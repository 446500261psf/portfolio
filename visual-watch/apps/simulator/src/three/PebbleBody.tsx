import { useMemo } from 'react'
import * as THREE from 'three'
import {
  createLipRing,
  createPebbleShellGeometry,
  superellipseOutlinePoints,
} from './superellipsoid'

export function PebbleBody() {
  const shellGeo = useMemo(() => createPebbleShellGeometry(64), [])
  const lipGeo = useMemo(() => createLipRing(128), [])
  const outline = useMemo(() => superellipseOutlinePoints(160), [])

  const outlineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(outline)
    return geo
  }, [outline])

  return (
    <group>
      <mesh geometry={shellGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#3d3d44"
          roughness={0.62}
          metalness={0.08}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
          envMapIntensity={0.6}
        />
      </mesh>

      <mesh geometry={lipGeo}>
        <meshPhysicalMaterial
          color="#52525c"
          roughness={0.35}
          metalness={0.15}
          clearcoat={0.85}
          clearcoatRoughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineLoop geometry={outlineGeo}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </lineLoop>

      <SideButton />
    </group>
  )
}

function SideButton() {
  return (
    <mesh position={[0.98, 0.05, 0.12]} rotation={[0, 0, -0.15]}>
      <boxGeometry args={[0.06, 0.22, 0.04]} />
      <meshStandardMaterial color="#2a2a30" roughness={0.5} metalness={0.2} />
    </mesh>
  )
}
