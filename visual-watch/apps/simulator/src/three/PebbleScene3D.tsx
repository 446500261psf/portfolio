import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import type { FieldParams } from '../cove-field/types'
import { BasinField } from './BasinField'
import { PebbleBody } from './PebbleBody'
import { PEBBLE } from './superellipsoid'

interface PebbleScene3DProps {
  params: FieldParams
  wakeBoost: number
}

function SceneContent({ params, wakeBoost }: PebbleScene3DProps) {
  return (
    <>
      <color attach="background" args={['#0a0a0e']} />
      <fog attach="fog" args={['#0a0a0e', 4, 9]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[2.5, 3, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2, 1, 2]} intensity={0.35} color="#8899bb" />
      <pointLight position={[0, 0, 2.5]} intensity={0.25} color="#aaccff" />

      <group rotation={[-0.35, 0.25, 0]}>
        <PebbleBody />
        <BasinField params={params} wakeBoost={wakeBoost} />
      </group>

      <ContactShadows
        position={[0, 0, -PEBBLE.c - 0.05]}
        rotation={[Math.PI / 2, 0, 0]}
        opacity={0.45}
        scale={3.2}
        blur={2.5}
        far={1.2}
      />

      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={4.5}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.55}
        target={[0, 0, 0.05]}
      />

      <Environment preset="city" environmentIntensity={0.35} />
    </>
  )
}

export function PebbleScene3D({ params, wakeBoost }: PebbleScene3DProps) {
  return (
    <div className="scene-3d-wrap">
      <Canvas
        shadows
        camera={{ position: [0, -0.15, 2.85], fov: 38, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneContent params={params} wakeBoost={wakeBoost} />
        </Suspense>
      </Canvas>
      <p className="pebble-spec">3D 超椭球 n={PEBBLE.n} · 曲面潭面 · 拖拽旋转</p>
    </div>
  )
}
