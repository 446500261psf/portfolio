import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from '@react-three/drei'
import type { CaseParams } from './CaseParams'
import { orthoZoom } from './watchCaseGeometry'
import { OutlineOverlay, ViewTriad, WatchCaseMesh } from './WatchCaseMesh'

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[50, 80, 60]} intensity={0.7} />
      <directionalLight position={[-40, 30, 40]} intensity={0.3} />
    </>
  )
}

interface MainPreviewProps {
  params: CaseParams
}

/** 主预览：独立 Canvas，斜 45° 初始视角 */
export function MainPreview({ params }: MainPreviewProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%', background: '#e8e8ec' }}
    >
      <PerspectiveCamera
        makeDefault
        position={[58, 42, 58]}
        fov={32}
        near={0.1}
        far={500}
      />
      <SceneLights />
      <WatchCaseMesh params={params} />
      <OrbitControls
        enablePan={false}
        minDistance={35}
        maxDistance={140}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

interface OrthoPanelProps {
  params: CaseParams
  view: 'front' | 'side' | 'top'
}

export function OrthoPanel({ params, view }: OrthoPanelProps) {
  const zoom = orthoZoom(params, view) * 40
  const camKey = `${view}-${params.a.toFixed(1)}-${params.b.toFixed(1)}-${params.c.toFixed(1)}-${params.n}`

  const camera = (() => {
    switch (view) {
      case 'front':
        return { position: [0, 0, 100] as const, up: [0, 1, 0] as const }
      case 'side':
        return { position: [100, 0, 0] as const, up: [0, 1, 0] as const }
      case 'top':
        return { position: [0, 100, 0] as const, up: [0, 0, -1] as const }
    }
  })()

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%', background: '#e0e0e6' }}
    >
      <OrthographicCamera
        key={camKey}
        makeDefault
        position={camera.position}
        up={camera.up}
        zoom={zoom}
        near={0.1}
        far={500}
      />
      <SceneLights />
      <WatchCaseMesh params={params} showEdges />
      <OutlineOverlay params={params} view={view} />
      <ViewTriad view={view} />
    </Canvas>
  )
}
