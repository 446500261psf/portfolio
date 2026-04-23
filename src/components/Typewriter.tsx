import { useEffect, useMemo, useState } from 'react'

type Props = {
  text: string
  start: boolean
  className?: string
  /** 每个字符间隔（ms） */
  speedMs?: number
  /** 开始前延迟（ms） */
  delayMs?: number
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function Typewriter({ text, start, className = '', speedMs = 26, delayMs = 0 }: Props) {
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const [shown, setShown] = useState(reduced ? text : '')

  useEffect(() => {
    if (!start) return
    if (reduced) {
      setShown(text)
      return
    }

    let i = 0
    setShown('')

    const startTimer = window.setTimeout(() => {
      const t = window.setInterval(() => {
        i += 1
        setShown(text.slice(0, i))
        if (i >= text.length) {
          window.clearInterval(t)
        }
      }, speedMs)
    }, delayMs)

    return () => window.clearTimeout(startTimer)
  }, [delayMs, reduced, speedMs, start, text])

  return (
    <div className={className} aria-label={text}>
      <span aria-hidden>{shown}</span>
      {!reduced && start && shown.length < text.length && (
        <span className="ml-[2px] inline-block w-[0.6ch] animate-blink align-baseline" aria-hidden>
          |
        </span>
      )}
    </div>
  )
}

