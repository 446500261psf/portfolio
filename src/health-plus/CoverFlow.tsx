import type { HealthCard } from './cards'

/** 中心卡始终居中正面；两侧扇开并渐隐 */
export const STAGE_PERSPECTIVE = 1400
export const CARD_ROTATE_Y = 14
export const STAGE_ROTATE_X = 4
export const CARD_SPREAD = 88
export const CARD_Z_STEP = 26

type Props = {
  cards: HealthCard[]
  activeIndex: number
  transitionMs: number
}

export function CoverFlow({ cards, activeIndex, transitionMs }: Props) {
  const ease = 'cubic-bezier(0.33, 0.1, 0.2, 1)'

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

          /* 当前卡永远在中心：tx/rotate 相对 activeIndex */
          const tx = rel * CARD_SPREAD
          const rotateY = rel === 0 ? 0 : rel * -CARD_ROTATE_Y
          const tz = rel === 0 ? 48 : -depth * CARD_Z_STEP
          const scale = rel === 0 ? 1 : Math.max(0.88, 1 - depth * 0.04)

          /* 中心不透明；两侧随距离递减 */
          const opacity =
            rel === 0 ? 1 : Math.max(0.22, 0.78 - (depth - 1) * 0.28)

          const blur = depth >= 2 ? 2 + (depth - 2) * 1.5 : 0

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
                zIndex: 40 - depth,
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
