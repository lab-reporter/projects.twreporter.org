# Preloader.jsx 組件分析文件

## 1. 組件概覽

**檔案位置：** `src/app/section/Preloader.jsx`  
**檔案大小：** 約 12KB  
**行數：** 253 行  
**複雜度：** 中等（資源預載 + 動畫序列 + 狀態管理）  
**主要功能：** 
- 網站資源預載入功能
- FlipClock 翻牌動畫展示
- 漸進式載入完成提示
- 滾動觸發的淡出退場

## 2. 功能清單

### 2.1 資源預載系統
- **多格式支援**：支援圖片（jpg, png, svg等）、影片（mp4, webm等）、3D模型（glb）
- **並行載入**：使用 Promise.all 同時載入所有資源
- **錯誤處理**：載入失敗時也會繼續進度，避免卡住
- **智能載入策略**：影片只載入 metadata，3D模型使用 HEAD 請求檢查存在性

### 2.2 載入進度管理
- **進度追蹤**：實時計算載入進度百分比
- **最小載入時間**：確保至少顯示 2 秒，避免載入過快的閃爍
- **隨機延遲**：為每個資源添加 100-800ms 隨機延遲，讓進度更平滑
- **狀態同步**：與全局 UiContext 同步 preloader 可見狀態

### 2.3 動畫序列控制
- **FlipClock 動畫**：日期翻牌效果作為主要載入視覺
- **文字淡入**：載入完成後的標題和 logo 淡入效果
- **捲動提示**：動畫完成後顯示捲動指引
- **淡出退場**：捲動 100px 後觸發 0.8 秒淡出動畫

### 2.4 用戶體驗優化
- **SSR 相容**：使用 isClient 狀態避免客戶端/伺服器不一致
- **滾動控制**：禁用瀏覽器的滾動恢復功能
- **狀態保護**：確保動畫序列正確執行，避免跳過步驟
- **視覺回饋**：清楚的文字指引和動畫提示

## 3. 視覺效果分析

### 3.1 載入階段動畫
- **FlipClock 主導**：替代傳統進度條的創新視覺效果
- **全黑背景**：營造沉浸式的載入體驗
- **時間控制**：最小 2 秒載入時間確保用戶能看到動畫

### 3.2 完成階段動畫
- **階段性顯示**：logo → 標題 → 捲動提示的三段式淡入
- **時間間隔**：文字立即顯示，捲動提示延遲 300ms
- **過渡效果**：1 秒的 ease-in-out 過渡動畫

### 3.3 退場動畫
- **滾動觸發**：100px 滾動距離作為觸發點
- **淡出效果**：500ms 的 opacity 和 visibility 過渡
- **延遲移除**：淡出完成後 800ms 才真正移除元素

## 4. 技術實作分析

### 4.1 資源預載架構
```javascript
// 核心預載邏輯
const preloadResource = (url) => {
    const fileExtension = url.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
        // 圖片：使用 Image 物件
        const img = new Image();
        img.onload = completeLoading;
        img.src = url;
    } else if (['mp4', 'webm', 'mov'].includes(fileExtension)) {
        // 影片：只載入 metadata
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = completeLoading;
    } else {
        // 其他：使用 HEAD 請求檢查存在性
        fetch(url, { method: 'HEAD' })
            .then(() => completeLoading());
    }
};
```

### 4.2 狀態管理架構
```javascript
// 主要狀態變數
const [loadingProgress, setLoadingProgress] = useState(0);        // 載入進度
const [isLoading, setIsLoading] = useState(true);               // 載入狀態
const [flipClockCompleted, setFlipClockCompleted] = useState(false); // FlipClock 完成
const [textVisible, setTextVisible] = useState(false);          // 文字可見
const [scrollHintVisible, setScrollHintVisible] = useState(false);   // 捲動提示
const [preloaderVisible, setPreloaderVisible] = useState(true);  // Preloader 可見
const [fadeOut, setFadeOut] = useState(false);                  // 淡出狀態

// Ref 變數
const loadedResources = useRef(0);     // 已載入資源數
const totalResources = useRef(0);     // 總資源數
const scrollAmount = useRef(0);       // 滾動量
const startTime = useRef(Date.now()); // 開始時間
```

