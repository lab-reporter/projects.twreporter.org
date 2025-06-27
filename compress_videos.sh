#!/bin/bash

# 影片壓縮腳本
# 使用方法: ./compress_videos.sh

cd "$(dirname "$0")/public/assets"

# 檢查 FFmpeg 是否安裝
if ! command -v ffmpeg &> /dev/null; then
    echo "錯誤: 請先安裝 FFmpeg"
    echo "macOS: brew install ffmpeg"
    echo "Windows: 下載 https://ffmpeg.org/download.html"
    exit 1
fi

# 創建輸出目錄
mkdir -p compressed

# 壓縮所有 mp4 檔案
for file in *.mp4; do
    if [ -f "$file" ]; then
        echo "正在壓縮: $file"
        ffmpeg -i "$file" \
            -vcodec libx264 \
            -crf 28 \
            -preset medium \
            -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
            -acodec aac \
            -b:a 128k \
            -movflags +faststart \
            "compressed/${file}"
        
        if [ $? -eq 0 ]; then
            echo "✅ 完成: compressed/${file}"
            
            # 顯示檔案大小比較
            original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            compressed_size=$(stat -f%z "compressed/${file}" 2>/dev/null || stat -c%s "compressed/${file}" 2>/dev/null)
            
            if [ ! -z "$original_size" ] && [ ! -z "$compressed_size" ]; then
                reduction=$(( (original_size - compressed_size) * 100 / original_size ))
                echo "   原始: $(numfmt --to=iec $original_size)"
                echo "   壓縮: $(numfmt --to=iec $compressed_size)"
                echo "   減少: ${reduction}%"
            fi
        else
            echo "❌ 失敗: $file"
        fi
        echo ""
    fi
done

echo "壓縮完成！檔案位於 compressed/ 目錄"
echo "檢查結果後，可以替換原檔案："
echo "mv compressed/*.mp4 ."