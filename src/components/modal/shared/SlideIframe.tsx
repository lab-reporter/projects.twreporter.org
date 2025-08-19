'use client';

import Image from 'next/image';

// 投影片 iframe 組件 - 將 macbook 外框與 iframe 內容整合
interface SlideIframeProps {
    src: string;
    className?: string; // iframe 的自訂樣式
    iframeProps?: {
        title?: string;
        allow?: string;
        allowFullscreen?: boolean;
        sandbox?: string;
    };
}

export default function SlideIframe({
    src,
    className = "absolute left-[11.1%] top-[5.7%] w-[77.8%] h-[84.4%]",
    iframeProps
}: SlideIframeProps) {
    return (
        <div className="relative w-[80%] h-auto aspect-[1000/575] mx-auto">
            <Image
                src="/assets/macbook-air.webp"
                alt="macbook-air"
                fill
                className="w-full h-full object-contain"
            />

            <iframe
                src={src}
                title={iframeProps?.title || 'Embedded content'}
                className={`w-full h-full ${className}`}
                allow={iframeProps?.allow}
                allowFullScreen={iframeProps?.allowFullscreen}
                sandbox={iframeProps?.sandbox}
            />
        </div>
    );
}
