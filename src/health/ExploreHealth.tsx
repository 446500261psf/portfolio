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

/** Left → right phone screens matching Figma Group 3 order */
const PHONES = [
  { id: 'plan', src: publicUrl('health/phone-plan.png'), label: 'My plan' },
  { id: 'training', src: publicUrl('health/phone-training.png'), label: 'Smart Training Plan' },
  { id: 'workout', src: publicUrl('health/phone-workout.png'), label: 'Build · Upper Body' },
  { id: 'analysis', src: publicUrl('health/phone-analysis.png'), label: "Today's analysis" },
  { id: 'sleep', src: publicUrl('health/phone-sleep.png'), label: 'Sleep Music' },
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
  const scrubRef = useRef<HTMLDivElement>(null)
  const lastTick = useRef<number | null>(null)
  const activeRef = useRef(2)
  /** Queued adjacent steps for slow one-tick moves only. */
  const pendingSteps = useRef(0)
  const animating = useRef(false)
  const queueTimer = useRef<number | null>(null)

  useEffect(() => {
    activeRef.current = active
  }, [active])

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
    /* Pointer stopped — cancel backlog and lock to the current tick's image. */
    snapToTick(tickRef.current)
    lastTick.current = null
  }, [snapToTick])

  const onPointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrubRef.current
    if (!el) return
    applyTick(tickFromClientX(e.clientX, el), false)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrubRef.current
    if (!el) return
    e.currentTarget.setPointerCapture(e.pointerId)
    applyTick(tickFromClientX(e.clientX, el), true)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrubRef.current
    if (!el) return
    applyTick(tickFromClientX(e.clientX, el), true)
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    stopScrub()
  }

  const onPointerLeave = () => {
    stopScrub()
  }

  return (
    <main className="eh-page">
      <section
        className="eh-stage"
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
                  onClick={() => {
                    const delta = wrappedOffset(i, active, CARD_COUNT)
                    if (delta === 0) return
                    pendingSteps.current += delta
                    /* Keep tick highlight aligned with the looping phone index */
                    setTick((t) => {
                      const targetPhone = i
                      let next = t
                      while (phoneFromTick(next) !== targetPhone) {
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
          className="eh-scrubber"
          role="slider"
          aria-label="Browse Health+ screens"
          aria-valuemin={0}
          aria-valuemax={TICK_COUNT - 1}
          aria-valuenow={tick}
          aria-valuetext={`${PHONES[phoneFromTick(tick)].label} (${tick + 1}/${TICK_COUNT})`}
          tabIndex={0}
          onPointerEnter={onPointerEnter}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerLeave}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault()
              applyTick(clamp(tick - 1, 0, TICK_COUNT - 1), true)
            } else if (e.key === 'ArrowRight') {
              e.preventDefault()
              applyTick(clamp(tick + 1, 0, TICK_COUNT - 1), true)
            } else if (e.key === 'Home') {
              e.preventDefault()
              applyTick(0, true)
            } else if (e.key === 'End') {
              e.preventDefault()
              applyTick(TICK_COUNT - 1, true)
            }
          }}
        >
          {Array.from({ length: TICK_COUNT }, (_, i) => {
            const dist = Math.abs(i - tick)
            const cls =
              dist === 0 ? 'eh-tick is-active' : dist <= 2 ? 'eh-tick is-near' : 'eh-tick'
            return <span key={i} className={cls} aria-hidden />
          })}
        </div>
      </section>
    </main>
  )
}
