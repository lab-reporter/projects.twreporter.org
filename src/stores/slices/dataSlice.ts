import { StateCreator } from 'zustand'
import { StoreState } from '../index'

export interface Project {
  id: string
  title: string
  description: string
  image: string
  video?: string
  type: 'innovation' | 'report'
  category?: string
  date?: string
  url?: string
}

export interface DataSlice {
  // 專案資料
  projects: Project[]
  filteredProjects: Project[]
  currentProject: Project | null

  // 篩選狀態
  filter: {
    type: 'all' | 'innovation' | 'report'
    category: string
    search: string
  }

  // 支持者數據
  supporterCount: number
  targetSupporters: number

  // 載入狀態
  isDataLoading: boolean
  dataError: string | null

  // 動作
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  setFilter: (filter: Partial<DataSlice['filter']>) => void
  applyFilters: () => void
  setSupporterCount: (count: number) => void
  setDataLoading: (loading: boolean) => void
  setDataError: (error: string | null) => void
}

export const dataSlice: StateCreator<
  StoreState,
  [['zustand/immer', never], ['zustand/devtools', never]],
  [],
  DataSlice
> = (set) => ({
  projects: [],
  filteredProjects: [],
  currentProject: null,

  filter: {
    type: 'all',
    category: '',
    search: '',
  },

  // 支持者數據初始值
  supporterCount: 8165, // 從 API 獲取的當前支持者數量
  targetSupporters: 10000, // 目標支持者數量

  isDataLoading: false,
  dataError: null,

  setProjects: (projects) =>
    set((state) => {
      state.projects = projects
      state.filteredProjects = projects
    }),

  setCurrentProject: (project) =>
    set((state) => {
      state.currentProject = project
    }),

  setFilter: (filter) =>
    set((state) => {
      state.filter = { ...state.filter, ...filter }
    }),

  applyFilters: () =>
    set((state) => {
      const { type, category, search } = state.filter
      let filtered = state.projects

      if (type !== 'all') {
        filtered = filtered.filter(p => p.type === type)
      }

      if (category) {
        filtered = filtered.filter(p => p.category === category)
      }

      if (search) {
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        )
      }

      state.filteredProjects = filtered
    }),

  setSupporterCount: (count) =>
    set((state) => {
      state.supporterCount = count
    }),

  setDataLoading: (loading) =>
    set((state) => {
      state.isDataLoading = loading
    }),

  setDataError: (error) =>
    set((state) => {
      state.dataError = error
    }),
})