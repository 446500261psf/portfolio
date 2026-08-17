export type PresetId =
  | 'deep_pool'
  | 'warm_current'
  | 'upwelling'
  | 'still_shore'
  | 'crossflow'
  | 'open_basin'

export type PhaseId = 'dwelling' | 'approach' | 'crossing' | 'drift'

export type ParticleBehavior =
  | 'inward'
  | 'orbit'
  | 'upward'
  | 'still'
  | 'cross'
  | 'drift'

export interface CZM {
  a: number
  o: number
  s: number
}

export interface ColorStops {
  inner: string
  outer: string
  accent: string
  gradientType: 'radial' | 'linear-vertical' | 'linear-horizontal' | 'dual'
  dualOuter?: string
}

export interface FieldParams {
  czm: CZM
  colors: ColorStops
  particleCount: number
  particleSpeed: number
  particleSize: number
  trailLength: number
  behavior: ParticleBehavior
  coherence: number
  breathBpm: number
  breathAmount: number
  rimStrength: number
  edgeGather: number
  hueDrift: number
}

export interface ComfortPreset {
  id: PresetId
  label: string
  labelEn: string
  feeling: string
  czm: CZM
  params: FieldParams
}

export interface SimulatorState {
  preset: PresetId
  phase: PhaseId
  nextPreset: PresetId
  crossingProgress: number
  customCzm: CZM | null
  wakeBoost: boolean
}

export const SUPERELLIPSE_N = 4.5
export const ASPECT_RATIO = 1.156
