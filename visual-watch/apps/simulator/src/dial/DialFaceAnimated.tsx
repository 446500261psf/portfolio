import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  DIAL_CROSSING_MS,
  DIAL_STATE_MAP,
  type FigmaDialId,
} from './figmaDialStates'
import type { DialTextureMap } from './useDialKeyframes'

interface DialStateLayerProps {
  geometry: THREE.BufferGeometry
  dialId: FigmaDialId
  textures: DialTextureMap
  /** 整组透明度（用于状态渡越） */
  groupOpacity: React.MutableRefObject<number>
  renderOrder: number
}

/**
 * 单个状态的潭面动画：
 * - 关键帧 A/B 余弦交叉淡化（loopSec 往返一周），连续 morph 永不硬切
 * - 呼吸 envelope 调制亮度（PRD §3.2：4–7bpm，±5–12%）
 *
 * 用加法混合模拟「玻璃下的 AMOLED 自发光」：屏幕黑色区域不加光，
 * 玻璃自身的反射保留在上层；光带区域将光「透出」玻璃。
 */
function DialStateLayer({
  geometry,
  dialId,
  textures,
  groupOpacity,
  renderOrder,
}: DialStateLayerProps) {
  const state = DIAL_STATE_MAP[dialId]
  const frames = textures[dialId]
  const baseRef = useRef<THREE.MeshBasicMaterial>(null)
  const overlayRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const breath =
      1 - state.breathAmount * (0.5 + 0.5 * Math.sin((t * state.breathBpm * Math.PI * 2) / 60))
    const master = groupOpacity.current

    if (baseRef.current) {
      baseRef.current.opacity = master
      baseRef.current.color.setScalar(breath)
    }
    if (overlayRef.current) {
      const phase = 0.5 - 0.5 * Math.cos((t * Math.PI * 2) / state.loopSec)
      overlayRef.current.opacity = master * phase
      overlayRef.current.color.setScalar(breath)
    }
  })

  const materialProps = {
    transparent: true,
    toneMapped: false,
    depthWrite: false,
    premultipliedAlpha: true,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  } as const

  return (
    <>
      <mesh geometry={geometry} renderOrder={renderOrder}>
        <meshBasicMaterial ref={baseRef} map={frames[0]} {...materialProps} />
      </mesh>
      {frames.length > 1 && (
        <mesh geometry={geometry} renderOrder={renderOrder + 1}>
          <meshBasicMaterial ref={overlayRef} map={frames[1]} {...materialProps} />
        </mesh>
      )}
    </>
  )
}

interface DialFaceAnimatedProps {
  geometry: THREE.BufferGeometry
  dialId: FigmaDialId
  textures: DialTextureMap
  /** 渲染次序基准 — 需大于玻璃壳体，保证发光叠加在玻璃着色之上 */
  renderOrderBase?: number
}

/** 状态切换时旧场淡出、新场淡入（渡越 ≥800ms，PRD §3.4 禁止硬切） */
export function DialFaceAnimated({
  geometry,
  dialId,
  textures,
  renderOrderBase = 10,
}: DialFaceAnimatedProps) {
  const [layers, setLayers] = useState<{ current: FigmaDialId; previous: FigmaDialId | null }>({
    current: dialId,
    previous: null,
  })
  const fadeStartRef = useRef(0)
  const currentOpacity = useRef(1)
  const previousOpacity = useRef(0)

  useEffect(() => {
    setLayers((l) => {
      if (l.current === dialId) return l
      fadeStartRef.current = performance.now()
      currentOpacity.current = 0
      previousOpacity.current = 1
      return { current: dialId, previous: l.current }
    })
  }, [dialId])

  useFrame(() => {
    if (!layers.previous) {
      currentOpacity.current = 1
      return
    }
    const t = Math.min(1, (performance.now() - fadeStartRef.current) / DIAL_CROSSING_MS)
    const eased = t * t * (3 - 2 * t)
    currentOpacity.current = eased
    previousOpacity.current = 1 - eased
    if (t >= 1) setLayers((l) => ({ ...l, previous: null }))
  })

  return (
    <>
      {layers.previous && (
        <DialStateLayer
          geometry={geometry}
          dialId={layers.previous}
          textures={textures}
          groupOpacity={previousOpacity}
          renderOrder={renderOrderBase}
        />
      )}
      <DialStateLayer
        geometry={geometry}
        dialId={layers.current}
        textures={textures}
        groupOpacity={currentOpacity}
        renderOrder={renderOrderBase + 2}
      />
    </>
  )
}
