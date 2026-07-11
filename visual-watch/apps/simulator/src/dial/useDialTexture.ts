import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { FigmaDialId } from './figmaDialStates'
import { renderFigmaDial } from './renderFigmaDial'

const TEX_SIZE = 1024

export function useDialTexture(dialId: FigmaDialId): THREE.CanvasTexture {
  const canvasRef = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = TEX_SIZE
    c.height = TEX_SIZE
    return c
  }, [])

  const textureRef = useRef<THREE.CanvasTexture | null>(null)

  if (!textureRef.current) {
    textureRef.current = new THREE.CanvasTexture(canvasRef)
    textureRef.current.colorSpace = THREE.SRGBColorSpace
    textureRef.current.minFilter = THREE.LinearFilter
    textureRef.current.magFilter = THREE.LinearFilter
  }

  useEffect(() => {
    const ctx = canvasRef.getContext('2d')
    if (!ctx) return
    renderFigmaDial(ctx, TEX_SIZE, dialId)
    const tex = textureRef.current
    if (tex) tex.needsUpdate = true
  }, [canvasRef, dialId])

  return textureRef.current
}
