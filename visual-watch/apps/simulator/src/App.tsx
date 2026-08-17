import { lazy, Suspense, useMemo, useState } from 'react'
import { caseFromSliders } from './shape/CaseParams'
import {
  ShapeControls,
  type ShapeSliderState,
} from './shape/ShapeControls'
import { ShapeStudio } from './shape/ShapeStudio'
import { LightControls } from './shape/LightControls'
import { DialControls } from './shape/DialControls'
import type { StudioLightingState } from './shape/studioLighting'
import type { FigmaDialId } from './dial/figmaDialStates'
import type { AppMode, OrbitCameraState, SurfaceMaterial } from './simulatorStorage'
import { WearableControls } from './wearable/WearableControls'
import type { WearableParams } from './wearable/wearableParams'
import { getInitialSimulatorState } from './usePersistSimulator'
import { usePersistSimulator } from './usePersistSimulator'

const WhiteModelView = lazy(() =>
  import('./shape/WhiteModelView').then((m) => ({ default: m.WhiteModelView })),
)

const FrontViewPreview = lazy(() =>
  import('./shape/FrontViewPreview').then((m) => ({ default: m.FrontViewPreview })),
)

const WearableView = lazy(() =>
  import('./wearable/WearableView').then((m) => ({ default: m.WearableView })),
)

const initial = getInitialSimulatorState()

export default function App() {
  const [mode, setMode] = useState<AppMode>(initial.mode)
  const [sliders, setSliders] = useState<ShapeSliderState>(initial.sliders)
  const [lights, setLights] = useState<StudioLightingState>(initial.lights)
  const [dialId, setDialId] = useState<FigmaDialId>(initial.dialId)
  const [surfaceMaterial, setSurfaceMaterial] = useState<SurfaceMaterial>(initial.surfaceMaterial)
  const [orbitCamera, setOrbitCamera] = useState<OrbitCameraState | null>(initial.orbitCamera)
  const [wear, setWear] = useState<WearableParams>(initial.wearable)

  const caseParams = useMemo(() => caseFromSliders(sliders), [sliders])

  usePersistSimulator(mode, sliders, lights, dialId, surfaceMaterial, orbitCamera, wear)

  const handleSliderChange = (next: Partial<ShapeSliderState>) => {
    setSliders((s) => ({ ...s, ...next }))
  }

  const handleWearChange = (next: Partial<WearableParams>) => {
    setWear((w) => ({ ...w, ...next }))
  }

  const handleLightChange = (next: Partial<StudioLightingState>) => {
    setLights((l) => ({
      key: next.key ?? l.key,
      fill: next.fill ?? l.fill,
    }))
  }

  return (
    <div id="shape-root" className="app app--shape">
      <nav className="mode-tabs">
        <button
          type="button"
          className={mode === 'shape' ? 'active' : ''}
          onClick={() => setMode('shape')}
        >
          外形工作室
        </button>
        <button
          type="button"
          className={mode === 'white3d' ? 'active' : ''}
          onClick={() => setMode('white3d')}
        >
          3D 白膜
        </button>
        <button
          type="button"
          className={mode === 'frontview' ? 'active' : ''}
          onClick={() => setMode('frontview')}
        >
          正视预览
        </button>
        <button
          type="button"
          className={mode === 'wearable' ? 'active' : ''}
          onClick={() => setMode('wearable')}
        >
          整机交互
        </button>
        <button
          type="button"
          className={mode === 'field' ? 'active' : ''}
          onClick={() => setMode('field')}
          disabled
          title="潭面场后续接入此外形"
        >
          潭面场（待接入）
        </button>
      </nav>

      {mode === 'shape' && (
        <>
          <main className="shape-panel">
            <ShapeStudio params={caseParams} />
          </main>
          <ShapeControls
            sliders={sliders}
            params={caseParams}
            onChange={handleSliderChange}
          />
        </>
      )}

      {mode === 'white3d' && (
        <>
          <main className="shape-panel shape-panel--3d">
            <Suspense fallback={<p className="white-model-loading">加载 3D 引擎…</p>}>
              <WhiteModelView
                params={caseParams}
                lights={lights}
                material={surfaceMaterial}
                orbitCamera={orbitCamera}
                onMaterialChange={setSurfaceMaterial}
                onOrbitChange={setOrbitCamera}
              />
            </Suspense>
          </main>
          <LightControls lights={lights} onChange={handleLightChange} />
        </>
      )}

      {mode === 'frontview' && (
        <>
          <main className="shape-panel shape-panel--3d">
            <Suspense fallback={<p className="white-model-loading">加载正视预览…</p>}>
              <FrontViewPreview params={caseParams} dialId={dialId} lights={lights} />
            </Suspense>
          </main>
          <DialControls dialId={dialId} onChange={setDialId} />
        </>
      )}

      {mode === 'wearable' && (
        <>
          <main className="shape-panel shape-panel--3d">
            <Suspense fallback={<p className="white-model-loading">加载整机场景…</p>}>
              <WearableView
                params={caseParams}
                wear={wear}
                dialId={dialId}
                lights={lights}
                onDialChange={setDialId}
              />
            </Suspense>
          </main>
          <WearableControls wear={wear} onChange={handleWearChange} />
        </>
      )}
    </div>
  )
}
