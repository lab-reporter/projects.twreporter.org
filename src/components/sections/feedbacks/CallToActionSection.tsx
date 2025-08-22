'use client';

import React, { useRef, useState, useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStoreSSR } from '@/hooks/useStoreSSR';
import DonatePanel from "@/components/sections/support/DonatePanel";
import TestimonialSwiper, { type TestimonialSwiperRef } from "./TestimonialSwiper";
import Image from "next/image";
import EventPreview from "@/components/sections/event/EventPreview";
import Button from "@/components/shared/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/shared/NavigationIcons";

// 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

// ============================
// Cut Scene 架構組件
// ============================

// 單一文字方塊組件 - 固定尺寸 5rem × 7rem，動態漸層角度旋轉
const Box = ({
    visible,
    opacity = 1,
    rotateY = 0,
    gradientAngle = 180,
    gradientColors = '#C3968E, #EE666F, #98457C, #677DA5, #CCB5F9',
    boxIndex = 0,
}: {
    visible: boolean;
    opacity?: number;
    rotateY?: number;
    gradientAngle?: number;
    gradientColors?: string;
    boxIndex?: number;
}) => {
    // 將色彩字串拆分成陣列
    const colors = gradientColors.split(', ');
    const color1 = colors[0] || '#C3968E';
    const color2 = colors[1] || '#EE666F';
    const color3 = colors[2] || '#98457C';
    const color4 = colors[3] || '#677DA5';
    const color5 = colors[4] || '#CCB5F9';

    // 創建唯一的 CSS 變數和動畫名稱
    const propertyName = `--gradient-angle-${boxIndex}`;
    const animationName = `rotateGradient-${boxIndex}`;

    // 動態創建 CSS 自定義屬性和動畫
    const styles = `
        @property ${propertyName} {
            syntax: "<angle>";
            inherits: true;
            initial-value: ${gradientAngle}deg;
        }
        
        @keyframes ${animationName} {
            to { ${propertyName}: ${gradientAngle + 360}deg; }
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div
                className={`-mr-px ${!visible && "invisible"}`}
                style={{
                    width: '5rem',
                    height: '7rem',
                    transform: `rotateY(${rotateY}deg)`,
                    opacity,
                    padding: '1px',
                    [propertyName]: `${gradientAngle}deg`,
                    backgroundImage: `conic-gradient(
                        from var(${propertyName}) at 50% 50%,
                        ${color1} 0%,
                        ${color2} 25%,
                        ${color3} 50%,
                        ${color4} 75%,
                        ${color5} 99%,
                        ${color1} 100%
                    )`,
                    animation: `${animationName} 6s linear infinite`,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black',
                    }}
                />
            </div>
        </>
    );
};

// 方塊列組件 - 支援從中央往兩側顯示，添加 rotateY 支援
const Row = ({
    length = 0,
    progress,
    offset,
    fadeProgress = 0,
    rotateY = 0,
    rowIndex = 0,
}: {
    length?: number;
    progress: number;
    offset: number;
    fadeProgress: number;
    rotateY?: number;
    rowIndex?: number;
}) => {
    return (
        <div
            className="flex -mb-px"
            style={{
                // transformStyle: 'preserve-3d',
                // perspective: '500px',
                // translateX 實現水平移動，負值向左移動
                transform: `translateX(-${offset * 100}%)`,
            }}
        >
            {new Array(length).fill(true).map((_, index) => {
                // 顯示邏輯：index / length < progress
                // 例如 progress=0.5 時，顯示前半段的方塊
                const visible = index / length < progress;
                // 為每個 Box 生成獨特的漸層角度和色彩組合
                const gradientAngle = getGradientAngleByIndex(rowIndex, index);
                const gradientColors = getGradientColorsByIndex(rowIndex, index);
                // 創建唯一的 boxIndex（結合行索引和列索引）
                const uniqueBoxIndex = rowIndex * 1000 + index;

                return (
                    <Box
                        key={index}
                        visible={visible}
                        // 透明度：1 - fadeProgress，實現淡出效果
                        opacity={1 - fadeProgress}
                        // rotateY 動畫角度
                        rotateY={rotateY}
                        // 隨機漸層角度
                        gradientAngle={gradientAngle}
                        // 隨機漸層色彩組合
                        gradientColors={gradientColors}
                        // 唯一索引用於動畫
                        boxIndex={uniqueBoxIndex}
                    />
                );
            })}
        </div>
    );
};

// 將整體滾動進度 (0~1) 分割成多個動畫階段
const getCurrentProgress = (overallProgress: number) => {
    // 限制數值在 0~1 範圍內
    const clamp = (num: number) => Math.max(Math.min(num, 1), 0);

    // 將特定區間 (start~end) 映射到 0~1
    const progress = (start: number, end: number) =>
        clamp((overallProgress - start) / (end - start));

    return {
        centerRow: progress(0.05, 0.1),   // 中央行顯示
        allRow: progress(0.1, 0.4),      // 全部行顯示
        zoom: progress(0.4, 0.6),         // 縮放放大
        textAnimation: progress(0.5, 0.55), // 文字動畫進度
        imageFadeIn: progress(0.5, 0.6),   // 背景圖片淡入
        rotateY: progress(0.7, 0.75),      // rotateY旋轉
        fade: progress(0.7, 0.75),       // 淡出消失
        secondSectionFadeOut: progress(0.7, 0.75), // 第二部分淡出
        donatePanelFadeIn: progress(0.8, 0.85),  // 贊助面板淡入
    };
};

// 五次方緩入函數：開始慢，然後急劇加速，用於 zoom 動畫
function easeInQuint(x: number): number {
    return x * x * x * x * x;
}

// 正弦波緩入緩出函數：開始和結束較慢，中間較快，用於 move 動畫
// function easeInOutSine(x: number): number {
//     return -(Math.cos(Math.PI * x) - 1) / 2;
// }

// 漸層色彩組合陣列：使用統一的色票組合
const gradientCombinations = [
    '#C3968E, #EE666F, #98457C, #677DA5, #CCB5F9', // 統一色票組合
];

// 生成基於索引的穩定隨機漸層角度：0, 5, 10, ..., 180度
function getGradientAngleByIndex(rowIndex: number, colIndex: number): number {
    const angles = Array.from({ length: 37 }, (_, i) => i * 5); // [0, 5, 10, ..., 180]
    // 使用行索引和列索引創建一個穩定的隨機種子
    const seed = (rowIndex * 31 + colIndex * 17) % angles.length;
    return angles[seed];
}

// 生成基於索引的穩定隨機漸層色彩組合
function getGradientColorsByIndex(rowIndex: number, colIndex: number): string {
    // 使用不同的質數組合來確保色彩和角度分布不同
    const seed = (rowIndex * 23 + colIndex * 41) % gradientCombinations.length;
    return gradientCombinations[seed];
}

// 主要網格組件：根據滾動進度動態生成多列 Row
const Grid = ({
    progress,
    showDebug = false,
}: {
    progress: number;
    showDebug?: boolean;
}) => {
    const currentProgress = getCurrentProgress(progress);

    // 取得視窗尺寸計算響應式縮放
    const size = useWindowSize();
    const width = size.width ?? 0;
    const height = size.height ?? 0;

    // 固定方塊尺寸：5rem × 7rem（假設 1rem = 16px）
    const BOX_WIDTH = 5 * 16; // 80px
    const BOX_HEIGHT = 7 * 16; // 112px

    // 計算螢幕可容納的方塊數量，確保完全覆蓋螢幕
    const colsPerRow = Math.ceil(width / BOX_WIDTH) + 4; // 使用 ceil 並多加 4 列確保充滿
    const totalRows = Math.ceil(height / BOX_HEIGHT) + 4; // 使用 ceil 並多加 4 行確保充滿

    // Grid 總尺寸：根據方塊數量計算
    const GRID_WIDTH = colsPerRow * BOX_WIDTH;
    const GRID_HEIGHT = totalRows * BOX_HEIGHT;

    // 基礎縮放：確保 Grid 至少填滿螢幕，偏向放大一些
    const fitScale = Math.max(width / GRID_WIDTH, height / GRID_HEIGHT) * 1.1;

    // 動畫縮放：透過 easeInQuint 實現放大效果，最大 30 倍
    const zoomScale = 1.5 - easeInQuint(currentProgress.zoom) * 0.5;

    return (
        <>
            <div
                className="relative z-1 flex flex-col items-start overflow-hidden flex-none pointer-events-none select-none"
                style={{
                    width: `${GRID_WIDTH}px`,
                    // 以中心為縮放原點，實現 zoom-in 效果
                    transformOrigin: "center center",
                    transform: `scale(${fitScale * zoomScale})`,
                }}
            >
                {new Array(totalRows).fill(true).map((_, index) => {
                    const centerIndex = Math.floor(totalRows / 2); // 中央行索引
                    const diffToCenter = Math.abs(centerIndex - index); // 與中央的距離
                    // const maxDiff = centerIndex; // 這個變數確實沒有使用，保持註解

                    // 奇偶行交錯位移，創造波浪效果（保留基礎交錯，移除動畫部分）
                    const startMoveOffset = index % 2 === 0 ? 0 : 0.03;
                    const rowOffset = startMoveOffset;

                    // 非中央行的顯示進度：當 allRow 進度 * 中央索引 >= 距離時顯示
                    const rowProgress =
                        currentProgress.allRow * centerIndex >= diffToCenter ? 1 : 0;

                    // 中央行使用獨立的進度控制
                    const centerRowProgress = currentProgress.centerRow;

                    // 淡出進度控制
                    const fadeProgress = currentProgress.fade;

                    // rotateY 角度計算：從 0 度到 90 度
                    const rotateYAngle = currentProgress.rotateY * 180;

                    return (
                        <Row
                            key={index}
                            length={colsPerRow}
                            progress={index === centerIndex ? centerRowProgress : rowProgress}
                            offset={rowOffset}
                            fadeProgress={fadeProgress}
                            rotateY={rotateYAngle}
                            rowIndex={index}
                        />
                    );
                })}
            </div>

            {/* Debug 面板 */}
            {showDebug && (
                <div className="z-[10000000] border border-white/20 bg-[#00000050] absolute top-4 left-4 bg-opacity-80 text-white p-4 rounded-lg font-mono text-sm">
                    <div>滾動進度: {(progress * 100).toFixed(1)}%</div>
                    {/* <div>中央行: {(currentProgress.centerRow * 100).toFixed(1)}%</div>
                    <div>全部行: {(currentProgress.allRow * 100).toFixed(1)}%</div>
                    <div>縮放: {(currentProgress.zoom * 100).toFixed(1)}%</div>
                    <div>旋轉Y: {(currentProgress.rotateY * 100).toFixed(1)}%</div>
                    <div>淡出: {(currentProgress.fade * 100).toFixed(1)}%</div>
                    <div>贊助面板: {(currentProgress.donatePanelFadeIn * 100).toFixed(1)}%</div>
                    <div className="mt-2 text-gray-300">網格: {colsPerRow} × {totalRows}</div>
                    <div>螢幕: {width} × {height}</div>
                    <div>縮放: {fitScale.toFixed(2)} × {zoomScale.toFixed(2)}</div> */}
                </div>
            )}
        </>
    );
};

// ============================
// 主要組件
// ============================
// 證言回饋頁面主要組件：展示使用者回饋並引導至贊助頁面
export default function CallToActionSection() {
    // ============================
    // Cut Scene 狀態管理
    // ============================
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0);

    // ============================
    // TestimonialSwiper 控制
    // ============================
    const testimonialSwiperRef = useRef<TestimonialSwiperRef>(null);

    // ============================
    // 支持者數據管理（從 store 獲取，SSR 安全）
    // ============================
    const supporterCount = useStoreSSR((state) => state.supporterCount, 8165);
    const targetSupporters = useStoreSSR((state) => state.targetSupporters, 10000);

    // 數字計數動畫邏輯
    const calculateDisplayNumber = (animationProgress: number) => {
        const startNumber = supporterCount;
        const targetNumber = targetSupporters;
        const currentNumber = startNumber + (targetNumber - startNumber) * animationProgress;
        return Math.floor(currentNumber);
    };

    // ============================
    // Cut Scene ScrollTrigger 設定
    // ============================
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        if (!section) return;

        // 建立 ScrollTrigger，將滾動進度 (0~1) 傳給 React state
        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // 平滑度設定
            // markers: true, // 開啟 markers 顯示
            onUpdate: (self) => {
                setProgress(self.progress); // 更新 React state
            },
        });

        return () => {
            trigger.kill();
        };
    }, []);



    // ============================
    // 渲染區塊
    // ============================
    return (
        <section
            ref={sectionRef}
            id="section-feedbacks"
            className="w-full text-white"
        >
            {/* Cut Scene 動畫區域 */}
            <div className="w-full h-screen flex items-center justify-center sticky top-0 left-0 overflow-hidden">
                <Image
                    src="/assets/Donate-BG.png"
                    alt="Donate背景"
                    width={1280}
                    height={750}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    style={{
                        opacity: getCurrentProgress(progress).imageFadeIn,
                    }}
                />
                <Grid progress={progress} showDebug={true} />
            </div>

            {/* ============================
      // 第一部分：證言展示區域
      // ============================*/}
            <div className="relative w-full min-h-screen py-16 flex flex-col items-center justify-center">
                <h2 className="mb-16 leading-relaxed">
                    持續求真的路上
                    <br />
                    感謝有眾聲同行
                </h2>

                {/* 導航箭頭與 Swiper 容器 */}
                <div className="flex justify-center items-center w-full mb-8 gap-4">
                    {/* 上一個按鈕 */}
                    <Button
                        variant="navigation"
                        shape="circle"
                        size="sm"
                        onClick={() => testimonialSwiperRef.current?.slidePrev()}
                        aria-label="上一個證言"
                        leftIcon={<ChevronLeftIcon size={16} />}
                        className="opacity-50 hover:opacity-100"
                    />

                    {/* 下一個按鈕 */}
                    <Button
                        variant="navigation"
                        size="sm"
                        shape="circle"
                        onClick={() => testimonialSwiperRef.current?.slideNext()}
                        aria-label="下一個證言"
                        leftIcon={<ChevronRightIcon size={16} />}
                        className="opacity-50 hover:opacity-100"
                    />
                </div>
                {/* TestimonialSwiper */}
                <TestimonialSwiper ref={testimonialSwiperRef} />
            </div>

            {/* ============================
      // 第二部分：號召新贊助者
      // ============================*/}
            <div
                className="sticky top-0 flex flex-col items-center justify-center h-screen"
                style={{
                    opacity: 1 - getCurrentProgress(progress).secondSectionFadeOut,
                    transform: `translateY(${getCurrentProgress(progress).secondSectionFadeOut * 20}px)`,
                }}
            >
                <div>
                    <h5
                        className="mb-4"
                        style={{
                            opacity: getCurrentProgress(progress).textAnimation,
                            transform: `translateY(${(1 - getCurrentProgress(progress).textAnimation) * 20}px)`,
                        }}
                    >
                        為了讓獨立媒體永續經營、邁向下一個十年 <br />
                        我們需要提升小額捐款比例至8成
                    </h5>
                    <div
                        className="flex flex-col items-center justify-start overflow-hidden h-[3rem]"
                    >
                        <h4 className="flex-shrink-0 h-[3rem] leading-[3rem]"
                            style={{
                                transform: `translateY(${-getCurrentProgress(progress).textAnimation * 100}%)`,
                            }}
                        >感謝目前</h4>
                        <h4 className="flex-shrink-0 h-[3rem] leading-[3rem]"
                            style={{
                                transform: `translateY(${-getCurrentProgress(progress).textAnimation * 100}%)`,
                            }}>我們希望累積至少</h4>
                    </div>
                    <h1>
                        <span className="font-azeret-mono text-8xl leading-none">{calculateDisplayNumber(getCurrentProgress(progress).textAnimation)}</span>
                        <span className="text-4xl font-noto-serif-tc font-bold">位</span>
                    </h1>
                    <h4 className="mb-2">定期定額捐款支持的夥伴</h4>
                </div>
            </div>

            {/* ============================
      // 第三部分：贊助行動區域
      // ============================*/}
            <div
                id="section-support"
                className="relative flex flex-col items-center justify-center min-h-screen"
                style={{
                    opacity: getCurrentProgress(progress).donatePanelFadeIn,
                    transform: `translateY(${(1 - getCurrentProgress(progress).donatePanelFadeIn) * 20}px)`,
                }}
            >
                {/* 嵌入贊助區塊組件 */}
                <DonatePanel />
            </div>

            {/* 第四部分：活動 */}
            <EventPreview />

        </section>
    );
}
