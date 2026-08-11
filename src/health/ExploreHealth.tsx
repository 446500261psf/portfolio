import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react'
import { publicUrl } from '../publicUrl'

const STAGE_W = 800
const STAGE_H = 600
const TICK_COUNT = 26
const CARD_COUNT = 5
/** Always show this many cards on each side of center (2+1+2 with 5 phones). */
const SIDE_COUNT = Math.floor((CARD_COUNT - 1) / 2)
const TRANSITION_MS = 320
const CLICK_MOVE_PX = 6

type Phone = {
  id: string
  src: string
  label: string
  title: string
  blurb: string
}

/** Left → right phone screens matching Figma Group 3 order */
const PHONES: readonly Phone[] = [
  {
    id: 'plan',
    src: publicUrl('health/phone-plan.png'),
    label: 'My plan',
    title: '我的计划',
    blurb:
      '一眼看清今日热量缺口与营养配比。把燃烧、摄入和下一餐建议收进同一张卡片，让坚持变得轻而易举。',
  },
  {
    id: 'training',
    src: publicUrl('health/phone-training.png'),
    label: 'Smart Training Plan',
    title: '智能训练计划',
    blurb:
      '从日常慢跑到全马目标，训练节奏会跟着你走。目标、课表与恢复建议自动排好，开练只需按下开始。',
  },
  {
    id: 'workout',
    src: publicUrl('health/phone-workout.png'),
    label: 'Build · Upper Body',
    title: '上肢塑形训练',
    blurb:
      '半小时上肢力量课，动作示范与消耗预估同步呈现。跟练即刻开始，把每一次发力都变成可见进步。',
  },
  {
    id: 'analysis',
    src: publicUrl('health/phone-analysis.png'),
    label: "Today's analysis",
    title: '今日分析',
    blurb:
      '三餐与营养素拆解成清晰圆环。哪里超了、哪里刚好，一屏读懂，下一餐决策更有底气。',
  },
  {
    id: 'sleep',
    src: publicUrl('health/phone-sleep.png'),
    label: 'Sleep Music',
    title: '助眠音乐',
    blurb:
      '雨声、海浪与轻柔旋律按场景分好类。选一段喜欢的声音，让夜晚慢慢安静下来。',
  },
] as const

const SPREAD = 62
const ROTATE_Y = 24
const DEPTH_Z = 40
const MAX_DEPTH = 2.2

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** Shortest signed distance on a circular ring of length `n`. */
function wrappedOffset(index: number, active: number, n: number): number {
  let d = index - active
  d -= n * Math.round(d / n)
  return d
}

/** Each tick maps to a looping phone index. */
function phoneFromTick(tick: number) {
  return mod(tick, CARD_COUNT)
}

function tickFromClientX(clientX: number, el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0) return 0
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
  return Math.round(ratio * (TICK_COUNT - 1))
}

