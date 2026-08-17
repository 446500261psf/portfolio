import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { FIGMA_DIAL_STATES, type FigmaDialId } from './figmaDialStates'

export type DialTextureMap = Record<FigmaDialId, THREE.Texture[]>

/** 一次性加载全部状态的 Figma 关键帧位图（10 张 972×972 PNG） */
export function useDialKeyframes(): DialTextureMap {
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const map = {} as DialTextureMap
    for (const state of FIGMA_DIAL_STATES) {
      map[state.id] = state.frames.map((path) => {
        const tex = loader.load(`${import.meta.env.BASE_URL}${path}`)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        return tex
      })
    }
    return map
  }, [])

  useEffect(() => {
    return () => {
      for (const list of Object.values(textures)) {
        for (const tex of list) tex.dispose()
      }
    }
  }, [textures])

  return textures
}
