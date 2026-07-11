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

function buildHemisphere(
  params: CaseParams,
  sign: 1 | -1,
  slices: number,
  rings: number,
  verts: number[],
  idx: number[],
): void {
  const { a, b, c, n } = params

  const ringStart: number[] = []

  ringStart.push(verts.length / 3)
  verts.push(0, 0, sign * c)

  for (let ring = 1; ring <= rings; ring++) {
    const s = Math.pow(ring / rings, 1 / n)
    ringStart.push(verts.length / 3)
    for (let j = 0; j < slices; j++) {
      const t = (j / slices) * Math.PI * 2
      const cos = Math.cos(t)
      const sin = Math.sin(t)
      const x = s * a * superPow(cos, n)
      const y = s * b * superPow(sin, n)
      const z = sign * zFromFrontProfile(x, y, a, b, c, n)
      verts.push(x, y, z)
    }
  }

  const pole = ringStart[0]
  const firstRing = ringStart[1]
  for (let j = 0; j < slices; j++) {
    const j1 = (j + 1) % slices
    if (sign > 0) {
      idx.push(pole, firstRing + j, firstRing + j1)
    } else {
      idx.push(pole, firstRing + j1, firstRing + j)
    }
  }

  for (let ring = 1; ring < rings; ring++) {
    const curr = ringStart[ring]
    const next = ringStart[ring + 1]
    for (let j = 0; j < slices; j++) {
      const j1 = (j + 1) % slices
      if (sign > 0) {
        idx.push(curr + j, next + j, next + j1, curr + j, next + j1, curr + j1)
      } else {
        idx.push(curr + j, curr + j1, next + j1, curr + j, next + j1, next + j)
      }
    }
  }
}

/** 由正视超椭圆轮廓 |x/a|^n + |y/b|^n = 1 隐式挤出 ±Z 半球，极点单顶点无破面 */
export function createWatchCaseGeometry(
  params: CaseParams,
  segments = 80,
): THREE.BufferGeometry {
  const verts: number[] = []
  const idx: number[] = []
  const slices = segments
  const rings = Math.max(8, Math.ceil(segments / 2))

  buildHemisphere(params, 1, slices, rings, verts, idx)
  buildHemisphere(params, -1, slices, rings, verts, idx)

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
