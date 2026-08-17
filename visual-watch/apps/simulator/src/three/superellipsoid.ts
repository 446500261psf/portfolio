import * as THREE from 'three'
import { ASPECT_RATIO, SUPERELLIPSE_N } from '../cove-field/types'

export const PEBBLE = {
  a: 1.0,
  b: ASPECT_RATIO,
  c: 0.38,
  n: SUPERELLIPSE_N,
  basinDepth: 0.075,
  safeMargin: 0.08,
  lipRaise: 0.018,
} as const

export function rho2d(x: number, y: number): number {
  const { a, b, n } = PEBBLE
  return Math.pow(Math.abs(x / a), n) + Math.pow(Math.abs(y / b), n)
}

export function inside2d(x: number, y: number, margin = 0): boolean {
  return rho2d(x, y) <= 1 - margin
}

/** 超椭球前盖外表面的 Z（朝向观察者） */
export function outerFrontZ(x: number, y: number): number {
  const r = rho2d(x, y)
  if (r >= 1) return 0
  return PEBBLE.c * Math.pow(1 - r, 2 / PEBBLE.n)
}

/** 潭面凹面 —— 在 3D 表壳上内凹的显示区 */
export function basinZ(x: number, y: number): number {
  const r = rho2d(x, y)
  if (r >= 1) return 0
  const outer = outerFrontZ(x, y)
  const dip = PEBBLE.basinDepth * Math.pow(1 - r, 2)
  return outer - dip
}

export function basinPosition(x: number, y: number, target = new THREE.Vector3()): THREE.Vector3 {
  return target.set(x, y, basinZ(x, y))
}

export function basinNormal(x: number, y: number, target = new THREE.Vector3()): THREE.Vector3 {
  const e = 0.004
  const zx = (basinZ(x + e, y) - basinZ(x - e, y)) / (2 * e)
  const zy = (basinZ(x, y + e) - basinZ(x, y - e)) / (2 * e)
  return target.set(-zx, -zy, 1).normalize()
}

export function randomBasinPoint(margin = PEBBLE.safeMargin): { x: number; y: number } {
  const { a, b } = PEBBLE
  for (let i = 0; i < 80; i++) {
    const x = (Math.random() * 2 - 1) * a * (1 - margin)
    const y = (Math.random() * 2 - 1) * b * (1 - margin)
    if (inside2d(x, y, margin)) return { x, y }
  }
  return { x: 0, y: 0 }
}

export function edgeProximity2d(x: number, y: number): number {
  const r = rho2d(x, y)
  return Math.max(0, Math.min(1, (r - 0.55) / 0.4))
}

/** 超椭球完整网格 */
export function createSuperellipsoidGeometry(segments = 72): THREE.BufferGeometry {
  const { a, b, c, n } = PEBBLE
  const verts: number[] = []
  const norms: number[] = []
  const uvs: number[] = []
  const idx: number[] = []

  const cosN = (t: number) => Math.sign(t) * Math.pow(Math.abs(t), 2 / n)
  const sinN = (t: number) => Math.sign(t) * Math.pow(Math.abs(t), 2 / n)

  for (let i = 0; i <= segments; i++) {
    const nu = -Math.PI / 2 + (i / segments) * Math.PI
    for (let j = 0; j <= segments; j++) {
      const omega = -Math.PI + (j / segments) * Math.PI * 2
      const x = a * cosN(nu) * cosN(omega)
      const y = b * cosN(nu) * sinN(omega)
      const z = c * sinN(nu)
      verts.push(x, y, z)
      uvs.push(j / segments, i / segments)

      const eps = 0.002
      const x1 = a * cosN(nu + eps) * cosN(omega)
      const y1 = b * cosN(nu + eps) * sinN(omega)
      const z1 = c * sinN(nu + eps)
      const tx = x1 - x
      const ty = y1 - y
      const tz = z1 - z
      const x2 = a * cosN(nu) * cosN(omega + eps)
      const ty2 = b * cosN(nu) * sinN(omega + eps) - y
      const tz2 = c * sinN(nu) - z
      const nx = ty * tz2 - tz * ty2
      const ny = tz * (x2 - x) - tx * tz2
      const nz = tx * ty2 - ty * (x2 - x)
      const len = Math.hypot(nx, ny, nz) || 1
      norms.push(nx / len, ny / len, nz / len)
    }
  }

  const row = segments + 1
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a0 = i * row + j
      const a1 = a0 + 1
      const a2 = a0 + row
      const a3 = a2 + 1
      idx.push(a0, a2, a1, a1, a2, a3)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(idx)
  return geo
}

