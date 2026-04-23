import { useState } from 'react'
import { publicUrl } from '../publicUrl'

/**
 * PhoneImageCarousel — Figma `PhoneImageToggle`（179:19）
 *
 * - instruments（179:23）：object-cover，与画板一致
 * - oceans_card（179:24）、flowers（179:25）：Figma 为放大位图 + 负 top，不用 object-cover
 */
const imgOceans = publicUrl('figma/oceans.png')
const imgInstruments = publicUrl('figma/instruments.png')
const imgFlowers = publicUrl('figma/flowers.png')
const imgArrowLeft = publicUrl('figma/arrow-left.svg')
const imgArrowRight = publicUrl('figma/arrow-right.svg')

type Page = 'instruments' | 'oceans' | 'flowers'

const PAGES: Page[] = ['instruments', 'oceans', 'flowers']

const PAGE_IMG: Record<Page, string> = {
  instruments: imgInstruments,
  oceans: imgOceans,
  flowers: imgFlowers,
}

/** 与 Figma get_design_context（179:24 / 179:25）数值一致 */
const CARD_CROP: Partial<Record<Page, { heightPct: number; topPct: number }>> = {
  oceans: { heightPct: 230.59, topPct: -30.82 },
  flowers: { heightPct: 230.71, topPct: -110.8 },
}

export default function PhoneImageCarousel() {
  const [idx, setIdx] = useState<number>(0)
  const move = (d: number) =>
    setIdx((prev) => (prev + d + PAGES.length) % PAGES.length)

  return (
    <div style={{ position: 'relative', width: 559, height: 980 }}>
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
            {CARD_CROP[p] ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                <img
                  src={PAGE_IMG[p]}
                  alt={p}
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    height: `${CARD_CROP[p]!.heightPct}%`,
                    top: `${CARD_CROP[p]!.topPct}%`,
                    maxWidth: 'none',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    display: 'block',
                  }}
                  draggable={false}
                />
              </div>
            ) : (
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
            )}
          </div>
        )
      })}

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
