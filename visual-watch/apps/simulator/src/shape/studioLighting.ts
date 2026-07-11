/** 面光源参数（width/height 控制聚光锥大小与柔边） */
export interface AreaLightSettings {
  position: { x: number; y: number; z: number }
  intensity: number
  width: number
  height: number
  color: string
}

export interface StudioLightingState {
  key: AreaLightSettings
  fill: AreaLightSettings
}

export const DEFAULT_STUDIO_LIGHTS: StudioLightingState = {
  key: {
    position: { x: 52, y: 58, z: 68 },
    intensity: 280,
    width: 42,
    height: 32,
    color: '#fff4ec',
  },
  fill: {
    position: { x: -48, y: 28, z: -52 },
    intensity: 110,
    width: 56,
    height: 44,
    color: '#b8c8dc',
  },
}
