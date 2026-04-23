import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

export const CARD_TRANSITION_MS = 550

type Options = {
  count: number
  containerRef: RefObject<HTMLElement | null>
  /** 多列并排时关闭，避免全局方向键同时切三张 */
  enableKeyboard?: boolean
}

export function useCardNavigation({ count, containerRef, enableKeyboard = true }: Options) {
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedRef = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchInWorkRef = useRef(false)

  const goNext = useCallback(() => {
    if (lockedRef.current) return
    setActiveIndex((i) => {
      if (i >= count - 1) return i
      lockedRef.current = true
      window.setTimeout(() => {
        lockedRef.current = false
      }, CARD_TRANSITION_MS)
      return i + 1
    })
  }, [count])

  const goPrev = useCallback(() => {
    if (lockedRef.current) return
    setActiveIndex((i) => {
      if (i <= 0) return i
      lockedRef.current = true
      window.setTimeout(() => {
        lockedRef.current = false
      }, CARD_TRANSITION_MS)
      return i - 1
    })
  }, [])

  const goTo = useCallback(
    (index: number) => {
      if (lockedRef.current) return
      if (index < 0 || index >= count) return
      lockedRef.current = true
      window.setTimeout(() => {
        lockedRef.current = false
      }, CARD_TRANSITION_MS)
      setActiveIndex(index)
    },
    [count],
  )

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const onWheel = (e: WheelEvent) => {
      if (!root.contains(e.target as Node)) return
      const dx = e.deltaX
      const dy = e.deltaY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2) {
        if (dx > 0 && activeIndex < count - 1) {
          e.preventDefault()
          goNext()
        } else if (dx < 0 && activeIndex > 0) {
          e.preventDefault()
          goPrev()
        }
        return
      }
      if (dy > 0) {
        if (activeIndex < count - 1) {
          e.preventDefault()
          goNext()
        }
      } else if (dy < 0) {
        if (activeIndex > 0) {
          e.preventDefault()
          goPrev()
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [activeIndex, containerRef, count, goNext, goPrev])

  useEffect(() => {
    if (!enableKeyboard) return
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowDown' ||
        e.key === 'j' ||
        e.key === 'J' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'K' || e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enableKeyboard, goNext, goPrev])

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      const root = containerRef.current
      touchInWorkRef.current = !!(root && root.contains(e.target as Node))
      if (touchInWorkRef.current) {
        touchStartY.current = t.clientY
        touchStartX.current = t.clientX
      } else {
        touchStartY.current = null
        touchStartX.current = null
      }
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchInWorkRef.current) {
        touchStartY.current = null
        touchStartX.current = null
        return
      }
      const startY = touchStartY.current
      const startX = touchStartX.current
      touchStartY.current = null
      touchStartX.current = null
      touchInWorkRef.current = false
      const end = e.changedTouches[0]
      if (startY == null || startX == null || !end) return
      const deltaY = startY - end.clientY
      const deltaX = startX - end.clientX
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 48) goNext()
        else if (deltaX < -48) goPrev()
      } else {
        if (deltaY > 48) goNext()
        else if (deltaY < -48) goPrev()
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goNext, goPrev, containerRef])

  return { activeIndex, goNext, goPrev, goTo, transitionMs: CARD_TRANSITION_MS }
}
