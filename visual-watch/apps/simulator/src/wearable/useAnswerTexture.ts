import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { FigmaDialId } from '../dial/figmaDialStates'
import { DIAL_ANSWERS } from './dialAnswers'

const SIZE = 768

/**
 * 把精确答案画成与 Figma 关键帧同尺度的透明贴图。
 *
 * 与 Pool 的 UI 层共用同一套 uv，所以文字会跟着曲面走，
 * 不是浮在玻璃前方的另一块平面。
 */
export function useAnswerTexture(dialId: FigmaDialId): THREE.Texture | null {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const answer = DIAL_ANSWERS[dialId]
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = 'rgba(236, 242, 250, 0.94)'
    ctx.font = `300 ${Math.round(SIZE * 0.155)}px Inter, "Helvetica Neue", Arial, sans-serif`
    ctx.fillText(answer.primary, SIZE / 2, SIZE * 0.47)

    ctx.fillStyle = 'rgba(176, 196, 216, 0.78)'
    ctx.font = `400 ${Math.round(SIZE * 0.042)}px Inter, "Helvetica Neue", Arial, sans-serif`
    ctx.letterSpacing = `${Math.round(SIZE * 0.012)}px`
    ctx.fillText(answer.secondary, SIZE / 2, SIZE * 0.585)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  }, [dialId])

  useEffect(() => () => texture?.dispose(), [texture])

  return texture
}
