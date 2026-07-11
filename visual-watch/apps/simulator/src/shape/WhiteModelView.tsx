import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Edges, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { CaseParams } from './CaseParams'
import { createWatchCaseGeometry } from './watchCaseGeometry'

interface WhiteModelViewProps {
  params: CaseParams
}

function cameraDistance(params: CaseParams): number {
  const span = Math.max(params.a, params.b, params.c) * 2
  return span * 2.4
}

function WhiteClayCase({ params }: { params: CaseParams }) {
  const geometry = useMemo(
    () => createWatchCaseGeometry(params, 96),
    [params.a, params.b, params.c, params.n],
  )

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#ececee"
        roughness={0.94}
        metalness={0}
        flatShading={false}
      />
      <Edges threshold={12} color="#5a5a62" />
    </mesh>
  )
}

function SceneContent({ params }: { params: CaseParams }) {
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

      <ambientLight intensity={0.62} />
      <hemisphereLight intensity={0.28} color="#ffffff" groundColor="#141414" />
      <directionalLight
        position={[dist, dist * 1.35, dist * 0.75]}
        intensity={1.05}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-dist * 0.55, dist * 0.35, -dist * 0.25]} intensity={0.32} />

      <WhiteClayCase params={params} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -params.c - 0.02]} receiveShadow>
        <planeGeometry args={[dist * 3, dist * 3]} />
        <shadowMaterial opacity={0.22} color="#000000" />
      </mesh>

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

/** 由三视图参数挤出超椭球表壳白膜 */
export function WhiteModelView({ params }: WhiteModelViewProps) {
  const { a, b, c, n } = params
  const camKey = `${a.toFixed(2)}-${b.toFixed(2)}-${c.toFixed(2)}-${n.toFixed(2)}`

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
            <SceneContent params={params} />
          </Suspense>
        </Canvas>
      </div>

      <footer className="white-model-spec">
        <span className="white-model-spec__title">3D 白膜 · Weißmodell</span>
        <span className="white-model-spec__dims">
          {`${(a * 2).toFixed(1)} × ${(b * 2).toFixed(1)} × ${(c * 2).toFixed(1)} mm · n=${n.toFixed(1)}`}
        </span>
        <span className="white-model-spec__hint">由外形工作室三视图轮廓挤出 · 拖拽旋转</span>
      </footer>
    </div>
  )
}
