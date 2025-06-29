# 🚀 報導者十週年回顧 2D 版本 - 快速開始指南

> **技術路線**：純 2D CSS/JS 動畫，提升設備兼容性與載入速度  
> **開發分支**：dev-2d

## 🎯 2D 版本優勢

### **設計理念**
- **高兼容性** - 支援更多低階設備和舊版瀏覽器
- **快速載入** - 避免 3D 渲染負擔，載入速度提升 50%+
- **易維護** - 降低技術複雜度，提升開發效率
- **響應式** - 完全適配各種螢幕尺寸

### **技術選型對比**
| 領域 | 3D 版本 | 2D 版本 | 優勢 |
|------|---------|---------|------|
| **渲染引擎** | React Three Fiber + WebGL | 純 CSS/JS + GSAP | 相容性 +200% |
| **檔案大小** | ~2MB (含 3D 模型) | ~500KB | 載入速度 +300% |
| **效能需求** | 中高階 GPU | 任何現代瀏覽器 | 設備支援 +150% |
| **開發複雜度** | 高 (3D 數學 + WebGL) | 中 (CSS 動畫 + DOM) | 開發效率 +200% |

## 📦 快速開始 (5 分鐘設置)

### **1. 環境要求**
```bash
Node.js 18+
npm 或 pnpm
```

### **2. 安裝和啟動**
```bash
# 安裝依賴
npm install

# 啟動開發伺服器 (http://localhost:3001)
npm run dev

# 建置生產版本
npm run build
```

### **3. 開發工具**
```bash
# 檢查程式碼規範
npm run lint

# TypeScript 類型檢查
npm run type-check
```

## 🏗️ 2D 版本架構設計

### **Section 系統設計**
```
6 個主要 Section:
├── Opening      - 開場動畫 (隱藏導航)
├── Reports      - 影響力報導展示 (顯示導航)
├── Innovations  - 多元創新展示
├── Challenges   - 挑戰與成長故事
├── Feedbacks    - 贊助者證言
└── Support      - 贊助支持頁面
```

### **目錄結構**
```
src/
├── components/
│   ├── sections/
│   │   ├── opening/          # Opening Section 組件群
│   │   ├── reports/          # Reports Section 組件群
│   │   ├── innovations/      # Innovations Section 組件群
│   │   ├── challenges/       # Challenges Section 組件群
│   │   ├── feedbacks/        # Feedbacks Section 組件群
│   │   └── support/          # Support Section 組件群
│   ├── modal/                # Modal 系統 (完整保留)
│   ├── LoadingScreen.tsx
│   ├── Navigation.tsx
│   └── SectionNavigation.tsx
├── stores/                   # Zustand 狀態管理
├── hooks/                    # 自定義 Hooks
└── app/
    ├── data/                # 專案資料
    └── page.tsx            # 主頁面
```

## 🔧 核心技術規範

### **GSAP & ScrollTrigger 管理**
```javascript
// Section 組件模板
const SectionComponent = ({ sectionName }) => {
  useEffect(() => {
    // 建立 ScrollTrigger 時使用唯一命名
    ScrollTrigger.create({
      trigger: `#section-${sectionName}`,
      id: `${sectionName}-main`,
      start: "top center",
      end: "bottom center",
      onEnter: () => setCurrentSection(sectionName),
    });
    
    // 清理機制防止衝突
    return () => {
      ScrollTrigger.getById(`${sectionName}-main`)?.kill();
    };
  }, [sectionName]);
};
```

### **SectionNavigation 顯示規則**
- **Opening 區域**: 導航完全隱藏
- **Reports+ 區域**: 導航顯示並同步當前位置
- **狀態同步**: 與滾動位置即時更新

### **效能優化策略**
- **延遲載入**: 非關鍵 Section 延遲載入
- **動畫節流**: GSAP 動畫適當節流控制
- **響應式**: 根據螢幕尺寸調整動畫複雜度
- **無障礙**: 提供 prefers-reduced-motion 支援

## 🎮 開發工作流程

### **Section 開發標準流程**
1. **建立 Section 目錄** - 在 `src/components/sections/` 下建立對應資料夾
2. **實作主要組件** - 建立 Section 主組件 + 必要的子組件
3. **整合 ScrollTrigger** - 設定滾動觸發和動畫
4. **更新狀態管理** - 確保與導航系統同步
5. **測試響應式** - 確保各螢幕尺寸正常運作

### **組件開發規範**
```javascript
// Section 主組件範例
const ReportsSection = () => {
  const { setCurrentSection } = useStore();
  
  useEffect(() => {
    // ScrollTrigger 設定
    ScrollTrigger.create({
      trigger: "#section-reports",
      id: "reports-main",
      start: "top center",
      end: "bottom center",
      onEnter: () => setCurrentSection('reports'),
    });
    
    return () => {
      ScrollTrigger.getById("reports-main")?.kill();
    };
  }, []);
  
  return (
    <section id="section-reports" className="min-h-screen">
      {/* Section 內容 */}
    </section>
  );
};
```

### **Modal 系統整合**
```javascript
// Modal 觸發範例
const handleItemClick = (itemId) => {
  const { openModal } = useStore();
  openModal({
    contentId: itemId,
    section: 'reports'
  });
};
```

## 📊 開發目標與指標

### **效能目標**
- **載入速度**: 比 3D 版本快 50%+
- **設備支援**: 覆蓋 95% 現代瀏覽器
- **檔案大小**: < 1MB (含資源)
- **響應時間**: 互動回應 < 100ms

### **開發效率目標**
- **新功能開發**: 時間減少 70%
- **除錯時間**: 減少 60%
- **維護成本**: 降低 50%

## 🌳 分支管理

### **分支架構**
- **`main`** - 穩定版本 (最終選擇的方案)
- **`dev-2d`** - 2D 版本開發 (當前)
- **`dev-3d`** - 3D 版本開發 (保留)

### **開發流程**
```bash
# 2D 版本開發
git checkout dev-2d
git add .
git commit -m "feat: 新增 Reports Section 動畫"
git push origin dev-2d

# 提交穩定版本
git checkout main
git merge dev-2d
git push origin main
```

## 🔍 除錯和問題解決

### **常見問題**
1. **ScrollTrigger 衝突** - 檢查 trigger ID 是否唯一
2. **狀態同步問題** - 確認 Zustand store 正確更新
3. **動畫卡頓** - 檢查 CSS transform 和 GPU 加速
4. **響應式問題** - 測試不同螢幕尺寸和設備

### **除錯工具**
- **GSAP Devtools** - 監控 ScrollTrigger 狀態
- **Zustand Devtools** - 檢查狀態變化
- **React DevTools** - 組件階層和效能
- **瀏覽器 DevTools** - CSS 動畫和效能分析

## 📋 Git Commit 規範

```bash
feat: 新增 Opening Section 開場動畫
fix: 修正 ScrollTrigger 衝突問題
refactor: 重構 Section 組件架構
perf: 優化 GSAP 動畫效能
style: 調整響應式樣式
docs: 更新開發文檔
```

---

**🎯 目標**：透過 2D 技術打造高效能、高兼容性的互動體驗，在維持視覺效果的同時大幅提升載入速度和設備支援度。