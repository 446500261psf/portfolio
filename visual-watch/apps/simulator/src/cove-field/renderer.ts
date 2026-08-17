import type { FieldParams } from './types'
import {
  breathEnvelope,
  clipCanvasToSuperellipse,
  createBounds,
  edgeProximity,
  lerpColor,
  superellipsePath,
  type SuperellipseBounds,
} from './superellipse'
import type { Particle } from './particles'

export function drawField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: FieldParams,
  particles: Particle[],
  timeSec: number,
  wakeBoost: number,
) {
  const bounds = createBounds(width, height, width * 0.04)
  const breath = breathEnvelope(timeSec, params.breathBpm, params.breathAmount)
  const brightness = Math.min(1.15, breath * (1 + wakeBoost * 0.15))

  ctx.save()
  clipCanvasToSuperellipse(ctx, bounds)

  drawBackground(ctx, width, height, bounds, params, timeSec, brightness)
  drawParticles(ctx, particles, params, bounds, brightness)
  drawRimGlow(ctx, bounds, params, timeSec, brightness)

  ctx.restore()
  drawBasinWall(ctx, bounds)
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bounds: SuperellipseBounds,
  params: FieldParams,
  timeSec: number,
  brightness: number,
) {
  const { colors } = params
  let outer = colors.outer
  let inner = colors.inner

  if (params.hueDrift > 0 && colors.dualOuter) {
    const t = (Math.sin(timeSec * (Math.PI * 2) / 45) + 1) / 2
    outer = lerpColor(colors.outer, colors.dualOuter, t * params.hueDrift)
  }

  let gradient: CanvasGradient
  switch (colors.gradientType) {
    case 'linear-vertical':
      gradient = ctx.createLinearGradient(0, height, 0, 0)
      break
    case 'linear-horizontal':
      gradient = ctx.createLinearGradient(0, 0, width, 0)
      break
    case 'dual':
    case 'radial':
    default:
      gradient = ctx.createRadialGradient(
        bounds.cx,
        bounds.cy - bounds.b * 0.08,
        bounds.a * 0.05,
        bounds.cx,
        bounds.cy,
        Math.max(bounds.a, bounds.b) * 1.05,
      )
  }

  gradient.addColorStop(0, adjustBrightness(inner, brightness))
  gradient.addColorStop(0.55, adjustBrightness(lerpColor(inner, outer, 0.45), brightness))
  gradient.addColorStop(1, adjustBrightness(outer, brightness * 0.92))

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const vignette = ctx.createRadialGradient(
    bounds.cx,
    bounds.cy,
    Math.min(bounds.a, bounds.b) * 0.2,
    bounds.cx,
    bounds.cy,
    Math.max(bounds.a, bounds.b),
  )
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(0.75, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  params: FieldParams,
  bounds: SuperellipseBounds,
  brightness: number,
) {
  const accent = adjustBrightness(params.colors.accent, brightness)

  for (const p of particles) {
    if (p.history.length > 1) {
      ctx.beginPath()
      ctx.moveTo(p.history[0].x, p.history[0].y)
      for (let i = 1; i < p.history.length; i++) {
        ctx.lineTo(p.history[i].x, p.history[i].y)
      }
      const edge = edgeProximity(p.x, p.y, bounds)
      ctx.strokeStyle = rgbaFromHex(accent, 0.08 + edge * 0.12)
      ctx.lineWidth = params.particleSize * 0.6
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    const edge = edgeProximity(p.x, p.y, bounds)
    const alpha = 0.35 + edge * 0.45
    const size = params.particleSize * (1 + edge * 0.35)

    ctx.beginPath()
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
    ctx.fillStyle = rgbaFromHex(accent, alpha)
    ctx.fill()
  }
}

function drawRimGlow(
  ctx: CanvasRenderingContext2D,
  bounds: SuperellipseBounds,
  params: FieldParams,
  timeSec: number,
  brightness: number,
) {
  const pulse = 0.85 + 0.15 * Math.sin(timeSec * params.breathBpm * 0.15)
  const strength = params.rimStrength * pulse * brightness

  const path = new Path2D(superellipsePath(bounds))
  ctx.strokeStyle = rgbaFromHex(params.colors.accent, strength * 0.35)
  ctx.lineWidth = Math.max(bounds.a, bounds.b) * 0.035
  ctx.filter = `blur(${bounds.a * 0.04}px)`
  ctx.stroke(path)
  ctx.filter = 'none'

  ctx.strokeStyle = rgbaFromHex('#ffffff', strength * 0.12)
  ctx.lineWidth = 1.5
  ctx.stroke(path)
}

function drawBasinWall(ctx: CanvasRenderingContext2D, bounds: SuperellipseBounds) {
  const path = new Path2D(superellipsePath(bounds))
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'
  ctx.lineWidth = 2
  ctx.stroke(path)
}

function adjustBrightness(hex: string, mult: number): string {
  const h = hex.replace('#', '')
  const r = Math.min(255, Math.round(parseInt(h.slice(0, 2), 16) * mult))
  const g = Math.min(255, Math.round(parseInt(h.slice(2, 4), 16) * mult))
  const b = Math.min(255, Math.round(parseInt(h.slice(4, 6), 16) * mult))
  return `rgb(${r},${g},${b})`
}

function rgbaFromHex(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export { createBounds, superellipsePath }
