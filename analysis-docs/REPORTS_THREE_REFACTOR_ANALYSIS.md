# ReportsThree.jsx 組件分析文件

## 1. 組件概覽

**檔案位置：** `src/app/section/ReportsThree.jsx`  
**檔案大小：** 約 31KB  
**行數：** 775 行  
**複雜度：** 極高（3D 圓柱畫廊 + 滾動控制 + 多媒體支援）  
**主要功能：** 
- 3D 圓柱形報導畫廊展示
- 滾動觸發的圓柱旋轉動畫
- 支援圖片和影片媒體展示
- 聚光燈動態跟隨效果

## 2. 功能清單

### 2.1 3D 場景管理
- **Three.js 圓柱畫廊**：創建彎曲平面幾何體組成圓柱形展示
- **魚眼相機效果**：120° FOV 廣角視野
- **聚光燈系統**：動態跟隨當前項目的聚光燈照明
- **響應式設計**：支援不同螢幕尺寸的圓柱半徑調整

### 2.2 媒體處理系統
- **多格式支援**：支援圖片（jpg, png, webp等）和影片（mp4, webm等）
- **智能載入機制**：影片自動播放和紋理更新系統
- **錯誤處理**：載入失敗時顯示佔位紋理
- **編碼處理**：支援中文路徑的URI編碼

### 2.3 交互功能
- **點擊檢測**：使用射線檢測精確識別點擊的媒體項目
- **影片控制**：點擊影片可播放/暫停
- **游標提示**：懸停時顯示手型游標
- **側邊欄整合**：點擊開啟對應項目的詳細內容

### 2.4 滾動控制系統
- **圓柱旋轉**：基於滾動進度的離散式旋轉動畫
- **緩衝區設計**：前後5%緩衝區避免過度滾動
- **聚光燈跟隨**：光源動態調整照射角度
- **平滑過渡**：使用GSAP實現流暢的旋轉動畫

### 2.5 動態幾何系統
- **彎曲平面**：自定義幾何體創建曲面展示效果
- **響應式尺寸**：根據項目數量和圓柱半徑動態調整圖片大小
- **UV映射**：精確的紋理座標映射

## 3. 視覺效果分析

### 3.1 圓柱畫廊效果
- **圓柱半徑**：桌面8、平板6、手機4的響應式設計
- **彎曲度**：使用 `width / radius * 1.2` 計算彎曲角度
- **分段精度**：X軸分段 `segments * 6`，Y軸分段 `height * 15`

### 3.2 聚光燈效果
- **光源強度**：10強度的主聚光燈 + 0.1強度環境光
- **光錐角度**：`Math.PI * 0.4` 擴大角度覆蓋中央+兩側
- **跟隨係數**：0.2的輕微跟隨強度保持穩定性
- **邊緣軟化**：0.1的penumbra值提供自然過渡

### 3.3 滾動動畫
- **離散旋轉**：基於項目索引的精確定位而非連續旋轉
- **緩動效果**：0.5秒持續時間的"power2.out"緩動
- **防衝突機制**：`overwrite: true`避免動畫重疊

## 4. 技術實作分析

### 4.1 核心架構
```javascript
// 主要 Refs 管理
const sceneRef = useRef(null);           // Three.js 場景
const cameraRef = useRef(null);          // 相機引用
const rendererRef = useRef(null);        // 渲染器引用
const galleryGroupRef = useRef(null);    // 畫廊群組
const blocksRef = useRef([]);            // 所有圖片方塊
const clickableObjectsRef = useRef([]);  // 可點擊物件
const animationFrameRef = useRef(null);  // 動畫幀引用
```

### 4.2 彎曲平面幾何體創建
```javascript
const createCurvedPlane = (width, height, radius, segments) => {
    const segmentsX = segments * 6;
    const segmentsY = Math.floor(height * 15);
    const theta = width / radius * 1.2;
    
    // 生成頂點: 圓柱面座標轉換
    const xAngle = (x / segmentsX - 0.5) * theta;
    const xPos = Math.sin(xAngle) * radius;
    const zPos = Math.cos(xAngle) * radius;
};
```

### 4.3 媒體載入系統
```javascript
const loadMediaTexture = async (mediaPath) => {
    const isVideo = videoFormats.includes(fileExtension);
    
    if (isVideo) {
        // 影片紋理處理
        const videoTexture = new THREE.VideoTexture(video);
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
    } else {
        // 圖片紋理處理
        const texture = textureLoader.load(imagePath);
    }
};
```

