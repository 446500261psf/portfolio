import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { CaseParams } from './CaseParams'
import { createWatchCaseGeometry } from './watchCaseGeometry'
import type { StudioLightingState } from './studioLighting'
import { StudioLights } from './StudioLights'

interface WhiteModelViewProps {
  params: CaseParams
  lights: StudioLightingState
}

export type SurfaceMaterial = 'clay' | 'glass'

function cameraDistance(params: CaseParams): number {
  const span = Math.max(params.a, params.b, params.c) * 2
  return span * 2.4
}

function CaseMesh({
  params,
  material,
}: {
  params: CaseParams
  material: SurfaceMaterial
}) {
  const geometry = useMemo(
    () => createWatchCaseGeometry(params, 80),
    [params.a, params.b, params.c, params.n],
  )

  if (material === 'glass') {
    return (
      <mesh geometry={geometry} receiveShadow>
        <meshPhysicalMaterial
          color="#222228"
          roughness={0.04}
          metalness={0}
          transmission={0.9}
          thickness={params.c * 0.9}
          ior={1.52}
          envMapIntensity={0}
          specularIntensity={1}
          specularColor="#ffffff"
          clearcoat={1}
          clearcoatRoughness={0.02}
          transparent
          side={THREE.FrontSide}
        />
      </mesh>
    )
  }

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#ececee" roughness={0.94} metalness={0} />
    </mesh>
  )
}

function SceneContent({
  params,
  material,
  lights,
}: {
  params: CaseParams
  material: SurfaceMaterial
  lights: StudioLightingState
}) {
  const dist = cameraDistance(params)

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', dist * 2.2, dist * 5]} />

      <PerspectiveCamera
        makeDefault
        position={[dist * 0.92, dist * 0.68, dist * 0.92]}
        fov={32}
        near={0.1}
        far={500}
      />

      <StudioLights keyLight={lights.key} fillLight={lights.fill} />

      <CaseMesh params={params} material={material} />

      <ContactShadows
        position={[0, 0, -params.c - 0.04]}
        rotation={[Math.PI / 2, 0, 0]}
        opacity={material === 'glass' ? 0.22 : 0.35}
        scale={Math.max(params.a, params.b) * 4}
        blur={2.4}
        far={params.c * 3}
      />

      <OrbitControls
        enablePan={false}
        minDistance={dist * 0.55}
        maxDistance={dist * 2.4}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  )
}

/** 由三视图参数挤出表壳 · 可调主光/反射光 */
export function WhiteModelView({ params, lights }: WhiteModelViewProps) {
  const { a, b, c, n } = params
  const [material, setMaterial] = useState<SurfaceMaterial>('glass')
  const camKey = `${a.toFixed(2)}-${b.toFixed(2)}-${c.toFixed(2)}-${n.toFixed(2)}-${material}`

  return (
    <div className="white-model-studio">
      <div className="white-model-canvas-wrap">
        <Canvas
          key={camKey}
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Suspense fallback={null}>
            <SceneContent params={params} material={material} lights={lights} />
          </Suspense>
        </Canvas>
      </div>

      <div className="white-model-material-tabs" role="tablist" aria-label="表面材质">
        <button
          type="button"
          role="tab"
          aria-selected={material === 'clay'}
          className={material === 'clay' ? 'active' : ''}
          onClick={() => setMaterial('clay')}
        >
          白膜
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={material === 'glass'}
          className={material === 'glass' ? 'active' : ''}
          onClick={() => setMaterial('glass')}
        >
          镜面玻璃
        </button>
      </div>

      <footer className="white-model-spec">
        <span className="white-model-spec__title">
          {material === 'glass' ? '3D 镜面玻璃 · Spiegelglas' : '3D 白膜 · Weißmodell'}
        </span>
        <span className="white-model-spec__dims">
          {`${(a * 2).toFixed(1)} × ${(b * 2).toFixed(1)} × ${(c * 2).toFixed(1)} mm · n=${n.toFixed(1)}`}
        </span>
        <span className="white-model-spec__hint">
          主光 + 反射光面光源 · 右侧面板调节 · 拖拽旋转
        </span>
      </footer>
    </div>
  )
}
