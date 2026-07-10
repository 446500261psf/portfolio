import type { ComfortPreset, FieldParams, PhaseId, PresetId } from './types'

function baseParams(
  partial: Partial<FieldParams> & Pick<FieldParams, 'colors' | 'behavior' | 'czm'>,
): FieldParams {
  return {
    particleCount: 120,
    particleSpeed: 0.4,
    particleSize: 1.8,
    trailLength: 12,
    coherence: 0.7,
    breathBpm: 6,
    breathAmount: 0.08,
    rimStrength: 0.35,
    edgeGather: 0,
    hueDrift: 0,
    ...partial,
  }
}

export const PRESETS: Record<PresetId, ComfortPreset> = {
  deep_pool: {
    id: 'deep_pool',
    label: '深潭',
    labelEn: 'Deep Pool',
    feeling: '可以沉下去做事',
    czm: { a: 0.25, o: 0.15, s: 0.85 },
    params: baseParams({
      czm: { a: 0.25, o: 0.15, s: 0.85 },
      colors: {
        inner: '#2d5a6b',
        outer: '#1a3a4a',
        accent: '#4a8a9f',
        gradientType: 'radial',
      },
      particleCount: 80,
      particleSpeed: 0.22,
      particleSize: 2.2,
      trailLength: 28,
      behavior: 'inward',
      coherence: 0.92,
      breathBpm: 6,
      breathAmount: 0.08,
      rimStrength: 0.25,
    }),
  },
  warm_current: {
    id: 'warm_current',
    label: '暖流',
    labelEn: 'Warm Current',
    feeling: '有人在场、可以说话',
    czm: { a: 0.45, o: 0.7, s: 0.6 },
    params: baseParams({
      czm: { a: 0.45, o: 0.7, s: 0.6 },
      colors: {
        inner: '#e8b88a',
        outer: '#c4783a',
        accent: '#f0d4b0',
        gradientType: 'linear-horizontal',
      },
      particleCount: 200,
      particleSpeed: 0.55,
      particleSize: 1.6,
      trailLength: 16,
      behavior: 'orbit',
      coherence: 0.75,
      breathBpm: 8,
      breathAmount: 0.06,
      rimStrength: 0.45,
    }),
  },
  upwelling: {
    id: 'upwelling',
    label: '跃泉',
    labelEn: 'Upwelling',
    feeling: '身体该动起来',
    czm: { a: 0.8, o: 0.4, s: 0.5 },
    params: baseParams({
      czm: { a: 0.8, o: 0.4, s: 0.5 },
      colors: {
        inner: '#7ecdb8',
        outer: '#3d8b7a',
        accent: '#a8e6d4',
        gradientType: 'linear-vertical',
      },
      particleCount: 300,
      particleSpeed: 1.1,
      particleSize: 1.4,
      trailLength: 10,
      behavior: 'upward',
      coherence: 0.55,
      breathBpm: 10,
      breathAmount: 0.05,
      rimStrength: 0.5,
    }),
  },
  still_shore: {
    id: 'still_shore',
    label: '静岸',
    labelEn: 'Still Shore',
    feeling: '可以什么都不做',
    czm: { a: 0.1, o: 0.3, s: 0.9 },
    params: baseParams({
      czm: { a: 0.1, o: 0.3, s: 0.9 },
      colors: {
        inner: '#2a3d32',
        outer: '#1e2d24',
        accent: '#3d5248',
        gradientType: 'radial',
      },
      particleCount: 30,
      particleSpeed: 0.06,
      particleSize: 2.4,
      trailLength: 32,
      behavior: 'still',
      coherence: 0.98,
      breathBpm: 5,
      breathAmount: 0.05,
      rimStrength: 0.15,
    }),
  },
  crossflow: {
    id: 'crossflow',
    label: '紊流',
    labelEn: 'Crossflow',
    feeling: '在切换中，别深度投入',
    czm: { a: 0.55, o: 0.55, s: 0.2 },
    params: baseParams({
      czm: { a: 0.55, o: 0.55, s: 0.2 },
      colors: {
        inner: '#5a6a7a',
        outer: '#3a4550',
        accent: '#8a7a6a',
        dualOuter: '#4a5a6a',
        gradientType: 'dual',
      },
      particleCount: 180,
      particleSpeed: 0.75,
      particleSize: 1.5,
      trailLength: 8,
      behavior: 'cross',
      coherence: 0.25,
      breathBpm: 7,
      breathAmount: 0.04,
      rimStrength: 0.55,
      hueDrift: 1,
    }),
  },
  open_basin: {
    id: 'open_basin',
    label: '空潭',
    labelEn: 'Open Basin',
    feeling: '没有安排，自由',
    czm: { a: 0.2, o: 0.5, s: 0.1 },
    params: baseParams({
      czm: { a: 0.2, o: 0.5, s: 0.1 },
      colors: {
        inner: '#323238',
        outer: '#2a2a2e',
        accent: '#4a4a52',
        gradientType: 'radial',
      },
      particleCount: 50,
      particleSpeed: 0.18,
      particleSize: 1.8,
      trailLength: 20,
      behavior: 'drift',
      coherence: 0.15,
      breathBpm: 4,
      breathAmount: 0.03,
      rimStrength: 0.2,
    }),
  },
}

