import { useEffect, useRef, type RefObject } from 'react'

export type ParallaxCoefficients = {
  portrait: { x: number; y: number; scale?: number }
  grid: { x: number; y: number }
}

const DEFAULT_COEFFICIENTS: ParallaxCoefficients = {
  portrait: { x: -18, y: -12, scale: 1.04 },
  grid: { x: 10, y: 8 },
}

/**
 * Pointer-driven parallax (mouse, pen, touch) with rAF coalescing.
 * Normalized offsets are in roughly -0.5 … 0.5 relative to the viewport.
 */
export function usePointerParallax(
  containerRef: RefObject<HTMLElement | null>,
  portraitRef: RefObject<HTMLElement | null>,
  gridRef: RefObject<HTMLElement | null>,
  enabled = true,
  coefficients: ParallaxCoefficients = DEFAULT_COEFFICIENTS,
) {
  const coefRef = useRef(coefficients)
  coefRef.current = coefficients

  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return

    const apply = () => {
      rafRef.current = null
      const { x, y } = pendingRef.current
      const { portrait, grid } = coefRef.current
      const portraitEl = portraitRef.current
      const gridEl = gridRef.current
      const scale = portrait.scale ?? 1

      if (portraitEl) {
        portraitEl.style.transform = `translate(${x * portrait.x}px, ${y * portrait.y}px) scale(${scale})`
      }
      if (gridEl) {
        gridEl.style.transform = `translate(${x * grid.x}px, ${y * grid.y}px)`
      }
    }

    const schedule = (clientX: number, clientY: number) => {
      pendingRef.current = {
        x: clientX / window.innerWidth - 0.5,
        y: clientY / window.innerHeight - 0.5,
      }
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(apply)
      }
    }

    const onPointerMove = (e: PointerEvent) => schedule(e.clientX, e.clientY)

    container.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      container.removeEventListener('pointermove', onPointerMove)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef, portraitRef, gridRef, enabled])
}
