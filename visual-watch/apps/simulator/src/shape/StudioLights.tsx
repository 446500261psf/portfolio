import { useLayoutEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { AreaLightSettings } from './studioLighting'

const TARGET: [number, number, number] = [0, 0, 0]

/** width/height → 聚光角 + 半影，模拟面光源大小 */
function spotFromConfig(config: AreaLightSettings) {
  const dist = Math.hypot(config.position.x, config.position.y, config.position.z) || 1
  const half = Math.max(config.width, config.height) / 2
  const angle = THREE.MathUtils.clamp(Math.atan(half / dist) * 2, 0.08, Math.PI / 2.2)
  const penumbra = THREE.MathUtils.clamp(config.height / Math.max(config.width, 1), 0.12, 1)
  return { angle, penumbra, distance: dist * 5 }
}

function StudioSpot({
  config,
}: {
  config: AreaLightSettings
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { x, y, z } = config.position
  const spot = useMemo(() => spotFromConfig(config), [config])

  useLayoutEffect(() => {
    groupRef.current?.lookAt(TARGET[0], TARGET[1], TARGET[2])
  }, [x, y, z])

  return (
    <group ref={groupRef} position={[x, y, z]}>
      <spotLight
        intensity={config.intensity}
        color={config.color}
        angle={spot.angle}
        penumbra={spot.penumbra}
        decay={2}
        distance={spot.distance}
        castShadow={false}
      />
    </group>
  )
}

/** 中性灰室环境（程序化，非 HDR 场景照片），辅助玻璃边缘反射 */
function NeutralStudioEnv() {
  const { gl, scene } = useThree()

  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = tex
    return () => {
      scene.environment = null
      tex.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  return null
}

interface StudioLightsProps {
  keyLight: AreaLightSettings
  fillLight: AreaLightSettings
  glassMode?: boolean
}

/** 主光 + 反射光软聚光，玻璃上可见镜面高光 */
export function StudioLights({ keyLight, fillLight, glassMode = true }: StudioLightsProps) {
  const { gl } = useThree()

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = glassMode ? 1.28 : 1.05
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl, glassMode])

  return (
    <>
      {glassMode && <NeutralStudioEnv />}
      <ambientLight intensity={glassMode ? 0.18 : 0.35} />
      <StudioSpot config={keyLight} />
      <StudioSpot config={fillLight} />
    </>
  )
}

export { spotFromConfig }
