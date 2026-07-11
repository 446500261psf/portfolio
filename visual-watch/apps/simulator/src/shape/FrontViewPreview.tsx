import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { CaseParams } from './CaseParams'
import { createWatchCaseGeometry } from './watchCaseGeometry'
import type { StudioLightingState } from './studioLighting'
import { StudioLights, reflectionEnvStrength } from './StudioLights'
import { DIAL_STATE_MAP, type FigmaDialId } from '../dial/figmaDialStates'
import { createDialFaceGeometry } from '../dial/createDialFaceGeometry'
import { DialFaceAnimated } from '../dial/DialFaceAnimated'
import { useDialKeyframes } from '../dial/useDialKeyframes'

interface FrontViewPreviewProps {
  params: CaseParams
  dialId: FigmaDialId
  lights: StudioLightingState
}

function cameraDistance(params: CaseParams): number {
  const span = Math.max(params.a, params.b, params.c) * 2
  return span * 2.3
}

function WatchGlassScene({ params, dialId, lights }: FrontViewPreviewProps) {
  const caseGeo = useMemo(
    () => createWatchCaseGeometry(params, 80),
    [params.a, params.b, params.c, params.n],
  )
  const dialGeo = useMemo(
    () => createDialFaceGeometry(params, 128),
    [params.a, params.b, params.c, params.n],
  )
  const textures = useDialKeyframes()
  const dist = cameraDistance(params)

  const envStrength = useMemo(
    () => reflectionEnvStrength(lights.key, lights.fill),
    [lights.key.intensity, lights.fill.intensity],
  )

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />

      <PerspectiveCamera makeDefault fov={30} near={0.1} far={500} position={[0, 0, dist]} />

      <StudioLights keyLight={lights.key} fillLight={lights.fill} glassMode />

      {/* 镜面玻璃外壳（岸 + 潭口） */}
      <mesh geometry={caseGeo} renderOrder={1}>
        <meshPhysicalMaterial
          color="#050505"
          roughness={0.06}
          metalness={0}
          transmission={0.22}
          thickness={params.c * 1.2}
          ior={1.52}
          envMapIntensity={envStrength}
          specularIntensity={0.35}
          specularColor="#ffffff"
          clearcoat={1}
          clearcoatRoughness={0.045}
          attenuationColor="#000000"
          attenuationDistance={params.c * 1.6}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 玻璃下的 3D 显示屏：Figma 光场关键帧，加法混合透出玻璃 */}
      <DialFaceAnimated
        geometry={dialGeo}
        dialId={dialId}
        textures={textures}
        renderOrderBase={10}
      />

      <ContactShadows
        position={[0, -params.b * 1.28, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        opacity={0.14}
        scale={Math.max(params.a, params.b) * 3}
        blur={2.6}
        far={params.b * 2.2}
      />

      <OrbitControls
        enablePan={false}
        minDistance={dist * 0.5}
        maxDistance={dist * 2.4}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  )
}

/** 3D 玻璃表壳 + 内嵌显示屏 — Figma 光场 UI 动画实机演示 */
export function FrontViewPreview({ params, dialId, lights }: FrontViewPreviewProps) {
  const state = DIAL_STATE_MAP[dialId]

  return (
    <div className="front-view-studio">
      <div className="front-view-canvas-wrap">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Suspense fallback={null}>
            <WatchGlassScene params={params} dialId={dialId} lights={lights} />
          </Suspense>
        </Canvas>
      </div>

      <footer className="white-model-spec">
        <span className="white-model-spec__title">正视预览 · 3D 实机演示</span>
        <span className="white-model-spec__dims">
          {`${(params.a * 2).toFixed(1)} × ${(params.b * 2).toFixed(1)} × ${(params.c * 2).toFixed(1)} mm · ${state.label} · ${state.labelEn}`}
        </span>
        <span className="white-model-spec__hint">
          镜面玻璃 + 内嵌显示屏 · 呼吸 {state.breathBpm}bpm · 拖拽旋转 · 光源在 3D 白膜页调节
        </span>
      </footer>
    </div>
  )
}
