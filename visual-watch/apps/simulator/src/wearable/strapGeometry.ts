import * as THREE from 'three'
import type { CaseParams } from '../shape/CaseParams'
import { createWatchCaseGeometry } from '../shape/watchCaseGeometry'
import { strapOffset, wristCenterZ, type WearableParams } from './wearableParams'

/** 超椭圆参数化：|cos|^(2/n) 保号 */
function sp(t: number, n: number): number {
  return Math.sign(t) * Math.pow(Math.abs(t), 2 / n)
}

/** 表壳背面（-Z 侧）在 (x=0, y) 处的高度 */
function caseBackZ(params: CaseParams, y: number): number {
  const rho = Math.pow(Math.abs(y / params.b), params.n)
  if (rho >= 1) return 0
  return -params.c * Math.pow(1 - rho, 1 / params.n)
}

/** 表带截面圆角度：3.4≈扁圆角矩形，与表体的超椭圆语言一致 */
const STRAP_SECTION_N = 3.4

interface RibbonControl {
  p: THREE.Vector3
  /** 半宽（X 向） */
  hw: number
  /** 半厚（贴腕法向） */
  ht: number
}

/**
 * 表带中心线控制点 — 从表壳背面接口出发，绕手腕一圈，回到另一端接口。
 *
 * 全程在 YZ 平面内：接口段贴合表壳背面曲率，表带段沿手腕超椭圆外圈偏移。
 * 两段共享一条连续曲线，因此不存在拼接缝——「一体化」是形态目标。
 */
function strapControls(params: CaseParams, wear: WearableParams): RibbonControl[] {
  const interfaceHalfW = (wear.strapWidth * wear.lugFlare) / 2
  const interfaceHalfT = wear.interfaceLength / 2
  const strapHalfW = wear.strapWidth / 2
  const strapHalfT = wear.strapThickness / 2

  const offset = strapOffset(wear)
  const oz = wristCenterZ(params, wear)
  const ry = wear.wristHalfY + offset
  const rz = wear.wristHalfZ + offset

  /** 表带脱离表壳、转入手腕外圈的起始角 */
  const phiStart = THREE.MathUtils.degToRad(46)
  /** 绕过手腕背侧到对称位置所跨的角度 */
  const phiSweep = Math.PI * 2 - phiStart * 2

  const wristPoint = (phi: number) =>
    new THREE.Vector3(0, ry * sp(Math.cos(phi), wear.wristN), oz + rz * sp(Math.sin(phi), wear.wristN))

  // 接口段：沿 Y 贴合表壳背面，端头略微埋入表壳内部藏住截面
  const interfaceSeg = (sign: 1 | -1): RibbonControl[] => {
    const steps = 9
    const out: RibbonControl[] = []
    for (let i = 0; i <= steps; i++) {
      const k = i / steps
      const y = params.b * (0.34 + 0.65 * k) * sign
      const embed = (1 - k) * 0.9
      const ht = interfaceHalfT * (0.42 + 0.58 * k)
      out.push({
        p: new THREE.Vector3(0, y, caseBackZ(params, y) - ht + embed),
        hw: interfaceHalfW * (0.74 + 0.26 * k),
        ht,
      })
    }
    return out
  }

  // 过渡段：接口末端 → 手腕外圈起点，宽厚同时收到表带尺寸
  const bridgeSeg = (sign: 1 | -1): RibbonControl[] => {
    const steps = 5
    const out: RibbonControl[] = []
    const from = interfaceSeg(sign)[9]
    const to = wristPoint(sign === 1 ? phiStart : Math.PI - phiStart)
    for (let i = 1; i <= steps; i++) {
      const k = i / steps
      const ease = k * k * (3 - 2 * k)
      out.push({
        p: from.p.clone().lerp(to, ease),
        hw: THREE.MathUtils.lerp(interfaceHalfW, strapHalfW, ease),
        ht: THREE.MathUtils.lerp(interfaceHalfT, strapHalfT, ease),
      })
    }
    return out
  }

  const wristSeg: RibbonControl[] = []
  const wristSteps = 120
  for (let i = 1; i < wristSteps; i++) {
    const phi = phiStart - (i / wristSteps) * phiSweep
    wristSeg.push({ p: wristPoint(phi), hw: strapHalfW, ht: strapHalfT })
  }

  return [
    ...interfaceSeg(1).reverse(),
    ...bridgeSeg(1),
    ...wristSeg,
    ...bridgeSeg(-1).reverse(),
    ...interfaceSeg(-1),
  ]
}

