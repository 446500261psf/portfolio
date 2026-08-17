import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { AreaLightSettings } from './studioLighting'

function addReflectionCard(studio: THREE.Scene, cfg: AreaLightSettings) {
  const card = new THREE.Group()
  card.position.set(cfg.position.x, cfg.position.y, cfg.position.z)
  card.lookAt(0, 0, 0)

  const color = new THREE.Color(cfg.color)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(cfg.width, cfg.height),
    new THREE.MeshStandardMaterial({
      color: '#000000',
      emissive: color,
      emissiveIntensity: cfg.intensity / 35,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  )
  card.add(mesh)
  studio.add(card)
}

function buildReflectionStudio(key: AreaLightSettings, fill: AreaLightSettings): THREE.Scene {
  const studio = new THREE.Scene()
  studio.background = new THREE.Color(0x000000)
  addReflectionCard(studio, key)
  addReflectionCard(studio, fill)
  return studio
}

/** 由主光/反射光尺寸与强度烘焙环境贴图 → 表盘大面积柔反射 */
export function ReflectionStudioEnv({
  keyLight,
  fillLight,
}: {
  keyLight: AreaLightSettings
  fillLight: AreaLightSettings
}) {
  const { gl, scene } = useThree()

  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const studio = buildReflectionStudio(keyLight, fillLight)
    const env = pmrem.fromScene(studio, 0.08).texture
    scene.environment = env

    studio.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        const mat = obj.material
        if (mat instanceof THREE.Material) mat.dispose()
      }
    })

    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [
    gl,
    scene,
    keyLight.intensity,
    keyLight.width,
    keyLight.height,
    keyLight.color,
    keyLight.position.x,
    keyLight.position.y,
    keyLight.position.z,
    fillLight.intensity,
    fillLight.width,
    fillLight.height,
    fillLight.color,
    fillLight.position.x,
    fillLight.position.y,
    fillLight.position.z,
  ])

  return null
}

interface StudioLightsProps {
  keyLight: AreaLightSettings
  fillLight: AreaLightSettings
  glassMode?: boolean
}

export function StudioLights({ keyLight, fillLight, glassMode = true }: StudioLightsProps) {
  const { gl } = useThree()

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = glassMode ? 0.82 : 1.0
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl, glassMode])

  if (glassMode) {
    return (
      <>
        <ambientLight intensity={0.03} />
        <ReflectionStudioEnv keyLight={keyLight} fillLight={fillLight} />
      </>
    )
  }

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[60, 70, 50]} intensity={0.9} />
      <directionalLight position={[-40, 30, -30]} intensity={0.25} />
    </>
  )
}

/** 环境反射总强度 — 由两盏灯强度共同决定 */
export function reflectionEnvStrength(key: AreaLightSettings, fill: AreaLightSettings): number {
  const blend = key.intensity * 0.65 + fill.intensity * 0.35
  return THREE.MathUtils.clamp(blend / 55, 0.05, 1.35)
}

export { buildReflectionStudio }
