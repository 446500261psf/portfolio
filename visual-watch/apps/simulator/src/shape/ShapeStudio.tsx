import { useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  View,
} from '@react-three/drei'
import type { CaseParams } from './CaseParams'
import { orthoZoom } from './watchCaseGeometry'
import { OutlineOverlay, ViewTriad, WatchCaseMesh } from './WatchCaseMesh'

interface ShapeStudioProps {
  params: CaseParams
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[40, 60, 50]} intensity={0.65} />
      <directionalLight position={[-30, 20, 30]} intensity={0.25} />
    </>
  )
}

function OrthoViewContent({
  params,
  view,
}: {
  params: CaseParams
  view: 'front' | 'side' | 'top'
}) {
  const zoom = orthoZoom(params, view) * 40

  const cameraProps = useMemo(() => {
    switch (view) {
      case 'front':
        return { position: [0, 0, 100] as const, up: [0, 1, 0] as const }
      case 'side':
        return { position: [100, 0, 0] as const, up: [0, 1, 0] as const }
      case 'top':
        return { position: [0, 100, 0] as const, up: [0, 0, -1] as const }
    }
  }, [view])

  return (
    <>
      <OrthographicCamera
        makeDefault
        position={cameraProps.position}
        up={cameraProps.up}
        zoom={zoom}
        near={0.1}
        far={500}
      />
      <SceneLights />
      <WatchCaseMesh params={params} showEdges />
      <OutlineOverlay params={params} view={view} />
      <ViewTriad view={view} />
    </>
  )
}

export function ShapeStudio({ params }: ShapeStudioProps) {
  const mainRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const sideRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  return (
    <div className="shape-studio">
      <div className="shape-viewports">
        <div ref={mainRef} className="view-frame view-frame--main">
          <span className="view-label">三维预览 · 拖拽旋转</span>
        </div>

        <div className="triple-row">
          <div ref={frontRef} className="view-frame view-frame--ortho">
            <span className="view-label">正视图 Front</span>
          </div>
          <div ref={sideRef} className="view-frame view-frame--ortho">
            <span className="view-label">侧视图 Side</span>
          </div>
          <div ref={topRef} className="view-frame view-frame--ortho">
            <span className="view-label">俯视图 Top</span>
          </div>
        </div>
      </div>

      <Canvas
        className="shape-canvas"
        eventSource={document.getElementById('shape-root') ?? undefined}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#e8e8ec']} />

        <View track={mainRef as React.MutableRefObject<HTMLElement>}>
          <PerspectiveCamera makeDefault position={[0, -8, 72]} fov={28} near={0.1} far={300} />
          <SceneLights />
          <WatchCaseMesh params={params} />
          <OrbitControls
            enablePan={false}
            minDistance={40}
            maxDistance={120}
            target={[0, 0, 0]}
          />
        </View>

        <View track={frontRef as React.MutableRefObject<HTMLElement>}>
          <OrthoViewContent key={`f-${params.n}-${params.a}-${params.b}-${params.c}`} params={params} view="front" />
        </View>

        <View track={sideRef as React.MutableRefObject<HTMLElement>}>
          <OrthoViewContent key={`s-${params.n}-${params.a}-${params.b}-${params.c}`} params={params} view="side" />
        </View>

        <View track={topRef as React.MutableRefObject<HTMLElement>}>
          <OrthoViewContent key={`t-${params.n}-${params.a}-${params.b}-${params.c}`} params={params} view="top" />
        </View>
      </Canvas>
    </div>
  )
}
