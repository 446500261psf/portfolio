import { DEFAULT_FIGMA_DIAL, type FigmaDialId, FIGMA_DIAL_STATES } from './dial/figmaDialStates'
import { DEFAULT_SLIDERS, type ShapeSliderState } from './shape/ShapeControls'
import { DEFAULT_STUDIO_LIGHTS, type StudioLightingState } from './shape/studioLighting'

const STORAGE_KEY = 'cove-simulator-state-v1'

export type SurfaceMaterial = 'clay' | 'glass'

export type AppMode = 'shape' | 'white3d' | 'frontview' | 'field'

export interface PersistedSimulatorState {
  version: 1
  mode: AppMode
  sliders: ShapeSliderState
  lights: StudioLightingState
  dialId: FigmaDialId
  surfaceMaterial: SurfaceMaterial
}

const VALID_MODES: AppMode[] = ['shape', 'white3d', 'frontview', 'field']
const VALID_DIALS = new Set(FIGMA_DIAL_STATES.map((s) => s.id))
const VALID_MATERIALS: SurfaceMaterial[] = ['clay', 'glass']

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function parseSliders(raw: unknown): ShapeSliderState {
  const d = DEFAULT_SLIDERS
  if (!raw || typeof raw !== 'object') return d
  const o = raw as Record<string, unknown>
  return {
    widthMm: clamp(Number(o.widthMm) || d.widthMm, 28, 44),
    heightMm: clamp(Number(o.heightMm) || d.heightMm, 28, 48),
    thicknessMm: clamp(Number(o.thicknessMm) || d.thicknessMm, 6, 16),
    n: clamp(Number(o.n) || d.n, 2, 8),
    lockAspect: typeof o.lockAspect === 'boolean' ? o.lockAspect : d.lockAspect,
  }
}

function parseAreaLight(raw: unknown, fallback: StudioLightingState['key']) {
  if (!raw || typeof raw !== 'object') return fallback
  const o = raw as Record<string, unknown>
  const pos = o.position as Record<string, unknown> | undefined
  return {
    position: {
      x: clamp(Number(pos?.x) || fallback.position.x, -120, 120),
      y: clamp(Number(pos?.y) || fallback.position.y, -120, 120),
      z: clamp(Number(pos?.z) || fallback.position.z, -120, 120),
    },
    intensity: clamp(Number(o.intensity) || fallback.intensity, 0, 400),
    width: clamp(Number(o.width) || fallback.width, 8, 140),
    height: clamp(Number(o.height) || fallback.height, 8, 140),
    color: typeof o.color === 'string' ? o.color : fallback.color,
  }
}

function parseLights(raw: unknown): StudioLightingState {
  if (!raw || typeof raw !== 'object') return DEFAULT_STUDIO_LIGHTS
  const o = raw as Record<string, unknown>
  return {
    key: parseAreaLight(o.key, DEFAULT_STUDIO_LIGHTS.key),
    fill: parseAreaLight(o.fill, DEFAULT_STUDIO_LIGHTS.fill),
  }
}

export function loadPersistedState(): PersistedSimulatorState {
  const fallback: PersistedSimulatorState = {
    version: 1,
    mode: 'shape',
    sliders: DEFAULT_SLIDERS,
    lights: DEFAULT_STUDIO_LIGHTS,
    dialId: DEFAULT_FIGMA_DIAL,
    surfaceMaterial: 'glass',
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<PersistedSimulatorState>
    if (parsed.version !== 1) return fallback

    const mode = VALID_MODES.includes(parsed.mode as AppMode)
      ? (parsed.mode as AppMode)
      : fallback.mode
    const safeMode = mode === 'field' ? 'shape' : mode

    const dialId = VALID_DIALS.has(parsed.dialId as FigmaDialId)
      ? (parsed.dialId as FigmaDialId)
      : fallback.dialId

    const surfaceMaterial = VALID_MATERIALS.includes(parsed.surfaceMaterial as SurfaceMaterial)
      ? (parsed.surfaceMaterial as SurfaceMaterial)
      : fallback.surfaceMaterial

    return {
      version: 1,
      mode: safeMode,
      sliders: parseSliders(parsed.sliders),
      lights: parseLights(parsed.lights),
      dialId,
      surfaceMaterial,
    }
  } catch {
    return fallback
  }
}

export function savePersistedState(state: PersistedSimulatorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function getInitialSimulatorState(): PersistedSimulatorState {
  return loadPersistedState()
}
