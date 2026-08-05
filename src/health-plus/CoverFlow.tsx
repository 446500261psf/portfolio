import type { HealthCard } from './cards'

/**
 * 透视参数对齐既有 coverFlow（CardStage / health-plus-motion）：
 * perspective 1600px · rotateY ±22°/步 · spread · zStep · scale 衰减
 */
export const COVER_PERSPECTIVE = 1600
export const COVER_ROTATE_Y = 22
export const COVER_SPREAD = 78
export const COVER_Z_STEP = 40
export const COVER_MAX_DEPTH = 4

type Props = {
  cards: HealthCard[]
  activeIndex: number
  transitionMs: number
}

export function CoverFlow({ cards, activeIndex, transitionMs }: Props) {
  const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'

  return (
    <div className="hp-stage" style={{ perspective: `${COVER_PERSPECTIVE}px` }}>
      <div className="hp-stage-inner" style={{ transformStyle: 'preserve-3d' }}>
        {cards.map((card, i) => {
          const rel = i - activeIndex
          const depth = Math.abs(rel)
          if (depth > COVER_MAX_DEPTH) return null

          const tx = rel * COVER_SPREAD
          const rotateY = rel * -COVER_ROTATE_Y
          const tz = -depth * COVER_Z_STEP
          const scale = Math.max(0.55, 1 - depth * 0.1)
          const opacity = rel === 0 ? 1 : Math.max(0.38, 0.95 - depth * 0.13)
          /* Figma 外侧卡带运动模糊感 */
          const blur = depth >= 2 ? Math.min(6, (depth - 1) * 3) : 0

          const transform = `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${rotateY}deg) scale(${scale})`

          return (
            <div
              key={card.id}
              className={`hp-card${rel === 0 ? ' is-active' : ''}`}
              style={{
                zIndex: 50 - depth,
                opacity,
                transform,
                transformStyle: 'preserve-3d',
                filter: blur ? `blur(${blur}px)` : undefined,
                transition: `transform ${transitionMs}ms ${ease}, opacity ${transitionMs}ms ${ease}, filter ${transitionMs}ms ${ease}`,
              }}
              aria-hidden={rel !== 0}
              aria-label={card.title}
            >
              <img src={card.src} alt="" draggable={false} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