/** 控制点的归一化累积弧长 */
function arcParams(controls: RibbonControl[]): number[] {
  const s = [0]
  for (let i = 1; i < controls.length; i++) {
    s.push(s[i - 1] + controls[i].p.distanceTo(controls[i - 1].p))
  }
  const total = s[s.length - 1] || 1
  return s.map((v) => v / total)
}

function sampleAt(controls: RibbonControl[], sList: number[], s: number): { hw: number; ht: number } {
  if (s <= 0) return { hw: controls[0].hw, ht: controls[0].ht }
  const last = controls.length - 1
  if (s >= 1) return { hw: controls[last].hw, ht: controls[last].ht }
  let i = 1
  while (i < last && sList[i] < s) i++
  const k = (s - sList[i - 1]) / Math.max(1e-6, sList[i] - sList[i - 1])
  return {
    hw: THREE.MathUtils.lerp(controls[i - 1].hw, controls[i].hw, k),
    ht: THREE.MathUtils.lerp(controls[i - 1].ht, controls[i].ht, k),
  }
}

/**
 * 表带 + 连接结构网格。
 *
 * 沿 YZ 平面内的中心线挤出超椭圆截面：宽度方向恒为 X（横跨手腕），
 * 厚度方向 = 切线 × X（始终指向手腕法向），因此表带永远「躺平」贴腕，
 * 不会像 Frenet frame 那样在曲率反转处扭转。
 */
export function createStrapGeometry(
  params: CaseParams,
  wear: WearableParams,
  lengthSegments = 260,
  radialSegments = 26,
): THREE.BufferGeometry {
  const controls = strapControls(params, wear)
  const sList = arcParams(controls)
  const curve = new THREE.CatmullRomCurve3(
    controls.map((c) => c.p),
    false,
    'catmullrom',
    0.35,
  )
  const pts = curve.getSpacedPoints(lengthSegments)

  const verts: number[] = []
  const norms: number[] = []
  const idx: number[] = []
  const widthDir = new THREE.Vector3(1, 0, 0)
  const tangent = new THREE.Vector3()
  const thickDir = new THREE.Vector3()

  for (let i = 0; i <= lengthSegments; i++) {
    const prev = pts[Math.max(0, i - 1)]
    const next = pts[Math.min(lengthSegments, i + 1)]
    tangent.subVectors(next, prev).normalize()
    thickDir.crossVectors(tangent, widthDir).normalize()

    const s = i / lengthSegments
    const { hw, ht } = sampleAt(controls, sList, s)
    // 两端收成圆钝收尾，端头截面被表壳遮住
    const cap = Math.min(1, Math.min(s, 1 - s) / 0.012)
    const taper = 0.34 + 0.66 * cap

    for (let j = 0; j < radialSegments; j++) {
      const a = (j / radialSegments) * Math.PI * 2
      const cw = sp(Math.cos(a), STRAP_SECTION_N)
      const ct = sp(Math.sin(a), STRAP_SECTION_N)
      verts.push(
        pts[i].x + widthDir.x * hw * cw * taper + thickDir.x * ht * ct * taper,
        pts[i].y + widthDir.y * hw * cw * taper + thickDir.y * ht * ct * taper,
        pts[i].z + widthDir.z * hw * cw * taper + thickDir.z * ht * ct * taper,
      )
      const nx = widthDir.x * cw * ht + thickDir.x * ct * hw
      const ny = widthDir.y * cw * ht + thickDir.y * ct * hw
      const nz = widthDir.z * cw * ht + thickDir.z * ct * hw
      const len = Math.hypot(nx, ny, nz) || 1
      norms.push(nx / len, ny / len, nz / len)
    }
  }

  for (let i = 0; i < lengthSegments; i++) {
    const a = i * radialSegments
    const b = (i + 1) * radialSegments
    for (let j = 0; j < radialSegments; j++) {
      const j1 = (j + 1) % radialSegments
      idx.push(a + j, b + j, b + j1, a + j, b + j1, a + j1)
    }
  }

  // 端面封口
  for (const end of [0, lengthSegments]) {
    const ring = end * radialSegments
    const center = verts.length / 3
    verts.push(pts[end].x, pts[end].y, pts[end].z)
    tangent
      .subVectors(pts[Math.min(lengthSegments, end + 1)], pts[Math.max(0, end - 1)])
      .normalize()
    const s = end === 0 ? -1 : 1
    norms.push(tangent.x * s, tangent.y * s, tangent.z * s)
    for (let j = 0; j < radialSegments; j++) {
      const j1 = (j + 1) % radialSegments
      if (end === 0) idx.push(center, ring + j1, ring + j)
      else idx.push(center, ring + j, ring + j1)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3))
  geo.setIndex(idx)
  geo.computeBoundingSphere()
  return geo
}

