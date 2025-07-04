import { StateCreator } from 'zustand'
import { StoreState } from '../index'

export interface UISlice {
  // 導航狀態
  isNavigationOpen: boolean
  isSidePanelOpen: boolean
  sidePanelContent: string | null
  
  // Modal 狀態
  modal: {
    isOpen: boolean
    contentId: string | null
    data: Record<string, unknown> | null
  }
  
  // 主題和響應式
  theme: 'light' | 'dark'
  isMobile: boolean
  isTablet: boolean
  
  // 載入和錯誤狀態
  hasError: boolean
  errorMessage: string | null
  
  // 動作
  setNavigationOpen: (isOpen: boolean) => void
  setSidePanelOpen: (isOpen: boolean) => void
  setSidePanelContent: (content: string | null) => void
  openModal: (contentId: string, data?: Record<string, unknown> | null) => void
  closeModal: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setDeviceType: (isMobile: boolean, isTablet: boolean) => void
  setError: (error: string | null) => void
}

export const uiSlice: StateCreator<
  StoreState,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  UISlice
> = (set) => ({
  isNavigationOpen: false,
  isSidePanelOpen: false,
  sidePanelContent: null,
  
  modal: {
    isOpen: false,
    contentId: null,
    data: null
  },
  
  theme: 'light',
  isMobile: false,
  isTablet: false,
  
  hasError: false,
  errorMessage: null,
  
  setNavigationOpen: (isOpen) =>
    set((state) => {
      state.isNavigationOpen = isOpen
    }),
    
  setSidePanelOpen: (isOpen) =>
    set((state) => {
      state.isSidePanelOpen = isOpen
    }),
    
  setSidePanelContent: (content) =>
    set((state) => {
      state.sidePanelContent = content
    }),
    
  openModal: (contentId, data = null) =>
    set((state) => {
      state.modal.isOpen = true
      state.modal.contentId = contentId
      state.modal.data = data
    }),
    
  closeModal: () =>
    set((state) => {
      state.modal.isOpen = false
      state.modal.contentId = null
      state.modal.data = null
    }),
    
  setTheme: (theme) =>
    set((state) => {
      state.theme = theme
    }),
    
  setDeviceType: (isMobile, isTablet) =>
    set((state) => {
      state.isMobile = isMobile
      state.isTablet = isTablet
    }),
    
  setError: (error) =>
    set((state) => {
      state.hasError = !!error
      state.errorMessage = error
    }),
})