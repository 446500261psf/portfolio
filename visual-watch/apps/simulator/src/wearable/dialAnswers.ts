import type { FigmaDialId } from '../dial/figmaDialStates'

/**
 * 精确答案层内容（PRD「腕上无文字」的例外）
 *
 * 稳态只有场，没有文字。只有在**明确指令**（轻触表盘）之后，
 * 才短暂给出一个结论 + 一个数字；不展示指标矩阵，不解释过程。
 */
export interface DialAnswer {
  /** 主答案：一个数字或一个时间 */
  primary: string
  /** 一行结论，全大写、字距拉开 */
  secondary: string
}

export const DIAL_ANSWERS: Record<FigmaDialId, DialAnswer> = {
  steady: { primary: '7h20', secondary: 'SLEEP · RECOVERED' },
  gather: { primary: '20 min', secondary: 'FOCUS LEFT' },
  drift: { primary: '30 min', secondary: 'REST WINDOW' },
  lift: { primary: '09:00', secondary: 'PRIORITY TASK' },
  grounded: { primary: '1 breath', secondary: 'STEADY NOW' },
  low: { primary: '4 bpm', secondary: 'SLOW BREATHING' },
}

/** 精确答案在腕上停留的时长 — 看完即走，不驻留 */
export const ANSWER_HOLD_MS = 2400