export const PRESET_LIST = Object.values(PRESETS)

export const PHASE_LABELS: Record<PhaseId, string> = {
  dwelling: '驻留 Dwelling',
  approach: '趋近 Approach',
  crossing: '渡越 Crossing',
  drift: '漂游 Drift',
}

export function applyPhaseModifiers(
  params: FieldParams,
  phase: PhaseId,
  nextParams: FieldParams | null,
  crossingProgress: number,
): FieldParams {
  const p = { ...params, colors: { ...params.colors } }

  switch (phase) {
    case 'dwelling':
      return p
    case 'approach':
      if (nextParams) {
        p.colors.outer = lerpColors(params.colors.outer, nextParams.colors.outer, 0.2)
        p.colors.inner = lerpColors(params.colors.inner, nextParams.colors.inner, 0.15)
        p.edgeGather = 0.55
        p.rimStrength += 0.2
      }
      return p
    case 'crossing':
      if (nextParams) {
        const t = crossingProgress
        return lerpFieldParams(params, nextParams, t)
      }
      return p
    case 'drift':
      p.particleSpeed *= 0.85
      p.breathAmount *= 1.2
      return p
    default:
      return p
  }
}

function lerpColors(c1: string, c2: string, t: number): string {
  const parse = (c: string) => {
    const h = c.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const [r1, g1, b1] = parse(c1)
  const [r2, g2, b2] = parse(c2)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function lerpFieldParams(a: FieldParams, b: FieldParams, t: number): FieldParams {
  return {
    czm: {
      a: a.czm.a + (b.czm.a - a.czm.a) * t,
      o: a.czm.o + (b.czm.o - a.czm.o) * t,
      s: a.czm.s + (b.czm.s - a.czm.s) * t,
    },
    colors: {
      inner: lerpColors(a.colors.inner, b.colors.inner, t),
      outer: lerpColors(a.colors.outer, b.colors.outer, t),
      accent: lerpColors(a.colors.accent, b.colors.accent, t),
      gradientType: t < 0.5 ? a.colors.gradientType : b.colors.gradientType,
      dualOuter: b.colors.dualOuter
        ? lerpColors(a.colors.outer, b.colors.dualOuter, t)
        : undefined,
    },
    particleCount: Math.round(a.particleCount + (b.particleCount - a.particleCount) * t),
    particleSpeed: a.particleSpeed + (b.particleSpeed - a.particleSpeed) * t,
    particleSize: a.particleSize + (b.particleSize - a.particleSize) * t,
    trailLength: Math.round(a.trailLength + (b.trailLength - a.trailLength) * t),
    behavior: t < 0.5 ? a.behavior : b.behavior,
    coherence: a.coherence + (b.coherence - a.coherence) * t,
    breathBpm: a.breathBpm + (b.breathBpm - a.breathBpm) * t,
    breathAmount: a.breathAmount + (b.breathAmount - a.breathAmount) * t,
    rimStrength: a.rimStrength + (b.rimStrength - a.rimStrength) * t,
    edgeGather: a.edgeGather + (b.edgeGather - a.edgeGather) * t,
    hueDrift: a.hueDrift + (b.hueDrift - a.hueDrift) * t,
  }
}

export function paramsFromCzm(czm: { a: number; o: number; s: number }): FieldParams {
  const nearest = PRESET_LIST.reduce((best, preset) => {
    const d =
      Math.hypot(preset.czm.a - czm.a, preset.czm.o - czm.o) +
      Math.abs(preset.czm.s - czm.s) * 0.5
    return d < best.d ? { preset, d } : best
  }, { preset: PRESETS.deep_pool, d: Infinity }).preset

  const p = { ...nearest.params, czm: { ...czm }, colors: { ...nearest.params.colors } }
  p.particleSpeed = 0.15 + czm.a * 1.0
  p.particleCount = Math.round(40 + czm.o * 220)
  p.coherence = 0.15 + czm.s * 0.8
  p.rimStrength = 0.15 + czm.a * 0.4 + czm.o * 0.15
  p.breathBpm = 4 + czm.a * 6
  p.breathAmount = 0.04 + (1 - czm.s) * 0.04
  return p
}
