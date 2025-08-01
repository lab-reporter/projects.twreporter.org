# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI 助手工作規範

### ✅ 自動執行（不需詢問）
- pnpm install/add
- 建立檔案/組件
- 編輯程式碼
- 修復 bug
- 重構功能

### ❌ 需要確認（必須詢問）
- 刪除檔案/目錄
- git commit/push
- git merge/rebase
- **重要**: dev-2d 合併到 main 需特別確認

## Git Commit 規範

```bash
<type>: <繁體中文描述>

# 類型:
feat: 新增功能
fix: 修復問題
refactor: 重構程式碼
perf: 效能優化
style: 格式調整
docs: 文檔更新
revert: 恢復版本

# 禁止: AI/Claude/助手等字詞
```

## 程式碼規範

### 架構原則
- Section 組件互不依賴
- 檔案超過 200 行要拆分
- 重複 2-3 次的邏輯要抽取
- 一檔一功能原則

### 註解規範
- 使用繁體中文
- 解釋「為什麼」而非「做什麼」
- 不要寫具體數值，只描述這個參數的功效
- 置於程式碼上方
- 讓非技術人員也能理解

### Console 輸出
```typescript
// 僅開發環境
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

## ESLint 與 TypeScript 規範（必須嚴格遵守）

### 常見錯誤與修復方式

#### 1. 未使用的變數和參數 (@typescript-eslint/no-unused-vars)
```typescript
// ❌ 錯誤：未使用的變數
const unused = 'value';
import InnovationsSection from './InnovationsSection';

// ✅ 正確：移除未使用的程式碼
// 或使用底線前綴表示刻意忽略
const _unused = 'value';

// ❌ 錯誤：未使用的函數參數
array.forEach((item, index) => {
  console.log(item);
});

// ✅ 正確：移除或使用底線前綴
array.forEach((item) => {
  console.log(item);
});
// 或
array.forEach((item, _index) => {
  console.log(item);
});
```

#### 2. 禁止使用 any 類型 (@typescript-eslint/no-explicit-any)
```typescript
// ❌ 錯誤：使用 any
const data: any = fetchData();
(window as any).customProp = value;
(element as any)._animData = {};

// ✅ 正確：定義明確的類型
interface DataType {
  id: string;
  name: string;
}
const data: DataType = fetchData();

// 擴展 Window 介面
interface WindowWithCustom extends Window {
  customProp?: string;
}
(window as WindowWithCustom).customProp = value;

// 為 DOM 元素擴展屬性
interface ElementWithAnimData extends HTMLElement {
  _animData?: {
    x: number;
    y: number;
    transform: string;
  };
}
(element as ElementWithAnimData)._animData = {};
```

#### 3. React Hook 依賴陣列 (react-hooks/exhaustive-deps)
```typescript
// ❌ 錯誤：缺少依賴
useEffect(() => {
  console.log(value);
  doSomething(prop);
}, []); // 缺少 value 和 prop

// ✅ 正確：包含所有依賴
useEffect(() => {
  console.log(value);
  doSomething(prop);
}, [value, prop]);

// 特殊情況：確實只需執行一次時
useEffect(() => {
  // 只在組件掛載時執行一次的初始化邏輯
  initializeOnce();
}, []); // 這是合理的，但要確保內部沒有使用外部變數
```

#### 4. Ref 在清理函數中的使用
```typescript
// ❌ 錯誤：直接在清理函數中使用 ref.current
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  timerRef.current = timer;
  
  return () => {
    clearTimeout(timerRef.current); // ref 值可能已改變
  };
}, []);

// ✅ 正確：複製到局部變數
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  timerRef.current = timer;
  
  return () => {
    clearTimeout(timer); // 使用局部變數
  };
}, []);

// 或在清理函數中複製
useEffect(() => {
  // ...
  return () => {
    const currentTimer = timerRef.current;
    if (currentTimer) {
      clearTimeout(currentTimer);
    }
  };
}, []);
```

#### 5. 圖片最佳化警告 (@next/next/no-img-element)
```typescript
// ⚠️ 警告：使用原生 img 標籤
<img src="/image.jpg" alt="description" />

// ✅ 建議：使用 Next.js Image 組件
import Image from 'next/image';
<Image src="/image.jpg" alt="description" width={500} height={300} />

// 例外情況：當確實需要使用 img 時（如外部圖片、動態尺寸等）
// 可以保留但應有充分理由
```

### 程式碼檢查命令

**在每次提交前必須執行：**

```bash
# 1. TypeScript 類型檢查
npx tsc --noEmit

# 2. ESLint 檢查
pnpm lint

# 3. 建置測試（最終確認）
pnpm build
```

### 錯誤處理原則

1. **錯誤（Error）**：必須修復，不能忽略
2. **警告（Warning）**：應該修復，除非有特殊原因
3. **提示（Info）**：建議遵循，但非強制

### 特殊情況處理

如果確實需要違反某個規則，必須：
1. 加上明確的註解說明原因
2. 使用 ESLint 註解禁用該行
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyData = externalLibrary.getData() as any; // 第三方庫未提供類型
```

## 部署前檢查

```bash
# 清理快取
rm -rf .next node_modules/.cache

# 重新安裝
pnpm install

# 類型檢查
npx tsc --noEmit

# Lint 檢查
pnpm lint

# 建置測試
pnpm build

# 本地預覽
pnpm start
```

## TypeScript 類型處理範例

```typescript
// 處理 unknown 類型
const id = (modal.data as { id?: string })?.id || '';

// Web Component 類型宣告
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'custom-element': React.DetailedHTMLProps<...>;
    }
  }
}
```

## 分支策略

- `main`: 生產環境程式碼
- `dev-2d`: 當前 2D 開發（獨立分支）
- `dev-3d`: 舊版 3D 版本（保留）

注意：dev-2d 不應直接合併到 main，需特別確認。