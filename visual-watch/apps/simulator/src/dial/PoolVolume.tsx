import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { CaseParams } from '../shape/CaseParams'
import { createWatchCaseGeometry } from '../shape/watchCaseGeometry'
import {
  DIAL_CROSSING_MS,
  DIAL_STATE_MAP,
  type FigmaDialId,
} from './figmaDialStates'
import type { DialTextureMap } from './useDialKeyframes'

/** Pool 内腔相对玻璃壳的缩放 — 贴近玻璃，光场浮在表面正下方 */
const POOL_SCALE = 0.985
/** 光场 xy 分布相对表壳的内缩（与 Figma 关键帧潭口对齐） */
const FIELD_INSET = 0.94

const vertexShader = /* glsl */ `
varying vec3 vWorldPos;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const fragmentShader = /* glsl */ `
precision highp float;

varying vec3 vWorldPos;

uniform vec3 uHalf;        // Pool 体积半径 a,b,c
uniform vec2 uUvHalf;      // 光场 xy 半径（uv 映射范围）
uniform float uN;          // 超椭圆指数
uniform sampler2D uTexOldA;
uniform sampler2D uTexOldB;
uniform sampler2D uTexNewA;
uniform sampler2D uTexNewB;
uniform float uMixOld;     // 旧状态关键帧 morph 相位
uniform float uMixNew;     // 新状态关键帧 morph 相位
uniform float uWOld;       // 渡越权重（旧）
uniform float uWNew;       // 渡越权重（新）
uniform float uBreathOld;  // 呼吸亮度（旧）
uniform float uBreathNew;  // 呼吸亮度（新）
uniform float uSwirl;      // 边缘流动相位（弧度）
uniform float uIntensity;  // 总亮度（随尺寸归一）

// 超椭球隐式方程 ρ(p)：<1 在 Pool 内，≈1 贴内壁
float rhoAt(vec3 p) {
  vec3 q = abs(p) / uHalf;
  return pow(q.x, uN) + pow(q.y, uN) + pow(q.z, uN);
}

// 新旧状态 × 各两帧关键帧的混合采样；uv 越界处返回 0（防止 clamp 拉丝）
vec3 blendedField(vec2 uvRaw) {
  float mask = step(abs(uvRaw.x - 0.5), 0.494) * step(abs(uvRaw.y - 0.5), 0.494);
  if (mask < 0.5) return vec3(0.0);
  vec2 uv = uvRaw;
  vec4 texOld = mix(texture2D(uTexOldA, uv), texture2D(uTexOldB, uv), uMixOld);
  vec4 texNew = mix(texture2D(uTexNewA, uv), texture2D(uTexNewB, uv), uMixNew);
  return texOld.rgb * texOld.a * uWOld * uBreathOld
       + texNew.rgb * texNew.a * uWNew * uBreathNew;
}

// 体积中一点的发光：边缘/背部流动 + 稀薄填充（前壁显示层由解析项负责）
vec3 fieldColor(vec3 p, float rho) {
  // 边缘流动：光场绕潭心缓慢摆动，越贴内壁摆幅越大
  float ang = uSwirl * smoothstep(0.25, 1.0, rho);
  float cs = cos(ang);
  float sn = sin(ang);
  vec2 xy = mat2(cs, -sn, sn, cs) * p.xy;

  vec3 col = blendedField(0.5 + xy / (2.0 * uUvHalf));

  float shell = smoothstep(0.35, 1.0, rho);
  shell *= shell;
  float frontness = smoothstep(-0.15, 1.0, p.z / uHalf.z);

  float rimBackFlow = shell * (1.0 - 0.75 * frontness);
  float density = 0.07 + 0.55 * rimBackFlow;

  return col * density;
}