### 4.4 滾動控制邏輯
```javascript
onUpdate: (self) => {
    const rotationFraction = (self.progress - startBuffer) / activeRange;
    const currentImageIndex = Math.round(rotationFraction * (totalProjects - 1));
    const targetRotation = -sectionAngle * clampedIndex;
    
    gsap.to(galleryGroup.rotation, {
        y: targetRotation,
        duration: 0.5,
        ease: "power2.out"
    });
}
```

## 5. R3F 重構方案

### 5.1 組件結構重構
```jsx
// R3F 重構架構
const ReportsThreeR3F = () => {
    return (
        <div className="relative h-[600vh]">
            <div className="sticky top-0 w-full h-screen">
                <Canvas
                    camera={{ position: [0, 0, calculateCameraDistance()], fov: 120 }}
                    gl={{ antialias: true, alpha: true }}
                >
                    <ScrollControls pages={6} damping={0.1}>
                        <ReportsGallery />
                    </ScrollControls>
                    <Lighting />
                </Canvas>
                <ProjectTitle />
            </div>
        </div>
    );
};
```

### 5.2 圓柱畫廊重構
```jsx
const ReportsGallery = () => {
    const groupRef = useRef();
    const scroll = useScroll();
    
    useFrame(() => {
        const progress = scroll.offset;
        const bufferStart = 0.05;
        const activeRange = 0.9;
        
        if (progress >= bufferStart && progress <= 0.95) {
            const rotationFraction = (progress - bufferStart) / activeRange;
            const currentIndex = Math.round(rotationFraction * (projects.length - 1));
            const targetRotation = -sectionAngle * currentIndex;
            
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y, 
                targetRotation, 
                0.1
            );
        }
    });
    
    return (
        <group ref={groupRef}>
            {projects.map((project, index) => (
                <CurvedMediaPanel 
                    key={project.id}
                    project={project}
                    index={index}
                    radius={cylinderRadius}
                />
            ))}
        </group>
    );
};
```

### 5.3 彎曲媒體面板重構
```jsx
const CurvedMediaPanel = ({ project, index, radius }) => {
    const meshRef = useRef();
    const texture = useTexture(project.path);
    
    const curvedGeometry = useMemo(() => {
        return createCurvedPlaneGeometry(width, height, radius, 15);
    }, [width, height, radius]);
    
    const handleClick = () => {
        // R3F 事件處理
        handleProjectClick(project);
    };
    
    return (
        <group rotation={[0, sectionAngle * index, 0]}>
            <mesh 
                ref={meshRef}
                geometry={curvedGeometry}
                onClick={handleClick}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'default'}
            >
                <meshPhongMaterial 
                    map={texture} 
                    side={THREE.DoubleSide}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
};
```

### 5.4 聚光燈系統重構
```jsx
const DynamicSpotlight = () => {
    const spotlightRef = useRef();
    const targetRef = useRef();
    const scroll = useScroll();
    
    useFrame(() => {
        const currentIndex = getCurrentProjectIndex(scroll.offset);
        const currentAngle = sectionAngle * currentIndex;
        
        // 動態調整聚光燈目標
        const offsetStrength = LIGHT_CONFIG.followStrength;
        const targetX = Math.sin(currentAngle) * radius * offsetStrength;
        const targetZ = (Math.cos(currentAngle) - 1) * radius * offsetStrength;
        
        targetRef.current.position.set(targetX, 0, targetZ);
    });
    
    return (
        <>
            <spotLight
                ref={spotlightRef}
                position={[0, 0, cameraDistance]}
                target={targetRef.current}
                intensity={LIGHT_CONFIG.spotLightIntensity}
                angle={LIGHT_CONFIG.spotLightAngle}
                penumbra={LIGHT_CONFIG.penumbra}
            />
            <object3D ref={targetRef} position={[0, 0, 0]} />
            <ambientLight intensity={LIGHT_CONFIG.ambientIntensity} />
        </>
    );
};
```

## 6. 風險評估

### 6.1 技術風險

#### 6.1.1 極高風險項目
- **彎曲幾何體重構**：原本的自定義幾何體創建邏輯複雜，R3F中需要重新實現
- **影片紋理處理**：R3F的影片紋理機制與原本的THREE.VideoTexture可能有差異
- **聚光燈跟隨系統**：動態光照效果的精確復現具有挑戰性

#### 6.1.2 高風險項目
- **滾動同步問題**：離散式旋轉vs連續滾動的同步精度
- **媒體載入錯誤處理**：R3F的Suspense機制可能改變錯誤處理流程
- **性能優化**：大量彎曲幾何體的渲染效能需要特別優化

### 6.2 UX 風險

