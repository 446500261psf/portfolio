import { useRef, useState, useCallback, useEffect } from 'react'
import { CardStage } from './CardStage'
import { InfoPanel } from './InfoPanel'
import type { PortfolioCard } from '../data/cards'
import { COVER_COLUMN_ROW_CLASS, COVER_FLOW_CARD_CLASS } from '../constants/centerCard'
import { useCardNavigation } from '../hooks/useCardNavigation'

const WHEEL_COVER_MS = 480

type Props = {
  title: string
  cards: PortfolioCard[]
}

export function ProjectColumn({ title, cards }: Props) {
  const ref = useRef<HTMLElement>(null)
  const wheelHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverOnCardsRef = useRef(false)

  const [hoverOnCards, setHoverOnCards] = useState(false)
  const [wheelCoverFlow, setWheelCoverFlow] = useState(false)

  const clearWheelTimer = useCallback(() => {
    if (wheelHideTimer.current != null) {
      window.clearTimeout(wheelHideTimer.current)
      wheelHideTimer.current = null
    }
  }, [])

  useEffect(() => () => clearWheelTimer(), [clearWheelTimer])

  const scheduleHideCoverFlow = useCallback(() => {
    clearWheelTimer()
    wheelHideTimer.current = window.setTimeout(() => {
      setWheelCoverFlow(false)
      wheelHideTimer.current = null
    }, WHEEL_COVER_MS)
  }, [clearWheelTimer])

  const onCardStackPointerEnter = useCallback(() => {
    hoverOnCardsRef.current = true
    setHoverOnCards(true)
  }, [])

  const onCardStackPointerLeave = useCallback(() => {
    hoverOnCardsRef.current = false
    setHoverOnCards(false)
    setWheelCoverFlow(false)
    clearWheelTimer()
  }, [clearWheelTimer])

  /** 在卡片区域上滚轮时短暂进入 cover flow；停滚后恢复 flat */
  const onCardStackWheel = useCallback(() => {
    if (!hoverOnCardsRef.current) return
    setWheelCoverFlow(true)
    scheduleHideCoverFlow()
  }, [scheduleHideCoverFlow])

  const { activeIndex, transitionMs } = useCardNavigation({
    count: cards.length,
    containerRef: ref,
    enableKeyboard: false,
  })

  const card = cards[activeIndex]!

  const showCoverFlow = hoverOnCards && wheelCoverFlow

  return (
    <section
      ref={ref}
      className={`flex flex-col items-center ${COVER_COLUMN_ROW_CLASS}`}
      aria-label={title}
    >
      <div
        className={`w-full transition-opacity duration-300 ease-out ${hoverOnCards ? 'opacity-100' : 'opacity-50'}`}
        onPointerEnter={onCardStackPointerEnter}
        onPointerLeave={onCardStackPointerLeave}
        onWheel={onCardStackWheel}
      >
        <CardStage
          cards={cards}
          activeIndex={activeIndex}
          transitionMs={transitionMs}
          cardShellClass={COVER_FLOW_CARD_CLASS}
          viewportClass="h-[min(30vh,260px)] w-full sm:h-[min(34vh,300px)]"
          spread={26}
          zStep={22}
          maxDepth={3}
          visualMode={showCoverFlow ? 'coverFlow' : 'flat'}
        />
      </div>
      <InfoPanel
        className="mt-2 w-full px-0.5"
        shellClass="w-full min-w-0"
        variant="light"
        card={card}
        transitionMs={transitionMs}
      />
    </section>
  )
}
