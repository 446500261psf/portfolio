import type { CaseParams } from './CaseParams'
import { frontAspect, sideFlatness } from './CaseParams'

export interface ShapeSliderState {
  widthMm: number
  heightMm: number
  thicknessMm: number
  n: number
  lockAspect: boolean
}

interface ShapeControlsProps {
  sliders: ShapeSliderState
  params: CaseParams
  onChange: (next: Partial<ShapeSliderState>) => void
}

export function ShapeControls({ sliders, params, onChange }: ShapeControlsProps) {
  return (
    <aside className="shape-controls">
      <header>
        <p className="eyebrow">Technische Zeichnung</p>
        <h1>表盘轮廓</h1>
        <p className="subtitle">三视图 · 参数编辑 · 1:1 mm</p>
      </header>

      <section className="control-block">
        <h2>圆角弧度</h2>
        <SliderRow
          label="超椭圆指数 n"
          hint="2 椭圆 → 4.5 近圆 → 8 角更平"
          value={sliders.n}
          min={2}
          max={8}
          step={0.1}
          display={sliders.n.toFixed(1)}
          onChange={(n) => onChange({ n })}
        />
      </section>

      <section className="control-block">
        <h2>正面轮廓（mm）</h2>
        <SliderRow
          label="宽度"
          value={sliders.widthMm}
          min={28}
          max={44}
          step={0.5}
          display={`${sliders.widthMm.toFixed(1)} mm`}
          onChange={(widthMm) => {
            if (sliders.lockAspect) {
              const ratio = sliders.heightMm / sliders.widthMm
              onChange({ widthMm, heightMm: widthMm * ratio })
            } else {
              onChange({ widthMm })
            }
          }}
        />
        <SliderRow
          label="高度"
          value={sliders.heightMm}
          min={28}
          max={48}
          step={0.5}
          display={`${sliders.heightMm.toFixed(1)} mm`}
          onChange={(heightMm) => onChange({ heightMm })}
        />
        <label className="check-row">
          <input
            type="checkbox"
            checked={sliders.lockAspect}
            onChange={(e) => onChange({ lockAspect: e.target.checked })}
          />
          锁定宽高比
        </label>
      </section>

      <section className="control-block">
        <h2>侧面扁度（mm）</h2>
        <SliderRow
          label="厚度"
          hint="越小侧面越扁"
          value={sliders.thicknessMm}
          min={6}
          max={16}
          step={0.5}
          display={`${sliders.thicknessMm.toFixed(1)} mm`}
          onChange={(thicknessMm) => onChange({ thicknessMm })}
        />
      </section>

      <section className="control-block stats">
        <Stat label="正面长宽比" value={frontAspect(params).toFixed(3)} />
        <Stat label="厚/宽比" value={sideFlatness(params).toFixed(3)} />
        <Stat label="a · b · c" value={`${params.a.toFixed(1)} · ${params.b.toFixed(1)} · ${params.c.toFixed(1)}`} />
        <Stat label="n" value={params.n.toFixed(1)} />
      </section>

      <section className="control-block hint-block">
        <p>
          <strong>正视图</strong>：表盘正面超椭圆（近圆）<br />
          <strong>侧视图</strong>：扁薄侧面圆润剖面<br />
          <strong>俯视图</strong>：宽度 × 厚度轮廓<br />
          虚线为投影对齐关系
        </p>
      </section>
    </aside>
  )
}

function SliderRow({
  label,
  hint,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}) {
  return (
    <div className="slider-row">
      <div className="slider-labels">
        <span>{label}</span>
        <span className="hint">{hint ?? display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="value-readout">{display}</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export const DEFAULT_SLIDERS: ShapeSliderState = {
  widthMm: 34,
  heightMm: 37,
  thicknessMm: 10,
  n: 4.5,
  lockAspect: true,
}
