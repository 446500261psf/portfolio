import { useMemo } from 'react'
import { ASPECT_RATIO, SUPERELLIPSE_N } from '../cove-field/types'
import { superellipsePath, createBounds } from '../cove-field/superellipse'

interface PebbleShellProps {
  displayWidth: number
  children: React.ReactNode
}

export function PebbleShell({ displayWidth, children }: PebbleShellProps) {
  const displayHeight = Math.round(displayWidth * ASPECT_RATIO)
  const shellPad = Math.round(displayWidth * 0.09)
  const shellWidth = displayWidth + shellPad * 2
  const shellHeight = displayHeight + shellPad * 2

  const outerBounds = useMemo(
    () => createBounds(shellWidth, shellHeight, 0),
    [shellWidth, shellHeight],
  )
  const innerBounds = useMemo(
    () =>
      createBounds(displayWidth, displayHeight, displayWidth * 0.04),
    [displayWidth, displayHeight],
  )

  const outerPath = useMemo(
    () => superellipsePath(outerBounds, 160),
    [outerBounds],
  )
  const innerPath = useMemo(
    () => superellipsePath(innerBounds, 128),
    [innerBounds],
  )

  const clipOuter = 'pebble-outer-clip'
  const clipInner = 'pebble-inner-clip'

  return (
    <div className="pebble-stage">
      <svg
        className="pebble-svg"
        width={shellWidth}
        height={shellHeight}
        viewBox={`0 0 ${shellWidth} ${shellHeight}`}
        aria-label="Cove Watch 鹅软石表体"
      >
        <defs>
          <clipPath id={clipOuter}>
            <path d={outerPath} />
          </clipPath>
          <clipPath id={clipInner}>
            <path d={innerPath} transform={`translate(${shellPad}, ${shellPad})`} />
          </clipPath>
          <radialGradient id="pebble-body-grad" cx="42%" cy="38%" r="68%">
            <stop offset="0%" stopColor="#5a5a62" />
            <stop offset="55%" stopColor="#3a3a42" />
            <stop offset="100%" stopColor="#222228" />
          </radialGradient>
          <linearGradient id="pebble-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </linearGradient>
          <filter id="pebble-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#pebble-shadow)">
          <g clipPath={`url(#${clipOuter})`}>
            <rect
              width={shellWidth}
              height={shellHeight}
              fill="url(#pebble-body-grad)"
            />
            <path d={outerPath} fill="url(#pebble-rim)" opacity="0.85" />

            <foreignObject
              x={shellPad}
              y={shellPad}
              width={displayWidth}
              height={displayHeight}
            >
              <div
                className="display-well-inner"
                style={{ width: displayWidth, height: displayHeight }}
              >
                {children}
              </div>
            </foreignObject>

            <path
              d={innerPath}
              transform={`translate(${shellPad}, ${shellPad})`}
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.5"
            />
            <path
              d={innerPath}
              transform={`translate(${shellPad}, ${shellPad})`}
              fill="none"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="2.5"
              opacity="0.6"
            />
          </g>
        </g>

        <rect
          x={shellWidth * 0.88}
          y={shellHeight * 0.38}
          width={shellWidth * 0.045}
          height={shellHeight * 0.12}
          rx={3}
          fill="#2e2e34"
          stroke="rgba(255,255,255,0.08)"
        />
      </svg>

      <p className="pebble-spec" aria-hidden="true">
        超椭圆 n={SUPERELLIPSE_N} · 长宽比 {ASPECT_RATIO.toFixed(2)}:1
      </p>
    </div>
  )
}

export { ASPECT_RATIO }
