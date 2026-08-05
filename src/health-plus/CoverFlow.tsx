import type { HealthCard } from './cards'

/** 浅角扇形：对齐 Figma 卡心间距与约 ±14–18° 透视，避免过重 coverflow */
export const STAGE_PERSPECTIVE = 1400
export const CARD_ROTATE_Y = 15
export const STAGE_ROTATE_X = 6
export const CARD_SPREAD = 72
export const CARD_Z_STEP = 22

/** 默认五卡（中心为 Upper Body）的稿面相对位移 */
const FIGMA_TX = [-148, -76, 0, 70, 112] as const

type Props = {
  cards: HealthCard[]
  activeIndex: number
  transitionMs: number
}

export function CoverFlow({ cards, activeIndex, transitionMs }: Props) {
  const ease = 'cubic-bezier(0.33, 0.1, 0.2, 1)'
  const useFigmaTx = cards.length === 5 && activeIndex === 2

  return (
    <div className="hp-stage" style={{ perspective: `${STAGE_PERSPECTIVE}px` }}>
      <div
        className="hp-stage-inner"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${STAGE_ROTATE_X}deg)`,
        }}
      >
        {cards.map((card, i) => {
          const rel = i - activeIndex
          const depth = Math.abs(rel)
          if (depth > 3) return null

          const tx = useFigmaTx ? FIGMA_TX[i]! : rel * CARD_SPREAD
          const rotateY = rel * -CARD_ROTATE_Y
          const tz = depth === 0 ? 36 : -depth * CARD_Z_STEP
          const scale = depth === 0 ? 1 : Math.max(0.9, 1 - depth * 0.035)
          const opacity =
            depth === 0 ? 1 : depth === 1 ? 0.9 : Math.max(0.38, 0.62 - (depth - 2) * 0.12)
          const blur = depth >= 2 ? 3.5 + (depth - 2) * 1.5 : 0

          const transform = [
            'translate3d(-50%, -50%, 0)',
            `translateX(${tx}px)`,
            `translateZ(${tz}px)`,
            `rotateY(${rotateY}deg)`,
            `scale(${scale})`,
          ].join(' ')

          return (
            <div
              key={card.id}
              className={`hp-card${rel === 0 ? ' is-active' : ''}`}
              style={{
                zIndex: 30 - depth,
                opacity,
                transform,
                filter: blur ? `blur(${blur}px)` : undefined,
                transition: `transform ${transitionMs}ms ${ease}, opacity ${transitionMs}ms ${ease}, filter ${transitionMs}ms ${ease}`,
              }}
              aria-hidden={rel !== 0}
              aria-label={card.title}
            >
              <img src={card.flatSrc} alt="" draggable={false} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
