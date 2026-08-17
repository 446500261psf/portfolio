import * as THREE from 'three'
import type { CaseParams } from './CaseParams'

function superPow(t: number, n: number): number {
  return Math.sign(t) * Math.pow(Math.abs(t), 2 / n)
}

function zFromFrontProfile(x: number, y: number, a: number, b: number, c: number, n: number): number {
  const rho = Math.pow(Math.abs(x / a), n) + Math.pow(Math.abs(y / b), n)
  if (rho >= 1) return 0
  return c * Math.pow(1 - rho, 1 / n)
}

function ringXY(params: CaseParams, s: number, t: number): [number, number] {
  const { a, b, n } = params
  const cos = Math.cos(t)
  const sin = Math.sin(t)
  return [s * a * superPow(cos, n), s * b * superPow(sin, n)]
}

function pushRing(
  params: CaseParams,
  s: number,
  zSign: 1 | -1 | 0,
  slices: number,
  verts: number[],
): number {
  const { a, b, c, n } = params
  const start = verts.length / 3
  for (let j = 0; j < slices; j++) {
    const t = (j / slices) * Math.PI * 2
    const [x, y] = ringXY(params, s, t)
    const z =
      zSign === 0 ? 0 : zSign * zFromFrontProfile(x, y, a, b, c, n)
    verts.push(x, y, z)
  }
  return start
}

function fanPole(
  pole: number,
  ring: number,
  slices: number,
  idx: number[],
  outwardNorth: boolean,
): void {
  for (let j = 0; j < slices; j++) {
    const j1 = (j + 1) % slices
    if (outwardNorth) {
      idx.push(pole, ring + j, ring + j1)
    } else {
      idx.push(pole, ring + j1, ring + j)
    }
  }
}

function stitchRings(
  curr: number,
  next: number,
  slices: number,
  idx: number[],
): void {
  for (let j = 0; j < slices; j++) {
    const j1 = (j + 1) % slices
    idx.push(curr + j, next + j, next + j1, curr + j, next + j1, curr + j1)
  }
}

/** 由正视超椭圆轮廓隐式挤出完整表壳，赤道共享顶点，连续曲面 */
export function createWatchCaseGeometry(
  params: CaseParams,
  segments = 80,
): THREE.BufferGeometry {
  const verts: number[] = []
  const idx: number[] = []
  const slices = segments
  const rings = Math.max(8, Math.ceil(segments / 2))
  const ringStart: number[] = []

  const { c } = params

  ringStart.push(verts.length / 3)
  verts.push(0, 0, c)

  for (let ring = 1; ring < rings; ring++) {
    const s = Math.pow(ring / rings, 1 / params.n)
    ringStart.push(pushRing(params, s, 1, slices, verts))
  }

  ringStart.push(pushRing(params, 1, 0, slices, verts))

  for (let ring = rings - 1; ring >= 1; ring--) {
    const s = Math.pow(ring / rings, 1 / params.n)
    ringStart.push(pushRing(params, s, -1, slices, verts))
  }

  ringStart.push(verts.length / 3)
  verts.push(0, 0, -c)

  fanPole(ringStart[0], ringStart[1], slices, idx, true)

  for (let r = 1; r < ringStart.length - 2; r++) {
    stitchRings(ringStart[r], ringStart[r + 1], slices, idx)
  }

  const southRing = ringStart[ringStart.length - 2]
  const southPole = ringStart[ringStart.length - 1]
  fanPole(southPole, southRing, slices, idx, false)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

export function orthoZoom(params: CaseParams, view: 'front' | 'side' | 'top'): number {
  const pad = 1.22
  switch (view) {
    case 'front':
      return 18 / (Math.max(params.a, params.b) * pad)
    case 'side':
      return 18 / (Math.max(params.b, params.c) * pad)
    case 'top':
      return 18 / (Math.max(params.a, params.c) * pad)
  }
}

export function frontOutlinePoints(params: CaseParams, segments = 128): THREE.Vector3[] {
  const { a, b, n } = params
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const cos = Math.cos(t)
    const sin = Math.sin(t)
    const x = a * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n)
    const y = b * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n)
    pts.push(new THREE.Vector3(x, y, 0))
  }
  return pts
}

export function sideProfilePoints(params: CaseParams, segments = 64): THREE.Vector3[] {
  const { b, c, n } = params
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const nu = -Math.PI / 2 + (i / segments) * Math.PI
    const cosN = Math.sign(Math.cos(nu)) * Math.pow(Math.abs(Math.cos(nu)), 2 / n)
    const sinN = Math.sign(Math.sin(nu)) * Math.pow(Math.abs(Math.sin(nu)), 2 / n)
    pts.push(new THREE.Vector3(0, b * cosN, c * sinN))
  }
  return pts
}

export function topProfilePoints(params: CaseParams, segments = 64): THREE.Vector3[] {
  const { a, c, n } = params
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const nu = -Math.PI / 2 + (i / segments) * Math.PI
    const cosN = Math.sign(Math.cos(nu)) * Math.pow(Math.abs(Math.cos(nu)), 2 / n)
    const sinN = Math.sign(Math.sin(nu)) * Math.pow(Math.abs(Math.sin(nu)), 2 / n)
    pts.push(new THREE.Vector3(a * cosN, 0, c * sinN))
  }
  return pts
}