/**
 * 背面传感器窗 — 一枚更小的同族「鹅软石」，一半埋进表壳背面。
 * 复用表壳几何函数，保证与主体同一曲面语言。
 */
export function createSensorWindowGeometry(params: CaseParams): THREE.BufferGeometry {
  return createWatchCaseGeometry(
    {
      a: params.a * 0.34,
      b: params.b * 0.34,
      c: 0.62,
      n: 3,
    },
    48,
  )
}

/** 手腕参考体：沿 X（手臂轴）挤出的超椭圆柱，两端封口 */
export function createWristGeometry(
  params: CaseParams,
  wear: WearableParams,
  length = 118,
  radialSegments = 72,
): THREE.BufferGeometry {
  const oz = wristCenterZ(params, wear)
  const verts: number[] = []
  const norms: number[] = []
  const idx: number[] = []
  const slices = 2

  // 手腕向手掌方向略微收细
  const taperAt = (k: number) => 1 - 0.07 * (k - 0.5) * 2

  for (let i = 0; i <= slices; i++) {
    const k = i / slices
    const x = -length / 2 + k * length
    const t = taperAt(k)
    for (let j = 0; j < radialSegments; j++) {
      const a = (j / radialSegments) * Math.PI * 2
      const cy = sp(Math.cos(a), wear.wristN)
      const cz = sp(Math.sin(a), wear.wristN)
      verts.push(x, wear.wristHalfY * t * cy, oz + wear.wristHalfZ * t * cz)
      const ny = cy * wear.wristHalfZ
      const nz = cz * wear.wristHalfY
      const len = Math.hypot(ny, nz) || 1
      norms.push(0, ny / len, nz / len)
    }
  }

  for (let i = 0; i < slices; i++) {
    const a = i * radialSegments
    const b = (i + 1) * radialSegments
    for (let j = 0; j < radialSegments; j++) {
      const j1 = (j + 1) % radialSegments
      idx.push(a + j, b + j, b + j1, a + j, b + j1, a + j1)
    }
  }

  for (const end of [0, slices]) {
    const ring = end * radialSegments
    const center = verts.length / 3
    const x = -length / 2 + (end / slices) * length
    verts.push(x, 0, oz)
    norms.push(end === 0 ? -1 : 1, 0, 0)
    for (let j = 0; j < radialSegments; j++) {
      const j1 = (j + 1) % radialSegments
      if (end === 0) idx.push(center, ring + j1, ring + j)
      else idx.push(center, ring + j, ring + j1)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3))
  geo.setIndex(idx)
  geo.computeBoundingSphere()
  return geo
}

/** 表带中段长度（用于规格文字） */
export function strapPathLength(params: CaseParams, wear: WearableParams): number {
  const controls = strapControls(params, wear)
  let len = 0
  for (let i = 1; i < controls.length; i++) len += controls[i].p.distanceTo(controls[i - 1].p)
  return len
}
