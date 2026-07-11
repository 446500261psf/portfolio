import * as THREE from 'three'
import type { CaseParams } from '../shape/CaseParams'

/** 正视表盘显示区 — 贴合超椭圆正面，略低于外壳表面 */
export function createDialFaceGeometry(params: CaseParams, segments = 96): THREE.BufferGeometry {
  const { a, b, c, n } = params
  const inset = 0.93
  const z = c * 0.999
  const verts: number[] = [0, 0, z]
  const uvs: number[] = [0.5, 0.5]
  const idx: number[] = []

  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const cos = Math.cos(t)
    const sin = Math.sin(t)
    const x = inset * a * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n)
    const y = inset * b * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n)
    verts.push(x, y, z)
    uvs.push(0.5 + x / (a * 2), 0.5 - y / (b * 2))
  }

  for (let i = 0; i < segments; i++) {
    idx.push(0, i + 1, ((i + 1) % segments) + 1)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}
