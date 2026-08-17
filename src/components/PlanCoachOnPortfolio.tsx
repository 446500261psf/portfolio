import { useEffect, useRef, useState, type ReactNode } from 'react'
import { publicUrl } from '../publicUrl'
import { planCoachCopy, PLAN_COACH_HREF } from '../plan-coach/copy'

const CHAPTER_Y = 16063
const CHAPTER_H = 472
const CASE_Y = CHAPTER_Y + CHAPTER_H
const CASE_H = 1200

function RevealBlock({
  y,
  h,
  name,
  className,
  children,
}: {
  y: number
  h: number
  name: string
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [revealing, setRevealing] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealing(true)
            setActive(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`strip${active ? ' is-active' : ''}${revealing ? ' is-revealing' : ''}${className ? ` ${className}` : ''}`}
      style={{ top: y, width: 1440, height: h }}
      data-name={name}
      onTransitionEnd={() => setRevealing(false)}
    >
      {children}
    </div>
  )
}

/** Fourth row on the baked Projects PNG — measured from `projects.png` @2x. */
export function PlanCoachProjectsLink() {
  return (
    <a
      className="overlay pc-projects-link"
      href={publicUrl(PLAN_COACH_HREF)}
      style={{ left: 148, top: 922 + 878, width: 720, height: 96 }}
      aria-label="Open Plan Coach case"
    >
      <span className="pc-projects-link__title">{planCoachCopy.listTitle}</span>
      <span className="pc-projects-link__sub">{planCoachCopy.listSubtitle}</span>
    </a>
  )
}

export function PlanCoachChapter() {
  return (
    <>
      <RevealBlock y={CHAPTER_Y} h={CHAPTER_H} name="chapter04" className="pc-chapter">
        <p id="plan-coach">{planCoachCopy.chapter}</p>
      </RevealBlock>
      <RevealBlock y={CASE_Y} h={CASE_H} name="case04" className="pc-case">
        <div className="pc-case__inner">
          <p className="pc-case__kicker">{planCoachCopy.kicker}</p>
          <h2 className="pc-case__headline">{planCoachCopy.headline}</h2>
          <p className="pc-case__lede">{planCoachCopy.lede}</p>
          <dl className="pc-case__dl">
            <div>
              <dt>Goal</dt>
              <dd>{planCoachCopy.goal}</dd>
            </div>
            <div>
              <dt>Action</dt>
              <dd>{planCoachCopy.action}</dd>
            </div>
            <div>
              <dt>Result</dt>
              <dd>{planCoachCopy.result}</dd>
            </div>
          </dl>
          <a className="pc-case__cta" href={publicUrl(PLAN_COACH_HREF)}>
            Open live prototype
          </a>
          <p className="pc-case__path">{planCoachCopy.demoPath}</p>
        </div>
      </RevealBlock>
    </>
  )
}
