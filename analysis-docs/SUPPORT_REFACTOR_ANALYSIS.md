# Support.jsx 組件分析文件

## 1. 組件概覽

**檔案位置：** `src/app/section/Support.jsx`  
**檔案大小：** 約 11KB  
**行數：** 277 行  
**複雜度：** 中等（數字動畫 + 表單驗證 + 彩帶效果）  
**主要功能：** 
- 展示定期定額支持者募集活動
- 數字動畫展示當前支持人數和進度
- 互動式金額選擇和自訂輸入
- 慶祝彩帶效果和外部捐款導向

## 2. 功能清單

### 2.1 數據展示系統
- **當前支持者**：7,964 位已支持者（顯示動畫）
- **目標支持者**：10,000 位定期定額支持者
- **進度計算**：79.64% 的完成進度
- **下一位序號**：動態顯示「成為第 7,965 位支持者」

### 2.2 滾動觸發動畫
- **Intersection Observer**：進入視窗 30% 時觸發動畫
- **數字計數動畫**：3 秒 easeOutQuart 緩動從 0 到 7,964
- **同步動畫**：支持者人數和序號同時增加
- **單次觸發**：使用 `animationStarted` 確保動畫只觸發一次

### 2.3 金額選擇系統
- **預設選項**：500、1,000、3,000 元三個按鈕
- **自訂金額**：支援用戶輸入任意金額（最低 100 元）
- **輸入驗證**：只允許數字輸入，即時驗證最低金額
- **狀態管理**：選擇預設金額會清空自訂輸入，反之亦然

### 2.4 視覺回饋系統
- **彩帶效果**：使用 canvas-confetti 慶祝金額選擇
- **差異化顏色**：不同金額對應不同的彩帶顏色組合
- **多重噴發**：基本效果 + 左右兩側延遲噴發
- **進度條視覺**：金色進度條配陰影光暈效果

### 2.5 外部整合功能
- **捐款導向**：構建帶參數的外部支持頁面 URL
- **新視窗開啟**：使用 `window.open` 避免離開當前頁面
- **安全設置**：使用 `noopener,noreferrer` 增強安全性

## 3. 視覺效果分析

### 3.1 進度條設計
- **金色主題**：`#c9a156` 金色配 `rgba(201,161,86,0.3)` 光暈
- **平滑過渡**：500ms 的寬度變化動畫
- **圓角設計**：`rounded-xl` 現代化視覺風格
- **相對定位**：支援響應式寬度調整

### 3.2 數字動畫效果
- **緩動函數**：easeOutQuart (`1 - Math.pow(1 - progress, 4)`) 創造自然減速
- **格式化顯示**：使用 `toLocaleString()` 添加千分位分隔符
- **同步更新**：兩個數字（7,964 和 7,965）保持同步增長
- **視覺強調**：大字體 + 粗體突出重點數字

### 3.3 彩帶效果配置
```javascript
// 不同金額的顏色主題
const confettiColors = {
    500: ['#FFC107', '#FF5722', '#03A9F4'],  // 黃橙藍
    1000: ['#4CAF50', '#9C27B0', '#E91E63'], // 綠紫紅
    3000: ['#c9a156', '#FF4081', '#3F51B5']  // 金紅藍
};
```

## 4. 技術實作分析

### 4.1 核心狀態管理
```javascript
// 數據狀態
const [finalSupporterCount] = useState(7964);              // 目標人數
const [displaySupporterCount, setDisplaySupporterCount] = useState(0); // 動畫人數
const [displayNextSupporterNumber, setDisplayNextSupporterNumber] = useState(1); // 下一位序號
const [animationStarted, setAnimationStarted] = useState(false); // 動畫控制

// 表單狀態
const [selectedAmount, setSelectedAmount] = useState(null);     // 選中金額
const [customAmount, setCustomAmount] = useState('');          // 自訂金額
const [errorMessage, setErrorMessage] = useState('');          // 錯誤訊息
```

### 4.2 滾動觸發動畫
```javascript
useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !animationStarted) {
                    setAnimationStarted(true);
                    
                    // 數字動畫邏輯
                    const animationDuration = 3000;
                    const animate = () => {
                        const progress = Math.min(elapsed / animationDuration, 1);
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        
                        const currentValue = Math.floor(
                            startValue + (endValue - startValue) * easeOutQuart
                        );
                        
                        setDisplaySupporterCount(currentValue);
                        setDisplayNextSupporterNumber(currentValue + 1);
                    };
                }
            });
        },
        { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );
}, []);
```

### 4.3 表單驗證邏輯
```javascript
// 自訂金額輸入處理
const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // 只允許數字輸入
    if (value === '' || /^\d+$/.test(value)) {
        setCustomAmount(value);
        setSelectedAmount(null);
        
        // 即時驗證最低金額
        if (value !== '' && Number(value) < 100) {
            setErrorMessage('請輸入至少 100 元');
        } else {
            setErrorMessage('');
        }
    }
};

// 支持按鈕可用性檢查
const canSupport = selectedAmount || (customAmount && Number(customAmount) >= 100);
```

