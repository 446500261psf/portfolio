import {
  DEFAULT_FIGMA_DIAL,
  FIGMA_DIAL_STATES,
  type FigmaDialId,
} from '../dial/figmaDialStates'

interface DialControlsProps {
  dialId: FigmaDialId
  onChange: (id: FigmaDialId) => void
}

export function DialControls({ dialId, onChange }: DialControlsProps) {
  return (
    <aside className="shape-controls dial-controls">
      <header>
        <p className="eyebrow">Figma Dial UI</p>
        <h1>表盘状态</h1>
        <p className="subtitle">舒适区场 · 纯视觉 · 无文字</p>
      </header>

      <section className="control-block">
        <h2>舒适区预设</h2>
        <div className="dial-state-list">
          {FIGMA_DIAL_STATES.map((state) => (
            <button
              key={state.id}
              type="button"
              className={`dial-state-btn${dialId === state.id ? ' active' : ''}`}
              onClick={() => onChange(state.id)}
            >
              <span className="dial-state-btn__label">{state.label}</span>
              <span className="dial-state-btn__hint">{state.labelEn}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="control-block hint-block">
        <p>
          表盘 UI 来自 Figma 设计稿，贴合三视图定义的表壳正面。<br />
          外形参数请在外形工作室调节。
        </p>
      </section>
    </aside>
  )
}

export { DEFAULT_FIGMA_DIAL }
