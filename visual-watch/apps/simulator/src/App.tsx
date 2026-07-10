import { useMemo, useState } from 'react'
import type { CZM, PhaseId, PresetId } from './cove-field/types'
import {
  PRESETS,
  applyPhaseModifiers,
  paramsFromCzm,
} from './cove-field/presets'
import { behaviorLabel } from './cove-field/particles'
import { PebbleShell } from './components/PebbleShell'
import { CoveCanvas } from './components/CoveCanvas'
import { Controls } from './components/Controls'

const DISPLAY_W = 280

export default function App() {
  const [preset, setPreset] = useState<PresetId>('deep_pool')
  const [phase, setPhase] = useState<PhaseId>('dwelling')
  const [nextPreset, setNextPreset] = useState<PresetId>('warm_current')
  const [crossingProgress, setCrossingProgress] = useState(0.45)
  const [customCzm, setCustomCzm] = useState<CZM | null>(null)
  const [wakeBoost, setWakeBoost] = useState(false)

  const activePreset = PRESETS[preset]
  const nextParams = PRESETS[nextPreset].params

  const fieldParams = useMemo(() => {
    const base = customCzm
      ? paramsFromCzm(customCzm)
      : { ...activePreset.params }
    return applyPhaseModifiers(base, phase, nextParams, crossingProgress)
  }, [
    activePreset,
    customCzm,
    phase,
    nextParams,
    crossingProgress,
  ])

  const displayH = Math.round(DISPLAY_W * 1.156)

  return (
    <div className="app">
      <main className="stage-panel">
        <PebbleShell displayWidth={DISPLAY_W}>
          <CoveCanvas
            width={DISPLAY_W}
            height={displayH}
            params={fieldParams}
            edgeGather={0}
            wakeBoost={wakeBoost}
          />
        </PebbleShell>
      </main>

      <Controls
        preset={preset}
        phase={phase}
        nextPreset={nextPreset}
        crossingProgress={crossingProgress}
        customCzm={customCzm}
        feeling={activePreset.feeling}
        behavior={behaviorLabel(fieldParams.behavior)}
        onPresetChange={setPreset}
        onPhaseChange={setPhase}
        onNextPresetChange={setNextPreset}
        onCrossingProgressChange={setCrossingProgress}
        onCzmChange={setCustomCzm}
        onWake={() => setWakeBoost(true)}
      />
    </div>
  )
}
