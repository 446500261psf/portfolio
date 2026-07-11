import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { CaseParams } from './CaseParams'
import { createWatchCaseGeometry } from './watchCaseGeometry'

interface WhiteModelViewProps {
  params: CaseParams
}

export type SurfaceMaterial = 'clay' | 'glass'

function cameraDistance(params: CaseParams): number {
  const span = Math.max(params.a, params.b, params.c) * 2
  return span * 2.4
}

function GlassCase({ geometry, thickness }: { geometry: THREE.BufferGeometry; thickness: number }) {
  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshPhysicalMaterial
          color="#34343c"
          roughness={0.09}
          metalness={0}
          transmission={0.78}
          thickness={thickness}
          ior={1.52}
          envMapIntensity={0}
          specularIntensity={0}
          clearcoat={0.65}
          clearcoatRoughness={0.06}
          transparent
          side={THREE.FrontSide}
        />
      </mesh>
      {/* 背向壳体：只在轮廓处可见，形成柔边 rim light */}
      <mesh geometry={geometry} scale={1.018}>
        <meshBasicMaterial
          color="#a8b0bc"
          side={THREE.BackSide}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
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
    return <GlassCase geometry={geometry} thickness={params.c * 0.85} />
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
}: {
  params: CaseParams
  material: SurfaceMaterial
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

      <ambientLight intensity={material === 'glass' ? 0.95 : 0.62} />
      <hemisphereLight
        intensity={material === 'glass' ? 0.72 : 0.28}
        color="#d8dce4"
        groundColor="#181818"
      />
      {material === 'glass' && (
        <>
          {/* 轮廓光：从模型后方打光，specular=0 时仅提亮边缘漫反射 */}
          <directionalLight position={[-dist * 0.9, dist * 0.55, -dist * 0.85]} intensity={0.55} color="#c8d0dc" />
          <directionalLight position={[dist * 0.75, dist * 0.35, -dist * 0.9]} intensity={0.38} color="#b0b8c8" />
          <directionalLight position={[0, -dist * 0.6, -dist * 0.5]} intensity={0.22} color="#9098a8" />
          <directionalLight position={[0, 0, dist * 0.85]} intensity={0.12} color="#606870" />
        </>
      )}
      {material === 'clay' && (
        <>
          <directionalLight
            position={[dist, dist * 1.35, dist * 0.75]}
            intensity={1.05}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-dist * 0.55, dist * 0.35, -dist * 0.25]} intensity={0.32} />
        </>
      )}

      <CaseMesh params={params} material={material} />

      <ContactShadows
        position={[0, 0, -params.c - 0.04]}
        rotation={[Math.PI / 2, 0, 0]}
        opacity={material === 'glass' ? 0.28 : 0.35}
        scale={Math.max(params.a, params.b) * 4}
        blur={2.2}
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

/** 由三视图参数挤出超椭球表壳白膜 / 镜面玻璃 */
export function WhiteModelView({ params }: WhiteModelViewProps) {
  const { a, b, c, n } = params
  const [material, setMaterial] = useState<SurfaceMaterial>('clay')
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
            <SceneContent params={params} material={material} />
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
          {material === 'glass'
            ? '暗色镜面 · 轮廓光 · 无场景贴图 · 拖拽旋转'
            : '由外形工作室三视图轮廓挤出 · 拖拽旋转'}
        </span>
      </footer>
    </div>
  )
}
