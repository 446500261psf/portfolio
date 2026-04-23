import { useState } from 'react'

/**
 * PhoneImageCarousel — pixel-accurate reproduction of Figma `PhoneImageToggle`
 * (179:58). Three pages backed by the actual Figma images (oceans, instruments,
 * flowers).
 *
 * Figma geometry (559 × 980 component):
 *   oceans fill (Group 11 bg):  451 × 980 at (54, 0)
 *   soft inner slot rect:       451 × 430 at (54, 125) fill #eff4f5
 *   active card:                451 × 425 at (54, 131)
 *   arrow_left:                 44  × 44  at (5, 468)
 *   arrow_right:                44  × 44  at (510, 468)
 */

const imgOceans = '/figma/oceans.png'
const imgInstruments = '/figma/instruments.png'
const imgFlowers = '/figma/flowers.png'
const imgArrowLeft = '/figma/arrow-left.svg'
const imgArrowRight = '/figma/arrow-right.svg'

type Page = 'instruments' | 'oceans' | 'flowers'

const PAGES: Page[] = ['instruments', 'oceans', 'flowers']

const PAGE_IMG: Record<Page, string> = {
  instruments: imgInstruments,
  oceans: imgOceans,
  flowers: imgFlowers,
}

export default function PhoneImageCarousel() {
  const [idx, setIdx] = useState<number>(0)
  const move = (d: number) =>
    setIdx((prev) => (prev + d + PAGES.length) % PAGES.length)

  return (
    <div style={{ position: 'relative', width: 559, height: 980 }}>
      {/* Phone 'Group 11' base fill (oceans image) 451×980 at (54, 0) */}
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 0,
          width: 451,
          height: 980,
          overflow: 'hidden',
          borderRadius: 48,
        }}
      >
        <img
          src={imgOceans}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block',
          }}
          draggable={false}
        />
      </div>

      {/* Soft slot rect #eff4f5 — 451 × 430 at (54, 125) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 54,
          top: 125,
          width: 451,
          height: 430,
          background: '#eff4f5',
          borderRadius: 24,
        }}
      />

      {/* Cards: render the active one at (54,131) and slide the prev/next cards
          off-screen to left/right using the same offsets seen in Figma
          (next=579, prev=-471). */}
      {PAGES.map((p, i) => {
        const offset = (i - idx + PAGES.length) % PAGES.length
        const state = offset === 0 ? 'active' : offset === 1 ? 'next' : 'prev'
        const left = state === 'active' ? 54 : state === 'next' ? 579 : -471
        const opacity = state === 'active' ? 1 : 0
        return (
          <div
            key={p}
            aria-hidden={state !== 'active'}
            style={{
              position: 'absolute',
              left,
              top: 131,
              width: 451,
              height: 425,
              overflow: 'hidden',
              borderRadius: 20,
              opacity,
              transition:
                'left .55s cubic-bezier(.4,0,.2,1), opacity .35s cubic-bezier(.4,0,.2,1)',
              zIndex: state === 'active' ? 3 : 1,
              willChange: 'left, opacity',
            }}
          >
            <img
              src={PAGE_IMG[p]}
              alt={p}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                userSelect: 'none',
                display: 'block',
              }}
              draggable={false}
            />
          </div>
        )
      })}

      {/* Arrow buttons — 44×44, rounded, white w/ shadow, 50% opacity */}
      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="Previous"
        style={{
          position: 'absolute',
          left: 5,
          top: 468,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: '#fff',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.5,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          zIndex: 5,
          transition: 'opacity .2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
      >
        <img src={imgArrowLeft} alt="" width={16} height={16} />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label="Next"
        style={{
          position: 'absolute',
          left: 510,
          top: 468,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: '#fff',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.5,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          zIndex: 5,
          transition: 'opacity .2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
      >
        <img src={imgArrowRight} alt="" width={16} height={16} />
      </button>
    </div>
  )
}
