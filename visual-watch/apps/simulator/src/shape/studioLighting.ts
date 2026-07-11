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
    intensity: 48,
    width: 58,
    height: 44,
    color: '#fff2ea',
  },
  fill: {
    position: { x: -48, y: 28, z: -52 },
    intensity: 32,
    width: 72,
    height: 56,
    color: '#b0c0d4',
  },
}
