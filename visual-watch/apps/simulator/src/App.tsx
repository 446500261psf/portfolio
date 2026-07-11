import { lazy, Suspense, useMemo, useState } from 'react'
import { caseFromSliders } from './shape/CaseParams'
import {
  DEFAULT_SLIDERS,
  ShapeControls,
  type ShapeSliderState,
} from './shape/ShapeControls'
import { ShapeStudio } from './shape/ShapeStudio'

const WhiteModelView = lazy(() =>
  import('./shape/WhiteModelView').then((m) => ({ default: m.WhiteModelView })),
)

type AppMode = 'shape' | 'white3d' | 'field'

export default function App() {
  const [mode, setMode] = useState<AppMode>('shape')
  const [sliders, setSliders] = useState<ShapeSliderState>(DEFAULT_SLIDERS)

  const caseParams = useMemo(() => caseFromSliders(sliders), [sliders])

  const handleSliderChange = (next: Partial<ShapeSliderState>) => {
    setSliders((s) => ({ ...s, ...next }))
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
              <WhiteModelView params={caseParams} />
            </Suspense>
          </main>
          <ShapeControls
            sliders={sliders}
            params={caseParams}
            onChange={handleSliderChange}
          />
        </>
      )}
    </div>
  )
}
