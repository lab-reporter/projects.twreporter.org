# Practice 分支工作流程

## 概述

`practice` 分支用於維護 React 練習專區，與主開發分支 `dev-2d` 保持獨立但定期同步。

## 分支策略

- **dev-2d**: 主要開發分支，包含網站的核心功能
- **practice**: 練習專區分支，包含 `/src/app/react-practice` 目錄

## 工作流程

### 1. 在 practice 分支上開發

```bash
# 切換到 practice 分支
git checkout practice

# 開始開發練習內容
# ... 編輯檔案 ...

# 提交變更
git add .
git commit -m "feat: 新增練習內容"
```

### 2. 定期從 dev-2d 同步更新

建議每週或在重大功能更新後同步：

```bash
# 確保在 practice 分支
git checkout practice

# 獲取最新更新
git fetch origin

# 方法一：使用 merge（保留完整歷史）
git merge origin/dev-2d

# 方法二：使用 rebase（更乾淨的歷史）
git rebase origin/dev-2d
```

### 3. 處理衝突

如果出現衝突：

1. **保留練習內容**：`src/app/react-practice/` 目錄下的所有變更應該保留 practice 版本
2. **接受主分支更新**：其他檔案通常接受 dev-2d 的版本

```bash
# 解決衝突後
git add .
git commit  # 如果是 merge
git rebase --continue  # 如果是 rebase
```

### 4. 推送更新

```bash
# 推送到遠端
git push origin practice

# 如果使用了 rebase，可能需要強制推送
git push origin practice --force-with-lease
```

## 重要原則

1. **不要將 practice 合併回 dev-2d**
   - practice 分支的內容是獨立的練習系統
   - 不應該影響主要的網站功能

2. **定期同步**
   - 確保練習內容使用最新的組件和 API
   - 避免累積過多的差異導致合併困難

3. **清晰的提交訊息**
   - 練習相關：`feat(practice): 新增 Hooks 練習`
   - 同步相關：`chore: 同步 dev-2d 最新更新`

## 緊急情況處理

如果不小心將 practice 內容合併到 dev-2d：

```bash
# 在 dev-2d 分支上
git revert <commit-hash>  # 還原該次合併

# 或者重置到合併前（謹慎使用）
git reset --hard <commit-before-merge>
```

## 查看分支差異

```bash
# 查看 practice 有哪些 dev-2d 沒有的提交
git log dev-2d..practice

# 查看檔案差異
git diff dev-2d..practice

# 只看特定目錄的差異
git diff dev-2d..practice -- src/app/react-practice/
```