import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { publicUrl } from '../publicUrl'

const STAGE_W = 800
const STAGE_H = 600
const TICK_COUNT = 26
const CARD_COUNT = 5
/** Always show this many cards on each side of center (2+1+2 with 5 phones). */
const SIDE_COUNT = Math.floor((CARD_COUNT - 1) / 2)
/** How far the pointer must travel (as fraction of scrubber width) to step one card. */
const STEP_THRESHOLD = 1 / TICK_COUNT

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

/** Shortest signed distance on a circular ring of length `n`. */
function wrappedOffset(index: number, active: number, n: number): number {
  let d = index - active
  d -= n * Math.round(d / n)
  return d
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

  /* Soften the outer vertical edge of the farthest phones */
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
  /** Discrete active card index (unbounded for wrap direction; display uses mod). */
  const [active, setActive] = useState(2)
  const scrubRef = useRef<HTMLDivElement>(null)
  const lastX = useRef<number | null>(null)
  const pending = useRef(0)

  /**
   * Accumulate pointer delta; only step ±1 card when enough distance is traveled.
   * mouse left → images push left (active ↑); mouse right → push right (active ↓).
   */
  const scrubByClientX = useCallback((clientX: number) => {
    const el = scrubRef.current
    if (!el) return
    const width = el.getBoundingClientRect().width
    if (width <= 0) return

    if (lastX.current == null) {
      lastX.current = clientX
      pending.current = 0
      return
    }

    const dx = clientX - lastX.current
    lastX.current = clientX
    if (dx === 0) return

    pending.current += -dx / width

    while (pending.current >= STEP_THRESHOLD) {
      pending.current -= STEP_THRESHOLD
      setActive((a) => a + 1)
    }
    while (pending.current <= -STEP_THRESHOLD) {
      pending.current += STEP_THRESHOLD
      setActive((a) => a - 1)
    }
  }, [])

  const onPointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    lastX.current = e.clientX
    pending.current = 0
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    lastX.current = e.clientX
    pending.current = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    scrubByClientX(e.clientX)
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    pending.current = 0
  }

  const onPointerLeave = () => {
    lastX.current = null
    pending.current = 0
  }

  const nearest = mod(active, CARD_COUNT)
  const activeTick = Math.round((nearest / CARD_COUNT) * (TICK_COUNT - 1)) % TICK_COUNT

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
                  onClick={() => setActive((a) => a + wrappedOffset(i, a, CARD_COUNT))}
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
          aria-valuemax={CARD_COUNT - 1}
          aria-valuenow={nearest}
          aria-valuetext={PHONES[nearest].label}
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
              setActive((a) => a + 1)
            } else if (e.key === 'ArrowRight') {
              e.preventDefault()
              setActive((a) => a - 1)
            } else if (e.key === 'Home') {
              e.preventDefault()
              setActive((a) => a + wrappedOffset(0, a, CARD_COUNT))
            } else if (e.key === 'End') {
              e.preventDefault()
              setActive((a) => a + wrappedOffset(CARD_COUNT - 1, a, CARD_COUNT))
            }
          }}
        >
          {Array.from({ length: TICK_COUNT }, (_, i) => {
            const dist = Math.min(
              Math.abs(i - activeTick),
              TICK_COUNT - Math.abs(i - activeTick),
            )
            const cls =
              dist === 0 ? 'eh-tick is-active' : dist <= 2 ? 'eh-tick is-near' : 'eh-tick'
            return <span key={i} className={cls} aria-hidden />
          })}
        </div>
      </section>
    </main>
  )
}