function cardStyle(offset: number): CSSProperties {
  const depth = Math.min(Math.abs(offset), MAX_DEPTH)
  const tx = offset * SPREAD
  const ry = offset * -ROTATE_Y
  const tz = -depth * DEPTH_Z
  const ty = depth * 4
  const scale = Math.max(0.86, 1 - depth * 0.055)

  const style: CSSProperties = {
    zIndex: Math.round(40 - depth * 10),
    opacity: 1,
    transform: `translate(-50%, -50%) translateX(${tx}px) translateY(${ty}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
  }

  if (offset <= -SIDE_COUNT + 0.01) {
    const mask = 'linear-gradient(to right, transparent 0%, transparent 8%, #000 62%)'
    style.WebkitMaskImage = mask
    style.maskImage = mask
    style.boxShadow = 'none'
  } else if (offset >= SIDE_COUNT - 0.01) {
    const mask = 'linear-gradient(to left, transparent 0%, transparent 8%, #000 62%)'
    style.WebkitMaskImage = mask
    style.maskImage = mask
    style.boxShadow = 'none'
  }

  return style
}

export default function ExploreHealth() {
  /**
   * `active` = discrete carousel pose (unbounded).
   * `tick` = which scrubber pointer is selected (0..TICK_COUNT-1).
   * Mapping: phone index === tick % CARD_COUNT (images loop across ticks).
   */
  const [active, setActive] = useState(2)
  const [tick, setTick] = useState(2)
  const [scrubHot, setScrubHot] = useState(false)
  const [detailPhone, setDetailPhone] = useState<number | null>(null)
  const scrubRef = useRef<HTMLDivElement>(null)
  const lastTick = useRef<number | null>(null)
  const activeRef = useRef(2)
  const tickRef = useRef(2)
  const pointerDown = useRef<{ x: number; y: number } | null>(null)
  const didDrag = useRef(false)
  /** Queued adjacent steps for slow one-tick moves only. */
  const pendingSteps = useRef(0)
  const animating = useRef(false)
  const queueTimer = useRef<number | null>(null)

  const inDetail = detailPhone != null
  const detail = inDetail ? PHONES[detailPhone] : null

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  useEffect(
    () => () => {
      if (queueTimer.current != null) window.clearTimeout(queueTimer.current)
    },
    [],
  )

  const clearQueue = useCallback(() => {
    if (queueTimer.current != null) {
      window.clearTimeout(queueTimer.current)
      queueTimer.current = null
    }
    pendingSteps.current = 0
    animating.current = false
  }, [])

  /** Instantly sync carousel to a tick's looping phone; drop any catch-up queue. */
  const snapToTick = useCallback(
    (nextTick: number) => {
      clearQueue()
      const targetPhone = phoneFromTick(nextTick)
      const delta = wrappedOffset(targetPhone, activeRef.current, CARD_COUNT)
      if (delta !== 0) {
        setActive((a) => a + delta)
      }
    },
    [clearQueue],
  )

  const drainQueue = useCallback(() => {
    if (animating.current) return
    if (pendingSteps.current > 0) {
      pendingSteps.current -= 1
      setActive((a) => a + 1)
      animating.current = true
      queueTimer.current = window.setTimeout(() => {
        animating.current = false
        queueTimer.current = null
        drainQueue()
      }, TRANSITION_MS)
    } else if (pendingSteps.current < 0) {
      pendingSteps.current += 1
      setActive((a) => a - 1)
      animating.current = true
      queueTimer.current = window.setTimeout(() => {
        animating.current = false
        queueTimer.current = null
        drainQueue()
      }, TRANSITION_MS)
    }
  }, [])

  /**
   * Absolute tick under pointer → one tick = one image (images loop: tick % 5).
   * Slow adjacent moves keep the coverflow transition; fast scrub / stop snaps
   * so the carousel never lags behind the pointer.
   */
  const applyTick = useCallback(
    (nextTick: number, animate: boolean) => {
      const prev = lastTick.current
      tickRef.current = nextTick
      setTick(nextTick)

      if (prev == null) {
        lastTick.current = nextTick
        snapToTick(nextTick)
        return
      }

      const deltaTicks = nextTick - prev
      lastTick.current = nextTick
      if (deltaTicks === 0) return

      const canAnimateStep =
        animate &&
        Math.abs(deltaTicks) === 1 &&
        !animating.current &&
        pendingSteps.current === 0

      if (!canAnimateStep) {
        snapToTick(nextTick)
        return
      }

      pendingSteps.current += deltaTicks
      drainQueue()
    },
    [drainQueue, snapToTick],
  )

  const stopScrub = useCallback(() => {
    snapToTick(tickRef.current)
    lastTick.current = null
  }, [snapToTick])

  const openDetail = useCallback((phoneIndex: number) => {
    clearQueue()
    setScrubHot(false)
    lastTick.current = null
    setDetailPhone(phoneIndex)
  }, [clearQueue])

  const closeDetail = useCallback(() => {
    setDetailPhone(null)
  }, [])

  useEffect(() => {
    if (!inDetail) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inDetail, closeDetail])

  const onPointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (inDetail) return
    const el = scrubRef.current
    if (!el) return
    setScrubHot(true)
    applyTick(tickFromClientX(e.clientX, el), false)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (inDetail) return
    const el = scrubRef.current
    if (!el) return
    setScrubHot(true)
    pointerDown.current = { x: e.clientX, y: e.clientY }
    didDrag.current = false
    e.currentTarget.setPointerCapture(e.pointerId)
    applyTick(tickFromClientX(e.clientX, el), true)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (inDetail) return
    const el = scrubRef.current
    if (!el) return
    if (pointerDown.current) {
      const dx = e.clientX - pointerDown.current.x
      const dy = e.clientY - pointerDown.current.y
      if (dx * dx + dy * dy > CLICK_MOVE_PX * CLICK_MOVE_PX) {
        didDrag.current = true
      }
    }
    setScrubHot(true)
    applyTick(tickFromClientX(e.clientX, el), true)
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    const wasClick = pointerDown.current != null && !didDrag.current
    pointerDown.current = null
    didDrag.current = false
    stopScrub()
    if (wasClick && !inDetail) {
      openDetail(phoneFromTick(tickRef.current))
    }
  }

  const onPointerLeave = () => {
    pointerDown.current = null
    didDrag.current = false
    setScrubHot(false)
    stopScrub()
  }

  const dotLeftPct = TICK_COUNT <= 1 ? 0 : (tick / (TICK_COUNT - 1)) * 100

  return (
    <main className="eh-page">
      <section
        className={`eh-stage${inDetail ? ' is-detail' : ''}`}
        style={{ width: STAGE_W, height: STAGE_H }}
        aria-label="Explore Health+ showcase"
      >
        <img
          className="eh-logo"
          src={publicUrl('health/logo.png')}
          alt="HUAWEI Health"
          width={106}
          height={23}
          draggable={false}
        />

        <div className="eh-explore" aria-hidden={inDetail}>
          <h1 className="eh-title">Explore Health+</h1>
          <img
            className="eh-underline"
            src={publicUrl('health/underline.svg')}
            alt=""
            width={271}
            height={5}
            draggable={false}
          />

          <div className="eh-carousel" aria-live="polite">
            <div className="eh-carousel-track">
              {PHONES.map((phone, i) => {
                const offset = wrappedOffset(i, active, CARD_COUNT)
                if (Math.abs(offset) > SIDE_COUNT) return null
                const isCenter = offset === 0
                return (
                  <button
                    key={phone.id}
                    type="button"
                    className={`eh-card${isCenter ? ' is-center' : ''}`}
                    style={cardStyle(offset)}
                    aria-label={phone.label}
                    aria-current={isCenter ? 'true' : undefined}
                    tabIndex={inDetail ? -1 : 0}
                    onClick={() => {
                      if (inDetail) return
                      const delta = wrappedOffset(i, active, CARD_COUNT)
                      if (delta === 0) {
                        openDetail(i)
                        return
                      }
                      pendingSteps.current += delta
                      setTick((t) => {
                        let next = t
                        while (phoneFromTick(next) !== i) {
                          next += delta > 0 ? 1 : -1
                          next = mod(next, TICK_COUNT)
                        }
                        lastTick.current = next
                        return next
                      })
                      drainQueue()
                    }}
                  >
                    <img src={phone.src} alt="" draggable={false} />
                  </button>
                )
              })}
            </div>
          </div>
          <div className="eh-edge-fade" aria-hidden />

          <div
            ref={scrubRef}
            className={`eh-scrubber${scrubHot ? ' is-hot' : ''}`}
            role="slider"
            aria-label="Browse Health+ screens"
            aria-valuemin={0}
            aria-valuemax={TICK_COUNT - 1}
            aria-valuenow={tick}
            aria-valuetext={`${PHONES[phoneFromTick(tick)].label} (${tick + 1}/${TICK_COUNT})`}
            tabIndex={inDetail ? -1 : 0}
            onPointerEnter={onPointerEnter}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerLeave}
            onKeyDown={(e) => {
              if (inDetail) return
              if (e.key === 'ArrowLeft') {
                e.preventDefault()
                applyTick(clamp(tick - 1, 0, TICK_COUNT - 1), true)
              } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                applyTick(clamp(tick + 1, 0, TICK_COUNT - 1), true)
              } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openDetail(phoneFromTick(tick))
              } else if (e.key === 'Home') {
                e.preventDefault()
                applyTick(0, true)
              } else if (e.key === 'End') {
                e.preventDefault()
                applyTick(TICK_COUNT - 1, true)
              }
            }}
          >
            <span
              className="eh-cursor-dot"
              style={{ left: `${dotLeftPct}%` }}
              aria-hidden
            />
            {Array.from({ length: TICK_COUNT }, (_, i) => {
              const dist = Math.abs(i - tick)
              const cls =
                dist === 0 ? 'eh-tick is-active' : dist <= 2 ? 'eh-tick is-near' : 'eh-tick'
              return <span key={i} className={cls} aria-hidden />
            })}
          </div>
        </div>

        <div className="eh-detail" aria-hidden={!inDetail}>
          {detail && (
            <>
              <button type="button" className="eh-detail-back" onClick={closeDetail}>
                返回
              </button>
              <div className="eh-detail-media">
                <img src={detail.src} alt="" draggable={false} />
              </div>
              <div className="eh-detail-copy">
                <p className="eh-detail-kicker">Health+</p>
                <h2 className="eh-detail-title">{detail.title}</h2>
                <p className="eh-detail-blurb">{detail.blurb}</p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