### 4.3 動畫序列控制
```javascript
// FlipClock 完成後的連鎖反應
useEffect(() => {
    if (flipClockCompleted && !isLoading) {
        setTextVisible(true);              // 立即顯示文字
        setTimeout(() => {
            setScrollHintVisible(true);    // 300ms 後顯示捲動提示
        }, 300);
    }
}, [flipClockCompleted, isLoading]);

// 滾動觸發淡出
const handleScroll = () => {
    if (!isLoading && textVisible && scrollAmount.current > 100 && !fadeOut) {
        setFadeOut(true);
        setTimeout(() => {
            setPreloaderVisible(false);    // 800ms 後移除
        }, 800);
    }
};
```

## 5. R3F 重構方案

### 5.1 組件結構重構
```jsx
// R3F 版本的 Preloader（主要保持原架構）
const PreloaderR3F = () => {
    return (
        <div className={`preloader ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {/* 載入階段：FlipClock + 進度管理 */}
            {(isLoading || !flipClockCompleted) && (
                <div className="absolute inset-0 bg-black">
                    <FlipClockR3F onComplete={handleFlipClockComplete} />
                </div>
            )}
            
            {/* 完成階段：文字展示 + 捲動提示 */}
            {!isLoading && flipClockCompleted && (
                <PreloaderContent 
                    textVisible={textVisible}
                    scrollHintVisible={scrollHintVisible}
                />
            )}
        </div>
    );
};
```

### 5.2 資源預載優化
```javascript
// 改進的預載策略
const useResourcePreloader = (resources) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    
    useEffect(() => {
        const preloadWithPriority = async () => {
            // 分優先級載入：critical → important → optional
            const criticalResources = resources.filter(r => r.priority === 'critical');
            const importantResources = resources.filter(r => r.priority === 'important');
            const optionalResources = resources.filter(r => r.priority === 'optional');
            
            // 階段性載入
            await preloadBatch(criticalResources);
            setProgress(33);
            
            await preloadBatch(importantResources);
            setProgress(66);
            
            await preloadBatch(optionalResources);
            setProgress(100);
            setIsComplete(true);
        };
        
        preloadWithPriority();
    }, [resources]);
    
    return { progress, isComplete };
};
```

### 5.3 FlipClock 3D 增強版
```jsx
// 可選的 3D FlipClock 效果
const FlipClock3D = ({ onComplete }) => {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <group>
                {/* 3D 翻牌效果 */}
                <FlipCard3D digit="2" position={[-1, 0, 0]} />
                <FlipCard3D digit="0" position={[0, 0, 0]} />
                <FlipCard3D digit="2" position={[1, 0, 0]} />
                <FlipCard3D digit="5" position={[2, 0, 0]} />
            </group>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 5]} intensity={1} />
        </Canvas>
    );
};

