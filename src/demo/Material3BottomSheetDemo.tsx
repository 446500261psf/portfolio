import { useCallback, useEffect, useRef, useState } from 'react'

const DISMISS_THRESHOLD = 120
const DISMISS_VELOCITY = 0.8

type DragState = {
  startY: number
  offset: number
  dragging: boolean
}

export default function Material3BottomSheetDemo() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<DragState>({ startY: 0, offset: 0, dragging: false })
  const lastMoveRef = useRef({ y: 0, t: 0 })

  const close = useCallback(() => {
    setClosing(true)
    setDragOffset(0)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 200)
  }, [])

  const openSheet = () => {
    setClosing(false)
    setDragOffset(0)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      startY: event.clientY,
      offset: dragOffset,
      dragging: true,
    }
    setDragging(true)
    lastMoveRef.current = { y: event.clientY, t: performance.now() }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return

    const delta = event.clientY - dragRef.current.startY
    const nextOffset = Math.max(0, dragRef.current.offset + delta)
    setDragOffset(nextOffset)
    lastMoveRef.current = { y: event.clientY, t: performance.now() }
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return

    dragRef.current.dragging = false
    setDragging(false)

    const now = performance.now()
    const dt = Math.max(now - lastMoveRef.current.t, 1)
    const velocity = (event.clientY - lastMoveRef.current.y) / dt

    const shouldDismiss =
      dragOffset > DISMISS_THRESHOLD || velocity > DISMISS_VELOCITY

    if (shouldDismiss) {
      close()
      return
    }

    setDragOffset(0)
  }

  return (
    <div className="m3-demo">
      <header className="m3-demo__header">
        <p className="m3-demo__eyebrow">Material Design 3</p>
        <h1 className="m3-demo__title">半屏 Bottom Sheet</h1>
        <p className="m3-demo__subtitle">
          按 M3 规范：50% 屏高、28px 顶圆角、Drag Handle、Scrim 32%、可拖拽关闭。
        </p>
      </header>

      <main className="m3-demo__content">
        <button type="button" className="m3-filled-button" onClick={openSheet}>
          打开半屏抽屉
        </button>

        <p className="m3-demo__hint">
          试试这些交互：点击遮罩关闭 · 向下拖拽关闭 · 按 Esc 关闭。
          <br />
          本地访问：<code>/demo.html</code>
        </p>
      </main>

      <div
        className={`m3-sheet-root${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={`m3-sheet-scrim${dragging ? ' is-dragging' : ''}`}
          aria-label="关闭抽屉"
          onClick={close}
          tabIndex={open ? 0 : -1}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
          className={`m3-sheet-panel${dragging ? ' is-dragging' : ''}${closing ? ' is-closing' : ''}`}
          style={{ '--sheet-drag-offset': `${dragOffset}px` } as React.CSSProperties}
        >
          <div
            className="m3-sheet-handle"
            aria-hidden
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="m3-sheet-handle__bar" />
          </div>

          <div className="m3-sheet-header">
            <h2 id="sheet-title" className="m3-sheet-header__title">
              选择播放列表
            </h2>
            <p className="m3-sheet-header__subtitle">半屏高度 · 内容可滚动</p>
          </div>

          <div className="m3-sheet-body">
            <ul className="m3-sheet-list">
              {PLAYLISTS.map((name) => (
                <li key={name} className="m3-sheet-list__item">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="m3-sheet-actions">
            <button type="button" className="m3-text-button" onClick={close}>
              取消
            </button>
            <button type="button" className="m3-filled-button" onClick={close}>
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const PLAYLISTS = [
  '通勤 Lo-Fi',
  '晨跑 120 BPM',
  '深夜爵士',
  '学习专注',
  '周末 House',
  '开车公路歌单',
  '雨天窗边',
  '派对热身',
]
