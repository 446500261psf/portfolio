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

/** 发光壳层相对玻璃壳的缩放 — 略大于 1，浮在镜面玻璃表面之上 */
const SHELL_SCALE = 1.003
/** 光场 xy 分布相对表壳的内缩（与 Figma 关键帧潭口对齐） */
export const FIELD_INSET = 0.94

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

uniform vec3 uHalf;        // 壳层半径 a,b,c
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
uniform float uWake;       // 唤醒亮度：0 休眠 → 1 完全点亮
uniform vec3 uRipple;      // 触点涟漪：xy = 触点 uv，z = 年龄（秒），<0 表示无
uniform sampler2D uAnswerTex;
uniform float uAnswerOpacity; // 精确答案文字层不透明度

// 轻微裁掉 PNG 最外层抗锯齿像素
vec2 cropFigmaUv(vec2 uv) {
  return 0.5 + (uv - 0.5) * 0.985;
}

// 触摸涟漪：单环外扩 + 双重衰减，表达「场被扰动」而非按钮反馈
float rippleAt(vec2 uv) {
  if (uRipple.z < 0.0) return 0.0;
  float age = uRipple.z;
  float d = length(uv - uRipple.xy);
  float ring = exp(-pow((d - age * 0.5) / 0.08, 2.0));
  float decay = max(0.0, 1.0 - age / 1.5);
  return ring * decay * decay;
}

// 新旧状态 × 各两帧关键帧的混合采样；uv 越界处返回 0（防止 clamp 拉丝）
vec3 blendedField(vec2 uvRaw) {
  float mask = step(abs(uvRaw.x - 0.5), 0.494) * step(abs(uvRaw.y - 0.5), 0.494);
  if (mask < 0.5) return vec3(0.0);
  // Figma 图中自带一圈白色轮廓；按真实表壳 n 值建立超椭圆安全区，
  // 在潭边平滑衰减 UI，玻璃反射不受影响
  vec2 q = abs((uvRaw - 0.5) * 2.0);
  float rho2d = pow(q.x, uN) + pow(q.y, uN);
  float safeArea = 1.0 - smoothstep(0.88, 0.985, rho2d);
  vec2 uv = cropFigmaUv(uvRaw);
  vec4 texOld = mix(texture2D(uTexOldA, uv), texture2D(uTexOldB, uv), uMixOld);
  vec4 texNew = mix(texture2D(uTexNewA, uv), texture2D(uTexNewB, uv), uMixNew);
  return (texOld.rgb * texOld.a * uWOld * uBreathOld
       + texNew.rgb * texNew.a * uWNew * uBreathNew) * safeArea;
}

void main() {
  // frontness：正面 1 → 赤道 0 → 背面 0
  float zn = vWorldPos.z / uHalf.z;
  float frontness = smoothstep(-0.02, 0.72, zn);

  // —— UI 显示层：直接演示在镜面玻璃正面 ——
  vec2 uv = 0.5 + vWorldPos.xy / (2.0 * uUvHalf);
  vec3 ui = blendedField(uv) * pow(frontness, 1.25) * 1.35 * uWake;

  // 触摸涟漪：与场同源的中性冷白光扰动
  float rip = rippleAt(uv) * uWake * pow(frontness, 1.4);

  // 精确答案层：仅在明确指令后短暂出现（PRD 的无文字例外）
  vec4 answer = texture2D(uAnswerTex, uv);
  vec3 answerLight =
    answer.rgb * answer.a * uAnswerOpacity * uWake * pow(frontness, 1.3);

  vec3 col = ui + vec3(0.5, 0.58, 0.7) * rip * 0.85 + answerLight;
  // 软压缩防高光带过曝
  col = col / (1.0 + col * 0.3);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

/** 触点涟漪：表盘 uv 坐标 + 触发时刻（performance.now） */
export interface PoolRipple {
  u: number
  v: number
  startedAt: number
}

interface PoolVolumeProps {
  params: CaseParams
  dialId: FigmaDialId
  textures: DialTextureMap
  renderOrder?: number
  /** 唤醒亮度 0–1；整机模式由抬腕/落腕驱动，缺省恒为 1 */
  wakeRef?: { current: number }
  /** 最近一次触摸；由 ref 传入以免每帧触发 React 重渲染 */
  rippleRef?: { current: PoolRipple | null }
  /** 精确答案文字层（CanvasTexture）与其不透明度 */
  answerTexture?: THREE.Texture | null
  answerOpacityRef?: { current: number }
}

/**
 * Pool 发光壳层 — UI 直接演示在镜面玻璃上。
 *
 * 与镜面玻璃共面（同一挤出曲面，微放大避免 z-fight），加法混合：
 * 玻璃负责镜面反射，本层负责 UI 自发光，两者叠加 =「玻璃同时具有
 * 镜面与 UI 演示效果」。只在正面显示 Figma 光场 UI；侧缘不发光，
 * 避免形成白色轮廓线。
 */
export function PoolVolume({
  params,
  dialId,
  textures,
  renderOrder = 10,
  wakeRef,
  rippleRef,
  answerTexture,
  answerOpacityRef,
}: PoolVolumeProps) {
  const geometry = useMemo(
    () =>
      createWatchCaseGeometry(
        {
          a: params.a * SHELL_SCALE,
          b: params.b * SHELL_SCALE,
          c: params.c * SHELL_SCALE,
          n: params.n,
        },
        80,
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
        uWake: { value: 1 },
        uRipple: { value: new THREE.Vector3(0.5, 0.5, -1) },
        uAnswerTex: { value: placeholder },
        uAnswerOpacity: { value: 0 },
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

    u.uHalf.value.set(params.a * SHELL_SCALE, params.b * SHELL_SCALE, params.c * SHELL_SCALE)
    u.uUvHalf.value.set(params.a * FIELD_INSET, params.b * FIELD_INSET)
    u.uN.value = params.n

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

    u.uWake.value = wakeRef ? wakeRef.current : 1

    const ripple = rippleRef?.current
    if (ripple) {
      const age = (performance.now() - ripple.startedAt) / 1000
      if (age > 1.5) {
        rippleRef.current = null
        u.uRipple.value.set(0.5, 0.5, -1)
      } else {
        u.uRipple.value.set(ripple.u, ripple.v, age)
      }
    } else {
      u.uRipple.value.set(0.5, 0.5, -1)
    }

    if (answerTexture) u.uAnswerTex.value = answerTexture
    u.uAnswerOpacity.value = answerOpacityRef ? answerOpacityRef.current : 0
  })

  return <mesh geometry={geometry} material={material} renderOrder={renderOrder} />
}
