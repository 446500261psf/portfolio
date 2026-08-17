import type { CaseParams } from '../shape/CaseParams'

/**
 * 整机佩戴参数（mm，场景内 1 单位 = 1mm）
 *
 * 坐标约定：表壳正面朝 +Z，长轴（12–6 点）沿 Y，表带在 YZ 平面内绕手腕，
 * 手臂轴沿 X。这与真实腕表一致：表带从长轴两端伸出，绕过手腕横截面。
 */
export interface WearableParams {
  /** 手腕横截面半宽（Y 向，即沿表壳长轴方向） */
  wristHalfY: number
  /** 手腕横截面半厚（Z 向，手背到手心） */
  wristHalfZ: number
  /** 手腕横截面超椭圆指数（2≈椭圆，越大越扁方） */
  wristN: number
  /** 表带宽度（X 向，横跨手腕） */
  strapWidth: number
  /** 表带厚度（贴腕方向） */
  strapThickness: number
  /** 表带在耳部相对中段的加宽比例 */
  lugFlare: number
  /** 连接结构（接口块）沿 Y 的伸出长度 */
  interfaceLength: number
  /** 是否显示手腕参考体 */
  showWrist: boolean
}

export const DEFAULT_WEARABLE: WearableParams = {
  wristHalfY: 27,
  wristHalfZ: 19,
  wristN: 2.6,
  strapWidth: 21,
  strapThickness: 2.6,
  lugFlare: 1.34,
  interfaceLength: 3.4,
  showWrist: true,
}

/**
 * 表壳压入软组织的比例 — 佩戴时表壳不是悬在皮肤上方，
 * 背面会陷进手腕一点，表带才拉得住。
 */
const PRESS_INTO_SKIN = 0.45

/** 手腕横截面中心的 Z 位置 */
export function wristCenterZ(caseParams: CaseParams, wear: WearableParams): number {
  return -(caseParams.c * (1 - PRESS_INTO_SKIN) + wear.wristHalfZ)
}

/** 表带离手腕表面的偏移（表带自身厚度的一半 + 贴合间隙） */
export function strapOffset(wear: WearableParams): number {
  return wear.strapThickness * 0.5 + 0.35
}

/** 整机包围盒最大半径 — 用于相机取景 */
export function wearableSpan(caseParams: CaseParams, wear: WearableParams): number {
  const zSpan = Math.abs(wristCenterZ(caseParams, wear)) + wear.wristHalfZ + wear.strapThickness
  return Math.max(caseParams.a, caseParams.b, wear.wristHalfY, zSpan * 0.62)
}
