import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { usePointerParallax } from '../hooks/usePointerParallax'
import { useRafScrollProgress } from '../hooks/useRafScrollProgress'
import { publicUrl } from '../publicUrl'

export type DesignPerspectivesRevealProps = {
  /** 人像照片（建议黑白、人物略偏右下构图） */
  portraitSrc?: string
  /** Design Perspectives 黄色海报整图 */
  posterSrc?: string
  nameLabel?: string
  eyebrow?: string
  /** 拱顶高度，0 = 顶部，1 = 底部 */
  archTopY?: number
  /** 拱脚归一化半宽（-1…1 坐标系），越大拱脚越靠外 */
  legX?: number
  cols?: number
  rows?: number
  /** scroll-driver 高度，控制滚动行程 */
  scrollHeight?: string
}

type CellMeta = {
  col: number
  row: number
  score: number
}

const DEFAULT_PORTRAIT = publicUrl('design-perspectives/portrait.svg')
const DEFAULT_POSTER = publicUrl('design-perspectives/poster.svg')

function archBoundaryY(cx: number, archTopY: number, legX: number): number {
  const t = Math.min(1, Math.pow(Math.abs(cx) / legX, 2))
  return archTopY + (1 - archTopY) * t
}

/** Deterministic jitter so dissolve order is stable across renders. */
function cellJitter(row: number, col: number): number {
  const n = Math.sin(row * 127.1 + col * 311.7) * 43_758.5453
  return (n - Math.floor(n) - 0.5) * 0.05
}

function buildDissolveOrder(
  cols: number,
  rows: number,
  archTopY: number,
  legX: number,
): CellMeta[] {
  const cells: CellMeta[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = ((col + 0.5) / cols) * 2 - 1
      const ny = (row + 0.5) / rows
      const score = ny - archBoundaryY(cx, archTopY, legX)
      cells.push({ col, row, score })
    }
  }

  return cells.sort((a, b) => {
    const jitterA = cellJitter(a.row, a.col)
    const jitterB = cellJitter(b.row, b.col)
    return b.score + jitterB - (a.score + jitterA)
  })
}

function posterSliceStyle(
  col: number,
  row: number,
  cols: number,
  rows: number,
  posterSrc: string | null,
): CSSProperties {
  if (!posterSrc) return { backgroundColor: '#e4ff3d' }

  const xPct = cols > 1 ? (col / (cols - 1)) * 100 : 0
  const yPct = rows > 1 ? (row / (rows - 1)) * 100 : 0

  return {
    backgroundImage: `url("${posterSrc}")`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${xPct}% ${yPct}%`,
  }
}

export default function DesignPerspectivesReveal({
  portraitSrc = DEFAULT_PORTRAIT,
  posterSrc = DEFAULT_POSTER,
  nameLabel = 'Axel Meise',
  eyebrow = 'Design\nPerspectives',
  archTopY = 0.24,
  legX = 0.78,
  cols = 18,
  rows = 24,
  scrollHeight = '300vh',
}: DesignPerspectivesRevealProps) {
  const driverRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])
  const hideCountRef = useRef(0)

  const [assetsReady, setAssetsReady] = useState(false)
  const [loadedPoster, setLoadedPoster] = useState<string | null>(null)

  const dissolveOrder = useMemo(
    () => buildDissolveOrder(cols, rows, archTopY, legX),
    [cols, rows, archTopY, legX],
  )

  const orderIndices = useMemo(() => {
    const indexByPos = new Map<string, number>()
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        indexByPos.set(`${col},${row}`, row * cols + col)
      }
    }
    return dissolveOrder.map((cell) => indexByPos.get(`${cell.col},${cell.row}`)!)
  }, [dissolveOrder, cols, rows])

  const progress = useRafScrollProgress(driverRef, assetsReady)
  usePointerParallax(pinRef, portraitRef, gridRef, assetsReady)

  // Lazy-load image assets once the section nears the viewport.
  useEffect(() => {
    const driver = driverRef.current
    if (!driver) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setAssetsReady(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '200px 0px', threshold: 0 },
    )

    io.observe(driver)
    return () => io.disconnect()
  }, [])

  // Pre-decode poster before painting 288 background slices.
  useEffect(() => {
    if (!assetsReady) return
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (!cancelled) setLoadedPoster(posterSrc)
    }
    img.onerror = () => {
      if (!cancelled) setLoadedPoster(null)
    }
    img.src = posterSrc
    return () => {
      cancelled = true
    }
  }, [assetsReady, posterSrc])

  // Imperatively toggle only the cells that cross the hide threshold — avoids
  // re-rendering 288 React nodes and repeated layout on every scroll frame.
  useEffect(() => {
    const hideCount = Math.floor(progress * orderIndices.length)
    const prev = hideCountRef.current
    if (hideCount === prev) return

    const start = Math.min(prev, hideCount)
    const end = Math.max(prev, hideCount)
    const hiding = hideCount > prev

    for (let i = start; i < end; i++) {
      const cellIndex = orderIndices[i]
      const el = cellRefs.current[cellIndex]
      if (el) el.classList.toggle('dp-reveal__cell--hidden', hiding)
    }

    hideCountRef.current = hideCount
  }, [progress, orderIndices])

  // Reset cells when arch parameters change.
  useEffect(() => {
    hideCountRef.current = 0
    for (const el of cellRefs.current) {
      el?.classList.remove('dp-reveal__cell--hidden')
    }
  }, [orderIndices])

  const gridCells = useMemo(() => {
    const items: { key: string; col: number; row: number }[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        items.push({ key: `${col}-${row}`, col, row })
      }
    }
    return items
  }, [cols, rows])

  const eyebrowLines = eyebrow.split('\n')

  return (
    <section className="dp-reveal" aria-label="Design Perspectives reveal">
      <div
        ref={driverRef}
        className="dp-reveal__driver"
        style={{ height: scrollHeight }}
      >
        <div ref={pinRef} className="dp-reveal__pin">
          <div ref={portraitRef} className="dp-reveal__portrait">
            {assetsReady ? (
              <img
                className="dp-reveal__portrait-img"
                src={portraitSrc}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ) : (
              <div className="dp-reveal__portrait-placeholder" aria-hidden />
            )}
          </div>

          <p className="dp-reveal__name">{nameLabel}</p>

          <div
            ref={gridRef}
            className="dp-reveal__grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
            }}
          >
            {gridCells.map((cell, index) => (
              <div
                key={cell.key}
                ref={(el) => {
                  cellRefs.current[index] = el
                }}
                className="dp-reveal__cell"
                style={posterSliceStyle(
                  cell.col,
                  cell.row,
                  cols,
                  rows,
                  loadedPoster,
                )}
              />
            ))}
          </div>

          <p className="dp-reveal__eyebrow">
            {eyebrowLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < eyebrowLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>
      </div>

      <p className="dp-reveal__hint" aria-hidden>
        ↕ 上下滚动 · 移动指针查看视差
      </p>
    </section>
  )
}
