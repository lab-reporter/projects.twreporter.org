import { StateCreator } from 'zustand'
import { StoreState } from '../index'

export interface SceneSlice {
  // 相機狀態
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  cameraFOV: number
  
  // 載入狀態
  isLoading: boolean
  loadingProgress: number
  
  // 效能監控
  fps: number
  memoryUsage: number
  
  // 場景品質
  quality: 'high' | 'medium' | 'low'
  
  // 動作
  setCameraPosition: (position: [number, number, number]) => void
  setCameraTarget: (target: [number, number, number]) => void
  setCameraFOV: (fov: number) => void
  setLoadingProgress: (progress: number) => void
  setFPS: (fps: number) => void
  setMemoryUsage: (usage: number) => void
  setQuality: (quality: 'high' | 'medium' | 'low') => void
}

export const sceneSlice: StateCreator<
  StoreState,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  SceneSlice
> = (set) => ({
  cameraPosition: [0, 0, 1000],
  cameraTarget: [0, 0, 0],
  cameraFOV: 75,
  
  isLoading: true,
  loadingProgress: 0,
  
  fps: 60,
  memoryUsage: 0,
  
  quality: 'high',
  
  setCameraPosition: (position) =>
    set((state) => {
      state.cameraPosition = position
    }),
    
  setCameraTarget: (target) =>
    set((state) => {
      state.cameraTarget = target
    }),
    
  setCameraFOV: (fov) =>
    set((state) => {
      state.cameraFOV = fov
    }),
    
  setLoadingProgress: (progress) =>
    set((state) => {
      state.loadingProgress = progress
      state.isLoading = progress < 1
    }),
    
  setFPS: (fps) =>
    set((state) => {
      state.fps = fps
    }),
    
  setMemoryUsage: (usage) =>
    set((state) => {
      state.memoryUsage = usage
    }),
    
  setQuality: (quality) =>
    set((state) => {
      state.quality = quality
    }),
})