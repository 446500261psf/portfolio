import { useCallback, useEffect, useRef, useState } from 'react'
import { CoverFlow } from './CoverFlow'
import { healthAssets, healthCards } from './cards'

const TICK_COUNT = 13
/** Figma 默认居中卡：Build · Upper Body */
const INITIAL_INDEX = 2
const TRANSITION_MS = 550

export default function ExploreHealthPlus() {
  const rootRef = useRef<HTMLElement>(null)
  const lockedRef = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX)
  const [ready, setReady] = useState(false)

  const goTo = useCallback((index: number) => {
    if (lockedRef.current) return
    if (index < 0 || index >= healthCards.length) return
    lockedRef.current = true
    window.setTimeout(() => {
      lockedRef.current = false
    }, TRANSITION_MS)
    setActiveIndex((prev) => (prev === index ? prev : index))
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (lockedRef.current || prev >= healthCards.length - 1) return prev
      lockedRef.current = true
      window.setTimeout(() => {
        lockedRef.current = false
      }, TRANSITION_MS)
      return prev + 1
    })
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (lockedRef.current || prev <= 0) return prev
      lockedRef.current = true
      window.setTimeout(() => {
        lockedRef.current = false
      }, TRANSITION_MS)
      return prev - 1
    })
  }, [])

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const root = rootRef.current
      if (!root || !root.contains(e.target as Node)) return
      const dx = e.deltaX
      const dy = e.deltaY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2) {
        e.preventDefault()
        if (dx > 0) goNext()
        else goPrev()
        return
      }
      if (Math.abs(dy) > 2) {
        e.preventDefault()
        if (dy > 0) goNext()
        else goPrev()
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [goNext, goPrev])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      touchStart.current = { x: t.clientX, y: t.clientY }
    }
    const onEnd = (e: TouchEvent) => {
      const start = touchStart.current
      touchStart.current = null
      const end = e.changedTouches[0]
      if (!start || !end) return
      const dx = start.x - end.clientX
      const dy = start.y - end.clientY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
        if (dx > 0) goNext()
        else goPrev()
      } else if (Math.abs(dy) > 48) {
        if (dy > 0) goNext()
        else goPrev()
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [goNext, goPrev])

  const tickActive = Math.round(
    ((TICK_COUNT - 1) * activeIndex) / Math.max(1, healthCards.length - 1),
  )

  return (
    <main ref={rootRef} className={`hp${ready ? ' is-ready' : ''}`}>
      <header className="hp-header">
        <img className="hp-logo" src={healthAssets.logo} alt="HUAWEI Health" width={106} height={23} />
      </header>

      <div className="hp-title-block">
        <h1 className="hp-title">Explore Health+</h1>
        <img className="hp-underline" src={healthAssets.underline} alt="" aria-hidden />
      </div>

      <section className="hp-carousel" aria-label="Health+ feature cards">
        <button
          type="button"
          className="hp-nav hp-nav-prev"
          onClick={goPrev}
          disabled={activeIndex <= 0}
          aria-label="Previous card"
        >
          <img src={healthAssets.ticksLeft} alt="" />
          <span className="hp-ticks-active" aria-hidden>
            {Array.from({ length: TICK_COUNT }, (_, i) => (
              <i key={i} className={i === tickActive ? 'is-on' : undefined} />
            ))}
          </span>
        </button>

        <CoverFlow cards={healthCards} activeIndex={activeIndex} transitionMs={TRANSITION_MS} />

        <button
          type="button"
          className="hp-nav hp-nav-next"
          onClick={goNext}
          disabled={activeIndex >= healthCards.length - 1}
          aria-label="Next card"
        >
          <img src={healthAssets.ticksRight} alt="" />
          <span className="hp-ticks-active" aria-hidden>
            {Array.from({ length: TICK_COUNT }, (_, i) => (
              <i key={i} className={i === tickActive ? 'is-on' : undefined} />
            ))}
          </span>
        </button>
      </section>

      <nav className="hp-dots" aria-label="Card position">
        {healthCards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            className={i === activeIndex ? 'is-active' : undefined}
            onClick={() => goTo(i)}
            aria-label={card.title}
            aria-current={i === activeIndex ? 'true' : undefined}
          />
        ))}
      </nav>

      <p className="hp-hint">Scroll · swipe · ← →</p>
    </main>
  )
}
