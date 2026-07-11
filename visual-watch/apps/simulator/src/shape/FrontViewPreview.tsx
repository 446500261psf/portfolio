import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { CaseParams } from './CaseParams'
import { createWatchCaseGeometry } from './watchCaseGeometry'
import { orthoZoom } from './watchCaseGeometry'
import type { FigmaDialId } from '../dial/figmaDialStates'
import { createDialFaceGeometry } from '../dial/createDialFaceGeometry'
import { useDialTexture } from '../dial/useDialTexture'

interface FrontViewPreviewProps {
  params: CaseParams
  dialId: FigmaDialId
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
  const dialTexture = useDialTexture(dialId)
  const zoom = orthoZoom(params, 'front') * 42

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />

      <OrthographicCamera
        makeDefault
        position={[0, 0, 120]}
        zoom={zoom}
        near={0.1}
        far={400}
      />

      <ambientLight intensity={0.35} />
      <directionalLight position={[0, 0, 80]} intensity={0.25} />
      <directionalLight position={[30, 40, 60]} intensity={0.15} />

      <mesh geometry={caseGeo}>
        <meshPhysicalMaterial
          color="#080808"
          roughness={0.12}
          metalness={0.05}
          clearcoat={0.85}
          clearcoatRoughness={0.04}
          envMapIntensity={0}
        />
      </mesh>

      <mesh geometry={dialGeo} renderOrder={2}>
        <meshBasicMaterial
          map={dialTexture}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </>
  )
}

/** 固定正视图 — 表盘 UI 贴合实体正面 */
export function FrontViewPreview({ params, dialId }: FrontViewPreviewProps) {
  const camKey = `${params.a.toFixed(2)}-${params.b.toFixed(2)}-${params.c.toFixed(2)}-${params.n.toFixed(2)}-${dialId}`

  return (
    <div className="front-view-studio">
      <div className="front-view-canvas-wrap">
        <Canvas
          key={camKey}
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Suspense fallback={null}>
            <WatchFrontScene params={params} dialId={dialId} />
          </Suspense>
        </Canvas>
      </div>

      <footer className="white-model-spec">
        <span className="white-model-spec__title">正视预览 · Front View</span>
        <span className="white-model-spec__dims">
          {`${(params.a * 2).toFixed(1)} × ${(params.b * 2).toFixed(1)} mm · 固定正视 · Figma 表盘 UI`}
        </span>
        <span className="white-model-spec__hint">外形来自外形工作室 · 右侧面板切换表盘状态</span>
      </footer>
    </div>
  )
}
