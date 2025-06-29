# 🚀 報導者十週年回顧 2D 版本開發狀態

## ✅ 已完成 (2025-06-29)
- **專案架構重構** - 從 3D 版本轉換為 2D 純 CSS/JS 動畫實作 ✅
- **3D 組件清除** - 移除所有 R3F 相關組件和文件 ✅
- **基礎專案設置** - Next.js 15 + TypeScript + Tailwind CSS ✅
- **狀態管理系統** - Zustand 完整架構保留 ✅
- **Modal 系統** - 完整保留互動系統與內容載入 ✅
- **開發伺服器** - 運行在 http://localhost:3001 ✅

## 🎯 當前狀態
- **技術路線**: 2D CSS/JS 動畫，避免 3D 渲染負擔
- **目標設備**: 提升低階設備兼容性與載入速度
- **專案架構**: dev-2d 分支獨立開發
- **參照程式碼**: copy/ 資料夾（git ignored）

## 📋 2D 版本 Section 架構
1. **Opening** - 開場動畫區塊
2. **Reports** - 影響力報導展示
3. **Innovations** - 多元創新展示
4. **Challenges** - 挑戰與成長故事
5. **Feedbacks** - 贊助者證言
6. **Support** - 贊助支持頁面

## 🔧 技術規範

### **GSAP & ScrollTrigger 管理**
- **命名空間隔離**: 每個 Section 使用唯一 trigger ID
- **統一清理機制**: 組件卸載時清理對應 ScrollTrigger
- **衝突預防**: 避免不同 Section 的動畫互相干擾
- **範例**:
  ```javascript
  useEffect(() => {
    ScrollTrigger.create({
      trigger: `#section-${sectionName}`,
      id: `${sectionName}-main`,
      // ... 配置
    });
    
    return () => {
      ScrollTrigger.getById(`${sectionName}-main`)?.kill();
    };
  }, []);
  ```

### **SectionNavigation 顯示規則**
- **Opening 區域**: 導航隱藏
- **Reports 開始**: 導航顯示
- **狀態同步**: 與滾動位置同步更新

### **效能優化原則**
- **延遲載入**: 非關鍵 Section 延遲載入
- **動畫節流**: GSAP 動畫適當節流控制
- **響應式設計**: 支援各螢幕尺寸
- **無障礙支援**: 提供動畫關閉選項

## 🔧 開發規則
- **自動執行**: 所有指令除了刪除檔案外都自動執行
- **不需詢問**: 安裝套件、建立檔案、編輯程式碼、一般 Git 操作
- **Git Commit**: 用戶提到需要 git commit 時直接執行，無需詢問
- **需要詢問**: 刪除檔案或目錄的操作
- **⚠️ 特別注意**: Git merge/rebase 到 main 分支**必須再次確認**

## 🐛 Console.log 使用規範
- **調試目的**: console.log 僅用於開發階段的問題調試
- **及時清理**: 調試完成後必須立即移除相關 console.log 程式碼
- **頻率控制**: 避免大量或高頻率的 console.log 輸出
- **保留原則**: 只保留必要的錯誤處理 console.error 和用戶操作回饋
- **開發環境限制**: 使用 `process.env.NODE_ENV === 'development'` 條件限制輸出

## 🌳 Git 工作流程規範
- **主分支**: `main` - 穩定版本
- **開發分支**: `dev-2d` - 2D 版本開發
- **技術路線**: 純 2D CSS/JS 動畫實作
- **GitHub Repository**: https://github.com/itisalongway574/r3f-10th-repo

### ⚠️ **重要：dev-2d 分支合併限制**
- **原則**: dev-2d 分支**不直接合併**到 main 分支
- **目的**: 保持 main 分支作為最終選擇的技術方案
- **AI 助手責任**: 如果用戶下達任何 merge、rebase 到 main 的指令，**必須再次確認**
- **確認提醒**: "您確定要將 dev-2d 合併到 main 嗎？這會改變主分支的技術路線。"

## 📋 Git Commit 規範
- **格式**: `<type>: <繁體中文描述>` (第一行不超過 50 字符)
- **語氣**: 使用祈使語氣，不用句號結尾
- **語言**: 描述使用繁體中文，類型使用英文

### **Commit 類型**
- `feat`: 新功能
- `fix`: 修復問題
- `refactor`: 重構程式碼
- `perf`: 效能優化
- `style`: 格式/樣式調整
- `docs`: 文檔更新

### **範例**
```bash
feat: 新增 Opening Section 開場動畫
fix: 修正 ScrollTrigger 衝突問題
refactor: 重構 Section 組件架構
perf: 優化 GSAP 動畫效能
```

## 📋 程式碼精簡化原則
1. **功能獨立性**: 每個 Section 組件保持獨立，避免相互依賴
2. **組件拆分**: 單一檔案超過 200 行時考慮拆分
3. **共用邏輯**: 相同邏輯出現 2-3 次時抽取為共用函數
4. **一檔一責**: 保持「一個檔案一個職責」原則
5. **開發效率**: 以開發效率和可讀性為優先考量

## 📊 2D 版本目標
- **兼容性提升**: 支援更多低階設備
- **載入速度**: 比 3D 版本快 50%+
- **維護性**: 降低技術複雜度
- **響應式**: 完整支援各螢幕尺寸

## 🎮 技術亮點
- **GSAP 動畫系統**: 高效能 2D 動畫實作
- **ScrollTrigger 整合**: 滾動驅動的動畫體驗
- **Modal 系統**: 完整保留 3D 版本的互動功能
- **狀態管理**: Zustand 統一管理應用狀態
- **響應式設計**: 適配各種設備與螢幕

---
*最後更新: 2025-06-29 - 完成 3D 到 2D 架構轉換，建立 dev-2d 開發基礎*