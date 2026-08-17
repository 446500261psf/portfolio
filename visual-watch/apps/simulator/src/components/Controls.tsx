import type { PhaseId, PresetId, CZM } from '../cove-field/types'
import { PRESET_LIST, PHASE_LABELS } from '../cove-field/presets'
import { behaviorLabel } from '../cove-field/particles'

interface ControlsProps {
  preset: PresetId
  phase: PhaseId
  nextPreset: PresetId
  crossingProgress: number
  customCzm: CZM | null
  feeling: string
  onPresetChange: (id: PresetId) => void
  onPhaseChange: (phase: PhaseId) => void
  onNextPresetChange: (id: PresetId) => void
  onCrossingProgressChange: (v: number) => void
  onCzmChange: (czm: CZM | null) => void
  onWake: () => void
  behavior: string
}

export function Controls({
  preset,
  phase,
  nextPreset,
  crossingProgress,
  customCzm,
  feeling,
  onPresetChange,
  onPhaseChange,
  onNextPresetChange,
  onCrossingProgressChange,
  onCzmChange,
  onWake,
  behavior,
}: ControlsProps) {
  const active = PRESET_LIST.find((p) => p.id === preset)!
  const czm = customCzm ?? active.czm

  return (
    <aside className="controls">
      <header className="controls-header">
        <p className="eyebrow">Cove Watch · Phase 0</p>
        <h1>潭面模拟器</h1>
        <p className="subtitle">
          超椭圆 n=4.5 · 2.5D 鹅软石 · 舒适区动态场
        </p>
      </header>

      <section className="control-block">
        <h2>舒适区原型</h2>
        <div className="preset-grid">
          {PRESET_LIST.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`preset-chip ${preset === p.id ? 'active' : ''}`}
              onClick={() => {
                onPresetChange(p.id)
                onCzmChange(null)
              }}
            >
              <span className="chip-label">{p.label}</span>
              <span className="chip-en">{p.labelEn}</span>
            </button>
          ))}
        </div>
        <p className="feeling">「{feeling}」</p>
      </section>

      <section className="control-block">
        <h2>时相 Phase</h2>
        <div className="phase-row">
          {(Object.keys(PHASE_LABELS) as PhaseId[]).map((id) => (
            <button
              key={id}
              type="button"
              className={`phase-btn ${phase === id ? 'active' : ''}`}
              onClick={() => onPhaseChange(id)}
            >
              {PHASE_LABELS[id]}
            </button>
          ))}
        </div>
        {(phase === 'approach' || phase === 'crossing') && (
          <div className="sub-control">
            <label htmlFor="next-preset">下一舒适区</label>
            <select
              id="next-preset"
              value={nextPreset}
              onChange={(e) => onNextPresetChange(e.target.value as PresetId)}
            >
              {PRESET_LIST.filter((p) => p.id !== preset).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} · {p.labelEn}
                </option>
              ))}
            </select>
          </div>
        )}
        {phase === 'crossing' && (
          <div className="sub-control">
            <label htmlFor="crossing">
              渡越进度 {Math.round(crossingProgress * 100)}%
            </label>
            <input
              id="crossing"
              type="range"
              min={0}
              max={100}
              value={crossingProgress * 100}
              onChange={(e) =>
                onCrossingProgressChange(Number(e.target.value) / 100)
              }
            />
          </div>
        )}
      </section>

      <section className="control-block">
        <h2>CZM 身体语言</h2>
        <Slider
          label="激活度 A"
          hint="静 ←→ 动"
          value={czm.a}
          onChange={(a) => onCzmChange({ ...czm, a })}
        />
        <Slider
          label="开放度 O"
          hint="内 ←→ 外"
          value={czm.o}
          onChange={(o) => onCzmChange({ ...czm, o })}
        />
        <Slider
          label="稳定度 S"
          hint="自由 ←→ 规律"
          value={czm.s}
          onChange={(s) => onCzmChange({ ...czm, s })}
        />
        {customCzm && (
          <button
            type="button"
            className="text-btn"
            onClick={() => onCzmChange(null)}
          >
            重置为原型默认值
          </button>
        )}
      </section>

      <section className="control-block stats">
        <div className="stat">
          <span>粒子行为</span>
          <strong>{behavior}</strong>
        </div>
        <div className="stat">
          <span>A / O / S</span>
          <strong>
            {czm.a.toFixed(2)} · {czm.o.toFixed(2)} · {czm.s.toFixed(2)}
          </strong>
        </div>
      </section>

      <button type="button" className="wake-btn" onClick={onWake}>
        抬腕亮潭
      </button>
    </aside>
  )
}

function Slider({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="slider-row">
      <div className="slider-labels">
        <span>{label}</span>
        <span className="hint">{hint}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value * 100}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
      />
    </div>
  )
}

export { behaviorLabel }
