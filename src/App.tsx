import { useEffect, useRef, useState } from 'react'
import BlackFridayStack from './components/BlackFridayStack'
import DayCycleToggle from './components/DayCycleToggle'
import PhoneImageCarousel from './components/PhoneImageCarousel'

/* ============================================================================
 * PLAN A — Image-backed portfolio
 *
 * Each of the 14 Figma sub-frames in "Frame 8" (1440×16063) is exported as a
 * PNG @2x directly from the Figma design file, so the rendered page is a
 * pixel-perfect copy of the Figma layers (text, vectors, masks, photos are
 * all baked into the bitmap). Two interactive components are then layered on
 * top at exact Figma coordinates:
 *   • DayCycleToggle   — Case 01c (day/night pill)
 *   • PhoneImageCarousel — Case 01d (3-card toggle)
 *
 * The IntersectionObserver on each strip triggers a short fade-in once the
 * sub-canvas scrolls into view (user requirement: content only reveals when
 * its sub-canvas enters the screen).
 * ========================================================================== */

const E = '/figma/exports/'
const SUBFRAMES = [
  { name: 'cover',        y: 0,     h: 922,  src: E + 'cover.png' },
  { name: 'projects',     y: 922,   h: 1024, src: E + 'projects.png' },
  { name: 'chapter01',    y: 1946,  h: 472,  src: E + 'chapter01.png' },
  { name: 'case01a',      y: 2418,  h: 1024, src: E + 'case01a.png' },
  { name: 'case01b',      y: 3442,  h: 1024, src: E + 'case01b.png' },
  { name: 'case01c',      y: 4466,  h: 1024, src: E + 'case01c.png' },
  { name: 'case01d',      y: 5490,  h: 1024, src: E + 'case01d.png' },
  { name: 'chapter02',    y: 6514,  h: 1024, src: E + 'chapter02.png' },
  { name: 'qobuz',        y: 7538,  h: 2895, src: E + 'qobuz.png' },
  { name: 'user_journey', y: 10433, h: 1024, src: E + 'user_journey.png' },
  { name: 'black_friday', y: 11457, h: 1534, src: E + 'black_friday.png' },
  { name: 'chapter03',    y: 12991, h: 1024, src: E + 'chapter03.png' },
  { name: 'outdoor',      y: 14015, h: 1024, src: E + 'outdoor.png' },
  { name: 'value_comm',   y: 15039, h: 1024, src: E + 'value_comm.png' },
] as const

const CANVAS_W = 1440

type RevealImgProps = {
  y: number
  h: number
  src: string
  name: string
}

function RevealImg({ y, h, src, name }: RevealImgProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [revealing, setRevealing] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealing(true)
            setActive(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onTransitionEnd = () => setRevealing(false)

  return (
    <div
      ref={ref}
      className={`strip${active ? ' is-active' : ''}${revealing ? ' is-revealing' : ''}`}
      style={{ top: y, width: CANVAS_W, height: h }}
      data-name={name}
      onTransitionEnd={onTransitionEnd}
    >
      <img
        src={src}
        alt=""
        width={CANVAS_W}
        height={h}
        draggable={false}
        /* All strips start fetching eagerly; content-visibility handles the
           off-screen render cost, so we don't want network-level laziness
           to defer the decode to the first scroll. */
        loading="eager"
        decoding="async"
        fetchPriority={y < 2000 ? 'high' : 'low'}
      />
    </div>
  )
}

export default function App() {
  return (
    <main className="portfolio">
      <div className="frame8-wrap">
        <div className="frame8">
          {SUBFRAMES.map((sf) => (
            <RevealImg key={sf.name} y={sf.y} h={sf.h} src={sf.src} name={sf.name} />
          ))}

          {/* Figma: `120:448` / `120:447` / `120:449` are siblings of `120:441`, not in black_friday.png */}
          <BlackFridayStack />

          {/* Case 01c — DayCycleToggle overlays the static phone at abs (287, 4606) in Frame 8 */}
          <div
            className="overlay"
            style={{ left: 287, top: 4466 + 140, width: 591, height: 788 }}
          >
            <DayCycleToggle />
          </div>

          {/* Case 01d — PhoneImageCarousel overlays the static phone at abs (719, 5534) in Frame 8 */}
          <div
            className="overlay"
            style={{ left: 719, top: 5490 + 44, width: 559, height: 980 }}
          >
            <PhoneImageCarousel />
          </div>
        </div>
      </div>
    </main>
  )
}
