import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import type { OrbitCameraState } from '../simulatorStorage'

interface PersistedOrbitControlsProps {
  minDistance: number
  maxDistance: number
  orbit: OrbitCameraState | null
  onOrbitChange: (orbit: OrbitCameraState) => void
}

/** 恢复并持久化 OrbitControls 的方位角、俯仰角与缩放距离 */
export function PersistedOrbitControls({
  minDistance,
  maxDistance,
  orbit,
  onOrbitChange,
}: PersistedOrbitControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const restoredRef = useRef(false)
  const { camera } = useThree()

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || restoredRef.current || !orbit) return

    const dist = clamp(orbit.distance, minDistance, maxDistance)
    const offset = new THREE.Vector3().setFromSphericalCoords(
      dist,
      orbit.polar,
      orbit.azimuth,
    )
    camera.position.copy(controls.target).add(offset)
    controls.update()
    restoredRef.current = true
  }, [orbit, minDistance, maxDistance, camera])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    let debounce = 0
    const persist = () => {
      window.clearTimeout(debounce)
      debounce = window.setTimeout(() => {
        onOrbitChange({
          azimuth: controls.getAzimuthalAngle(),
          polar: controls.getPolarAngle(),
          distance: controls.getDistance(),
        })
      }, 120)
    }

    controls.addEventListener('change', persist)
    controls.addEventListener('end', persist)
    return () => {
      controls.removeEventListener('change', persist)
      controls.removeEventListener('end', persist)
      window.clearTimeout(debounce)
    }
  }, [onOrbitChange])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={minDistance}
      maxDistance={maxDistance}
      enableDamping
      dampingFactor={0.06}
    />
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}
