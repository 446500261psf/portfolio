import type { AreaLightSettings, StudioLightingState } from './studioLighting'

interface LightControlsProps {
  lights: StudioLightingState
  onChange: (next: Partial<StudioLightingState>) => void
}

export function LightControls({ lights, onChange }: LightControlsProps) {
  const patchKey = (patch: Partial<AreaLightSettings>) =>
    onChange({ key: { ...lights.key, ...patch } })
  const patchFill = (patch: Partial<AreaLightSettings>) =>
    onChange({ fill: { ...lights.fill, ...patch } })

  return (
    <aside className="shape-controls light-controls">
      <header>
        <p className="eyebrow">Studio Lighting</p>
        <h1>光源</h1>
        <p className="subtitle">主光 + 反射光 · 面光源</p>
      </header>

      <LightSection
        title="主光源 Key"
        accent
        light={lights.key}
        onPatch={patchKey}
        posRange={80}
        intensityMax={24}
        sizeMax={90}
      />

      <LightSection
        title="反射光 Fill"
        light={lights.fill}
        onPatch={patchFill}
        posRange={80}
        intensityMax={16}
        sizeMax={100}
      />

      <section className="control-block hint-block">
        <p>
          <strong>大小</strong>：面光源宽 × 高（mm 等效）<br />
          <strong>强度</strong>：亮度 cd/m²<br />
          <strong>位置</strong>：XYZ 世界坐标，自动朝向表壳中心<br />
          外形参数请在外形工作室调节
        </p>
      </section>
    </aside>
  )
}

function LightSection({
  title,
  accent,
  light,
  onPatch,
  posRange,
  intensityMax,
  sizeMax,
}: {
  title: string
  accent?: boolean
  light: AreaLightSettings
  onPatch: (patch: Partial<AreaLightSettings>) => void
  posRange: number
  intensityMax: number
  sizeMax: number
}) {
  return (
    <section className={`control-block${accent ? ' control-block--accent' : ''}`}>
      <h2>{title}</h2>
      <SliderRow
        label="强度"
        value={light.intensity}
        min={0}
        max={intensityMax}
        step={0.5}
        display={light.intensity.toFixed(1)}
        onChange={(intensity) => onPatch({ intensity })}
      />
      <SliderRow
        label="大小 · 宽"
        value={light.width}
        min={8}
        max={sizeMax}
        step={2}
        display={`${light.width.toFixed(0)} mm`}
        onChange={(width) => onPatch({ width })}
      />
      <SliderRow
        label="大小 · 高"
        value={light.height}
        min={8}
        max={sizeMax}
        step={2}
        display={`${light.height.toFixed(0)} mm`}
        onChange={(height) => onPatch({ height })}
      />
      <SliderRow
        label="位置 X"
        value={light.position.x}
        min={-posRange}
        max={posRange}
        step={2}
        display={`${light.position.x.toFixed(0)}`}
        onChange={(x) => onPatch({ position: { ...light.position, x } })}
      />
      <SliderRow
        label="位置 Y"
        value={light.position.y}
        min={-posRange}
        max={posRange}
        step={2}
        display={`${light.position.y.toFixed(0)}`}
        onChange={(y) => onPatch({ position: { ...light.position, y } })}
      />
      <SliderRow
        label="位置 Z"
        value={light.position.z}
        min={-posRange}
        max={posRange}
        step={2}
        display={`${light.position.z.toFixed(0)}`}
        onChange={(z) => onPatch({ position: { ...light.position, z } })}
      />
    </section>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string
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
        <span className="hint">{display}</span>
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