/** 超椭球表壳 —— 前盖中心开窗，露出凹面潭 */
export function createPebbleShellGeometry(segments = 72): THREE.BufferGeometry {
  const full = createSuperellipsoidGeometry(segments)
  const pos = full.getAttribute('position') as THREE.BufferAttribute
  const idx = full.getIndex()!.array
  const keep: number[] = []

  for (let i = 0; i < idx.length; i += 3) {
    const i0 = idx[i]
    const i1 = idx[i + 1]
    const i2 = idx[i + 2]
    const z0 = pos.getZ(i0)
    const z1 = pos.getZ(i1)
    const z2 = pos.getZ(i2)
    const r0 = rho2d(pos.getX(i0), pos.getY(i0))
    const r1 = rho2d(pos.getX(i1), pos.getY(i1))
    const r2 = rho2d(pos.getX(i2), pos.getY(i2))

    const frontFace = z0 > 0.02 && z1 > 0.02 && z2 > 0.02
    const inWindow = r0 < 0.94 && r1 < 0.94 && r2 < 0.94
    if (frontFace && inWindow) continue

    keep.push(i0, i1, i2)
  }

  const geo = full.clone()
  geo.setIndex(keep)
  return geo
}

/** 潭面凹面网格 —— 参数域映射到 3D 曲面 */
export function createBasinGeometry(segs = 96): THREE.BufferGeometry {
  const { a, b, safeMargin } = PEBBLE
  const verts: number[] = []
  const norms: number[] = []
  const uvs: number[] = []
  const idx: number[] = []
  const grid: number[][] = []

  let rowIdx = 0
  for (let i = 0; i <= segs; i++) {
    const row: number[] = []
    const u = i / segs
    for (let j = 0; j <= segs; j++) {
      const v = j / segs
      const x = (u * 2 - 1) * a * (1 - safeMargin * 0.5)
      const y = (v * 2 - 1) * b * (1 - safeMargin * 0.5)
      if (!inside2d(x, y, safeMargin * 0.3)) {
        row.push(-1)
        continue
      }
      const z = basinZ(x, y)
      verts.push(x, y, z)
      uvs.push(u, v)
      const n = basinNormal(x, y)
      norms.push(n.x, n.y, n.z)
      row.push(rowIdx++)
    }
    grid.push(row)
  }

  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < segs; j++) {
      const i00 = grid[i][j]
      const i10 = grid[i + 1][j]
      const i01 = grid[i][j + 1]
      const i11 = grid[i + 1][j + 1]
      if (i00 < 0 || i10 < 0 || i01 < 0 || i11 < 0) continue
      idx.push(i00, i10, i01, i01, i10, i11)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(idx)
  return geo
}

/** 2.5D 唇边 —— 沿超椭圆边缘隆起的岸 */
export function createLipRing(segments = 128): THREE.BufferGeometry {
  const { a, b, lipRaise } = PEBBLE
  const n = PEBBLE.n
  const verts: number[] = []
  const idx: number[] = []

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const cos = Math.cos(t)
    const sin = Math.sin(t)
    const x = a * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n)
    const y = b * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n)
    const zInner = basinZ(x * 0.94, y * 0.94)
    const zOuter = outerFrontZ(x, y) + lipRaise
    verts.push(x * 0.96, y * 0.96, zInner)
    verts.push(x, y, zOuter)
    if (i < segments) {
      const k = i * 2
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.computeVertexNormals()
  return geo
}

export function superellipseOutlinePoints(segments = 160): THREE.Vector3[] {
  const { a, b, n } = PEBBLE
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const cos = Math.cos(t)
    const sin = Math.sin(t)
    const x = a * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n)
    const y = b * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n)
    pts.push(new THREE.Vector3(x, y, outerFrontZ(x, y) + 0.004))
  }
  return pts
}
