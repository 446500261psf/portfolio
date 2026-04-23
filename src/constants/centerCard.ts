/** 单列布局：与 CardStage 中央手机卡同宽 */
export const CENTER_CARD_SHELL_CLASS = 'w-[min(62vw,280px)] sm:w-[min(58vw,300px)]'

/** 三列同行：每列等分宽度，可收缩避免挤出换行 */
export const COVER_COLUMN_ROW_CLASS = 'min-w-0 flex-1 basis-0'

/**
 * 三列 Cover Flow 手机卡：更小 + 随视口变化
 * clamp(最小, 首选 vw, 最大) 保证窄屏也有下限、大屏不会过大
 */
export const COVER_FLOW_CARD_CLASS =
  'w-[clamp(88px,14vw,138px)] sm:w-[clamp(96px,13vw,148px)] lg:w-[clamp(100px,11.5vw,158px)]'
