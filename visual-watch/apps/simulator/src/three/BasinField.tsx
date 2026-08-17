import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { FieldParams } from '../cove-field/types'
import { breathEnvelope } from '../cove-field/superellipse'
import {
  basinFragmentShader,
  basinVertexShader,
  gradientTypeIndex,
  hexToVec3,
} from './basinShader'
import { createBasinGeometry, PEBBLE } from './superellipsoid'
import { SurfaceParticleSystem } from './surfaceParticles'
import { basinZ } from './superellipsoid'

interface BasinFieldProps {
  params: FieldParams
  wakeBoost: number
}

export function BasinField({ params, wakeBoost }: BasinFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const systemRef = useRef<SurfaceParticleSystem | null>(null)
  const wakeRef = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    if (wakeBoost) wakeRef.current = 1
  }, [wakeBoost])

  const geometry = useMemo(() => createBasinGeometry(80), [])
  const pointsGeo = useMemo(() => new THREE.BufferGeometry(), [])

  const material = useMemo(() => {
    const [ir, ig, ib] = hexToVec3(params.colors.inner)
    const [or, og, ob] = hexToVec3(params.colors.outer)
    const [ar, ag, ab] = hexToVec3(params.colors.accent)
    const dual = params.colors.dualOuter
      ? hexToVec3(params.colors.dualOuter)
      : [or, og, ob]

    return new THREE.ShaderMaterial({
      vertexShader: basinVertexShader,
      fragmentShader: basinFragmentShader,
      uniforms: {
        uA: { value: PEBBLE.a },
        uB: { value: PEBBLE.b },
        uN: { value: PEBBLE.n },
        uColorInner: { value: new THREE.Vector3(ir, ig, ib) },
        uColorOuter: { value: new THREE.Vector3(or, og, ob) },
        uColorAccent: { value: new THREE.Vector3(ar, ag, ab) },
        uColorDual: { value: new THREE.Vector3(dual[0], dual[1], dual[2]) },
        uTime: { value: 0 },
        uBreath: { value: 1 },
        uRimStrength: { value: params.rimStrength },
        uHueDrift: { value: params.hueDrift },
        uGradientType: { value: gradientTypeIndex(params.colors.gradientType) },
      },
    })
  }, [])

  if (!systemRef.current) {
    systemRef.current = new SurfaceParticleSystem()
    systemRef.current.reset(params)
  }

  useFrame((_, dt) => {
    timeRef.current += dt
    wakeRef.current = Math.max(0, wakeRef.current - dt * 1.8)

    const breath =
      breathEnvelope(timeRef.current, params.breathBpm, params.breathAmount) *
      (1 + wakeRef.current * 0.15)

    const mat = meshRef.current?.material as THREE.ShaderMaterial
    if (mat) {
      const [ir, ig, ib] = hexToVec3(params.colors.inner)
      const [or, og, ob] = hexToVec3(params.colors.outer)
      const [ar, ag, ab] = hexToVec3(params.colors.accent)
      mat.uniforms.uColorInner.value.set(ir, ig, ib)
      mat.uniforms.uColorOuter.value.set(or, og, ob)
      mat.uniforms.uColorAccent.value.set(ar, ag, ab)
      mat.uniforms.uTime.value = timeRef.current
      mat.uniforms.uBreath.value = breath
      mat.uniforms.uRimStrength.value = params.rimStrength + wakeRef.current * 0.15
      mat.uniforms.uHueDrift.value = params.hueDrift
      mat.uniforms.uGradientType.value = gradientTypeIndex(params.colors.gradientType)
    }

    systemRef.current?.updateParams(params)
    systemRef.current?.update(dt, params, params.edgeGather)

    const sys = systemRef.current
    if (sys && pointsRef.current) {
      const count = sys.particles.length
      const positions = new Float32Array(count * 3)
      const alphas = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        const p = sys.particles[i]
        const z = basinZ(p.x, p.y) + 0.004
        positions[i * 3] = p.x
        positions[i * 3 + 1] = p.y
        positions[i * 3 + 2] = z
        alphas[i] = 0.35 + edgeGlow(p.x, p.y) * 0.5
      }

      pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      pointsGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
      pointsGeo.computeBoundingSphere()
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial
          color={params.colors.accent}
          size={params.particleSize * 0.009}
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

function edgeGlow(x: number, y: number): number {
  const r =
    Math.pow(Math.abs(x / PEBBLE.a), PEBBLE.n) +
    Math.pow(Math.abs(y / PEBBLE.b), PEBBLE.n)
  return Math.max(0, Math.min(1, (r - 0.55) / 0.4))
}
