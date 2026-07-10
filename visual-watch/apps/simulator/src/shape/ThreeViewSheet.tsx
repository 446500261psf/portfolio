import { useMemo } from 'react'
import type { CaseParams } from './CaseParams'
import { buildOutlineViews, pointsToSvgPath } from './outlinePaths'
import { DRAW } from './drawingTheme'

interface ThreeViewSheetProps {
  params: CaseParams
}

const SCALE = 5.5

function toSvg(x: number, y: number, cx: number, cy: number) {
  return { x: cx + x * SCALE, y: cy - y * SCALE }
}

function Grid({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  const lines: React.ReactNode[] = []
  const step = 5 * SCALE
  const major = 10 * SCALE
  for (let x = cx - rx; x <= cx + rx; x += step) {
    const isMajor = Math.abs((x - cx) % major) < step * 0.5
    lines.push(
      <line
        key={`v${x}`}
        x1={x}
        y1={cy - ry}
        x2={x}
        y2={cy + ry}
        stroke={isMajor ? DRAW.gridMajor : DRAW.grid}
        strokeWidth={isMajor ? 0.6 : 0.35}
      />,
    )
  }
  for (let y = cy - ry; y <= cy + ry; y += step) {
    const isMajor = Math.abs((y - cy) % major) < step * 0.5
    lines.push(
      <line
        key={`h${y}`}
        x1={cx - rx}
        y1={y}
        x2={cx + rx}
        y2={y}
        stroke={isMajor ? DRAW.gridMajor : DRAW.grid}
        strokeWidth={isMajor ? 0.6 : 0.35}
      />,
    )
  }
  return <g>{lines}</g>
}

function CenterMark({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g stroke={DRAW.center} strokeWidth={0.75} fill="none">
      <circle cx={cx} cy={cy} r={3.5} />
      <line x1={cx - 14} y1={cy} x2={cx + 14} y2={cy} />
      <line x1={cx} y1={cy - 14} x2={cx} y2={cy + 14} />
    </g>
  )
}

function AxisCross({
  cx,
  cy,
  labelH,
  labelV,
}: {
  cx: number
  cy: number
  labelH: string
  labelV: string
}) {
  return (
    <g>
      <line
        x1={cx - 120}
        y1={cy}
        x2={cx + 120}
        y2={cy}
        stroke={DRAW.axis}
        strokeWidth={0.5}
        strokeDasharray="12 3 2 3"
      />
      <line
        x1={cx}
        y1={cy - 120}
        x2={cx}
        y2={cy + 120}
        stroke={DRAW.axis}
        strokeWidth={0.5}
        strokeDasharray="12 3 2 3"
      />
      <text
        x={cx + 124}
        y={cy + 3}
        fill={DRAW.labelMuted}
        fontSize={9}
        fontFamily="var(--font-mono)"
        letterSpacing="0.08em"
      >
        {labelH}
      </text>
      <text
        x={cx + 4}
        y={cy - 122}
        fill={DRAW.labelMuted}
        fontSize={9}
        fontFamily="var(--font-mono)"
        letterSpacing="0.08em"
      >
        {labelV}
      </text>
    </g>
  )
}

function ViewFrame({ cx, cy, w, h }: { cx: number; cy: number; w: number; h: number }) {
  return (
    <rect
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      fill="none"
      stroke={DRAW.frame}
      strokeWidth={0.75}
    />
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
      <ViewFrame cx={0} cy={0} w={270} h={270} />
      <Grid cx={0} cy={0} rx={130} ry={130} />
      <AxisCross cx={0} cy={0} labelH={axisH} labelV={axisV} />
      <path
        d={pathD}
        fill={DRAW.fill}
        stroke={DRAW.line}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <CenterMark cx={0} cy={0} />
      <text
        x={-128}
        y={-148}
        fill={DRAW.label}
        fontSize={11}
        fontWeight={500}
        letterSpacing="0.14em"
        fontFamily="var(--font-ui)"
      >
        {title.toUpperCase()}
      </text>
      <text
        x={-128}
        y={-132}
        fill={DRAW.labelMuted}
        fontSize={8.5}
        fontFamily="var(--font-mono)"
        letterSpacing="0.04em"
      >
        {sub}
      </text>
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
  const stroke = DRAW.lineDim

  const arrow = (ax: number, ay: number, dir: 'l' | 'r' | 'u' | 'd') => {
    const s = 4
    const pts =
      dir === 'l'
        ? `${ax},${ay} ${ax + s},${ay - s} ${ax + s},${ay + s}`
        : dir === 'r'
          ? `${ax},${ay} ${ax - s},${ay - s} ${ax - s},${ay + s}`
          : dir === 'u'
            ? `${ax},${ay} ${ax - s},${ay + s} ${ax + s},${ay + s}`
            : `${ax},${ay} ${ax - s},${ay - s} ${ax + s},${ay - s}`
    return <polygon points={pts} fill={stroke} />
  }

  return (
    <g>
      <line
        x1={x1 + ox}
        y1={y1 + oy}
        x2={x2 + ox}
        y2={y2 + oy}
        stroke={stroke}
        strokeWidth={0.75}
      />
      {horizontal ? (
        <>
          <line x1={x1 + ox} y1={y1 + oy - 5} x2={x1 + ox} y2={y1 + oy + 5} stroke={stroke} strokeWidth={0.75} />
          <line x1={x2 + ox} y1={y2 + oy - 5} x2={x2 + ox} y2={y2 + oy + 5} stroke={stroke} strokeWidth={0.75} />
          {arrow(x1 + ox, y1 + oy, 'l')}
          {arrow(x2 + ox, y2 + oy, 'r')}
        </>
      ) : (
        <>
          <line x1={x1 + ox - 5} y1={y1 + oy} x2={x1 + ox + 5} y2={y1 + oy} stroke={stroke} strokeWidth={0.75} />
          <line x1={x2 + ox - 5} y1={y2 + oy} x2={x2 + ox + 5} y2={y2 + oy} stroke={stroke} strokeWidth={0.75} />
          {arrow(x1 + ox, y1 + oy, 'u')}
          {arrow(x2 + ox, y2 + oy, 'd')}
        </>
      )}
      <text
        x={(x1 + x2) / 2 + ox}
        y={(y1 + y2) / 2 + oy + (horizontal ? 15 : -7)}
        fill={DRAW.accent}
        fontSize={9}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        letterSpacing="0.06em"
      >
        {label}
      </text>
    </g>
  )
}

export function ThreeViewSheet({ params }: ThreeViewSheetProps) {
  const { a, b, c, n } = params
  const views = useMemo(() => buildOutlineViews(a, b, c, n), [a, b, c, n])

  const frontPath = pointsToSvgPath(views.front, SCALE)
  const sidePath = pointsToSvgPath(views.side, SCALE)
  const topPath = pointsToSvgPath(views.top, SCALE)

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
        <rect width="100%" height="100%" fill={DRAW.sheet} />

        <g stroke={DRAW.projection} strokeWidth={0.5} strokeDasharray="8 5 2 5">
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
          sub={`XY  |x/${a.toFixed(1)}|^${n} + |y/${b.toFixed(1)}|^${n} = 1`}
          axisH="X"
          axisV="Y"
        />
        <ViewContour
          cx={topCx}
          cy={topCy}
          pathD={topPath}
          title="俯视图 Top"
          sub={`XZ  ${(a * 2).toFixed(1)} × ${(c * 2).toFixed(1)} mm`}
          axisH="X"
          axisV="Z"
        />
        <ViewContour
          cx={sideCx}
          cy={sideCy}
          pathD={sidePath}
          title="侧视图 Side"
          sub={`YZ  ${(b * 2).toFixed(1)} × ${(c * 2).toFixed(1)} mm`}
          axisH="Y"
          axisV="Z"
        />

        <DimLine x1={fLeft.x} y1={fBottom.y} x2={fRight.x} y2={fBottom.y} label={`${(a * 2).toFixed(1)}`} offset={24} />
        <DimLine x1={fLeft.x} y1={fTop.y} x2={fLeft.x} y2={fBottom.y} label={`${(b * 2).toFixed(1)}`} offset={-24} />
        <DimLine x1={tLeft.x} y1={tBottom.y} x2={tRight.x} y2={tBottom.y} label={`${(a * 2).toFixed(1)}`} offset={20} />
        <DimLine x1={sLeft.x} y1={sBottom.y} x2={sRight.x} y2={sBottom.y} label={`${(b * 2).toFixed(1)}`} offset={24} />
        <DimLine x1={sRight.x} y1={sTop.y} x2={sRight.x} y2={sBottom.y} label={`${(c * 2).toFixed(1)}`} offset={20} />

        <g fontFamily="var(--font-mono)" fontSize={8} fill={DRAW.labelMuted} letterSpacing="0.06em">
          <text x={20} y={498}>
            TECHNISCHE ZEICHNUNG · ERSTE WINKEL · n={n.toFixed(1)} · MASSSTAB 1:1 mm
          </text>
          <text x={620} y={498} textAnchor="end" fill={DRAW.accent}>
            COVE
          </text>
        </g>
      </svg>
    </div>
  )
}
