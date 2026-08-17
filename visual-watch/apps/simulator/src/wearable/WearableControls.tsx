import type { WearableParams } from './wearableParams'

interface WearableControlsProps {
  wear: WearableParams
  onChange: (next: Partial<WearableParams>) => void
}

export function WearableControls({ wear, onChange }: WearableControlsProps) {
  return (
    <aside className="shape-controls">
      <header>
        <p className="eyebrow">Gesamtgerät</p>
        <h1>整机与佩戴</h1>
        <p className="subtitle">表带 · 连接结构 · 交互</p>
      </header>

      <section className="control-block">
        <h2>表带（mm）</h2>
        <SliderRow
          label="宽度"
          value={wear.strapWidth}
          min={14}
          max={26}
          step={0.5}
          display={`${wear.strapWidth.toFixed(1)} mm`}
          onChange={(strapWidth) => onChange({ strapWidth })}
        />
        <SliderRow
          label="厚度"
          value={wear.strapThickness}
          min={1.6}
          max={4.2}
          step={0.1}
          display={`${wear.strapThickness.toFixed(1)} mm`}
          onChange={(strapThickness) => onChange({ strapThickness })}
        />
      </section>

      <section className="control-block">
        <h2>连接结构</h2>
        <SliderRow
          label="耳部加宽"
          hint="1.0 等宽 → 1.7 明显外扩"
          value={wear.lugFlare}
          min={1}
          max={1.7}
          step={0.02}
          display={`×${wear.lugFlare.toFixed(2)}`}
          onChange={(lugFlare) => onChange({ lugFlare })}
        />
        <SliderRow
          label="接口厚度"
          hint="贴合表壳背面的桥体"
          value={wear.interfaceLength}
          min={2}
          max={5.5}
          step={0.1}
          display={`${wear.interfaceLength.toFixed(1)} mm`}
          onChange={(interfaceLength) => onChange({ interfaceLength })}
        />
      </section>

      <section className="control-block">
        <h2>手腕（mm）</h2>
        <SliderRow
          label="半宽"
          value={wear.wristHalfY}
          min={22}
          max={32}
          step={0.5}
          display={`${wear.wristHalfY.toFixed(1)} mm`}
          onChange={(wristHalfY) => onChange({ wristHalfY })}
        />
        <SliderRow
          label="半厚"
          value={wear.wristHalfZ}
          min={14}
          max={24}
          step={0.5}
          display={`${wear.wristHalfZ.toFixed(1)} mm`}
          onChange={(wristHalfZ) => onChange({ wristHalfZ })}
        />
        <SliderRow
          label="截面圆角 n"
          hint="2 椭圆 → 3.6 更扁方"
          value={wear.wristN}
          min={2}
          max={3.6}
          step={0.05}
          display={wear.wristN.toFixed(2)}
          onChange={(wristN) => onChange({ wristN })}
        />
        <label className="check-row">
          <input
            type="checkbox"
            checked={wear.showWrist}
            onChange={(e) => onChange({ showWrist: e.target.checked })}
          />
          显示手腕参考体
        </label>
      </section>

      <section className="control-block hint-block">
        <p>
          <strong>抬腕</strong>：Pool 渐亮，无硬切<br />
          <strong>轻触表盘</strong>：明确指令 → 一个结论 + 一个数字，看完自动收回<br />
          <strong>长按</strong>：撤销浏览，回到此刻真实状态<br />
          <strong>滚轮 / 指拨</strong>：浏览舒适区，不改变真实状态<br />
          <strong>一天演播</strong>：被动预测只改变场，不代替用户动作
        </p>
      </section>

      <section className="control-block hint-block">
        <p>
          表盘形状与厚度在<strong>外形工作室</strong>调节，光源在<strong>3D 白膜</strong>调节；
          此处只管佩戴结构与交互。
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
