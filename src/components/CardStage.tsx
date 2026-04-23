import { CENTER_CARD_SHELL_CLASS } from '../constants/centerCard'
import { cardImageSrc, type PortfolioCard } from '../data/cards'
import { useEffect, useState } from 'react'

const gradientForProject = (projectId: number) => {
  switch (projectId) {
    case 1:
      return 'from-[#2c302a] via-[#3e4440] to-[#1a1d1a]'
    case 2:
      return 'from-[#252824] via-[#363b36] to-[#141614]'
    default:
      return 'from-[#2a2e29] via-[#3a403b] to-[#181b18]'
  }
}

function CardFace({ card }: { card: PortfolioCard }) {
  const src = cardImageSrc(card.projectId, card.stepInProject)
  const [useImg, setUseImg] = useState(true)

  useEffect(() => {
    setUseImg(true)
  }, [src])

  const label = `${card.projectLabel} · ${String(card.stepInProject).padStart(2, '0')}`

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[14px] bg-gradient-to-br shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${gradientForProject(card.projectId)}`}
    >
      {useImg ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setUseImg(false)}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-95 ${gradientForProject(card.projectId)}`}
          aria-hidden
        />
      )}
      {!useImg && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
            Placeholder
          </span>
          <span className="max-w-[14rem] text-sm font-medium leading-snug text-white/85">
            {label}
          </span>
          <span className="text-xs text-white/40">Drop image as {src.replace(/^\//, '')}</span>
        </div>
      )}
    </div>
  )
}

const DEFAULT_MAX_DEPTH = 4

export type CardVisualMode = 'flat' | 'coverFlow'

type Props = {
  cards: PortfolioCard[]
  activeIndex: number
  transitionMs: number
  cardShellClass?: string
  viewportClass?: string
  spread?: number
  zStep?: number
  maxDepth?: number
  /** flat：仅当前张、无扇形；coverFlow：扇形堆叠 */
  visualMode?: CardVisualMode
}

export function CardStage({
  cards,
  activeIndex,
  transitionMs,
  cardShellClass = CENTER_CARD_SHELL_CLASS,
  viewportClass = 'h-[min(52vh,460px)] max-w-[min(100%,920px)]',
  spread = 52,
  zStep = 36,
  maxDepth = DEFAULT_MAX_DEPTH,
  visualMode = 'coverFlow',
}: Props) {
  const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'
  const active = cards[activeIndex]

  if (!active) {
    return null
  }

  if (visualMode === 'flat') {
    return (
      <div className="relative mx-auto flex w-full flex-[1_1_auto] items-center justify-center overflow-visible py-3 sm:py-5">
        <div className={`relative w-full min-w-0 ${viewportClass}`}>
          <div
            key={active.id}
            className={`absolute left-1/2 top-1/2 aspect-[9/16] ${cardShellClass} will-change-transform`}
            style={{
              transform: 'translate(-50%, -50%) scale(1)',
              zIndex: 10,
              transition: `transform ${transitionMs}ms ${ease}`,
            }}
          >
            <CardFace card={active} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative mx-auto flex w-full flex-[1_1_auto] items-center justify-center overflow-visible py-3 sm:py-5"
      style={{ perspective: '1600px' }}
    >
      <div
        className={`relative w-full min-w-0 ${viewportClass}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {cards.map((card, i) => {
          const rel = i - activeIndex
          if (Math.abs(rel) > maxDepth) {
            return null
          }

          const depth = Math.abs(rel)
          const tx = rel * spread
          const rotateY = rel * -22
          const tz = -depth * zStep
          const scale = Math.max(0.55, 1 - depth * 0.1)
          const opacity = rel === 0 ? 1 : Math.max(0.38, 0.95 - depth * 0.13)

          const tr = `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${rotateY}deg) scale(${scale})`

          return (
            <div
              key={card.id}
              className={`absolute left-1/2 top-1/2 aspect-[9/16] ${cardShellClass} will-change-transform`}
              style={{
                zIndex: 50 - depth,
                opacity,
                transform: tr,
                transformStyle: 'preserve-3d',
                transition: `transform ${transitionMs}ms ${ease}, opacity ${transitionMs}ms ${ease}`,
              }}
            >
              <CardFace card={card} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
