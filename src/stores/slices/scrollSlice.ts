import { StateCreator } from 'zustand'
import { StoreState } from '../index'

export interface ScrollSlice {
  // 滾動狀態
  scrollProgress: number
  scrollDirection: 'up' | 'down'
  currentSection: string
  
  // 區段進度 (0-1)
  sectionProgress: {
    preloader: number
    open: number
    innovation: number
    reports: number
    path: number
    support: number
    feedback: number
    callToAction: number
  }
  
  // 動作
  setScrollProgress: (progress: number) => void
  setScrollDirection: (direction: 'up' | 'down') => void
  setCurrentSection: (section: string) => void
  setSectionProgress: (section: string, progress: number) => void
}

export const scrollSlice: StateCreator<
  StoreState,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  ScrollSlice
> = (set, get) => ({
  scrollProgress: 0,
  scrollDirection: 'down',
  currentSection: 'preloader',
  
  sectionProgress: {
    preloader: 0,
    open: 0,
    innovation: 0,
    reports: 0,
    path: 0,
    support: 0,
    feedback: 0,
    callToAction: 0,
  },
  
  setScrollProgress: (progress) =>
    set((state) => {
      state.scrollProgress = progress
    }),
    
  setScrollDirection: (direction) =>
    set((state) => {
      state.scrollDirection = direction
    }),
    
  setCurrentSection: (section) =>
    set((state) => {
      state.currentSection = section
    }),
    
  setSectionProgress: (section, progress) =>
    set((state) => {
      if (section in state.sectionProgress) {
        state.sectionProgress[section as keyof typeof state.sectionProgress] = progress
      }
    }),
})