import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { CaseParams } from './CaseParams'
import { createWatchCaseGeometry } from './watchCaseGeometry'
import {
  DIAL_CROSSING_MS,
  DIAL_STATE_MAP,
  type FigmaDialId,
} from '../dial/figmaDialStates'
import { createDialFaceGeometry } from '../dial/createDialFaceGeometry'
import { useDialKeyframes, type DialTextureMap } from '../dial/useDialKeyframes'

interface FrontViewPreviewProps {
  params: CaseParams
  dialId: FigmaDialId
}

/** 相机随画布尺寸与表壳大小自适应，保证整表始终完整可见 */
function FitOrthoCamera({ params }: { params: CaseParams }) {
  const { size } = useThree()
  const pad = 1.24
  const zoom = Math.min(size.width, size.height) / (2 * Math.max(params.a, params.b) * pad)

  return (
    <OrthographicCamera
      makeDefault
      position={[0, 0, 120]}
      zoom={zoom}
      near={0.1}
      far={400}
    />
  )
}

interface DialLayerProps {
  geometry: THREE.BufferGeometry
  dialId: FigmaDialId
  textures: DialTextureMap
  /** 整组透明度（用于状态渡越） */
  groupOpacity: React.MutableRefObject<number>
  renderOrder: number
}

/**
 * 单个状态的潭面动画：
 * - 关键帧 A/B 交叉淡化（loopSec 往返一周）
 * - 呼吸 envelope 调制亮度（PRD §3.2：5–7bpm，±5–12%）
 */
function DialStateLayer({ geometry, dialId, textures, groupOpacity, renderOrder }: DialLayerProps) {
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
      // 0→1→0 余弦往返：关键帧间连续 morph，永不硬切
      const phase = 0.5 - 0.5 * Math.cos((t * Math.PI * 2) / state.loopSec)
      overlayRef.current.opacity = master * phase
      overlayRef.current.color.setScalar(breath)
    }
  })

  return (
    <>
      <mesh geometry={geometry} renderOrder={renderOrder}>
        <meshBasicMaterial
          ref={baseRef}
          map={frames[0]}
          transparent
          toneMapped={false}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
      {frames.length > 1 && (
        <mesh geometry={geometry} renderOrder={renderOrder + 1}>
          <meshBasicMaterial
            ref={overlayRef}
            map={frames[1]}
            transparent
            toneMapped={false}
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
    </>
  )
}

/** 状态切换时保留旧场淡出、新场淡入（渡越 ≥800ms，禁止硬切） */
function DialFace({
  geometry,
  dialId,
  textures,
}: {
  geometry: THREE.BufferGeometry
  dialId: FigmaDialId
  textures: DialTextureMap
}) {
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
          renderOrder={2}
        />
      )}
      <DialStateLayer
        geometry={geometry}
        dialId={layers.current}
        textures={textures}
        groupOpacity={currentOpacity}
        renderOrder={4}
      />
    </>
  )
}

function WatchFrontScene({ params, dialId }: FrontViewPreviewProps) {
  const caseGeo = useMemo(
    () => createWatchCaseGeometry(params, 80),
    [params.a, params.b, params.c, params.n],
  )
  const dialGeo = useMemo(
    () => createDialFaceGeometry(params, 128),
    [params.a, params.b, params.c, params.n],
  )
  const textures = useDialKeyframes()

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />

      <FitOrthoCamera params={params} />

      <ambientLight intensity={0.42} />
      <directionalLight position={[0, 0, 80]} intensity={0.3} />

      {/* 表壳唇边（岸） */}
      <mesh geometry={caseGeo}>
        <meshPhysicalMaterial
          color="#0b0b0b"
          roughness={0.3}
          metalness={0.05}
          clearcoat={0.5}
          clearcoatRoughness={0.18}
          envMapIntensity={0}
        />
      </mesh>

      {/* 潭面：Figma 光场关键帧动画 */}
      <DialFace geometry={dialGeo} dialId={dialId} textures={textures} />
    </>
  )
}

/** 固定正视图 — Figma 表盘光场贴合实体正面，关键帧连续演化 */
export function FrontViewPreview({ params, dialId }: FrontViewPreviewProps) {
  const state = DIAL_STATE_MAP[dialId]

  return (
    <div className="front-view-studio">
      <div className="front-view-canvas-wrap">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        >
          <Suspense fallback={null}>
            <WatchFrontScene params={params} dialId={dialId} />
          </Suspense>
        </Canvas>
      </div>

      <footer className="white-model-spec">
        <span className="white-model-spec__title">正视预览 · Front View</span>
        <span className="white-model-spec__dims">
          {`${(params.a * 2).toFixed(1)} × ${(params.b * 2).toFixed(1)} mm · ${state.label} · ${state.labelEn}`}
        </span>
        <span className="white-model-spec__hint">
          Figma 光场关键帧 · 呼吸 {state.breathBpm}bpm · 外形来自外形工作室
        </span>
      </footer>
    </div>
  )
}
