# 狀態管理與滾動系統分析改善文件

## 1. 現有狀態管理分析

### 1.1 UiContext 系統
**檔案位置：** `src/app/context/UiContext.js`

**當前狀態結構：**
```javascript
const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
const [preloaderVisible, setPreloaderVisible] = useState(true);
const [isBeforeReportsOpen, setIsBeforeReportsOpen] = useState(true);
```

**問題點：**
- 狀態過於簡單，無法應對複雜的全域狀態需求
- 缺乏類型安全性
- 狀態變化無持久化機制
- 沒有中間件支援（如 logger、persist）
- 重新渲染優化不足

### 1.2 滾動管理系統
**檔案位置：** `src/app/hooks/useScrollManager.js`

**當前功能：**
```javascript
const [showNav, setShowNav] = useState(true);           // 導航欄控制
const [isDarkMode, setIsDarkMode] = useState(false);    // 深色模式
const [lastScrollY, setLastScrollY] = useState(0);      // 滾動位置
```

**問題點：**
- 功能過於基礎，無法處理複雜的區段切換邏輯
- 深色模式僅基於單一元素（call-to-action）
- 缺乏滾動進度追蹤
- 沒有區段檢測機制

### 1.3 ScrollTrigger 優化系統
**檔案位置：** `src/app/hooks/useOptimizedScrollTrigger.js`

**優點：**
- 提供節流和防抖優化
- 支援批次 ScrollTrigger 管理
- 包含 Intersection Observer 替代方案

**問題點：**
- 與全域狀態管理脫鉤
- 每個組件各自管理 ScrollTrigger 實例
- 缺乏統一的滾動進度協調機制

### 1.4 組件內部狀態散佈
**分佈範圍：** 各 section 組件

**問題：**
- 狀態管理分散，難以統一控制
- 組件間通信複雜（透過 props 層層傳遞）
- 重複的邏輯散佈在不同組件
- 無法實現全域的動畫協調

## 2. R3F 重構的狀態管理需求

### 2.1 新增狀態需求

#### 2.1.1 3D 場景狀態
```typescript
interface Scene3DState {
  isLoaded: boolean;              // 3D 場景載入狀態
  loadingProgress: number;        // 載入進度 0-100
  currentCamera: string;          // 當前相機位置 
  quality: 'low' | 'medium' | 'high'; // 渲染品質
  performance: {
    fps: number;
    frameTime: number;
    memoryUsage: number;
  };
}
```

#### 2.1.2 滾動協調狀態
```typescript
interface ScrollState {
  progress: number;               // 整體滾動進度 0-1
  velocity: number;               // 滾動速度
  direction: 'up' | 'down';       // 滾動方向
  currentSection: string;         // 當前區段 ID
  sectionProgress: number;        // 區段內進度 0-1
  isScrolling: boolean;           // 是否正在滾動
  sections: SectionInfo[];        // 所有區段資訊
}
```

#### 2.1.3 動畫協調狀態
```typescript
interface AnimationState {
  activeAnimations: Set<string>;  // 正在執行的動畫 ID
  timeline: TimelineMax;          // 主時間軸
  paused: boolean;                // 暫停狀態
  speed: number;                  // 播放速度
}
```

#### 2.1.4 使用者體驗狀態
```typescript
interface UXState {
  theme: 'light' | 'dark';        // 主題模式
  reducedMotion: boolean;         // 減少動畫偏好
  touchDevice: boolean;           // 觸控裝置檢測
  viewportSize: {
    width: number;
    height: number;
    breakpoint: 'mobile' | 'tablet' | 'desktop';
  };
}
```

## 3. Zustand 重構方案

### 3.1 整體架構設計