const FlipCard3D = ({ digit, position }) => {
    const meshRef = useRef();
    
    useFrame((state) => {
        // 3D 翻牌動畫邏輯
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });
    
    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[0.8, 1.2, 0.1]} />
            <meshStandardMaterial color="#ffffff" />
        </mesh>
    );
};
```

## 6. 風險評估

### 6.1 技術風險

#### 6.1.1 低風險項目
- **資源預載邏輯**：主要為 JavaScript 邏輯，R3F 重構影響較小
- **動畫序列控制**：使用標準 React state，易於保持
- **滾動檢測**：DOM 事件處理，重構不受影響

#### 6.1.2 中風險項目
- **FlipClock 組件**：如果要加入 3D 效果，需要重新實現
- **全局狀態同步**：需要確保與 R3F 場景的狀態一致性
- **載入時機控制**：3D 資源載入可能改變預載時機

### 6.2 UX 風險

#### 6.2.1 視覺一致性風險
- **動畫時序**：FlipClock 時機可能因 3D 渲染而有差異
- **過渡效果**：淡入淡出動畫需要與 3D 場景切換協調
- **載入體驗**：3D 資源載入可能改變進度顯示方式

#### 6.2.2 性能風險
- **3D 預載**：如果加入 3D FlipClock，會增加 GPU 負擔
- **記憶體使用**：預載資源與 3D 場景同時存在可能影響記憶體
- **載入效率**：需要平衡視覺效果與實際載入速度

## 7. 驗收標準

### 7.1 功能驗收

#### 7.1.1 資源預載功能 ✅
- [ ] 所有指定資源正確預載（3D模型、圖片、影片）
- [ ] 載入進度準確計算和顯示
- [ ] 載入失敗時不阻塞整體進度
- [ ] 最小載入時間（2秒）正確執行
- [ ] 隨機延遲效果讓進度平滑

#### 7.1.2 動畫序列功能 ✅
- [ ] FlipClock 動畫正確執行並觸發完成回調
- [ ] 文字淡入動畫時序正確
- [ ] 捲動提示在適當時機顯示
- [ ] 滾動 100px 觸發淡出效果
- [ ] 淡出動畫完成後正確移除元素

#### 7.1.3 狀態管理功能 ✅
- [ ] 與 UiContext 的全局狀態正確同步
- [ ] SSR 兼容性正常，無 hydration 錯誤
- [ ] 瀏覽器滾動恢復功能正確禁用
- [ ] 組件卸載時正確清理事件監聽器

### 7.2 視覺驗收

#### 7.2.1 載入階段視覺 🎨
- [ ] FlipClock 動畫流暢執行
- [ ] 全黑背景正確顯示
- [ ] 載入時間感受合理（不會太快或太慢）

#### 7.2.2 完成階段視覺 ✨
- [ ] Logo 和標題淡入效果自然
- [ ] 捲動提示動畫時機恰當
- [ ] 文字樣式和字體正確顯示
- [ ] 整體視覺層次清楚

### 7.3 性能驗收

#### 7.3.1 載入性能 ⚡
- [ ] 預載不影響頁面首次渲染
- [ ] 記憶體使用量在合理範圍
- [ ] 網路請求合理分散，不會造成阻塞
- [ ] 在慢速網路下依然能正常運作

#### 7.3.2 運行性能 🚀
- [ ] 動畫流暢，無卡頓現象
- [ ] 滾動檢測靈敏度適中
- [ ] 組件切換無明顯延遲
- [ ] 資源清理及時，無記憶體洩漏

### 7.4 兼容性驗收

#### 7.4.1 瀏覽器兼容 🌐
- [ ] 主流瀏覽器（Chrome、Safari、Firefox、Edge）
- [ ] 移動瀏覽器正常運作
- [ ] 不同螢幕尺寸下顯示正常

#### 7.4.2 設備兼容 📱
- [ ] 桌面端完整功能
- [ ] 平板端適配良好
- [ ] 手機端基本功能可用
- [ ] 觸控操作流暢

## 結論

Preloader.jsx 是相對簡單但重要的組件，主要負責網站的首次載入體驗。R3F 重構的重點在於：

1. **保持核心功能**：資源預載和動畫序列控制是核心，應該保持不變
2. **可選的 3D 增強**：可以考慮將 FlipClock 升級為 3D 效果，但需權衡性能
3. **狀態同步優化**：確保與主要 3D 場景的狀態管理一致
4. **載入策略優化**：可以實作更智能的分優先級載入策略

重構風險相對較低，建議：
- 第一階段：保持現有功能，確保基本體驗不變
- 第二階段：可選的 3D FlipClock 增強效果
- 第三階段：整合載入策略優化

---

*分析完成日期：2025-06-18*  
*重構目標：保持載入體驗 + 可選 3D 增強*  
*風險等級：中等（主要為功能保持 + 可選增強）*