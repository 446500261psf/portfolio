import { useState } from 'react'
import { publicUrl } from '../publicUrl'

/**
 * ToggleDayCycle — 与 Figma `ToggleDayCycle`（150:32）一致。
 * 三种变体为互斥子树：各状态使用独立 phone 图 + icon 资源 + 滑块/图标几何（get_design_context）。
 */
type Phase = 'night' | 'noon' | 'morning'

const PHASES: Phase[] = ['night', 'noon', 'morning']

const PHONE: Record<Phase, string> = {
  night: publicUrl('figma/phone-night.png'),
  noon: publicUrl('figma/phone-noon.png'),
  morning: publicUrl('figma/phone-morning.png'),
}

const ICON_SRC: Record<Phase, string> = {
  night: publicUrl('figma/icon-night.svg'),
  noon: publicUrl('figma/icon-noon.svg'),
  morning: publicUrl('figma/icon-morning.svg'),
}

const PILL_BG: Record<Phase, string> = {
  night: '#6c5aa7',
  noon: '#78b478',
  morning: '#f0a564',
}

/** 滑块左边缘 x（Figma 绝对坐标） */
const KNOB_LEFT: Record<Phase, number> = {
  night: 403,
  noon: 465,
  morning: 527,
}

/** 滑块内图标位置与尺寸（Figma 各变体不同） */
const KNOB_ICON: Record<Phase, { left: number; top: number; w: number; h: number }> = {
  night: { left: 424, top: 568.5, w: 18, h: 18 },
  noon: { left: 485, top: 567.5, w: 20, h: 20 },
  morning: { left: 546, top: 569.5, w: 22, h: 16 },
}

const PILL = { left: 399, top: 558, w: 192, h: 39, r: 19.5 as const }
const KNOB = { w: 60, h: 31, top: 562, r: 15.5 as const }

export default function DayCycleToggle() {
  const [phase, setPhase] = useState<Phase>('night')

  const next = () =>
    setPhase(PHASES[(PHASES.indexOf(phase) + 1) % PHASES.length])

  const k = KNOB_LEFT[phase]
  const icon = KNOB_ICON[phase]

  return (
    <div style={{ position: 'relative', width: 591, height: 788, zIndex: 1 }}>
      <img
        key={phase}
        src={PHONE[phase]}
        alt=""
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 362,
          height: 788,
          objectFit: 'cover',
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'block',
        }}
        draggable={false}
        loading="eager"
        decoding="async"
        fetchPriority="low"
      />

      <button
        type="button"
        onClick={next}
        aria-label={`时段：${phase}，点击切换下一种`}
        style={{
          position: 'absolute',
          left: PILL.left,
          top: PILL.top,
          width: PILL.w,
          height: PILL.h,
          borderRadius: PILL.r,
          background: PILL_BG[phase],
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          transition: 'background 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: k,
          top: KNOB.top,
          width: KNOB.w,
          height: KNOB.h,
          borderRadius: KNOB.r,
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
          transition: 'left 0.55s cubic-bezier(0.65, 0, 0.35, 1)',
          pointerEvents: 'none',
        }}
      />

      <img
        key={`${phase}-icon`}
        src={ICON_SRC[phase]}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          left: icon.left,
          top: icon.top,
          width: icon.w,
          height: icon.h,
          pointerEvents: 'none',
          display: 'block',
          objectFit: 'contain',
          transition: 'left 0.55s cubic-bezier(0.65, 0, 0.35, 1), top 0.55s cubic-bezier(0.65, 0, 0.35, 1), width 0.35s ease, height 0.35s ease',
        }}
        draggable={false}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}
