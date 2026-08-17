/** 超椭圆轮廓点集（数学坐标，Y 向上） */

export interface Point2 {
  x: number
  y: number
}

export function superellipsePoints(
  semiA: number,
  semiB: number,
  n: number,
  segments = 160,
): Point2[] {
  const pts: Point2[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const cos = Math.cos(t)
    const sin = Math.sin(t)
    pts.push({
      x: semiA * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n),
      y: semiB * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n),
    })
  }
  return pts
}

/** SVG path，Y 轴翻转以匹配屏幕 */
export function pointsToSvgPath(points: Point2[]): string {
  if (points.length === 0) return ''
  return (
    points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(3)} ${(-p.y).toFixed(3)}`)
      .join(' ') + ' Z'
  )
}

/** 超椭球三视图轮廓（正交投影外轮廓） */
export interface OutlineViews {
  /** 正视图 XY：|x/a|^n + |y/b|^n = 1 */
  front: Point2[]
  /** 侧视图 YZ：|y/b|^n + |z/c|^n = 1 */
  side: Point2[]
  /** 俯视图 XZ：|x/a|^n + |z/c|^n = 1 */
  top: Point2[]
}

export function buildOutlineViews(
  a: number,
  b: number,
  c: number,
  n: number,
): OutlineViews {
  return {
    front: superellipsePoints(a, b, n),
    side: superellipsePoints(b, c, n),
    top: superellipsePoints(a, c, n),
  }
}

export function pathLength(points: Point2[]): number {
  let len = 0
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
  }
  return len
}
