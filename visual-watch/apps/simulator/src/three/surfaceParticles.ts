import type { FieldParams } from '../cove-field/types'
import {
  edgeProximity2d,
  inside2d,
  PEBBLE,
  randomBasinPoint,
  rho2d,
} from './superellipsoid'

export interface SurfaceParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  orbitAngle: number
  orbitRadius: number
}

export class SurfaceParticleSystem {
  particles: SurfaceParticle[] = []
  private time = 0
  private noiseOffset = Math.random() * 1000

  reset(params: FieldParams) {
    this.particles = []
    for (let i = 0; i < params.particleCount; i++) {
      this.particles.push(this.spawn())
    }
  }

  private spawn(): SurfaceParticle {
    const { x, y } = randomBasinPoint()
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      life: Math.random(),
      orbitAngle: Math.random() * Math.PI * 2,
      orbitRadius: Math.random() * 0.45,
    }
  }

  updateParams(params: FieldParams) {
    const diff = Math.abs(params.particleCount - this.particles.length)
    if (diff > params.particleCount * 0.25) this.reset(params)
    while (this.particles.length < params.particleCount) this.particles.push(this.spawn())
    while (this.particles.length > params.particleCount) this.particles.pop()
  }

  update(dt: number, params: FieldParams, edgeGather: number) {
    this.time += dt
    const speed = params.particleSpeed * 0.012
    const coh = params.coherence

    for (const p of this.particles) {
      this.behavior(p, params, speed, coh, edgeGather, dt)
      p.x += p.vx
      p.y += p.vy

      if (!inside2d(p.x, p.y, PEBBLE.safeMargin)) {
        const r = randomBasinPoint()
        p.x = r.x
        p.y = r.y
        p.vx = 0
        p.vy = 0
      }

      p.vx *= 0.9
      p.vy *= 0.9
    }
  }

  private behavior(
    p: SurfaceParticle,
    params: FieldParams,
    speed: number,
    coh: number,
    edgeGather: number,
    dt: number,
  ) {
    const cx = 0
    const cy = 0
    const dx = cx - p.x
    const dy = cy - p.y
    const dist = Math.hypot(dx, dy) || 0.001
    const noise = this.noise(p.x, p.y)

    switch (params.behavior) {
      case 'inward':
        p.vx += (dx / dist) * speed * 0.6
        p.vy += (dy / dist) * speed * 0.6
        p.vx += (noise - 0.5) * (1 - coh) * 0.004
        break
      case 'orbit':
        p.orbitAngle += dt * speed * 2.2
        p.vx += (Math.cos(p.orbitAngle) * p.orbitRadius - p.x) * 0.02 * coh
        p.vy += (Math.sin(p.orbitAngle) * p.orbitRadius * 0.75 - p.y) * 0.02 * coh
        break
      case 'upward':
        p.vy += speed * 0.85
        p.vx += (cx - p.x) * 0.001 + (noise - 0.5) * 0.006
        if (p.y > PEBBLE.b * 0.72) {
          const r = randomBasinPoint()
          p.x = r.x
          p.y = -PEBBLE.b * 0.65
        }
        break
      case 'still':
        p.vx += (noise - 0.5) * 0.0008
        p.vy += (this.noise(p.y, this.time) - 0.5) * 0.0008
        break
      case 'cross':
        p.vx += Math.sin(this.time * 0.7 + p.life * 10) * speed * 0.5
        p.vy += Math.cos(this.time * 0.5 + p.life * 8) * speed * 0.5
        break
      case 'drift':
        p.vx += (noise - 0.5) * speed * 0.6
        p.vy += (this.noise(p.x + 10, p.y) - 0.5) * speed * 0.6
        break
    }

    if (edgeGather > 0) {
      const edge = edgeProximity2d(p.x, p.y)
      if (edge > 0.35) {
        const nx = p.x / PEBBLE.a
        const ny = p.y / PEBBLE.b
        const len = Math.hypot(nx, ny) || 1
        p.vx += (nx / len) * edgeGather * speed * 0.8 * edge
        p.vy += (ny / len) * edgeGather * speed * 0.8 * edge
      }
    }
  }

  private noise(x: number, y: number): number {
    return (
      (Math.sin(x * 8 + y * 6 + this.noiseOffset) +
        Math.sin(x * 4 - y * 9 + this.time * 0.4)) /
        2 +
      0.5
    )
  }
}

export function rhoAt(x: number, y: number): number {
  return rho2d(x, y)
}
