import React from 'react';
import IndicatorScroll from '@/app/components/IndicatorScroll';

const ReportBanner = ({ mediaSrc, title, subtitle, date }) => {
    // 判斷媒體類型的函數
    const getMediaType = (src) => {
        if (!src) return 'image';

        const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
        const lowerSrc = src.toLowerCase();

        return videoExtensions.some(ext => lowerSrc.includes(ext)) ? 'video' : 'image';
    };

    const mediaType = getMediaType(mediaSrc);

    return (
        <div className="relative">
            <div className="w-full h-[calc(90vh)]">
                {mediaType === 'video' ? (
                    <video
                        className="w-full h-full object-cover"
                        src={mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        您的瀏覽器不支援影片播放。
                    </video>
                ) : (
                    <img
                        className="w-full h-full object-cover"
                        src={mediaSrc}
                        alt={title}
                    />
                )}
                <div className='absolute top-0 left-0 w-full h-full bg-blend-multiply' style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%,  rgba(0, 0, 0, 0.9) 100%)' }}></div>
            </div>
            <div className="absolute bottom-10 left-0 w-full flex flex-col items-center">
                <h4 className='text-white text-xl font-bold text-center mb-4'>
                    {date}
                </h4>
                <h2 className="text-white text-4xl font-bold text-center mb-4">
                    {title}
                </h2>
                <h3 className="text-white text-xl font-bold text-center">
                    {subtitle}
                </h3>
                <IndicatorScroll />
            </div>
        </div>
    );
};

export default ReportBanner; 