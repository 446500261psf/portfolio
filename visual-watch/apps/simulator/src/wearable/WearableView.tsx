import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, type ThreeEvent, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { CaseParams } from '../shape/CaseParams'
import { createWatchCaseGeometry } from '../shape/watchCaseGeometry'
import type { StudioLightingState } from '../shape/studioLighting'
import { StudioLights, reflectionEnvStrength } from '../shape/StudioLights'
import {
  DIAL_STATE_MAP,
  FIGMA_DIAL_STATES,
  type FigmaDialId,
} from '../dial/figmaDialStates'
import { FIELD_INSET, PoolVolume, type PoolRipple } from '../dial/PoolVolume'
import { useDialKeyframes } from '../dial/useDialKeyframes'
import {
  createSensorWindowGeometry,
  createStrapGeometry,
  createWristGeometry,
  strapPathLength,
} from './strapGeometry'
import { wearableSpan, type WearableParams } from './wearableParams'
import { useAnswerTexture } from './useAnswerTexture'
import { ANSWER_HOLD_MS } from './dialAnswers'

/** 休眠时手腕自然下垂的倾角 */
const SLEEP_TILT = -0.62
/** 自动演播：一天里舒适区的推进序列 */
const DEMO_SEQUENCE: FigmaDialId[] = ['steady', 'lift', 'gather', 'drift', 'grounded', 'low']
const DEMO_STEP_MS = 4200

export type WearableGesture = '抬腕' | '落腕' | '轻触' | '长按' | '指拨' | '演播'

interface SceneRefs {
  awakeRef: { current: boolean }
  wakeRef: { current: number }
  rippleRef: { current: PoolRipple | null }
  answerUntilRef: { current: number }
  answerOpacityRef: { current: number }
  crownTargetRef: { current: number }
}

interface WearableViewProps {
  params: CaseParams
  wear: WearableParams
  dialId: FigmaDialId
  lights: StudioLightingState
  onDialChange: (id: FigmaDialId) => void
}