```typescript
// stores/index.ts - 主要 store 入口
import { create } from 'zustand';
import { subscribeWithSelector, devtools, persist } from 'zustand/middleware';
import { createSceneSlice } from './slices/sceneSlice';
import { createScrollSlice } from './slices/scrollSlice';
import { createUISlice } from './slices/uiSlice';
import { createAnimationSlice } from './slices/animationSlice';

export const useAppStore = create<AppStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get, api) => ({
          // 合併各個 slice
          ...createSceneSlice(set, get, api),
          ...createScrollSlice(set, get, api),
          ...createUISlice(set, get, api),
          ...createAnimationSlice(set, get, api),
        }),
        {
          name: 'app-storage',
          partialize: (state) => ({
            // 只持久化部分狀態
            theme: state.theme,
            reducedMotion: state.reducedMotion,
            quality: state.quality,
          }),
        }
      )
    ),
    { name: 'App Store' }
  )
);
```

### 3.2 滾動狀態管理 Slice

```typescript
// stores/slices/scrollSlice.ts
export interface ScrollSlice {
  // 狀態
  scroll: {
    progress: number;
    velocity: number;
    direction: 'up' | 'down';
    currentSection: string;
    sectionProgress: number;
    isScrolling: boolean;
    sections: SectionInfo[];
  };
  
  // Actions
  updateScrollProgress: (progress: number) => void;
  setCurrentSection: (sectionId: string) => void;
  setSectionProgress: (progress: number) => void;
  addSection: (section: SectionInfo) => void;
  removeSection: (sectionId: string) => void;
  
  // Computed values
  getCurrentSectionData: () => SectionInfo | null;
  getNextSection: () => SectionInfo | null;
  getPreviousSection: () => SectionInfo | null;
}

export const createScrollSlice: StateCreator<
  AppStore,
  [],
  [],
  ScrollSlice
> = (set, get) => ({
  scroll: {
    progress: 0,
    velocity: 0,
    direction: 'down',
    currentSection: 'preloader',
    sectionProgress: 0,
    isScrolling: false,
    sections: [],
  },

  updateScrollProgress: (progress) => {
    const currentScroll = get().scroll;
    const direction = progress > currentScroll.progress ? 'down' : 'up';
    
    set(
      (state) => ({
        scroll: {
          ...state.scroll,
          progress,
          direction,
          velocity: Math.abs(progress - currentScroll.progress),
          isScrolling: true,
        },
      }),
      false,
      'scroll/updateProgress'
    );
    
    // 自動停止滾動檢測
    clearTimeout(get().scrollTimeoutId);
    const timeoutId = setTimeout(() => {
      set(
        (state) => ({
          scroll: { ...state.scroll, isScrolling: false },
        }),
        false,
        'scroll/stopScrolling'
      );
    }, 150);
    
    set({ scrollTimeoutId: timeoutId });
  },

  setCurrentSection: (sectionId) => {
    set(
      (state) => ({
        scroll: { ...state.scroll, currentSection: sectionId },
      }),
      false,
      'scroll/setCurrentSection'
    );
  },

  getCurrentSectionData: () => {
    const { currentSection, sections } = get().scroll;
    return sections.find(section => section.id === currentSection) || null;
  },

  // ... 其他方法
});
```

### 3.3 3D 場景狀態管理 Slice

