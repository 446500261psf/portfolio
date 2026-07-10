import { useMemo } from 'react'
import type { CaseParams } from './CaseParams'
import { buildOutlineViews, pointsToSvgPath } from './outlinePaths'

interface ThreeViewSheetProps {
  params: CaseParams
}

const SCALE = 5.5

function toSvg(x: number, y: number, cx: number, cy: number) {
  return { x: cx + x * SCALE, y: cy - y * SCALE }
}

function Grid({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  const lines: React.ReactNode[] = []
  const step = 10 * SCALE
  for (let x = cx - rx; x <= cx + rx; x += step) {
    lines.push(
      <line key={`v${x}`} x1={x} y1={cy - ry} x2={x} y2={cy + ry} stroke="#d0d0d8" strokeWidth={0.5} />,
    )
  }
  for (let y = cy - ry; y <= cy + ry; y += step) {
    lines.push(
      <line key={`h${y}`} x1={cx - rx} y1={y} x2={cx + rx} y2={y} stroke="#d0d0d8" strokeWidth={0.5} />,
    )
  }
  return <g>{lines}</g>
}

function AxisCross({ cx, cy, labelH, labelV }: { cx: number; cy: number; labelH: string; labelV: string }) {
  return (
    <g opacity={0.55}>
      <line x1={cx - 120} y1={cy} x2={cx + 120} y2={cy} stroke="#999" strokeWidth={0.75} strokeDasharray="4 3" />
      <line x1={cx} y1={cy - 120} x2={cx} y2={cy + 120} stroke="#999" strokeWidth={0.75} strokeDasharray="4 3" />
      <text x={cx + 125} y={cy + 4} fill="#777" fontSize={11}>{labelH}</text>
      <text x={cx + 4} y={cy - 125} fill="#777" fontSize={11}>{labelV}</text>
    </g>
  )
}

function ViewContour({
  cx,
  cy,
  pathD,
  title,
  sub,
  axisH,
  axisV,
}: {
  cx: number
  cy: number
  pathD: string
  title: string
  sub: string
  axisH: string
  axisV: string
}) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <Grid cx={0} cy={0} rx={130} ry={130} />
      <AxisCross cx={0} cy={0} labelH={axisH} labelV={axisV} />
      <path
        d={pathD}
        fill="rgba(154,154,162,0.12)"
        stroke="#2a2a32"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <circle cx={0} cy={0} r={2.5} fill="#3d6a8c" />
      <text x={-125} y={-145} fill="#444" fontSize={13} fontWeight={600}>{title}</text>
      <text x={-125} y={-128} fill="#777" fontSize={10}>{sub}</text>
    </g>
  )
}

function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
  offset = 0,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  label: string
  offset?: number
}) {
  const horizontal = Math.abs(y2 - y1) < 1
  const oy = horizontal ? offset : 0
  const ox = horizontal ? 0 : offset
  return (
    <g>
      <line x1={x1 + ox} y1={y1 + oy} x2={x2 + ox} y2={y2 + oy} stroke="#3d6a8c" strokeWidth={1} />
      <line x1={x1 + ox} y1={y1 + oy - 4} x2={x1 + ox} y2={y1 + oy + 4} stroke="#3d6a8c" strokeWidth={1} />
      <line x1={x2 + ox} y1={y2 + oy - 4} x2={x2 + ox} y2={y2 + oy + 4} stroke="#3d6a8c" strokeWidth={1} />
      <text x={(x1 + x2) / 2 + ox} y={(y1 + y2) / 2 + oy + (horizontal ? 14 : -6)} fill="#3d6a8c" fontSize={10} textAnchor="middle">
        {label}
      </text>
    </g>
  )
}

