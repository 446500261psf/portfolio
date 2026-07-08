import { useCallback, useEffect, useRef, useState } from 'react'
import { ANNOTATED_FILES, type AnnotatedFile } from './annotatedCode'

const DISMISS_THRESHOLD = 120
const DISMISS_VELOCITY = 0.8

type DragState = {
  startY: number
  offset: number
  dragging: boolean
}

function CodeAnnotator({ file }: { file: AnnotatedFile }) {
  return (
    <div className="m3-code-viewer">
      <p className="m3-code-viewer__filename">{file.filename}</p>
      <ol className="m3-code-lines">
        {file.lines.map((entry) => (
          <li key={`${file.id}-${entry.line}`} className="m3-code-line">
            <div className="m3-code-line__row">
              <span className="m3-code-line__number">{entry.line}</span>
              <pre className="m3-code-line__code">
                <code>{entry.code || ' '}</code>
              </pre>
            </div>
            <p className="m3-code-line__note">{entry.note}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Material3BottomSheetDemo() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [activeFileId, setActiveFileId] = useState<'tsx' | 'css'>('tsx')
  const dragRef = useRef<DragState>({ startY: 0, offset: 0, dragging: false })
  const lastMoveRef = useRef({ y: 0, t: 0 })

  const activeFile = ANNOTATED_FILES.find((file) => file.id === activeFileId)!

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
          打开抽屉可查看本页源码，每行都标注了控制什么。
        </p>
      </header>

      <main className="m3-demo__content">
        <button type="button" className="m3-filled-button" onClick={openSheet}>
          打开源码备注
        </button>

        <p className="m3-demo__hint">
          抽屉内可切换 TSX / CSS 两个文件，上下滚动阅读逐行备注。
          <br />
          线上地址：<code>/demo.html</code>
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
              源码逐行备注
            </h2>
            <p className="m3-sheet-header__subtitle">
              {activeFile.language} · 半屏可滚动
            </p>
          </div>

          <div className="m3-code-tabs" role="tablist" aria-label="源码文件">
            {ANNOTATED_FILES.map((file) => (
              <button
                key={file.id}
                type="button"
                role="tab"
                aria-selected={activeFileId === file.id}
                className={`m3-code-tab${activeFileId === file.id ? ' is-active' : ''}`}
                onClick={() => setActiveFileId(file.id)}
              >
                {file.filename}
              </button>
            ))}
          </div>

          <div className="m3-sheet-body">
            <CodeAnnotator file={activeFile} />
          </div>

          <div className="m3-sheet-actions">
            <button type="button" className="m3-text-button" onClick={close}>
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
