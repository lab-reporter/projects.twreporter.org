import { StateCreator } from 'zustand'
import { StoreState } from '../index'

export interface ScrollSlice {
  // 滾動狀態
  scrollProgress: number
  scrollDirection: 'up' | 'down'
  currentSection: string
  sectionProgress: number
  
  // 動作
  setScrollProgress: (progress: number) => void
  setScrollDirection: (direction: 'up' | 'down') => void
  setCurrentSection: (section: string) => void
  setSectionProgress: (progress: number) => void
}

export const scrollSlice: StateCreator<
  StoreState,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  ScrollSlice
> = (set) => ({
  scrollProgress: 0,
  scrollDirection: 'down',
  currentSection: 'reports', // 預設為 reports，因為 SectionNavigation 顯示時一定在 reports section
  sectionProgress: 0,
  
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
    
  setSectionProgress: (progress) =>
    set((state) => {
      state.sectionProgress = progress
    }),
})