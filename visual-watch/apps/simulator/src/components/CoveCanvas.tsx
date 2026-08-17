import { useEffect, useRef } from 'react'
import type { FieldParams } from '../cove-field/types'
import { createBounds } from '../cove-field/superellipse'
import { ParticleSystem } from '../cove-field/particles'
import { drawField } from '../cove-field/renderer'

interface CoveCanvasProps {
  width: number
  height: number
  params: FieldParams
  edgeGather: number
  wakeBoost: boolean
}

export function CoveCanvas({
  width,
  height,
  params,
  edgeGather,
  wakeBoost,
}: CoveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const systemRef = useRef<ParticleSystem | null>(null)
  const wakeRef = useRef(0)
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const paramsRef = useRef(params)
  const edgeRef = useRef(edgeGather)

  paramsRef.current = params
  edgeRef.current = edgeGather

  useEffect(() => {
    if (wakeBoost) wakeRef.current = 1
  }, [wakeBoost])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const bounds = createBounds(width, height, width * 0.04)
    if (!systemRef.current) {
      systemRef.current = new ParticleSystem(bounds, paramsRef.current)
    } else {
      systemRef.current.resize(bounds)
      systemRef.current.updateParams(paramsRef.current)
    }

    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      timeRef.current += dt
      wakeRef.current = Math.max(0, wakeRef.current - dt * 1.8)

      const p = paramsRef.current
      systemRef.current?.update(dt, p, edgeRef.current + p.edgeGather)
      drawField(
        ctx,
        width,
        height,
        p,
        systemRef.current?.particles ?? [],
        timeRef.current,
        wakeRef.current,
      )

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [width, height])

  useEffect(() => {
    systemRef.current?.updateParams(params)
  }, [params])

  return (
    <canvas
      ref={canvasRef}
      className="cove-canvas"
      aria-label="comfort field visualization"
    />
  )
}