## 5. R3F 重構方案

### 5.1 組件結構重構
```jsx
// R3F 版本的 Support
const SupportR3F = () => {
    return (
        <div className="w-full min-h-screen relative">
            {/* 2D UI 層 */}
            <SupportUI />
            
            {/* 3D 背景效果層 */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <SupportBackground3D />
                    <AnimatedProgressBar />
                    <ParticleSystem />
                </Canvas>
            </div>
        </div>
    );
};
```

### 5.2 3D 進度條效果
```jsx
const AnimatedProgressBar3D = ({ progress }) => {
    const barRef = useRef();
    const particlesRef = useRef();
    
    useFrame((state) => {
        if (barRef.current) {
            // 3D 進度條動畫
            barRef.current.scale.x = THREE.MathUtils.lerp(
                barRef.current.scale.x,
                progress / 100,
                0.05
            );
            
            // 金色光效流動
            const time = state.clock.elapsedTime;
            barRef.current.material.emissiveIntensity = 
                0.3 + Math.sin(time * 2) * 0.1;
        }
    });
    
    return (
        <group>
            {/* 3D 進度條 */}
            <mesh ref={barRef} position={[0, 2, 0]}>
                <boxGeometry args={[10, 0.5, 0.2]} />
                <meshStandardMaterial
                    color="#c9a156"
                    emissive="#c9a156"
                    emissiveIntensity={0.3}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
            
            {/* 進度條光效粒子 */}
            <Points ref={particlesRef}>
                <pointsMaterial
                    size={0.05}
                    color="#c9a156"
                    transparent
                    opacity={0.8}
                />
            </Points>
        </group>
    );
};
```

### 5.3 3D 數字展示系統
```jsx
const AnimatedNumbers3D = ({ displayCount, targetCount }) => {
    const numberGroupRef = useRef();
    
    useFrame((state) => {
        if (numberGroupRef.current) {
            // 數字浮動效果
            const time = state.clock.elapsedTime;
            numberGroupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
            numberGroupRef.current.rotation.y = Math.sin(time * 0.3) * 0.02;
        }
    });
    
    return (
        <group ref={numberGroupRef}>
            <Text3D
                text={displayCount.toLocaleString()}
                position={[0, 0, 0]}
                size={1}
                height={0.1}
                font="/fonts/font.json"
            >
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#c9a156"
                    emissiveIntensity={0.2}
                />
            </Text3D>
        </group>
    );
};
```

### 5.4 增強的彩帶粒子系統
```jsx
const ConfettiParticles3D = ({ trigger, amount }) => {
    const particlesRef = useRef();
    const [particles] = useState(() => {
        // 根據金額生成不同數量和顏色的粒子
        const colors = {
            500: [0xFFC107, 0xFF5722, 0x03A9F4],
            1000: [0x4CAF50, 0x9C27B0, 0xE91E63],
            3000: [0xc9a156, 0xFF4081, 0x3F51B5]
        };
        
        return generateParticles(amount, colors[amount] || colors[500]);
    });
    
    useEffect(() => {
        if (trigger && particlesRef.current) {
            // 3D 彩帶爆炸動畫
            particles.forEach((particle, i) => {
                gsap.to(particle.position, {
                    x: (Math.random() - 0.5) * 20,
                    y: Math.random() * 10 + 5,
                    z: (Math.random() - 0.5) * 10,
                    duration: 2,
                    delay: i * 0.01,
                    ease: "power2.out"
                });
                
                gsap.to(particle.material, {
                    opacity: 0,
                    duration: 2,
                    delay: i * 0.01
                });
            });
        }
    }, [trigger]);
    
    return (
        <group ref={particlesRef}>
            {particles.map((particle, i) => (
                <mesh key={i} {...particle}>
                    <boxGeometry args={[0.1, 0.1, 0.01]} />
                    <meshBasicMaterial {...particle.material} />
                </mesh>
            ))}
        </group>
    );
};
```

### 5.5 互動式 3D 按鈕系統
```jsx
const InteractiveButtons3D = ({ amounts, onSelect }) => {
    return (
        <group>
            {amounts.map((amount, index) => (
                <InteractiveButton3D
                    key={amount}
                    amount={amount}
                    position={[(index - 1) * 3, -2, 0]}
                    onSelect={onSelect}
                />
            ))}
        </group>
    );
};

const InteractiveButton3D = ({ amount, position, onSelect }) => {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();
    
    useFrame(() => {
        if (meshRef.current) {
            // 懸停效果
            const targetScale = hovered ? 1.1 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.1
            );
        }
    });
    
    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onClick={() => onSelect(amount)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <roundedBoxGeometry args={[2, 0.8, 0.2]} radius={0.1} />
                <meshStandardMaterial
                    color={hovered ? "#ffffff" : "#666666"}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>
            
            <Text3D
                text={amount.toString()}
                position={[0, 0, 0.11]}
                size={0.3}
                color={hovered ? "#000000" : "#ffffff"}
            />
        </group>
    );
};
```