function WearableScene({
  params,
  wear,
  dialId,
  lights,
  refs,
  answerTexture,
  onTouch,
  onLongPress,
}: {
  params: CaseParams
  wear: WearableParams
  dialId: FigmaDialId
  lights: StudioLightingState
  refs: SceneRefs
  answerTexture: THREE.Texture | null
  onTouch: (u: number, v: number) => void
  onLongPress: () => void
}) {
  const textures = useDialKeyframes()
  const groupRef = useRef<THREE.Group>(null)
  const crownRef = useRef<THREE.Mesh>(null)
  const pressRef = useRef<{ t: number; x: number; y: number } | null>(null)
  const longPressTimer = useRef(0)

  const caseGeo = useMemo(
    () => createWatchCaseGeometry(params, 80),
    [params.a, params.b, params.c, params.n],
  )
  const strapGeo = useMemo(() => createStrapGeometry(params, wear), [params, wear])
  const sensorGeo = useMemo(() => createSensorWindowGeometry(params), [params])
  const wristGeo = useMemo(() => createWristGeometry(params, wear), [params, wear])

  useEffect(
    () => () => {
      caseGeo.dispose()
      strapGeo.dispose()
      sensorGeo.dispose()
      wristGeo.dispose()
    },
    [caseGeo, strapGeo, sensorGeo, wristGeo],
  )

  const envStrength = useMemo(
    () => reflectionEnvStrength(lights.key, lights.fill),
    [lights.key.intensity, lights.fill.intensity],
  )

  const dist = wearableSpan(params, wear) * 3.5

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)

    // 抬腕/落腕：整机倾斜 + Pool 亮度同步渐变（落腕即熄，不留残光）
    refs.wakeRef.current = THREE.MathUtils.damp(
      refs.wakeRef.current,
      refs.awakeRef.current ? 1 : 0,
      4.2,
      d,
    )

    if (groupRef.current) {
      const t = state.clock.getElapsedTime()
      const target = refs.awakeRef.current ? 0 : SLEEP_TILT
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        target + Math.sin(t * 0.55) * 0.008,
        3.4,
        d,
      )
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        Math.sin(t * 0.4 + 1.1) * 0.01,
        3,
        d,
      )
    }

    // 精确答案：到期后自动淡出，不需要用户关闭
    const remain = refs.answerUntilRef.current - performance.now()
    refs.answerOpacityRef.current = THREE.MathUtils.damp(
      refs.answerOpacityRef.current,
      remain > 0 ? 1 : 0,
      remain > 0 ? 7 : 4,
      d,
    )

    if (crownRef.current) {
      crownRef.current.rotation.y = THREE.MathUtils.damp(
        crownRef.current.rotation.y,
        refs.crownTargetRef.current,
        8,
        d,
      )
    }
  })

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pressRef.current = { t: performance.now(), x: e.clientX, y: e.clientY }
    window.clearTimeout(longPressTimer.current)
    longPressTimer.current = window.setTimeout(() => {
      if (pressRef.current) {
        pressRef.current = null
        onLongPress()
      }
    }, 520)
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    window.clearTimeout(longPressTimer.current)
    const press = pressRef.current
    pressRef.current = null
    if (!press) return
    // 拖拽视角不算触摸
    if (Math.hypot(e.clientX - press.x, e.clientY - press.y) > 6) return

    const local = e.object.worldToLocal(e.point.clone())
    const u = 0.5 + local.x / (2 * params.a * FIELD_INSET)
    const v = 0.5 + local.y / (2 * params.b * FIELD_INSET)
    onTouch(THREE.MathUtils.clamp(u, 0, 1), THREE.MathUtils.clamp(v, 0, 1))
  }

  return (
    <>
      <color attach="background" args={['#08080a']} />

      <PerspectiveCamera
        makeDefault
        fov={28}
        near={0.5}
        far={2000}
        position={[dist * 0.4, dist * 0.3, dist * 0.86]}
      />

      <StudioLights keyLight={lights.key} fillLight={lights.fill} glassMode />
      {/* 玻璃模式只有柔光板环境；表带与手腕是哑光体，需要一点直射与环境补光 */}
      <ambientLight intensity={0.16} />
      <directionalLight position={[70, 90, 60]} intensity={0.5} />
      <directionalLight position={[-60, 20, -40]} intensity={0.16} />

      <group ref={groupRef}>
        {wear.showWrist && (
          <mesh geometry={wristGeo}>
            <meshStandardMaterial color="#7e8188" roughness={0.97} metalness={0} />
          </mesh>
        )}

        {/* 表带 + 一体化连接结构（同一条挤出曲面，无拼接缝） */}
        <mesh geometry={strapGeo}>
          <meshPhysicalMaterial
            color="#191a1d"
            roughness={0.56}
            metalness={0}
            clearcoat={0.34}
            clearcoatRoughness={0.52}
            envMapIntensity={envStrength * 0.5}
          />
        </mesh>

        {/* 背面传感器窗 */}
        <mesh geometry={sensorGeo} position={[0, 0, -params.c + 0.18]}>
          <meshPhysicalMaterial
            color="#07080a"
            roughness={0.14}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.06}
            envMapIntensity={envStrength * 0.8}
          />
        </mesh>

        {/* 指拨（表冠）：滚轮浏览舒适区时同步转动 */}
        <mesh
          ref={crownRef}
          position={[params.a - 0.5, params.b * 0.2, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[2.25, 2.25, 1.9, 40]} />
          <meshStandardMaterial color="#9b9da2" roughness={0.3} metalness={0.88} />
        </mesh>

        {/* 表盘 = 外形工作室定义的同一超椭圆表壳 */}
        <mesh
          geometry={caseGeo}
          renderOrder={1}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <meshPhysicalMaterial
            color="#050505"
            roughness={0.06}
            metalness={0}
            transmission={0.22}
            thickness={params.c * 1.2}
            ior={1.52}
            envMapIntensity={envStrength}
            specularIntensity={0.35}
            specularColor="#ffffff"
            clearcoat={1}
            clearcoatRoughness={0.045}
            attenuationColor="#000000"
            attenuationDistance={params.c * 1.6}
            transparent
            side={THREE.FrontSide}
          />
        </mesh>

        <PoolVolume
          params={params}
          dialId={dialId}
          textures={textures}
          renderOrder={10}
          wakeRef={refs.wakeRef}
          rippleRef={refs.rippleRef}
          answerTexture={answerTexture}
          answerOpacityRef={refs.answerOpacityRef}
        />
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={dist * 0.42}
        maxDistance={dist * 2.2}
        enableDamping
        dampingFactor={0.07}
      />
    </>
  )
}