```typescript
// stores/slices/sceneSlice.ts
export interface SceneSlice {
  // 狀態
  scene: {
    isLoaded: boolean;
    loadingProgress: number;
    currentCamera: string;
    quality: 'low' | 'medium' | 'high';
    performance: {
      fps: number;
      frameTime: number;
      memoryUsage: number;
    };
    activeObjects: Set<string>;
  };
  
  // Actions
  setLoadingProgress: (progress: number) => void;
  setSceneLoaded: (loaded: boolean) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  updatePerformance: (metrics: PerformanceMetrics) => void;
  setActiveCamera: (cameraId: string) => void;
  addActiveObject: (objectId: string) => void;
  removeActiveObject: (objectId: string) => void;
  
  // Computed
  shouldUseOptimizedRendering: () => boolean;
}

export const createSceneSlice: StateCreator<
  AppStore,
  [],
  [],
  SceneSlice
> = (set, get) => ({
  scene: {
    isLoaded: false,
    loadingProgress: 0,
    currentCamera: 'main',
    quality: 'high',
    performance: {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
    },
    activeObjects: new Set(),
  },

  setLoadingProgress: (progress) => {
    set(
      (state) => ({
        scene: { ...state.scene, loadingProgress: progress },
      }),
      false,
      'scene/setLoadingProgress'
    );
    
    // 當載入完成時，自動設定為已載入
    if (progress >= 100) {
      get().setSceneLoaded(true);
    }
  },

  shouldUseOptimizedRendering: () => {
    const { performance, quality } = get().scene;
    return performance.fps < 30 || quality === 'low';
  },

  // ... 其他方法
});
```

### 3.4 動畫協調 Slice

```typescript
// stores/slices/animationSlice.ts
export interface AnimationSlice {
  // 狀態
  animation: {
    activeAnimations: Set<string>;
    timeline: gsap.core.Timeline | null;
    paused: boolean;
    speed: number;
    masterProgress: number;
  };
  
  // Actions
  addAnimation: (id: string) => void;
  removeAnimation: (id: string) => void;
  pauseAnimations: () => void;
  resumeAnimations: () => void;
  setAnimationSpeed: (speed: number) => void;
  updateMasterProgress: (progress: number) => void;
  
  // Master timeline control
  createMasterTimeline: () => void;
  destroyMasterTimeline: () => void;
}

export const createAnimationSlice: StateCreator<
  AppStore,
  [],
  [],
  AnimationSlice
> = (set, get) => ({
  animation: {
    activeAnimations: new Set(),
    timeline: null,
    paused: false,
    speed: 1,
    masterProgress: 0,
  },

  createMasterTimeline: () => {
    const tl = gsap.timeline({ 
      paused: true,
      onUpdate: () => {
        set(
          (state) => ({
            animation: {
              ...state.animation,
              masterProgress: tl.progress(),
            },
          }),
          false,
          'animation/updateMasterProgress'
        );
      },
    });
    
    set(
      (state) => ({
        animation: { ...state.animation, timeline: tl },
      }),
      false,
      'animation/createMasterTimeline'
    );
  },

  // ... 其他方法
});
```

## 4. R3F 整合的滾動系統

### 4.1 統一滾動管理器

```typescript
// hooks/useScrollManager.ts
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '../stores';
import { useEffect, useRef } from 'react';

export const useScrollManager = () => {
  const {
    updateScrollProgress,
    setCurrentSection,
    setSectionProgress,
    sections,
    scroll,
  } = useAppStore();
  
  const scrollRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  
  // R3F useFrame 中的滾動處理
  useFrame(() => {
    const currentScroll = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(currentScroll / maxScroll, 1);
    
    // 計算速度
    const velocity = Math.abs(currentScroll - scrollRef.current);
    velocityRef.current = velocity;
    scrollRef.current = currentScroll;
    
    // 更新全域滾動狀態
    updateScrollProgress(progress);
    
    // 檢測當前區段
    const currentSection = detectCurrentSection(currentScroll, sections);
    if (currentSection && currentSection.id !== scroll.currentSection) {
      setCurrentSection(currentSection.id);
    }
    
    // 更新區段內進度
    if (currentSection) {
      const sectionProgress = calculateSectionProgress(currentScroll, currentSection);
      setSectionProgress(sectionProgress);
    }
  });
  
  return {
    scroll,
    velocity: velocityRef.current,
  };
};

// 區段檢測邏輯
const detectCurrentSection = (scrollY: number, sections: SectionInfo[]) => {
  for (const section of sections) {
    if (scrollY >= section.startY && scrollY < section.endY) {
      return section;
    }
  }
  return null;
};

// 區段內進度計算
const calculateSectionProgress = (scrollY: number, section: SectionInfo) => {
  const sectionScroll = scrollY - section.startY;
  const sectionHeight = section.endY - section.startY;
  return Math.max(0, Math.min(1, sectionScroll / sectionHeight));
};
```

