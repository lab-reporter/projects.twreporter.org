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
    className = "absolute left-[11.1%] top-[5.7%] w-[77.7%] h-[84.4%]",
    iframeProps
}: SlideIframeProps) {
    return (
        <div className="relative w-[75%] h-auto aspect-[1000/575]">
            <Image
                src="/assets/macbook-air.webp"
                alt="macbook-air"
                fill
                className="w-full h-full"
            />

            <iframe
                src={src}
                title={iframeProps?.title || 'Embedded content'}
                className={`absolute left-[11.1%] top-[5.7%] w-[77.7%] h-[84.4%] ${className}`}
                allow={iframeProps?.allow}
                allowFullScreen={iframeProps?.allowFullscreen}
                sandbox={iframeProps?.sandbox}
            />
        </div>
    );
}