/** 整机交互模拟 — 表壳 + 一体化表带 + 抬腕/触摸/指拨 */
export function WearableView({ params, wear, dialId, lights, onDialChange }: WearableViewProps) {
  const [awake, setAwake] = useState(true)
  const [demo, setDemo] = useState(false)
  const [gesture, setGesture] = useState<{ kind: WearableGesture; note: string } | null>(null)

  const awakeRef = useRef(true)
  const wakeRef = useRef(1)
  const rippleRef = useRef<PoolRipple | null>(null)
  const answerUntilRef = useRef(0)
  const answerOpacityRef = useRef(0)
  const crownTargetRef = useRef(0)

  const answerTexture = useAnswerTexture(dialId)
  const state = DIAL_STATE_MAP[dialId]

  useEffect(() => {
    awakeRef.current = awake
  }, [awake])

  const note = useCallback((kind: WearableGesture, text: string) => {
    setGesture({ kind, note: text })
  }, [])

  const wake = useCallback(
    (next: boolean) => {
      setAwake(next)
      if (!next) answerUntilRef.current = 0
      note(next ? '抬腕' : '落腕', next ? 'Pool 渐亮 · 无点亮动画硬切' : 'Pool 渐暗 · 不留残光')
    },
    [note],
  )

  const handleTouch = useCallback(
    (u: number, v: number) => {
      rippleRef.current = { u, v, startedAt: performance.now() }
      answerUntilRef.current = performance.now() + ANSWER_HOLD_MS
      if (!awakeRef.current) setAwake(true)
      note('轻触', '明确指令 → 一个结论 + 一个数字，2.4s 后自动收回')
    },
    [note],
  )

  const handleLongPress = useCallback(() => {
    answerUntilRef.current = 0
    setDemo(false)
    onDialChange('steady')
    note('长按', '回到此刻真实状态，撤销浏览')
  }, [note, onDialChange])

  const step = useCallback(
    (delta: number) => {
      const i = FIGMA_DIAL_STATES.findIndex((s) => s.id === dialId)
      const next = FIGMA_DIAL_STATES[(i + delta + FIGMA_DIAL_STATES.length) % FIGMA_DIAL_STATES.length]
      crownTargetRef.current += delta * 0.7
      setDemo(false)
      onDialChange(next.id)
      note('指拨', `浏览 → ${next.label}·${next.labelEn}`)
    },
    [dialId, note, onDialChange],
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      step(e.deltaY > 0 ? 1 : -1)
    },
    [step],
  )

  useEffect(() => {
    if (!demo) return
    let i = DEMO_SEQUENCE.indexOf(dialId)
    const timer = window.setInterval(() => {
      i = (i + 1) % DEMO_SEQUENCE.length
      onDialChange(DEMO_SEQUENCE[i])
      note('演播', '被动预测只改变场，不代替用户动作')
    }, DEMO_STEP_MS)
    return () => window.clearInterval(timer)
    // 只在开关演播时重建定时器，避免每次状态变化都重置节奏
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo])

  const refs: SceneRefs = {
    awakeRef,
    wakeRef,
    rippleRef,
    answerUntilRef,
    answerOpacityRef,
    crownTargetRef,
  }

  return (
    <div className="wearable-studio">
      <div className="wearable-canvas-wrap" onWheel={handleWheel}>
        <Canvas dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
          <Suspense fallback={null}>
            <WearableScene
              params={params}
              wear={wear}
              dialId={dialId}
              lights={lights}
              refs={refs}
              answerTexture={answerTexture}
              onTouch={handleTouch}
              onLongPress={handleLongPress}
            />
          </Suspense>
        </Canvas>

        <div className="wearable-hud">
          <span className={`wearable-hud__dot${awake ? ' is-awake' : ''}`} />
          <span className="wearable-hud__state">
            {awake ? `${state.label} · ${state.labelEn}` : '休眠 · 落腕'}
          </span>
          {gesture && (
            <span className="wearable-hud__gesture">
              <strong>{gesture.kind}</strong>
              {gesture.note}
            </span>
          )}
        </div>
      </div>

      <div className="wearable-actions">
        <button type="button" className={awake ? 'active' : ''} onClick={() => wake(!awake)}>
          {awake ? '落腕' : '抬腕'}
        </button>
        <button type="button" onClick={() => step(-1)}>
          指拨 ↑
        </button>
        <button type="button" onClick={() => step(1)}>
          指拨 ↓
        </button>
        <button type="button" className={demo ? 'active' : ''} onClick={() => setDemo((d) => !d)}>
          {demo ? '停止演播' : '一天演播'}
        </button>
      </div>

      <footer className="white-model-spec">
        <span className="white-model-spec__title">整机交互 · Gesamtgerät</span>
        <span className="white-model-spec__dims">
          {`${(params.a * 2).toFixed(1)} × ${(params.b * 2).toFixed(1)} × ${(params.c * 2).toFixed(1)} mm · 表带 ${wear.strapWidth.toFixed(0)}mm · 环长 ${strapPathLength(params, wear).toFixed(0)}mm`}
        </span>
        <span className="white-model-spec__hint">
          表盘轻触 = 精确答案 · 长按 = 回到此刻 · 滚轮/指拨 = 浏览 · 拖拽 = 转动整机
        </span>
      </footer>
    </div>
  )
}