### 4.2 React Three Fiber 滾動控制

```typescript
// components/R3F/ScrollController.tsx
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '../../stores';

export const ScrollController = ({ children }: { children: React.ReactNode }) => {
  const scroll = useScroll();
  const { setCurrentSection, updateScrollProgress } = useAppStore();
  
  useFrame(() => {
    // R3F 滾動進度與全域狀態同步
    updateScrollProgress(scroll.offset);
    
    // 基於滾動進度決定當前區段
    const sectionIndex = Math.floor(scroll.offset * scroll.pages);
    const sectionIds = ['preloader', 'open', 'reports', 'innovation', 'path', 'feedback', 'support'];
    const currentSectionId = sectionIds[sectionIndex] || 'preloader';
    
    setCurrentSection(currentSectionId);
  });
  
  return <>{children}</>;
};
```

### 4.3 區段間動畫切換

```typescript
// hooks/useSectionTransition.ts
import { useAppStore } from '../stores';
import { useEffect } from 'react';
import gsap from 'gsap';

export const useSectionTransition = () => {
  const { scroll, animation } = useAppStore();
  const { currentSection, sectionProgress } = scroll;
  const { timeline } = animation;
  
  useEffect(() => {
    if (!timeline) return;
    
    // 基於區段切換觸發對應動畫
    const sectionAnimations = {
      preloader: () => {
        // Preloader 退場動畫
        timeline.to('.preloader', { opacity: 0, duration: 1 });
      },
      open: () => {
        // Open 區段入場動畫
        timeline.fromTo('.open-content', 
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 }
        );
      },
      reports: () => {
        // Reports 3D 場景啟動
        timeline.to('.camera', { 
          position: [0, 0, 5], 
          duration: 2,
          ease: 'power2.inOut'
        });
      },
      // ... 其他區段動畫
    };
    
    const animationFn = sectionAnimations[currentSection as keyof typeof sectionAnimations];
    if (animationFn) {
      animationFn();
    }
    
  }, [currentSection, timeline]);
  
  // 基於區段內進度的精細動畫控制
  useEffect(() => {
    if (!timeline) return;
    
    // 將區段進度映射到時間軸
    const sectionDuration = timeline.duration() / 6; // 假設 6 個區段
    const sectionIndex = ['preloader', 'open', 'reports', 'innovation', 'path', 'feedback', 'support'].indexOf(currentSection);
    const targetProgress = (sectionIndex + sectionProgress) / 6;
    
    timeline.progress(targetProgress);
    
  }, [sectionProgress, currentSection, timeline]);
  
  return {
    currentSection,
    sectionProgress,
  };
};
```

## 5. 性能優化策略

### 5.1 選擇性訂閱

```typescript
// hooks/useScrollState.ts - 選擇性訂閱滾動狀態
import { useAppStore } from '../stores';

// 只訂閱滾動進度，避免不必要的重新渲染
export const useScrollProgress = () => {
  return useAppStore((state) => state.scroll.progress);
};

// 只訂閱當前區段
export const useCurrentSection = () => {
  return useAppStore((state) => state.scroll.currentSection);
};

// 複合狀態訂閱
export const useScrollInfo = () => {
  return useAppStore((state) => ({
    progress: state.scroll.progress,
    currentSection: state.scroll.currentSection,
    direction: state.scroll.direction,
  }));
};
```

### 5.2 批次狀態更新

