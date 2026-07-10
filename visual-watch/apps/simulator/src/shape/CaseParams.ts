/** 表壳外形参数（单位：mm，场景内 1 单位 = 1mm） */
export interface CaseParams {
  /** 正面半宽 */
  a: number
  /** 正面半高 */
  b: number
  /** 半厚度（侧面扁度） */
  c: number
  /** 超椭圆指数 n：2≈椭圆，4–5≈近圆角方，越大角越「平」 */
  n: number
}

export const DEFAULT_CASE: CaseParams = {
  a: 17,
  b: 18.5,
  c: 5,
  n: 4.5,
}

export function caseFromSliders(input: {
  widthMm: number
  heightMm: number
  thicknessMm: number
  n: number
}): CaseParams {
  return {
    a: input.widthMm / 2,
    b: input.heightMm / 2,
    c: input.thicknessMm / 2,
    n: input.n,
  }
}

export function frontAspect(params: CaseParams): number {
  return params.b / params.a
}

export function sideFlatness(params: CaseParams): number {
  return params.c / Math.max(params.a, params.b)
}
