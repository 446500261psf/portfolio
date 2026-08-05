import { publicUrl } from '../publicUrl'

export type HealthCard = {
  id: string
  title: string
  /** 稿面导出的透视卡图（带 rotate/skew 使用） */
  warpedSrc: string
  /** 平面原图（切卡时备用） */
  flatSrc: string
}

const asset = (name: string) => publicUrl(`health-plus/${name}`)
const warped = (name: string) => publicUrl(`health-plus/warped/${name}`)

/** Figma「explore health+」五张手机屏，左 → 右 */
export const healthCards: HealthCard[] = [
  {
    id: 'smart-training',
    title: 'Smart Training Plan',
    warpedSrc: warped('w0-smart-training.png'),
    flatSrc: asset('card-smart-training.png'),
  },
  {
    id: 'my-plan',
    title: 'My plan',
    warpedSrc: warped('w1-my-plan.png'),
    flatSrc: asset('card-my-plan.png'),
  },
  {
    id: 'upper-body',
    title: 'Build · Upper Body',
    warpedSrc: warped('w2-upper-body.png'),
    flatSrc: asset('card-upper-body.png'),
  },
  {
    id: 'todays-analysis',
    title: "Today's analysis",
    warpedSrc: warped('w3-todays-analysis.png'),
    flatSrc: asset('card-todays-analysis.png'),
  },
  {
    id: 'sleep-music',
    title: 'Sleep Music',
    warpedSrc: warped('w4-sleep-music.png'),
    flatSrc: asset('card-sleep-music.png'),
  },
]

export const healthAssets = {
  logo: asset('logo.png'),
  underline: asset('underline.svg'),
  ticksLeft: asset('ticks-left.svg'),
  ticksRight: asset('ticks-right.svg'),
  figmaFrame: asset('figma-frame.png'),
}

/**
 * Figma 节点绝对 inset（相对 800×936 画布）+ rotate/skew。
 * 来源 get_design_context：image5→4→6→3→2（左→右）
 */
export type FigmaSlot = {
  top: number
  right: number
  bottom: number
  left: number
  rotate: number
  skewX: number
  opacity: number
  blur: number
  zIndex: number
}

export const FIGMA_SLOTS: FigmaSlot[] = [
  // image 5 — 最左（外侧淡+模糊）
  {
    top: 24.67,
    right: 61.36,
    bottom: 51.27,
    left: 27.07,
    rotate: 18,
    skewX: 18,
    opacity: 0.5,
    blur: 5,
    zIndex: 1,
  },
  // image 4
  {
    top: 24.25,
    right: 51.77,
    bottom: 51.82,
    left: 37,
    rotate: 18,
    skewX: 18,
    opacity: 0.95,
    blur: 0,
    zIndex: 2,
  },
  // image 6 — 中心
  {
    top: 24,
    right: 42.17,
    bottom: 52.45,
    left: 46.5,
    rotate: 19,
    skewX: 20,
    opacity: 1,
    blur: 0,
    zIndex: 5,
  },
  // image 3
  {
    top: 23.65,
    right: 33.38,
    bottom: 52.9,
    left: 55.78,
    rotate: 19,
    skewX: 19,
    opacity: 0.95,
    blur: 0,
    zIndex: 3,
  },
  // image 2 — 最右
  {
    top: 23.48,
    right: 26.94,
    bottom: 53.18,
    left: 62.14,
    rotate: 18,
    skewX: 18,
    opacity: 0.5,
    blur: 5,
    zIndex: 1,
  },
]
