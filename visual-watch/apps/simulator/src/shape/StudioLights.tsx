import { useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import type { AreaLightSettings } from './studioLighting'

function RectAreaLightInit() {
  useLayoutEffect(() => {
    RectAreaLightUniformsLib.init()
  }, [])
  return null
}

function AreaLight({
  config,
  target = [0, 0, 0],
}: {
  config: AreaLightSettings
  target?: [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { x, y, z } = config.position

  useLayoutEffect(() => {
    groupRef.current?.lookAt(target[0], target[1], target[2])
  }, [x, y, z, target])

  return (
    <group ref={groupRef} position={[x, y, z]}>
      <rectAreaLight
        width={config.width}
        height={config.height}
        intensity={config.intensity}
        color={config.color}
      />
    </group>
  )
}

interface StudioLightsProps {
  keyLight: AreaLightSettings
  fillLight: AreaLightSettings
}

/** 主光 + 反射光面光源，无 HDR 场景贴图 */
export function StudioLights({ keyLight, fillLight }: StudioLightsProps) {
  const { gl } = useThree()

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.05
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl])

  return (
    <>
      <RectAreaLightInit />
      <ambientLight intensity={0.08} />
      <AreaLight config={keyLight} />
      <AreaLight config={fillLight} />
    </>
  )
}
