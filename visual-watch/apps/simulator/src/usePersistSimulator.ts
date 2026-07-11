import { useEffect } from 'react'
import {
  getInitialSimulatorState,
  savePersistedState,
  type AppMode,
  type PersistedSimulatorState,
} from './simulatorStorage'
import type { FigmaDialId } from './dial/figmaDialStates'
import type { ShapeSliderState } from './shape/ShapeControls'
import type { StudioLightingState } from './shape/studioLighting'
import type { SurfaceMaterial } from './simulatorStorage'

export function usePersistSimulator(
  mode: AppMode,
  sliders: ShapeSliderState,
  lights: StudioLightingState,
  dialId: FigmaDialId,
  surfaceMaterial: SurfaceMaterial,
): void {
  useEffect(() => {
    const snapshot: PersistedSimulatorState = {
      version: 1,
      mode,
      sliders,
      lights,
      dialId,
      surfaceMaterial,
    }
    const t = window.setTimeout(() => savePersistedState(snapshot), 120)
    return () => window.clearTimeout(t)
  }, [mode, sliders, lights, dialId, surfaceMaterial])
}

export { getInitialSimulatorState }
