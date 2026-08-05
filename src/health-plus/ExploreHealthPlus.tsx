import { useCallback, useEffect, useRef, useState } from 'react'
import { CoverFlow } from './CoverFlow'
import { healthAssets, healthCards } from './cards'

/** Figma 默认居中卡：Build · Upper Body */
const INITIAL_INDEX = 2
const TRANSITION_MS = 680

export default function ExploreHealthPlus() {
  const rootRef = useRef<HTMLElement>(null)
  const lockedRef = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX)
  const [ready, setReady] = useState(false)

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

  return (
    <main ref={rootRef} className={`hp${ready ? ' is-ready' : ''}`}>
      {/* Figma 画布 800×936，等比缩放铺满视口 */}
      <div className="hp-artboard" role="img" aria-label="Explore Health+">
        <img className="hp-logo" src={healthAssets.logo} alt="HUAWEI Health" width={106} height={23} />

        <h1 className="hp-title">Explore Health+</h1>
        <img className="hp-underline" src={healthAssets.underline} alt="" aria-hidden />

        <button
          type="button"
          className="hp-ticks hp-ticks-left"
          onClick={goPrev}
          disabled={activeIndex <= 0}
          aria-label="Previous"
        >
          <img src={healthAssets.ticksLeft} alt="" />
        </button>

        <button
          type="button"
          className="hp-ticks hp-ticks-right"
          onClick={goNext}
          disabled={activeIndex >= healthCards.length - 1}
          aria-label="Next"
        >
          <img src={healthAssets.ticksRight} alt="" />
        </button>

        <div className="hp-carousel" aria-hidden={false}>
          <CoverFlow
            cards={healthCards}
            activeIndex={activeIndex}
            transitionMs={TRANSITION_MS}
            onNext={goNext}
            onPrev={goPrev}
          />
        </div>
      </div>
    </main>
  )
}
