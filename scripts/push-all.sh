#!/bin/bash

# 同時推送到所有遠端倉庫的腳本
echo "🚀 開始推送到所有遠端倉庫..."

# 取得當前分支名稱
current_branch=$(git branch --show-current)
echo "📍 當前分支: $current_branch"

# 推送到 origin
echo "📤 推送到 origin..."
git push origin $current_branch

# 推送到 twreporter
echo "📤 推送到 twreporter..."
git push twreporter $current_branch

echo "✅ 所有推送完成！"
