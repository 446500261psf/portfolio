import { useMemo, useState } from 'react'
import { caseFromSliders } from './shape/CaseParams'
import {
  DEFAULT_SLIDERS,
  ShapeControls,
  type ShapeSliderState,
} from './shape/ShapeControls'
import { ShapeStudio } from './shape/ShapeStudio'

type AppMode = 'shape' | 'field'

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
    </div>
  )
}
