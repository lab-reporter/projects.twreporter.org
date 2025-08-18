import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { scrollSlice, ScrollSlice } from './slices/scrollSlice'
import { sceneSlice, SceneSlice } from './slices/sceneSlice'
import { uiSlice, UISlice } from './slices/uiSlice'
import { dataSlice, DataSlice } from './slices/dataSlice'

export interface StoreState extends ScrollSlice, SceneSlice, UISlice, DataSlice { }

export const useStore = create<StoreState>()(
  devtools(
    immer(
      (...a) => ({
        ...scrollSlice(...a),
        ...sceneSlice(...a),
        ...uiSlice(...a),
        ...dataSlice(...a),
      })
    ),
    {
      name: 'r3f-10th-store',
    }
  )
)

// 為 SSR 提供安全的 store 存取
export const getStoreSnapshot = () => useStore.getState()