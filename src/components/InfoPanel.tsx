import type { PortfolioCard } from '../data/cards'
import { CENTER_CARD_SHELL_CLASS } from '../constants/centerCard'

type Props = {
  card: PortfolioCard
  transitionMs: number
  className?: string
  variant?: 'dark' | 'light'
  shellClass?: string
}

export function InfoPanel({
  card,
  transitionMs: _transitionMs,
  className = '',
  variant = 'dark',
  shellClass,
}: Props) {
  const isLight = variant === 'light'
  const shell = shellClass ?? CENTER_CARD_SHELL_CLASS
  const t = isLight
    ? {
        h2: 'text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl',
        dt: 'text-[11px] font-semibold uppercase tracking-wider text-neutral-500',
        dd: 'text-[14px] leading-snug text-neutral-700 sm:text-[15px]',
        ddResult: 'text-[14px] leading-snug text-neutral-900 sm:text-[15px]',
      }
    : {
        h2: 'text-xl font-semibold tracking-tight text-white sm:text-2xl',
        dt: 'text-[11px] font-semibold uppercase tracking-wider text-white/40',
        dd: 'text-[14px] leading-snug text-white/72 sm:text-[15px]',
        ddResult: 'text-[14px] leading-snug text-white/88 sm:text-[15px]',
      }

  return (
    <div className={`shrink-0 pb-4 pt-0 ${shell} text-left ${className}`}>
      <div key={card.id} className="text-left">
        <h2 className={t.h2}>{card.title}</h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className={t.dt}>Goal</dt>
            <dd className={`mt-1 ${t.dd}`}>{card.goal}</dd>
          </div>
          <div>
            <dt className={t.dt}>Action</dt>
            <dd className={`mt-1 ${t.dd}`}>{card.action}</dd>
          </div>
          <div>
            <dt className={t.dt}>Result</dt>
            <dd className={`mt-1 ${t.ddResult}`}>{card.result}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
