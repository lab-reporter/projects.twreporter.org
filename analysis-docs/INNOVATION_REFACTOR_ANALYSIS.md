# Innovation.jsx 組件分析文件

## 1. 組件概覽

**檔案位置：** `src/app/section/Innovation.jsx`  
**檔案大小：** 約 22KB  
**行數：** 661 行  
**複雜度：** 極高（3D 場景 + 滾動序列 + 互動系統）  
**主要功能：** 
- 展示報導者的創新項目
- 透過 3D 模型序列展示不同創新內容
- 滾動觸發的模型切換動畫

## 2. 功能清單

### 2.1 3D 場景管理
- **Three.js 場景初始化**：建立 3D 場景、相機、渲染器
- **光照系統**：包含環境光和方向光，支援陰影效果
- **模型載入**：使用 GLTF/GLB 格式，支援 DRACO 壓縮
- **動畫系統**：支援模型內建動畫播放和循環

### 2.2 互動功能
- **滑鼠懸停效果**：當滑鼠懸停在 3D 模型上時，游標變為手型
- **點擊互動**：點擊 3D 模型開啟對應的側邊欄內容
- **射線檢測**：精確檢測滑鼠與 3D 物件的交互

### 2.3 滾動控制系統
- **序列展示**：11 個創新項目按 ID 順序依序展示
- **滾動觸發**：基於 ScrollTrigger 實現滾動控制
- **位置動畫**：模型從原始位置移動到鏡頭前 (0, 0, 20)
- **縮放效果**：當前展示的模型放大 1.2 倍以增強聚焦效果

### 2.4 UI 展示
- **載入進度條**：顯示 3D 模型載入進度
- **項目資訊展示**：顯示當前項目的標題和副標題
- **區域檢測**：檢測使用者是否在 Innovation 區域內

### 2.5 狀態管理
- **場景就緒狀態**：追蹤所有模型是否載入完成
- **當前展示項目**：追蹤目前在鏡頭前的 3D 模型
- **載入狀態**：管理載入進度和UI顯示

## 3. 視覺效果分析

### 3.1 滾動序列動畫
- **觸發區域**：整個 Innovation 區域高度為 1000vh
- **緩衝區設計**：開始 10% 和結束 10% 為緩衝區
- **過渡效果**：使用 GSAP 的 "power2.out" 緩動函數
- **動畫時長**：每個模型移動動畫持續 1 秒

### 3.2 3D 模型效果
- **聚焦動畫**：當前模型移動到 (0, 0, 20) 位置
- **縮放效果**：當前模型放大至原始尺寸的 1.2 倍
- **位置重置**：非當前模型回到原始位置和尺寸
- **陰影效果**：所有模型支援投射和接收陰影

### 3.3 光照效果
- **環境光**：0.1 強度的白色環境光
- **方向光**：位於 (10, 10, 10) 的方向光，支援陰影
- **陰影品質**：使用 PCFSoftShadowMap 實現軟陰影效果

## 4. 技術實作分析

### 4.1 技術棧
- **Three.js**：3D 場景渲染和管理
- **GSAP + ScrollTrigger**：滾動動畫控制
- **React Hooks**：狀態管理和生命週期
- **Next.js**：路由和導航
- **GLTF/GLB 載入**：支援 DRACO 壓縮的 3D 模型

### 4.2 狀態管理架構
```javascript
const stateRef = useRef({
  controls: null,         // 軌道控制器
  camera: null,          // 相機引用
  modelMeshes: [],       // 所有 3D 模型
  isSceneReady: false,   // 場景就緒狀態
  loadedItems: 0,        // 已載入項目數
  totalItems: 0,         // 總項目數
  originalScales: {},    // 原始縮放比例
  scrollTrigger: null,   // 滾動觸發器
  animationMixers: [],   // 動畫混合器
  clock: new THREE.Clock() // 時鐘
});
```

### 4.3 資料結構
- **projects.json**：包含 11 個 innovation 項目
- **每個項目包含**：id、path、position、title、subtitle、scale、rotation
- **材質配置**：支援自定義材質屬性和 defaultMaterialConfigs

## 5. R3F 重構方案

### 5.1 組件結構重構
```jsx
// R3F 重構方案
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei'
import { useScroll } from '@react-three/drei'

const InnovationScene = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 40], fov: 45 }}
      gl={{ 
        antialias: true, 
        alpha: true,
        shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap }
      }}
    >
      <ScrollControls pages={10} damping={0.1}>
        <InnovationModels />
      </ScrollControls>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </Canvas>
  )
}
```

### 5.2 模型載入重構
```jsx
const InnovationModel = ({ modelData, index, total }) => {
  const { scene, animations } = useGLTF(modelData.path)
  const { actions } = useAnimations(animations, scene)
  const scroll = useScroll()
  
  useFrame(() => {
    const progress = scroll.offset
    const currentIndex = Math.floor(progress * total)
    
    if (currentIndex === index) {
      // 移動到鏡頭前
      scene.position.lerp(new THREE.Vector3(0, 0, 20), 0.1)
      scene.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
    } else {
      // 回到原位
      scene.position.lerp(modelData.position, 0.1)
      scene.scale.lerp(modelData.scale, 0.1)
    }
  })
  
  return <primitive object={scene} />
}
```

