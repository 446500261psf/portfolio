import { SUPERELLIPSE_N } from './types'

export interface SuperellipseBounds {
  cx: number
  cy: number
  a: number
  b: number
  n: number
}

export function createBounds(
  width: number,
  height: number,
  inset = 0,
): SuperellipseBounds {
  const cx = width / 2
  const cy = height / 2
  const a = width / 2 - inset
  const b = height / 2 - inset
  return { cx, cy, a, b, n: SUPERELLIPSE_N }
}

export function rho(x: number, y: number, bounds: SuperellipseBounds): number {
  const nx = (x - bounds.cx) / bounds.a
  const ny = (y - bounds.cy) / bounds.b
  return Math.pow(Math.abs(nx), bounds.n) + Math.pow(Math.abs(ny), bounds.n)
}

export function isInside(
  x: number,
  y: number,
  bounds: SuperellipseBounds,
  margin = 0,
): boolean {
  return rho(x, y, bounds) <= 1 - margin
}

export function edgeProximity(
  x: number,
  y: number,
  bounds: SuperellipseBounds,
): number {
  const r = rho(x, y, bounds)
  return Math.max(0, Math.min(1, (r - 0.55) / 0.45))
}

export function randomPointInSuperellipse(
  bounds: SuperellipseBounds,
  margin = 0.08,
  rng = Math.random,
): { x: number; y: number } {
  for (let i = 0; i < 64; i++) {
    const x = bounds.cx + (rng() * 2 - 1) * bounds.a * (1 - margin)
    const y = bounds.cy + (rng() * 2 - 1) * bounds.b * (1 - margin)
    if (isInside(x, y, bounds, margin)) return { x, y }
  }
  return { x: bounds.cx, y: bounds.cy }
}

export function superellipsePath(
  bounds: SuperellipseBounds,
  segments = 128,
): string {
  const points: string[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const cos = Math.cos(t)
    const sin = Math.sin(t)
    const x =
      bounds.cx +
      bounds.a * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / bounds.n)
    const y =
      bounds.cy +
      bounds.b * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / bounds.n)
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return `${points.join(' ')} Z`
}

export function clipCanvasToSuperellipse(
  ctx: CanvasRenderingContext2D,
  bounds: SuperellipseBounds,
): void {
  const path = new Path2D(superellipsePath(bounds))
  ctx.clip(path)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpCZM(
  from: { a: number; o: number; s: number },
  to: { a: number; o: number; s: number },
  t: number,
) {
  return {
    a: lerp(from.a, to.a, t),
    o: lerp(from.o, to.o, t),
    s: lerp(from.s, to.s, t),
  }
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function lerpColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1)
  const [r2, g2, b2] = hexToRgb(c2)
  const r = Math.round(lerp(r1, r2, t))
  const g = Math.round(lerp(g1, g2, t))
  const b = Math.round(lerp(b1, b2, t))
  return `rgb(${r},${g},${b})`
}

export function breathEnvelope(timeSec: number, bpm: number, amount: number): number {
  const phase = (timeSec * bpm) / 60
  return 1 + amount * Math.sin(phase * Math.PI * 2)
}
