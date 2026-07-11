import { useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { AreaLightSettings } from './studioLighting'

const TARGET = new THREE.Vector3(0, 0, 0)

/** width/height → 聚光角 + 半影 */
export function spotFromConfig(config: AreaLightSettings) {
  const dist = Math.hypot(config.position.x, config.position.y, config.position.z) || 1
  const half = Math.max(config.width, config.height) / 2
  const angle = THREE.MathUtils.clamp(Math.atan(half / dist) * 2, 0.06, Math.PI / 2.4)
  const penumbra = THREE.MathUtils.clamp(config.height / Math.max(config.width, 1), 0.15, 1)
  return { angle, penumbra, distance: dist * 4.5 }
}

function StudioSpot({ config }: { config: AreaLightSettings }) {
  const groupRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.SpotLight>(null)

  useLayoutEffect(() => {
    const group = groupRef.current
    const light = lightRef.current
    if (!group || !light) return

    group.position.set(config.position.x, config.position.y, config.position.z)
    group.lookAt(TARGET)

    const spot = spotFromConfig(config)
    light.intensity = config.intensity
    light.color.set(config.color)
    light.angle = spot.angle
    light.penumbra = spot.penumbra
    light.distance = spot.distance
    light.decay = 2
  }, [
    config.intensity,
    config.color,
    config.width,
    config.height,
    config.position.x,
    config.position.y,
    config.position.z,
  ])

  return (
    <group ref={groupRef}>
      <spotLight ref={lightRef} castShadow={false} />
    </group>
  )
}

interface StudioLightsProps {
  keyLight: AreaLightSettings
  fillLight: AreaLightSettings
  glassMode?: boolean
}

/** 主光 + 反射光；反射完全由聚光驱动，无环境贴图 */
export function StudioLights({ keyLight, fillLight, glassMode = true }: StudioLightsProps) {
  const { gl } = useThree()

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = glassMode ? 0.78 : 1.0
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl, glassMode])

  return (
    <>
      <ambientLight intensity={glassMode ? 0.04 : 0.3} />
      <StudioSpot key={`key-${keyLight.intensity}-${keyLight.position.x}-${keyLight.width}`} config={keyLight} />
      <StudioSpot key={`fill-${fillLight.intensity}-${fillLight.position.x}-${fillLight.width}`} config={fillLight} />
    </>
  )
}
