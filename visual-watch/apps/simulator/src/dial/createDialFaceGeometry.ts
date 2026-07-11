import * as THREE from 'three'
import type { CaseParams } from '../shape/CaseParams'

/** 表盘显示区相对表壳的内缩比例（潭口唇边，PRD §1.2） */
export const DIAL_INSET = 0.94

/**
 * 屏幕嵌入深度：表壳挤出剖面在 s 环处的高度为 z = c·(1−sⁿ)^(1/n)，
 * 取表盘外缘（s=inset）对应高度再留 12% 余量，保证屏幕整体贴在玻璃穹顶正下方
 */
export function dialScreenZ(params: CaseParams): number {
  const { c, n } = params
  return 0.88 * c * Math.pow(1 - Math.pow(DIAL_INSET, n), 1 / n)
}

/** 玻璃表壳内的 3D 显示屏 — 贴合超椭圆，嵌于穹顶之下 */
export function createDialFaceGeometry(params: CaseParams, segments = 96): THREE.BufferGeometry {
  const { a, b, n } = params
  const inset = DIAL_INSET
  const z = dialScreenZ(params)
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
    // Figma 关键帧位图的超椭圆恰好铺满整张 972×972 画布，
    // 因此表盘面的最大内缩范围要映射到纹理 [0,1] 全幅；
    // crop 裁掉边界抗锯齿像素，避免出现白色描边。
    // flipY 纹理下 v=1 对应图片顶部，故 v 随世界 y 正向增长
    const crop = 1 - 0.009
    uvs.push(0.5 + (x / (inset * a * 2)) * crop, 0.5 + (y / (inset * b * 2)) * crop)
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
