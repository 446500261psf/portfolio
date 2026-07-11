/**
 * Figma 表盘 UI 状态（来自 sZDBW36idsJ7op8FVhYq6W · 页面「表盘」）
 *
 * 每个状态 = 鹅软石潭面 + 边缘光带（light band）。
 * frames 是从 Figma 逐帧导出的关键帧位图；动画即在关键帧间缓慢插值，
 * 并叠加 PRD 规定的呼吸 envelope（5–6bpm，亮度 ±5–8%）。
 */
export type FigmaDialId =
  | 'steady'
  | 'gather'
  | 'drift'
  | 'lift'
  | 'grounded'
  | 'low'

export interface FigmaDialState {
  id: FigmaDialId
  label: string
  labelEn: string
  /** 关键帧位图（public/dial/ 下的 Figma 导出） */
  frames: string[]
  /** 关键帧往返一个周期的时长（秒） */
  loopSec: number
  /** 呼吸节律 bpm（PRD §3.2） */
  breathBpm: number
  /** 呼吸亮度幅度 0–1 */
  breathAmount: number
}

const base = (name: string) => `dial/${name}.png`

export const FIGMA_DIAL_STATES: FigmaDialState[] = [
  {
    id: 'steady',
    label: 'Steady',
    labelEn: 'Had a good sleep',
    frames: [base('steady-0'), base('steady-1')],
    loopSec: 9,
    breathBpm: 5,
    breathAmount: 0.06,
  },
  {
    id: 'gather',
    label: 'Gather',
    labelEn: 'Focus 20 more minutes',
    frames: [base('gather-0')],
    loopSec: 7,
    breathBpm: 6,
    breathAmount: 0.1,
  },
  {
    id: 'drift',
    label: 'Drift',
    labelEn: 'Rest within 30min',
    frames: [base('drift-0')],
    loopSec: 11,
    breathBpm: 5,
    breathAmount: 0.08,
  },
  {
    id: 'lift',
    label: 'Lift',
    labelEn: 'Start your priority task',
    frames: [base('lift-0'), base('lift-1')],
    loopSec: 6,
    breathBpm: 7,
    breathAmount: 0.08,
  },
  {
    id: 'grounded',
    label: 'Grounded',
    labelEn: 'Take one steady breath',
    frames: [base('grounded-0'), base('grounded-1')],
    loopSec: 8,
    breathBpm: 6,
    breathAmount: 0.07,
  },
  {
    id: 'low',
    label: 'Low',
    labelEn: 'Slow your breathing',
    frames: [base('low-0'), base('low-1')],
    loopSec: 10,
    breathBpm: 4,
    breathAmount: 0.12,
  },
]

export const DIAL_STATE_MAP: Record<FigmaDialId, FigmaDialState> = Object.fromEntries(
  FIGMA_DIAL_STATES.map((s) => [s.id, s]),
) as Record<FigmaDialId, FigmaDialState>

export const DEFAULT_FIGMA_DIAL: FigmaDialId = 'steady'

/** 状态切换渡越时长（PRD：色场渐变 ≥800ms，禁止 ≤500ms 突变） */
export const DIAL_CROSSING_MS = 900