```typescript
// stores/middleware/batchUpdates.ts
import { StateCreator } from 'zustand';

export const withBatchUpdates = <T>(
  stateCreator: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  const batchedSet = (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean | undefined,
    action?: string | { type: unknown }
  ) => {
    // 批次更新邏輯
    requestAnimationFrame(() => {
      set(partial, replace, action);
    });
  };
  
  return stateCreator(batchedSet, get, api);
};
```

### 5.3 記憶體管理

```typescript
// stores/slices/cleanupSlice.ts
export interface CleanupSlice {
  cleanup: {
    scheduledCleanups: Set<() => void>;
  };
  
  scheduleCleanup: (cleanup: () => void) => void;
  executeCleanups: () => void;
}

export const createCleanupSlice: StateCreator<
  AppStore,
  [],
  [],
  CleanupSlice
> = (set, get) => ({
  cleanup: {
    scheduledCleanups: new Set(),
  },
  
  scheduleCleanup: (cleanup) => {
    set((state) => ({
      cleanup: {
        ...state.cleanup,
        scheduledCleanups: new Set([...state.cleanup.scheduledCleanups, cleanup]),
      },
    }));
  },
  
  executeCleanups: () => {
    const { scheduledCleanups } = get().cleanup;
    scheduledCleanups.forEach(cleanup => cleanup());
    set((state) => ({
      cleanup: {
        ...state.cleanup,
        scheduledCleanups: new Set(),
      },
    }));
  },
});
```

## 6. 實作優先順序建議

### 6.1 第一階段：基礎狀態管理重構
1. **建立 Zustand store 架構**
   - 設定基本的 slice 結構
   - 實作 UI、滾動、場景狀態管理
   - 加入開發工具和持久化

2. **遷移現有 UiContext**
   - 將現有狀態遷移到 Zustand
   - 保持 API 兼容性
   - 漸進式替換組件中的狀態引用

### 6.2 第二階段：滾動系統整合
1. **統一滾動管理**
   - 實作全域滾動進度追蹤
   - 建立區段檢測機制
   - 整合 R3F useFrame 與滾動狀態

2. **ScrollTrigger 整合**
   - 將現有 ScrollTrigger 邏輯整合到 Zustand
   - 建立統一的動畫時間軸
   - 實作區段間的順暢切換

### 6.3 第三階段：動畫協調系統
1. **Master Timeline**
   - 建立主時間軸控制所有動畫
   - 實作動畫狀態的統一管理
   - 加入動畫性能監控

2. **R3F 動畫整合**
   - 將 3D 動畫與 2D 動畫協調
   - 實作相機切換動畫
   - 建立物件進出場動畫系統

### 6.4 第四階段：性能優化
1. **選擇性更新**
   - 實作精細的狀態訂閱
   - 減少不必要的重新渲染
   - 優化記憶體使用

2. **監控與調試**
   - 加入性能監控面板
   - 實作狀態變化記錄
   - 建立錯誤邊界和恢復機制

## 7. 預期效益

### 7.1 開發體驗改善
- **統一狀態管理**：所有狀態集中管理，減少狀態散佈
- **類型安全**：TypeScript 支援提供更好的開發體驗
- **調試能力**：Redux DevTools 整合，狀態變化可視化
- **代碼重用**：共用狀態邏輯，減少重複代碼

### 7.2 性能提升
- **精細控制**：選擇性訂閱減少不必要的重新渲染
- **批次更新**：減少狀態更新頻率，提升性能
- **記憶體優化**：統一的清理機制，避免記憶體洩漏
- **動畫協調**：避免動畫衝突，提升流暢度

### 7.3 維護性提升
- **模組化設計**：slice 架構便於維護和擴展
- **狀態持久化**：使用者偏好設定自動保存
- **錯誤處理**：統一的錯誤邊界和恢復機制
- **測試友好**：純函數狀態更新便於單元測試

---

*分析完成日期：2025-06-18*  
*重構目標：Zustand + R3F 整合的現代化狀態管理*  
*預期改善：開發體驗 + 性能 + 維護性的全面提升*