import React from 'react';

const SpotifyPlayer = ({ urls = [], className = '' }) => {
    // 如果沒有提供 urls 或者陣列為空，不渲染任何內容
    if (!urls || urls.length === 0) {
        return null;
    }

    return (
        <div className={`w-full flex flex-col my-8 gap-4 ${className}`}>
            {urls.map((url, index) => (
                <iframe
                    key={index}
                    style={{ borderRadius: "12px" }}
                    src={url}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                ></iframe>
            ))}
        </div>
    );
};

export default SpotifyPlayer; 