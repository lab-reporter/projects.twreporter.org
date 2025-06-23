import React, { useRef } from 'react';
import useGsapAnimation from '../hooks/gsap';

// 標題區塊組件，可傳入 heading (h2)、text (p)
const SectionOpenTitle = ({ englishTitle, chinestTitle, text, bgColor = '#F1F1F1' }) => {
    const sectionRef = useRef(null);

    // 使用自定義 Hook 處理 GSAP 動畫
    useGsapAnimation();

    // 移除背景色管理功能

    return (
        <div className='w-full max-w-[640px] mx-auto'>
            <div className='mb-4'>
                <h1 className='text-center text-8xl leading-none font-alverata font-normal'>
                    {englishTitle}
                </h1>
                <h2 className='leading-normal text-[3rem] font-bold text-center'>{chinestTitle}
                </h2>
            </div>
            <p className='text-[20px] leading-normal text-justify'
                style={{ textAlignLast: 'center' }}
            >
                {text}
            </p>
        </div >
    );
};

export default SectionOpenTitle; 