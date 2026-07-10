import { useMemo, useState } from 'react'
import type { CZM, PhaseId, PresetId } from './cove-field/types'
import {
  PRESETS,
  applyPhaseModifiers,
  paramsFromCzm,
} from './cove-field/presets'
import { behaviorLabel } from './cove-field/particles'
import { Controls } from './components/Controls'
import { PebbleScene3D } from './three/PebbleScene3D'

export default function App() {
  const [preset, setPreset] = useState<PresetId>('deep_pool')
  const [phase, setPhase] = useState<PhaseId>('dwelling')
  const [nextPreset, setNextPreset] = useState<PresetId>('warm_current')
  const [crossingProgress, setCrossingProgress] = useState(0.45)
  const [customCzm, setCustomCzm] = useState<CZM | null>(null)
  const [wakeTick, setWakeTick] = useState(0)

  const activePreset = PRESETS[preset]
  const nextParams = PRESETS[nextPreset].params

  const fieldParams = useMemo(() => {
    const base = customCzm
      ? paramsFromCzm(customCzm)
      : { ...activePreset.params }
    return applyPhaseModifiers(base, phase, nextParams, crossingProgress)
  }, [activePreset, customCzm, phase, nextParams, crossingProgress])

  return (
    <div className="app">
      <main className="stage-panel">
        <PebbleScene3D params={fieldParams} wakeBoost={wakeTick} />
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
        onWake={() => setWakeTick((t) => t + 1)}
      />
    </div>
  )
}
