/** Figma 表盘 UI 状态（来自 sZDBW36idsJ7op8FVhYq6W） */
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
}

export const FIGMA_DIAL_STATES: FigmaDialState[] = [
  { id: 'steady', label: 'Steady', labelEn: 'Had a good sleep' },
  { id: 'gather', label: 'Gather', labelEn: 'Focus 20 more minutes' },
  { id: 'drift', label: 'Drift', labelEn: 'Rest within 30min' },
  { id: 'lift', label: 'Lift', labelEn: 'Start your priority task' },
  { id: 'grounded', label: 'Grounded', labelEn: 'Take one steady breath' },
  { id: 'low', label: 'Low', labelEn: 'Slow your breathing' },
]

export const DEFAULT_FIGMA_DIAL: FigmaDialId = 'steady'
