import type { HealthCard } from './cards'

/** 中心卡始终居中正面；两侧扇开并渐隐 */
export const STAGE_PERSPECTIVE = 1400
export const CARD_ROTATE_Y = 16
export const STAGE_ROTATE_X = 4
export const CARD_SPREAD = 96
export const CARD_Z_STEP = 78

type Props = {
  cards: HealthCard[]
  activeIndex: number
  transitionMs: number
  onNext: () => void
  onPrev: () => void
}

export function CoverFlow({
  cards,
  activeIndex,
  transitionMs,
  onNext,
  onPrev,
}: Props) {
  const ease = 'cubic-bezier(0.22, 0.75, 0.2, 1)'

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
          const tz = rel === 0 ? 110 : -depth * CARD_Z_STEP
          const scale = rel === 0 ? 1 : Math.max(0.8, 0.92 - (depth - 1) * 0.06)

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
            <button
              type="button"
              key={card.id}
              className={`hp-card${rel === 0 ? ' is-active' : ''}`}
              onClick={rel > 0 ? onNext : rel < 0 ? onPrev : undefined}
              disabled={rel === 0}
              style={{
                zIndex: 40 - depth,
                opacity,
                transform,
                filter: blur ? `blur(${blur}px)` : undefined,
                transition: `transform ${transitionMs}ms ${ease}, opacity ${transitionMs}ms ${ease}, filter ${transitionMs}ms ${ease}`,
              }}
              aria-hidden={rel !== 0}
              aria-label={
                rel > 0 ? `Show next: ${card.title}` : rel < 0 ? `Show previous: ${card.title}` : card.title
              }
            >
              <img src={card.flatSrc} alt="" draggable={false} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
