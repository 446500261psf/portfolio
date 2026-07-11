import type { FigmaDialId } from './figmaDialStates'
import { clipCanvasToSuperellipse, createBounds, superellipsePath } from '../cove-field/superellipse'

const N = 4.5
const ASPECT = 1.156

/** 在方形画布上绘制 Figma 表盘 UI（972×972 设计稿比例） */
export function renderFigmaDial(
  ctx: CanvasRenderingContext2D,
  size: number,
  dialId: FigmaDialId,
) {
  const bounds = createBounds(size, size, size * 0.04)
  bounds.n = N
  bounds.a = (size / 2) * 0.84
  bounds.b = bounds.a * ASPECT

  ctx.clearRect(0, 0, size, size)
  ctx.save()
  clipCanvasToSuperellipse(ctx, bounds)

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, size, size)

  switch (dialId) {
    case 'steady':
      drawSteadyLight(ctx, size, bounds)
      break
    case 'gather':
      drawGatherLight(ctx, size, bounds)
      break
    case 'drift':
      drawDriftLight(ctx, size, bounds)
      break
    case 'lift':
      drawLiftLight(ctx, size, bounds)
      break
    case 'grounded':
      drawGroundedLight(ctx, size, bounds)
      break
    case 'low':
      drawLowLight(ctx, size, bounds)
      break
  }

  ctx.restore()
  drawBasinRim(ctx, bounds)
}

function drawSteadyLight(
  ctx: CanvasRenderingContext2D,
  size: number,
  bounds: ReturnType<typeof createBounds>,
) {
  ctx.save()
  ctx.filter = 'blur(18px)'
  const g = ctx.createLinearGradient(size * 0.42, 0, size * 0.98, 0)
  g.addColorStop(0, '#3b3b3b')
  g.addColorStop(0.45, '#8a8a8a')
  g.addColorStop(1, '#ffffff')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(bounds.cx + bounds.a * 0.05, bounds.cy - bounds.b)
  ctx.lineTo(bounds.cx + bounds.a, bounds.cy - bounds.b)
  ctx.lineTo(bounds.cx + bounds.a, bounds.cy + bounds.b)
  ctx.lineTo(bounds.cx + bounds.a * 0.05, bounds.cy + bounds.b)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawGatherLight(
  ctx: CanvasRenderingContext2D,
  size: number,
  bounds: ReturnType<typeof createBounds>,
) {
  ctx.save()
  ctx.filter = 'blur(14px)'
  const g1 = ctx.createLinearGradient(size * 0.72, 0, size, 0)
  g1.addColorStop(0, 'rgba(255,255,255,0)')
  g1.addColorStop(0.35, '#6a6a6a')
  g1.addColorStop(1, '#ffffff')
  ctx.fillStyle = g1
  ctx.fillRect(bounds.cx + bounds.a * 0.35, bounds.cy - bounds.b * 0.72, bounds.a * 0.55, bounds.b * 1.44)

  ctx.globalCompositeOperation = 'lighter'
  ctx.filter = 'blur(10px)'
  const g2 = ctx.createLinearGradient(size * 0.78, 0, size, 0)
  g2.addColorStop(0, 'rgba(255,255,255,0)')
  g2.addColorStop(1, '#ffffff')
  ctx.fillStyle = g2
  ctx.fillRect(bounds.cx + bounds.a * 0.48, bounds.cy - bounds.b * 0.42, bounds.a * 0.32, bounds.b * 0.84)
  ctx.restore()
}

function drawDriftLight(ctx: CanvasRenderingContext2D, size: number, bounds: ReturnType<typeof createBounds>) {
  ctx.save()
  ctx.filter = 'blur(20px)'
  const g = ctx.createLinearGradient(size * 0.35, 0, size * 0.95, 0)
  g.addColorStop(0, '#2a2a2a')
  g.addColorStop(0.5, '#707070')
  g.addColorStop(1, '#e8e8e8')
  ctx.fillStyle = g
  ctx.fillRect(bounds.cx - bounds.a * 0.1, bounds.cy - bounds.b * 0.85, bounds.a * 1.05, bounds.b * 1.7)
  ctx.restore()
}

function drawLiftLight(ctx: CanvasRenderingContext2D, _size: number, bounds: ReturnType<typeof createBounds>) {
  ctx.save()
  ctx.filter = 'blur(16px)'
  const g = ctx.createLinearGradient(bounds.cx, bounds.cy + bounds.b, bounds.cx, bounds.cy - bounds.b)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.55, '#5a5a5a')
  g.addColorStop(1, '#1a1a1a')
  ctx.fillStyle = g
  ctx.fillRect(bounds.cx + bounds.a * 0.08, bounds.cy - bounds.b * 0.55, bounds.a * 0.72, bounds.b * 0.65)
  ctx.restore()

  ctx.save()
  ctx.filter = 'blur(22px)'
  ctx.globalAlpha = 0.7
  ctx.fillStyle = '#888888'
  ctx.beginPath()
  ctx.ellipse(bounds.cx + bounds.a * 0.55, bounds.cy + bounds.b * 0.35, bounds.a * 0.35, bounds.b * 0.28, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawGroundedLight(ctx: CanvasRenderingContext2D, _size: number, bounds: ReturnType<typeof createBounds>) {
  ctx.save()
  ctx.filter = 'blur(18px)'
  const g = ctx.createLinearGradient(0, bounds.cy + bounds.b, 0, bounds.cy - bounds.b)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.4, '#666666')
  g.addColorStop(1, '#222222')
  ctx.fillStyle = g
  ctx.fillRect(bounds.cx + bounds.a * 0.2, bounds.cy - bounds.b * 0.75, bounds.a * 0.55, bounds.b * 0.55)
  ctx.restore()
}

function drawLowLight(ctx: CanvasRenderingContext2D, size: number, bounds: ReturnType<typeof createBounds>) {
  ctx.save()
  ctx.filter = 'blur(24px)'
  const g = ctx.createLinearGradient(size * 0.2, size * 0.7, size * 0.9, size * 0.3)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.5, '#4a4a4a')
  g.addColorStop(1, '#111111')
  ctx.fillStyle = g
  ctx.fillRect(bounds.cx - bounds.a * 0.15, bounds.cy + bounds.b * 0.05, bounds.a * 1.1, bounds.b * 0.55)
  ctx.restore()
}

function drawBasinRim(ctx: CanvasRenderingContext2D, bounds: ReturnType<typeof createBounds>) {
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1.2
  ctx.stroke(new Path2D(superellipsePath(bounds)))
}
