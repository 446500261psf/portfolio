import { type CSSProperties, type ReactNode, useCallback, useId, useState } from 'react'

export type FlipAxis = 'x' | 'y'
export type FlipMode = 'opacity' | 'backface'

const SPRING_MS = 600
const SPRING_EASE = 'cubic-bezier(0.34, 1.15, 0.64, 1)'

type Props = {
  front: ReactNode
  back: ReactNode
  /** 受控模式；不传则内部 toggle */
  flipped?: boolean
  onFlipChange?: (flipped: boolean) => void
  axis?: FlipAxis
  mode?: FlipMode
  className?: string
  /** 卡片容器尺寸类名 */
  shellClassName?: string
  disabled?: boolean
  ariaLabel?: string
}

export function FlipCard({
  front,
  back,
  flipped: flippedProp,
  onFlipChange,
  axis = 'y',
  mode = 'opacity',
  className = '',
  shellClassName = 'aspect-[3/4] w-[min(100%,300px)]',
  disabled = false,
  ariaLabel = 'Flip card',
}: Props) {
  const [internalFlipped, setInternalFlipped] = useState(false)
  const flipped = flippedProp ?? internalFlipped
  const labelId = useId()

  const toggle = useCallback(() => {
    if (disabled) return
    const next = !flipped
    if (flippedProp === undefined) setInternalFlipped(next)
    onFlipChange?.(next)
  }, [disabled, flipped, flippedProp, onFlipChange])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  const rotate = flipped ? 180 : 0
  const rotateProp = axis === 'y' ? 'rotateY' : 'rotateX'

  const innerStyle: CSSProperties = {
    transform: `${rotateProp}(${rotate}deg)`,
    transformStyle: 'preserve-3d',
    transition: `transform ${SPRING_MS}ms ${SPRING_EASE}`,
  }

  const faceBase = 'absolute inset-0 overflow-hidden rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.45)]'

  const frontStyle: CSSProperties =
    mode === 'backface'
      ? { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }
      : {
          opacity: flipped ? 0 : 1,
          transition: `opacity ${SPRING_MS}ms ${SPRING_EASE}`,
        }

  const backStyle: CSSProperties =
    mode === 'backface'
      ? {
          transform: `${rotateProp}(180deg)`,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }
      : {
          opacity: flipped ? 1 : 0,
          transition: `opacity ${SPRING_MS}ms ${SPRING_EASE}`,
        }

  return (
    <div className={`inline-block ${className}`} style={{ perspective: '1200px' }}>
      <button
        type="button"
        className={`relative block cursor-pointer border-0 bg-transparent p-0 text-left ${shellClassName} ${
          disabled ? 'cursor-default opacity-60' : 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70'
        }`}
        onClick={toggle}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-pressed={flipped}
        aria-labelledby={labelId}
        aria-label={ariaLabel}
      >
        <span id={labelId} className="sr-only">
          {ariaLabel}. {flipped ? 'Showing back.' : 'Showing front.'}
        </span>
        <div className="relative h-full w-full" style={innerStyle}>
          <div className={faceBase} style={frontStyle}>
            {front}
          </div>
          <div className={faceBase} style={backStyle}>
            {back}
          </div>
        </div>
      </button>
    </div>
  )
}

/** 演示用：同一页面展示多种 flip 变体 */
export function FlipCardShowcase() {
  const sampleFront = (
    <div className="flex h-full w-full items-end bg-gradient-to-br from-[#4a1010] via-[#8b1a1a] to-[#1a0505] p-5">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">Front</span>
    </div>
  )
  const sampleBack = (
    <div className="flex h-full w-full flex-col justify-end gap-2 bg-gradient-to-br from-[#1a2030] via-[#2a3548] to-[#0d1018] p-5">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">Back</span>
      <p className="text-sm leading-snug text-white/85">Goal · Action · Result</p>
    </div>
  )

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <FlipCard front={sampleFront} back={sampleBack} axis="y" mode="opacity" ariaLabel="Y-axis opacity flip" />
        <span className="text-xs text-white/50">Y · opacity（SwiftUI 同款）</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FlipCard front={sampleFront} back={sampleBack} axis="y" mode="backface" ariaLabel="Y-axis backface flip" />
        <span className="text-xs text-white/50">Y · backface</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FlipCard front={sampleFront} back={sampleBack} axis="x" mode="backface" ariaLabel="X-axis backface flip" />
        <span className="text-xs text-white/50">X · backface</span>
      </div>
    </div>
  )
}
