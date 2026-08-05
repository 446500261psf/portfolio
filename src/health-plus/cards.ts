import { publicUrl } from '../publicUrl'

export type HealthCard = {
  id: string
  title: string
  src: string
}

const asset = (name: string) => publicUrl(`health-plus/${name}`)

/** Figma「explore health+」五张手机屏，左 → 右 */
export const healthCards: HealthCard[] = [
  {
    id: 'smart-training',
    title: 'Smart Training Plan',
    src: asset('card-smart-training.png'),
  },
  {
    id: 'my-plan',
    title: 'My plan',
    src: asset('card-my-plan.png'),
  },
  {
    id: 'upper-body',
    title: 'Build · Upper Body',
    src: asset('card-upper-body.png'),
  },
  {
    id: 'todays-analysis',
    title: "Today's analysis",
    src: asset('card-todays-analysis.png'),
  },
  {
    id: 'sleep-music',
    title: 'Sleep Music',
    src: asset('card-sleep-music.png'),
  },
]

export const healthAssets = {
  logo: asset('logo.png'),
  underline: asset('underline.svg'),
  ticksLeft: asset('ticks-left.svg'),
  ticksRight: asset('ticks-right.svg'),
}