### 5.3 滾動控制重構
```jsx
const ScrollControlledSequence = ({ children }) => {
  const scroll = useScroll()
  const [currentIndex, setCurrentIndex] = useState(-1)
  
  useFrame(() => {
    const progress = scroll.offset
    const bufferStart = 0.1
    const bufferEnd = 0.9
    
    if (progress >= bufferStart && progress <= bufferEnd) {
      const effectiveProgress = (progress - bufferStart) / (bufferEnd - bufferStart)
      const newIndex = Math.floor(effectiveProgress * children.length)
      setCurrentIndex(Math.min(newIndex, children.length - 1))
    } else {
      setCurrentIndex(-1)
    }
  })
  
  return children.map((child, index) => 
    React.cloneElement(child, { 
      key: index, 
      isActive: index === currentIndex 
    })
  )
}
```

## 6. 風險評估

### 6.1 技術風險
**高風險項目：**
- **複雜的滾動控制邏輯**：原本的 ScrollTrigger 邏輯複雜，R3F 的 useScroll 可能需要重新設計
- **11 個 3D 模型的同步載入**：R3F 的 Suspense 機制可能改變載入體驗
- **動畫混合器管理**：原本的 THREE.AnimationMixer 需要在 R3F 中重新整合

**中風險項目：**
- **射線檢測精度**：R3F 的事件系統可能與原本的射線檢測有差異
- **材質配置系統**：materialUtils 的整合需要適配 R3F 的材質系統
- **效能優化**：大量 3D 模型的渲染效能需要特別注意

### 6.2 UX 風險
**視覺一致性風險：**
- **滾動觸發的精確度**：緩衝區設計和過渡效果可能不一致
- **模型載入順序**：可能影響首次載入的視覺體驗
- **動畫流暢度**：R3F 的 useFrame 可能改變動畫的流暢度

**互動體驗風險：**
- **點擊反應靈敏度**：R3F 的事件系統可能改變點擊體驗
- **滑鼠懸停效果**：游標變化的時機可能不同
- **載入進度指示**：需要重新設計載入狀態的顯示方式

## 7. 驗收標準

### 7.1 功能驗收
**3D 展示功能：**
- [ ] 11 個創新項目 3D 模型正確載入並顯示
- [ ] 滾動時模型按正確順序依序移動到鏡頭前
- [ ] 當前模型正確放大至 1.2 倍
- [ ] 非當前模型正確回到原始位置和尺寸
- [ ] 模型內建動畫正常播放（如果有）

**互動功能：**
- [ ] 滑鼠懸停時游標正確變為手型
- [ ] 點擊 3D 模型正確開啟對應的側邊欄內容
- [ ] 射線檢測精確識別被點擊的模型
- [ ] 項目資訊正確顯示在畫面下方

### 7.2 視覺驗收
**滾動動畫：**
- [ ] 滾動觸發的時機和原版一致
- [ ] 緩衝區設計正確實現（開始 10%，結束 10%）
- [ ] 模型移動動畫流暢，持續時間約 1 秒
- [ ] 過渡效果使用 "power2.out" 或類似的緩動函數

**3D 效果：**
- [ ] 光照效果與原版一致（環境光 + 方向光）
- [ ] 陰影效果正確顯示
- [ ] 模型材質和顏色與原版一致
- [ ] 相機位置和視角與原版相同

### 7.3 效能驗收
**載入效能：**
- [ ] 所有 3D 模型在 10 秒內載入完成
- [ ] 載入進度條正確顯示載入進度
- [ ] 載入完成後場景立即可用
- [ ] 記憶體使用量在合理範圍內

**運行效能：**
- [ ] 滾動時幀率保持在 30 FPS 以上
- [ ] 模型動畫流暢不卡頓
- [ ] 互動反應時間在 100ms 以內
- [ ] 長時間使用不出現記憶體洩漏

### 7.4 兼容性驗收
**瀏覽器兼容：**
- [ ] Chrome、Firefox、Safari、Edge 最新版本正常運行
- [ ] 移動端瀏覽器基本功能可用

**裝置兼容：**
- [ ] 桌面端完整功能可用
- [ ] 平板端主要功能可用
- [ ] 手機端基本展示可用
- [ ] 不同解析度下顯示正常

### 7.5 整合驗收
**與其他組件整合：**
- [ ] 與 UiContext 的整合正常
- [ ] 側邊欄開啟功能正常
- [ ] 與路由系統整合正常
- [ ] 與其他區塊的滾動協調正常

**資料整合：**
- [ ] projects.json 資料正確讀取
- [ ] 材質配置正確套用
- [ ] 內容映射正確執行
- [ ] 錯誤處理機制正常

## 結論

Innovation.jsx 是整個專案中最複雜的組件之一，包含了豐富的 3D 展示效果和複雜的滾動控制邏輯。重構時需要特別注意滾動觸發的精確度、3D 模型的載入和展示效果，以及與其他組件的整合。建議分階段進行重構，先完成基本的 3D 展示功能，再逐步加入滾動控制和互動功能。

---

*分析完成日期：2025-06-17*  
*重構目標：R3F + TypeScript 現代化架構*  
*風險等級：極高（複雜的 3D 序列展示 + 滾動控制）*