## 6. 風險評估

### 6.1 技術風險

#### 6.1.1 低風險項目
- **數字動畫**：基本計算邏輯，重構無影響
- **表單驗證**：JavaScript 邏輯，保持不變
- **外部連結**：URL 構建和導向功能保持

#### 6.1.2 中風險項目
- **3D 文字渲染**：中文數字和文字在 3D 環境中的顯示效果
- **互動回饋**：3D 按鈕的點擊體驗可能與原版不同
- **性能考量**：3D 彩帶粒子系統可能影響性能

### 6.2 機會與增強

#### 6.2.1 視覺增強機會
- **真實 3D 進度條**：立體金屬質感進度條
- **粒子特效**：增強彩帶效果的視覺衝擊力
- **動態光照**：突出重點內容的聚光燈效果
- **環境映射**：反射和折射增加真實感

#### 6.2.2 互動增強機會
- **手勢控制**：支援拖拽調整捐款金額
- **語音輸入**：無障礙的金額輸入方式
- **成就動畫**：達成里程碑的特殊慶祝效果
- **社交分享**：快照分享支持成果

## 7. 驗收標準

### 7.1 功能驗收

#### 7.1.1 數據展示功能 ✅
- [ ] 支持者人數動畫正確（0 → 7,964）
- [ ] 下一位序號同步更新（1 → 7,965）
- [ ] 進度條百分比正確（79.64%）
- [ ] 數字格式化顯示正確（千分位分隔符）

#### 7.1.2 表單互動功能 ✅
- [ ] 預設金額按鈕選擇正常
- [ ] 自訂金額輸入和驗證正常
- [ ] 最低金額限制正確執行（100 元）
- [ ] 錯誤訊息及時顯示和清除

#### 7.1.3 視覺回饋功能 ✅
- [ ] 彩帶效果在金額選擇時觸發
- [ ] 不同金額對應不同顏色組合
- [ ] 多重噴發效果正確執行
- [ ] 動畫不影響頁面性能

#### 7.1.4 外部整合功能 ✅
- [ ] 捐款 URL 正確構建
- [ ] 新視窗開啟功能正常
- [ ] 安全設置正確配置

### 7.2 視覺驗收

#### 7.2.1 動畫效果 🎨
- [ ] 數字計數動畫流暢自然
- [ ] 進度條填充效果平滑
- [ ] 彩帶效果視覺衝擊力強
- [ ] 整體視覺層次清楚

#### 7.2.2 3D 增強效果 ✨
- [ ] 3D 進度條質感逼真
- [ ] 數字浮動效果自然
- [ ] 按鈕懸停回饋明確
- [ ] 粒子系統性能良好

### 7.3 性能驗收

#### 7.3.1 動畫性能 ⚡
- [ ] 60 FPS 穩定運行
- [ ] 數字動畫無卡頓
- [ ] 彩帶效果不影響其他元素
- [ ] 3D 渲染效率良好

#### 7.3.2 響應性能 🚀
- [ ] 滾動觸發靈敏
- [ ] 按鈕點擊響應及時
- [ ] 表單輸入無延遲
- [ ] 頁面切換流暢

### 7.4 可用性驗收

#### 7.4.1 互動體驗 👆
- [ ] 操作流程直觀清楚
- [ ] 視覺提示充足
- [ ] 錯誤處理友好
- [ ] 成功回饋明確

#### 7.4.2 可訪問性 ♿
- [ ] 鍵盤導航支援
- [ ] 螢幕閱讀器友好
- [ ] 色彩對比度充足
- [ ] 動畫可選擇關閉

## 結論

Support.jsx 是一個重要的募款組件，結合數據展示、互動表單和視覺回饋。R3F 重構的機會在於：

1. **視覺升級**：3D 進度條、立體數字、粒子彩帶等增強視覺衝擊力
2. **互動增強**：3D 按鈕、手勢控制等提升用戶參與感
3. **性能優化**：GPU 加速的動畫和粒子系統
4. **功能擴展**：成就系統、社交分享等增加互動性

重構策略建議：
- **第一階段**：保持基本功能，實現基礎 3D 視覺效果
- **第二階段**：加入進階互動功能和粒子系統
- **第三階段**：優化性能和添加可選的高級視覺效果
- **第四階段**：整合成就系統和社交功能

風險適中，重點是保持捐款流程的簡潔性和可靠性，同時通過 3D 效果增強視覺吸引力和用戶參與度。

---

*分析完成日期：2025-06-18*  
*重構目標：視覺增強 + 互動優化 + 功能保持*  
*風險等級：中等（重要功能 + 視覺升級）*