import React from 'react';

const VideoPlayer = ({
    urls = [],
    className = '',
    showControls = true,     // 是否顯示播放控制項
    autoPlay = false,        // 是否自動播放
    loop = false,            // 是否循環播放
    muted = false,           // 是否靜音
    preload = "metadata",    // 預載入設定
    style = {}               // 額外的樣式設定
}) => {
    // 如果沒有提供 urls 或者陣列為空，不渲染任何內容
    if (!urls || urls.length === 0) {
        return null;
    }

    // 預設的影片樣式
    const defaultVideoStyle = { borderRadius: "12px", ...style };

    return (
        <div className={`w-full flex flex-col justify-center my-8 gap-4 ${className}`}>
            {urls.map((url, index) => (
                <video
                    key={index}
                    className="w-full h-auto rounded-xl"
                    controls={showControls}
                    autoPlay={autoPlay}
                    loop={loop}
                    muted={muted}
                    preload={preload}
                    style={defaultVideoStyle}
                >
                    <source src={url} type={`video/${url.split('.').pop()}`} />
                    您的瀏覽器不支援影片播放。
                </video>
            ))}
        </div>
    );
};

export default VideoPlayer; 