# HeroSection 滾動進度控制系統

## 🎯 **實作概要**

成功重構 `HeroSection.tsx`，參考 `CallToActionSection.tsx` 的進度控制方式，建立了統一的滾動進度管理系統，支援多個動畫的精確控制。

---

## 🔧 **技術架構**

### **1. 滾動進度分割函數**
```typescript
const getCurrentProgress = (overallProgress: number) => {
    // 限制數值在 0~1 範圍內
    const clamp = (num: number) => Math.max(Math.min(num, 1), 0);

    // 將特定區間 (start~end) 映射到 0~1
    const progress = (start: number, end: number) =>
        clamp((overallProgress - start) / (end - start));

    return {
        // 影片播放進度：0-1 整個範圍，循環播放 5 次
        videoPlayback: overallProgress * 5, // 0-5，每 0.2 為一個循環
        // 縮放動畫：0.05-1 範圍
        scaleAnimation: progress(0.05, 1),
    };
};
```

### **2. ScrollTrigger 設定**
```typescript
const scrollTrigger = ScrollTrigger.create({
    trigger: heroSectionRef.current,
    start: 'bottom 100%',  // 從 HeroSection 底部 100% 開始
    end: 'bottom 0%',      // 到 HeroSection 底部 0% 結束
    scrub: 0.5,            // 平滑滾動綁定
    onUpdate: (self) => {
        setScrollProgress(self.progress); // 更新 React state
    },
});
```

---

## 🎬 **動畫系統**

### **1. 影片播放進度控制**
- **觸發範圍**: 0-1 (整個滾動範圍)
- **循環次數**: 5 次 (每 0.2 滾動進度循環一次)
- **實作方式**: 
  ```typescript
  const cycleProgress = (currentProgress.videoPlayback % 1);
  video.currentTime = video.duration * cycleProgress;
  ```

### **2. 縮放動畫**
- **觸發範圍**: 0.05-1 (滾動進度 5%-100%)
- **動畫效果**: `scale: 1 - progress` (從 1 縮小到 0)
- **實作方式**: 
  ```typescript
  gsap.set(heroSectionRef.current, {
      scale: 1 - currentProgress.scaleAnimation
  });
  ```

---

## 📊 **滾動範圍對照**

| 滾動進度 | 影片播放 | 縮放動畫 | 說明 |
|----------|----------|----------|------|
| 0% | 第1次播放開始 | 無動畫 | 影片開始循環 |
| 5% | 第1次播放 25% | 開始縮放 | 縮放動畫啟動 |
| 20% | 第2次播放開始 | 縮放 16% | 影片第2次循環 |
| 40% | 第3次播放開始 | 縮放 37% | 影片第3次循環 |
| 60% | 第4次播放開始 | 縮放 58% | 影片第4次循環 |
| 80% | 第5次播放開始 | 縮放 79% | 影片第5次循環 |
| 100% | 第5次播放結束 | 完全縮小 | 所有動畫完成 |

---

## 🎮 **除錯功能**

開發模式下提供詳細的進度資訊：

```typescript
// 影片播放進度
console.log(`🎬 影片播放進度: ${(cycleProgress * 100).toFixed(1)}%, 循環: ${Math.floor(currentProgress.videoPlayback) + 1}/5`);

// 縮放動畫進度
console.log(`📏 縮放進度: ${(currentProgress.scaleAnimation * 100).toFixed(1)}%`);
```

---

## 📱 **響應式處理**

- **行動裝置**: 自動停用所有滾動動畫以節省效能
- **桌面裝置**: 啟用完整的影片播放和縮放動畫
- **判斷條件**: `breakpoint === 'base' || breakpoint === 'sm'`

---

## 🔄 **與 CallToActionSection 的對比**

| 特性 | CallToActionSection | HeroSection |
|------|---------------------|-------------|
| **滾動範圍** | 複雜多階段 (0.05-0.8) | 簡化兩階段 (0-1, 0.05-1) |
| **動畫類型** | 網格動畫、淡入淡出 | 影片播放、縮放 |
| **循環播放** | 無 | 影片 5 次循環 |
| **進度函數** | 多個複雜映射 | 簡化版映射 |
| **效能考量** | 大量 DOM 元素 | 單一影片元素 |

---

## ✅ **實作優勢**

1. **統一架構**: 與 CallToActionSection 使用相同的進度控制模式
2. **精確控制**: 可以精確控制不同動畫的觸發時機
3. **易於擴展**: 可以輕鬆添加新的動畫階段
4. **效能優化**: 行動裝置自動停用動畫
5. **除錯友善**: 開發模式提供詳細進度資訊

---

## 🚀 **使用效果**

- **影片體驗**: 滾動時影片會循環播放 5 次，提供豐富的視覺回饋
- **縮放效果**: HeroSection 會隨滾動逐漸縮小，創造深度感
- **流暢過渡**: 使用 `scrub: 0.5` 確保動畫平滑
- **響應式**: 在不同裝置上都有適當的體驗

---

*實作完成日期: 2025-01-09*  
*參考架構: CallToActionSection.tsx*
