import * as THREE from 'three'
import type { CaseParams } from './CaseParams'

export function createWatchCaseGeometry(
  params: CaseParams,
  segments = 80,
): THREE.BufferGeometry {
  const { a, b, c, n } = params
  const verts: number[] = []
  const idx: number[] = []

  const cosN = (t: number) => Math.sign(t) * Math.pow(Math.abs(t), 2 / n)
  const sinN = (t: number) => Math.sign(t) * Math.pow(Math.abs(t), 2 / n)

  for (let i = 0; i <= segments; i++) {
    const nu = -Math.PI / 2 + (i / segments) * Math.PI
    const cosNu = Math.cos(nu)
    const sinNu = Math.sin(nu)
    for (let j = 0; j <= segments; j++) {
      const omega = -Math.PI + (j / segments) * Math.PI * 2
      const cosOm = Math.cos(omega)
      const sinOm = Math.sin(omega)
      const x = a * cosN(cosNu) * cosN(cosOm)
      const y = b * cosN(cosNu) * sinN(sinOm)
      const z = c * sinN(sinNu)
      verts.push(x, y, z)
    }
  }

  const row = segments + 1
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const i0 = i * row + j
      const i1 = i0 + 1
      const i2 = i0 + row
      const i3 = i2 + 1
      idx.push(i0, i2, i1, i1, i2, i3)
    }
  }

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
