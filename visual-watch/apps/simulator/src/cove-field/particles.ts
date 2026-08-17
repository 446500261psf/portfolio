import type { FieldParams, ParticleBehavior } from './types'
import {
  edgeProximity,
  isInside,
  randomPointInSuperellipse,
  type SuperellipseBounds,
} from './superellipse'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  orbitAngle: number
  orbitRadius: number
  history: { x: number; y: number }[]
}

export class ParticleSystem {
  particles: Particle[] = []
  private bounds: SuperellipseBounds
  private time = 0
  private noiseOffset = Math.random() * 1000

  constructor(bounds: SuperellipseBounds, params: FieldParams) {
    this.bounds = bounds
    this.reset(params)
  }

  reset(params: FieldParams) {
    this.particles = []
    for (let i = 0; i < params.particleCount; i++) {
      this.particles.push(this.spawnParticle())
    }
  }

  resize(bounds: SuperellipseBounds) {
    this.bounds = bounds
  }

  updateParams(params: FieldParams) {
    const diff = Math.abs(params.particleCount - this.particles.length)
    if (diff > params.particleCount * 0.25) {
      this.reset(params)
    }
  }

  private spawnParticle(): Particle {
    const { x, y } = randomPointInSuperellipse(this.bounds, 0.1)
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * Math.min(this.bounds.a, this.bounds.b) * 0.55
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      life: Math.random(),
      orbitAngle: angle,
      orbitRadius: dist,
      history: [],
    }
  }

  update(dt: number, params: FieldParams, edgeGather: number) {
    this.time += dt
    const { bounds } = this

    while (this.particles.length < params.particleCount) {
      this.particles.push(this.spawnParticle())
    }
    while (this.particles.length > params.particleCount) {
      this.particles.pop()
    }

    for (const p of this.particles) {
      this.applyBehavior(p, params, edgeGather, dt)
      p.x += p.vx * dt * 60
      p.y += p.vy * dt * 60

      if (!isInside(p.x, p.y, bounds, 0.02)) {
        const respawn = randomPointInSuperellipse(bounds, 0.12)
        p.x = respawn.x
        p.y = respawn.y
        p.history = []
      }

      p.history.push({ x: p.x, y: p.y })
      if (p.history.length > params.trailLength) {
        p.history.shift()
      }
    }
  }

  private applyBehavior(
    p: Particle,
    params: FieldParams,
    edgeGather: number,
    dt: number,
  ) {
    const dx = this.bounds.cx - p.x
    const dy = this.bounds.cy - p.y
    const dist = Math.hypot(dx, dy) || 1
    const speed = params.particleSpeed
    const coh = params.coherence
    const noise = this.simplex2(
      p.x * 0.008 + this.noiseOffset,
      p.y * 0.008 + this.time * 0.3,
    )

    let ax = 0
    let ay = 0

    switch (params.behavior) {
      case 'inward':
        ax = (dx / dist) * speed * 0.35
        ay = (dy / dist) * speed * 0.35
        ax += noise * (1 - coh) * 0.15
        ay += (this.simplex2(p.y, this.time) - 0.5) * (1 - coh) * 0.2
        break
      case 'orbit': {
        p.orbitAngle += dt * speed * 0.45
        const tx =
          this.bounds.cx + Math.cos(p.orbitAngle) * p.orbitRadius
        const ty =
          this.bounds.cy + Math.sin(p.orbitAngle) * p.orbitRadius * 0.75
        ax = (tx - p.x) * 0.08 * coh
        ay = (ty - p.y) * 0.08 * coh
        ax += noise * 0.12
        break
      }
      case 'upward':
        ay = -speed * 0.65
        ax = (this.bounds.cx - p.x) * 0.002 + (noise - 0.5) * 0.25
        if (p.y < this.bounds.cy - this.bounds.b * 0.75) {
          const r = randomPointInSuperellipse(this.bounds, 0.15)
          p.x = r.x
          p.y = this.bounds.cy + this.bounds.b * 0.65
          p.history = []
        }
        break
      case 'still':
        ax = (noise - 0.5) * 0.04 * (1 - coh + 0.02)
        ay = (this.simplex2(this.time, p.x) - 0.5) * 0.04 * (1 - coh + 0.02)
        p.vx *= 0.92
        p.vy *= 0.92
        break
      case 'cross':
        ax = Math.sin(this.time * 0.7 + p.life * 10) * speed * 0.35
        ay = Math.cos(this.time * 0.5 + p.life * 8) * speed * 0.35
        break
      case 'drift':
        ax = (noise - 0.5) * speed * 0.4
        ay = (this.simplex2(p.x, p.y + this.time) - 0.5) * speed * 0.4
        break
    }

    if (edgeGather > 0) {
      const edge = edgeProximity(p.x, p.y, this.bounds)
      if (edge > 0.35) {
        const nx = (p.x - this.bounds.cx) / this.bounds.a
        const ny = (p.y - this.bounds.cy) / this.bounds.b
        const len = Math.hypot(nx, ny) || 1
        ax += (nx / len) * edgeGather * speed * 0.5 * smooth(edge)
        ay += (ny / len) * edgeGather * speed * 0.5 * smooth(edge)
      }
    }

    p.vx = p.vx * 0.88 + ax
    p.vy = p.vy * 0.88 + ay
  }

  private simplex2(x: number, y: number): number {
    return (
      (Math.sin(x * 1.7 + y * 1.3) +
        Math.sin(x * 0.9 - y * 2.1) +
        Math.sin(x * 2.3 + y * 0.7)) /
        3 +
      0.5
    )
  }
}

function smooth(x: number): number {
  return x * x * (3 - 2 * x)
}

export function behaviorLabel(b: ParticleBehavior): string {
  const map: Record<ParticleBehavior, string> = {
    inward: '向心吸纳',
    orbit: '涡旋轨道',
    upward: '向上涌流',
    still: '静泊微漂',
    cross: '交叉紊流',
    drift: '自由漂移',
  }
  return map[b]
}
