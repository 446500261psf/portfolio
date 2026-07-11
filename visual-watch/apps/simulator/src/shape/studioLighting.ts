/** 面光源参数（RectAreaLight：width/height = 光源「大小」） */
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
    intensity: 12,
    width: 42,
    height: 32,
    color: '#fff4ec',
  },
  fill: {
    position: { x: -48, y: 28, z: -52 },
    intensity: 5.5,
    width: 56,
    height: 44,
    color: '#b8c8dc',
  },
}
