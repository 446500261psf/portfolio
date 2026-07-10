import { useMemo } from 'react'
import * as THREE from 'three'
import { Edges, Line } from '@react-three/drei'
import type { CaseParams } from './CaseParams'
import {
  createWatchCaseGeometry,
  frontOutlinePoints,
  sideProfilePoints,
  topProfilePoints,
} from './watchCaseGeometry'

interface WatchCaseMeshProps {
  params: CaseParams
  showEdges?: boolean
}

export function WatchCaseMesh({ params, showEdges = false }: WatchCaseMeshProps) {
  const geometry = useMemo(
    () => createWatchCaseGeometry(params, 88),
    [params.a, params.b, params.c, params.n],
  )

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#9a9aa2"
        roughness={0.58}
        metalness={0.06}
        clearcoat={0.28}
        clearcoatRoughness={0.32}
      />
      {showEdges && <Edges threshold={12} color="#5a5a62" />}
    </mesh>
  )
}

interface OutlineOverlayProps {
  params: CaseParams
  view: 'front' | 'side' | 'top'
}

export function OutlineOverlay({ params, view }: OutlineOverlayProps) {
  const points = useMemo(() => {
    switch (view) {
      case 'front':
        return frontOutlinePoints(params)
      case 'side':
        return sideProfilePoints(params)
      case 'top':
        return topProfilePoints(params)
    }
  }, [params, view])

  const geo = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points],
  )

  return (
    <lineLoop geometry={geo}>
      <lineBasicMaterial color="#3d6a8c" />
    </lineLoop>
  )
}

export function ViewTriad({ view }: { view: 'front' | 'side' | 'top' }) {
  const len = 5
  const segments = useMemo(() => {
    switch (view) {
      case 'front':
        return [
          { points: [[0, 0, 0], [len, 0, 0]] as const, color: '#b55' },
          { points: [[0, 0, 0], [0, len, 0]] as const, color: '#5b5' },
        ]
      case 'side':
        return [
          { points: [[0, 0, 0], [0, len, 0]] as const, color: '#5b5' },
          { points: [[0, 0, 0], [0, 0, len]] as const, color: '#55b' },
        ]
      case 'top':
        return [
          { points: [[0, 0, 0], [len, 0, 0]] as const, color: '#b55' },
          { points: [[0, 0, 0], [0, 0, len]] as const, color: '#55b' },
        ]
    }
  }, [view])

  return (
    <group position={[-22, -22, 0]}>
      {segments.map((s, i) => (
        <Line
          key={i}
          points={s.points.map((p) => new THREE.Vector3(...p))}
          color={s.color}
          lineWidth={1}
        />
      ))}
    </group>
  )
}
