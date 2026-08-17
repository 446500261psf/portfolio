import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Maps scroll position within a tall driver element to progress 0→1.
 * Scroll/resize handlers are coalesced with requestAnimationFrame so we
 * never measure layout more than once per frame.
 */
export function useRafScrollProgress(
  driverRef: RefObject<HTMLElement | null>,
  enabled = true,
): number {
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return
    const driver = driverRef.current
    if (!driver) return

    const measure = () => {
      rafRef.current = null
      const rect = driver.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      const next = total > 0 ? scrolled / total : 0
      if (next !== progressRef.current) {
        progressRef.current = next
        setProgress(next)
      }
    }

    const schedule = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(measure)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    measure()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [driverRef, enabled])

  return progress
}