#### 6.2.1 視覺一致性風險
- **光照效果差異**：聚光燈的照射範圍和強度可能不一致
- **旋轉動畫流暢度**：離散式旋轉的平滑度可能受影響
- **媒體載入體驗**：影片自動播放和載入順序可能改變

#### 6.2.2 互動體驗風險
- **點擊精度**：R3F的事件系統可能改變射線檢測精度
- **影片播放控制**：影片播放/暫停的回饋機制可能不同
- **游標狀態管理**：懸停效果的觸發時機可能有差異

## 7. 驗收標準

### 7.1 功能驗收

#### 7.1.1 3D 畫廊功能 ✅
- [ ] 圓柱形畫廊正確展示所有報導項目
- [ ] 彎曲平面幾何體視覺效果與原版一致
- [ ] 響應式圓柱半徑調整正常（桌面8、平板6、手機4）
- [ ] 圖片和影片媒體正確載入和顯示
- [ ] 載入失敗時顯示佔位紋理

#### 7.1.2 滾動控制功能 ✅
- [ ] 滾動觸發圓柱旋轉方向正確
- [ ] 離散式旋轉精確定位到各項目
- [ ] 緩衝區設計正確（前後5%）
- [ ] 旋轉動畫流暢，持續時間約0.5秒
- [ ] 防止動畫衝突機制正常

#### 7.1.3 互動功能 ✅
- [ ] 點擊圖片正確開啟側邊欄
- [ ] 點擊影片可控制播放/暫停
- [ ] 射線檢測精確識別點擊對象
- [ ] 懸停時游標正確變為手型
- [ ] 項目數據正確傳遞到側邊欄

### 7.2 視覺驗收

#### 7.2.1 光照效果 💡
- [ ] 聚光燈強度和範圍與原版一致
- [ ] 聚光燈動態跟隨當前項目
- [ ] 環境光強度適當（0.1）
- [ ] 邊緣軟化效果（penumbra: 0.1）正確

#### 7.2.2 幾何效果 📐
- [ ] 彎曲平面弧度與原版一致
- [ ] UV紋理映射正確無變形
- [ ] 圓柱排列均勻分佈
- [ ] 魚眼相機視野效果（120° FOV）正確

### 7.3 性能驗收

#### 7.3.1 渲染性能 ⚡
- [ ] 60 FPS 穩定運行
- [ ] 影片紋理更新流暢
- [ ] 滾動過程無卡頓
- [ ] 記憶體使用量合理

#### 7.3.2 載入性能 📥
- [ ] 媒體載入進度合理
- [ ] 影片自動播放成功率高
- [ ] 錯誤處理機制不影響整體性能
- [ ] 中文路徑編碼處理正確

### 7.4 兼容性驗收

#### 7.4.1 瀏覽器兼容 🌐
- [ ] Chrome、Safari、Firefox、Edge 最新版本
- [ ] 影片格式支援（mp4, webm, mov等）
- [ ] 圖片格式支援（jpg, png, webp等）

#### 7.4.2 設備兼容 📱
- [ ] 桌面端完整功能
- [ ] 平板端優化體驗
- [ ] 手機端基本功能可用
- [ ] 觸控操作支援

### 7.5 整合驗收

#### 7.5.1 UI 整合 🔗
- [ ] 與UiContext的整合正常
- [ ] 側邊欄開啟功能正常
- [ ] 動態標題顯示正確
- [ ] 滾動進度與標題同步

#### 7.5.2 數據整合 📊
- [ ] projects.json數據正確篩選
- [ ] 媒體路徑解析正確
- [ ] 項目內容映射正確
- [ ] 錯誤狀態處理正常

## 結論

ReportsThree.jsx 是技術複雜度極高的組件，結合了複雜的3D幾何體創建、多媒體處理、動態光照和精確的滾動控制。重構的關鍵挑戰在於：

1. **彎曲幾何體重現**：需要在R3F中重新實現複雜的圓柱面幾何體創建邏輯
2. **影片紋理處理**：確保影片載入、播放控制和紋理更新的完整性
3. **聚光燈跟隨系統**：精確復現動態光照的跟隨效果
4. **滾動同步精度**：保持離散式旋轉的精確定位和流暢過渡

建議採用分階段重構策略：
1. 第一階段：實現基本的圓柱畫廊和圖片展示
2. 第二階段：加入影片支援和載入錯誤處理
3. 第三階段：實現聚光燈跟隨和完整互動功能
4. 第四階段：性能優化和兼容性測試

---

*分析完成日期：2025-06-18*  
*重構目標：R3F + TypeScript 現代化架構*  
*風險等級：極高（複雜幾何體 + 多媒體處理 + 動態光照）*