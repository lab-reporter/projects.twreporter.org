#!/bin/bash

# 重命名檔案腳本
# 將檔案名稱改為對應的 id

cd "$(dirname "$0")/public/assets"

echo "開始重命名檔案..."

# 備份原始檔案（以防萬一）
echo "創建備份目錄..."
backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
cp *.jpg *.mp4 *.png "$backup_dir"/ 2>/dev/null

# 執行重命名
rename_file() {
    local old_file="$1"
    local new_file="$2"
    
    if [ -f "$old_file" ]; then
        echo "重命名: $old_file → $new_file"
        mv "$old_file" "$new_file"
        
        if [ $? -eq 0 ]; then
            echo "✅ 成功"
        else
            echo "❌ 失敗"
        fi
    else
        echo "⚠️  檔案不存在: $old_file"
    fi
}

# 執行所有重命名
rename_file "report-1.jpg" "reports-1.jpg"
rename_file "report-2.mp4" "reports-2.mp4"
rename_file "report-3.mp4" "reports-3.mp4"
rename_file "廢墟裡的少年_(攝影余志偉).jpg" "reports-4.jpg"
rename_file "六輕環境難民。.jpg" "reports-5.jpg"
rename_file "國家不願面對的真相：獨家揭露台鐵體檢報告。（攝影蘇威銘）.jpg" "reports-6.jpg"
rename_file "每天我們失去5個孩子——搶救兒童高死亡率 - 報導者 The Reporter.mp4" "reports-7.mp4"
rename_file "看不見的線上博弈帝國 - 報導者 The Reporter.mp4" "reports-8.mp4"
rename_file "笑氣濫用_(攝影蔡耀徵).jpg" "reports-9.jpg"
rename_file "中國虎視下的島鏈──沖繩如何成為台海危機的熱點.jpg" "reports-10.jpg"
rename_file "出口禁令下的紅線交易──揭開MIT工具機流入俄羅斯軍工業隱蹤.png" "reports-11.png"
rename_file "獵童風暴：揭開未成年性剝削影像的暗黑產業鏈.mp4" "reports-12.mp4"

echo ""
echo "重命名完成！"
echo "檔案已備份到 $backup_dir 目錄"