// 屏幕空间 hash — 步进起点抖动，消除等值面带状伪影
float ditherHash(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 rd = normalize(vWorldPos - cameraPosition);

  // —— 贴玻璃显示层（解析，零采样噪声）——
  // 入射点即内壁：直接采样光场，UI 像手机屏一样浮在玻璃正下方；
  // swirl 不作用于此层，保证 UI 稳定不晃
  float frontness = smoothstep(0.0, 0.85, vWorldPos.z / uHalf.z);
  vec3 surface = blendedField(0.5 + vWorldPos.xy / (2.0 * uUvHalf)) * frontness * frontness * 1.2;

  // —— Pool 体积层（边缘/背部流动 + 稀薄填充）——
  float span = 2.2 * max(uHalf.x, max(uHalf.y, uHalf.z));
  const int STEPS = 30;
  float stepLen = span / float(STEPS);

  vec3 p = vWorldPos + rd * stepLen * ditherHash(gl_FragCoord.xy);

  vec3 acc = vec3(0.0);
  for (int i = 0; i < STEPS; i++) {
    p += rd * stepLen;
    float rho = rhoAt(p);
    if (rho > 1.0) break;
    acc += fieldColor(p, rho) * stepLen;
  }

  vec3 col = surface + acc * uIntensity;
  // 柔和压缩：防止长光路（侧/背视角）过曝发白
  col = col / (1.0 + col * 0.4);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

interface PoolVolumeProps {
  params: CaseParams
  dialId: FigmaDialId
  textures: DialTextureMap
  renderOrder?: number
}

/**
 * Pool — 玻璃内腔体积光场。
 *
 * 不是平面屏幕：光线步进穿过整个超椭球内腔，发光密度贴着内壁
 * （光在背部与边缘流动），Figma 关键帧决定光场的 xy 分布，
 * 关键帧 morph / 呼吸 / 状态渡越全部以 uniform 驱动。
 */
export function PoolVolume({ params, dialId, textures, renderOrder = 10 }: PoolVolumeProps) {
  const geometry = useMemo(
    () =>
      createWatchCaseGeometry(
        {
          a: params.a * POOL_SCALE,
          b: params.b * POOL_SCALE,
          c: params.c * POOL_SCALE,
          n: params.n,
        },
        64,
      ),
    [params.a, params.b, params.c, params.n],
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  // 状态渡越：旧场淡出、新场淡入（PRD §3.4 禁止硬切）
  const [states, setStates] = useState<{ current: FigmaDialId; previous: FigmaDialId }>({
    current: dialId,
    previous: dialId,
  })
  const fadeStartRef = useRef(0)

  useEffect(() => {
    setStates((s) => {
      if (s.current === dialId) return s
      fadeStartRef.current = performance.now()
      return { current: dialId, previous: s.current }
    })
  }, [dialId])

  const material = useMemo(() => {
    const placeholder = new THREE.Texture()
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uHalf: { value: new THREE.Vector3(1, 1, 1) },
        uUvHalf: { value: new THREE.Vector2(1, 1) },
        uN: { value: 4.5 },
        uTexOldA: { value: placeholder },
        uTexOldB: { value: placeholder },
        uTexNewA: { value: placeholder },
        uTexNewB: { value: placeholder },
        uMixOld: { value: 0 },
        uMixNew: { value: 0 },
        uWOld: { value: 0 },
        uWNew: { value: 1 },
        uBreathOld: { value: 1 },
        uBreathNew: { value: 1 },
        uSwirl: { value: 0 },
        uIntensity: { value: 1 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    })
  }, [])
  useEffect(() => () => material.dispose(), [material])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const u = material.uniforms

    u.uHalf.value.set(params.a * POOL_SCALE, params.b * POOL_SCALE, params.c * POOL_SCALE)
    u.uUvHalf.value.set(params.a * FIELD_INSET, params.b * FIELD_INSET)
    u.uN.value = params.n
    // 亮度随尺寸归一：步进积分乘 stepLen（mm），除以跨度保持观感一致
    u.uIntensity.value = 4.2 / (2.2 * Math.max(params.a, params.b, params.c) * POOL_SCALE)

    const cur = DIAL_STATE_MAP[states.current]
    const prev = DIAL_STATE_MAP[states.previous]
    const curFrames = textures[states.current]
    const prevFrames = textures[states.previous]

    u.uTexNewA.value = curFrames[0]
    u.uTexNewB.value = curFrames[1] ?? curFrames[0]
    u.uTexOldA.value = prevFrames[0]
    u.uTexOldB.value = prevFrames[1] ?? prevFrames[0]

    u.uMixNew.value = 0.5 - 0.5 * Math.cos((t * Math.PI * 2) / cur.loopSec)
    u.uMixOld.value = 0.5 - 0.5 * Math.cos((t * Math.PI * 2) / prev.loopSec)

    u.uBreathNew.value =
      1 - cur.breathAmount * (0.5 + 0.5 * Math.sin((t * cur.breathBpm * Math.PI * 2) / 60))
    u.uBreathOld.value =
      1 - prev.breathAmount * (0.5 + 0.5 * Math.sin((t * prev.breathBpm * Math.PI * 2) / 60))

    if (states.previous !== states.current) {
      const k = Math.min(1, (performance.now() - fadeStartRef.current) / DIAL_CROSSING_MS)
      const eased = k * k * (3 - 2 * k)
      u.uWNew.value = eased
      u.uWOld.value = 1 - eased
      if (k >= 1) setStates((s) => ({ ...s, previous: s.current }))
    } else {
      u.uWNew.value = 1
      u.uWOld.value = 0
    }

    // 边缘流动：缓慢往返摆动（约 14s 周期）
    u.uSwirl.value = 0.32 * Math.sin((t * Math.PI * 2) / 14)
  })

  return <mesh geometry={geometry} material={material} renderOrder={renderOrder} />
}