export function ThreeViewSheet({ params }: ThreeViewSheetProps) {
  const { a, b, c, n } = params
  const views = useMemo(() => buildOutlineViews(a, b, c, n), [a, b, c, n])

  const frontPath = pointsToSvgPath(views.front)
  const sidePath = pointsToSvgPath(views.side)
  const topPath = pointsToSvgPath(views.top)

  const frontCx = 240
  const frontCy = 340
  const topCx = 240
  const topCy = 130
  const sideCx = 520
  const sideCy = 340

  const fLeft = toSvg(-a, 0, frontCx, frontCy)
  const fRight = toSvg(a, 0, frontCx, frontCy)
  const fTop = toSvg(0, b, frontCx, frontCy)
  const fBottom = toSvg(0, -b, frontCx, frontCy)

  const tLeft = toSvg(-a, 0, topCx, topCy)
  const tRight = toSvg(a, 0, topCx, topCy)
  const tTop = toSvg(0, c, topCx, topCy)
  const tBottom = toSvg(0, -c, topCx, topCy)

  const sLeft = toSvg(-b, 0, sideCx, sideCy)
  const sRight = toSvg(b, 0, sideCx, sideCy)
  const sTop = toSvg(0, c, sideCx, sideCy)
  const sBottom = toSvg(0, -c, sideCx, sideCy)

  return (
    <div className="three-view-sheet-wrap">
      <svg
        className="three-view-sheet"
        viewBox="0 0 760 520"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="超椭圆表盘三视图轮廓"
      >
        <rect width="100%" height="100%" fill="#e8e8ec" />

        {/* 投影对齐线 */}
        <g stroke="#b0b0bc" strokeWidth={0.75} strokeDasharray="6 4" opacity={0.7}>
          <line x1={fLeft.x} y1={fTop.y} x2={tLeft.x} y2={tTop.y} />
          <line x1={fRight.x} y1={fTop.y} x2={tRight.x} y2={tTop.y} />
          <line x1={fLeft.x} y1={fBottom.y} x2={tLeft.x} y2={tBottom.y} />
          <line x1={fRight.x} y1={fBottom.y} x2={tRight.x} y2={tBottom.y} />
          <line x1={fRight.x} y1={fTop.y} x2={sLeft.x} y2={sTop.y} />
          <line x1={fRight.x} y1={fBottom.y} x2={sLeft.x} y2={sBottom.y} />
          <line x1={tRight.x} y1={tTop.y} x2={sTop.x} y2={sTop.y} />
          <line x1={tRight.x} y1={tBottom.y} x2={sBottom.x} y2={sBottom.y} />
        </g>

        <ViewContour
          cx={frontCx}
          cy={frontCy}
          pathD={frontPath}
          title="正视图 Front"
          sub={`XY · |x/${a.toFixed(1)}|^${n} + |y/${b.toFixed(1)}|^${n} = 1`}
          axisH="X"
          axisV="Y"
        />
        <ViewContour
          cx={topCx}
          cy={topCy}
          pathD={topPath}
          title="俯视图 Top"
          sub={`XZ · 宽 ${(a * 2).toFixed(1)} × 厚 ${(c * 2).toFixed(1)} mm`}
          axisH="X"
          axisV="Z"
        />
        <ViewContour
          cx={sideCx}
          cy={sideCy}
          pathD={sidePath}
          title="侧视图 Side"
          sub={`YZ · 高 ${(b * 2).toFixed(1)} × 厚 ${(c * 2).toFixed(1)} mm`}
          axisH="Y"
          axisV="Z"
        />

        {/* 尺寸标注 */}
        <DimLine x1={fLeft.x} y1={fBottom.y} x2={fRight.x} y2={fBottom.y} label={`${(a * 2).toFixed(1)} mm`} offset={22} />
        <DimLine x1={fLeft.x} y1={fTop.y} x2={fLeft.x} y2={fBottom.y} label={`${(b * 2).toFixed(1)} mm`} offset={-22} />
        <DimLine x1={tLeft.x} y1={tBottom.y} x2={tRight.x} y2={tBottom.y} label={`${(a * 2).toFixed(1)} mm`} offset={18} />
        <DimLine x1={sLeft.x} y1={sBottom.y} x2={sRight.x} y2={sBottom.y} label={`${(b * 2).toFixed(1)} mm`} offset={22} />
        <DimLine x1={sRight.x} y1={sTop.y} x2={sRight.x} y2={sBottom.y} label={`${(c * 2).toFixed(1)} mm`} offset={18} />

        <text x={20} y={500} fill="#888" fontSize={10}>
          第一角投影 · 超椭圆指数 n={n.toFixed(1)} · 轮廓为超椭球正交外轮廓 · 1 单位 = 1 mm
        </text>
      </svg>
    </div>
  )
}
