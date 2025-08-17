'use client';

import React, { useRef, useState, useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DonatePanel from "@/components/sections/support/DonatePanel";

// 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

// ============================
// Cut Scene 架構組件
// ============================

// 單一文字方塊組件 - 添加 rotateY 動畫
const Box = ({
    text,
    visible,
    opacity = 1,
    rotateY = 0,
}: {
    text: string;
    visible: boolean;
    opacity?: number;
    rotateY?: number;
}) => (
    <div
        className={`border border-[1px] border-gray-800 px-4 py-2 whitespace-nowrap -mr-px ${!visible && "invisible"
            }`}
        style={{
            transform: `rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
            perspective: '300px',
            backgroundColor: rotateY > 90 ? '#1f2937' : 'transparent', // 背面顯示深色
            boxShadow: rotateY > 0 ? `0 0 10px rgba(0,0,0,${Math.min(rotateY / 180 * 0.5, 0.5)})` : 'none',
        }}
    >
        {/* 透過 style 控制透明度，文字設為完全透明 */}
        <span style={{ opacity: 0 }}>{text}</span>
    </div>
);

// 方塊列組件 - 支援從中央往兩側顯示，添加 rotateY 支援
const Row = ({
    length = 0,
    progress,
    offset,
    fadeProgress = 0,
    rotateY = 0,
}: {
    length?: number;
    progress: number;
    offset: number;
    fadeProgress: number;
    rotateY?: number;
}) => {
    return (
        <div
            className="flex -mb-px"
            style={{
                // translateX 實現水平移動，負值向左移動
                transform: `translateX(-${offset * 100}%)`,
            }}
        >
            {new Array(length).fill(true).map((_, index) => {
                // 顯示邏輯：index / length < progress
                // 例如 progress=0.5 時，顯示前半段的方塊
                const visible = index / length < progress;

                return (
                    <Box
                        key={index}
                        // 文字內容交替：偶數索引 "Let's Support"，奇數索引 "Reporter"
                        text={"REPORTER"}
                        visible={visible}
                        // 透明度：1 - fadeProgress，實現淡出效果
                        opacity={1 - fadeProgress}
                        // rotateY 動畫角度
                        rotateY={rotateY}
                    />
                );
            })}
        </div>
    );
};

// 將整體滾動進度 (0~1) 分割成 5 個動畫階段
const getCurrentProgress = (overallProgress: number) => {
    // 限制數值在 0~1 範圍內
    const clamp = (num: number) => Math.max(Math.min(num, 1), 0);

    // 將特定區間 (start~end) 映射到 0~1
    const progress = (start: number, end: number) =>
        clamp((overallProgress - start) / (end - start));

    return {
        centerRow: progress(0.2, 0.3),   // 中央行顯示
        allRow: progress(0.3, 0.4),      // 全部行顯示
        move: progress(0.33, 0.8),       // 水平移動
        zoom: progress(0.35, 1),         // 縮放放大
        rotateY: progress(0.35, 1),      // rotateY 旋轉（與 zoom 同時進行）
        fade: progress(0.8, 0.95),       // 淡出消失
    };
};

// 五次方緩入函數：開始慢，然後急劇加速，用於 zoom 動畫
function easeInQuint(x: number): number {
    return x * x * x * x * x;
}

// 正弦波緩入緩出函數：開始和結束較慢，中間較快，用於 move 動畫
function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

// 主要網格組件：根據滾動進度動態生成多列 Row
const Grid = ({
    length = 17,
    progress,
}: {
    length?: number;
    progress: number;
}) => {
    const currentProgress = getCurrentProgress(progress);

    // 取得視窗尺寸計算響應式縮放
    const size = useWindowSize();
    const width = size.width ?? 0;
    const height = size.height ?? 0;

    // Grid 原始尺寸 - 與 SupportCutSceneSection 完全一樣
    const GRID_WIDTH = 1251;
    const GRID_HEIGHT = 741;

    // 基礎縮放：確保 Grid 填滿螢幕
    const fitScale = Math.max(width / GRID_WIDTH, height / GRID_HEIGHT);

    // 動畫縮放：透過 easeInQuint 實現放大效果，最大 30 倍
    const zoomScale = easeInQuint(currentProgress.zoom) * 30 + 1;

    return (
        <div
            className="flex flex-col items-start overflow-hidden flex-none pointer-events-none select-none"
            style={{
                width: `${GRID_WIDTH}px`,
                // 以中心為縮放原點，實現 zoom-in 效果
                transformOrigin: "center center",
                transform: `scale(${fitScale * zoomScale})`,
            }}
        >
            {new Array(length).fill(true).map((_, index) => {
                const centerIndex = Math.floor(length / 2); // 中央行索引
                const diffToCenter = Math.abs(centerIndex - index); // 與中央的距離
                const maxDiff = centerIndex;

                // 奇偶行交錯位移，創造波浪效果
                const startMoveOffset = index % 2 === 0 ? 0 : 0.03;

                // 計算每行的水平位移量
                // startMoveOffset 提供初始的交錯效果，move 進度提供額外的動畫位移
                const rowOffset =
                    startMoveOffset +
                    ((maxDiff - diffToCenter) / maxDiff) *
                    easeInOutSine(currentProgress.move) *
                    0.404;



                // 非中央行的顯示進度：當 allRow 進度 * 中央索引 >= 距離時顯示
                const rowProgress =
                    currentProgress.allRow * centerIndex >= diffToCenter ? 1 : 0;

                // 中央行使用獨立的進度控制
                const centerRowProgress = currentProgress.centerRow;

                // 淡出進度控制
                const fadeProgress = currentProgress.fade;

                // rotateY 角度計算：從 0 度到 180 度
                const rotateYAngle = currentProgress.rotateY * 180;

                return (
                    <Row
                        key={index}
                        length={15}
                        progress={index === centerIndex ? centerRowProgress : rowProgress}
                        offset={rowOffset}
                        fadeProgress={fadeProgress}
                        rotateY={rotateYAngle}
                    />
                );
            })}
        </div>
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
            scrub: 2, // 平滑度設定
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
            id="section-feedbacks"
            className="w-full text-white"
        >

            <div className="w-full h-[100vh]"></div>
            {/* Cut Scene 動畫區域 */}
            <div
                className="w-full h-[400vh] mt-[-100vh] relative"
                ref={sectionRef}
            >
                <div className="w-full h-screen flex items-center justify-center sticky top-0 left-0 overflow-hidden">
                    <Grid progress={progress} />
                </div>
            </div>

            {/* ============================
      // 第一部分：證言展示區域
      // ============================*/}
            <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
                <div>
                    <h2 className="mb-4 leading-relaxed">
                        持續求真的路上
                        <br />
                        感謝有眾聲同行
                    </h2>
                </div>
            </div>

            {/* ============================
      // 第二部分：號召新贊助者
      // ============================*/}
            <div className="z-1 h-auto">
                {/* 號召新贊助者（觸發灰色圓圈顯示） */}
                <div data-trigger="show-hidden-circle" className="relative flex flex-col items-center justify-center h-screen">
                    <div>
                        <h5 className="mb-4">
                            為了讓獨立媒體永續經營、邁向下一個十年 <br />
                            我們需要提升小額捐款比例至七成
                        </h5>
                        <h4>我們希望累積至少</h4>
                        <h1>
                            10000
                            <span className="text-4xl font-noto-serif-tc font-bold">位</span>
                        </h1>
                        <h4 className="mb-2">定期定額捐款支持的夥伴</h4>
                    </div>
                </div>
            </div>

            {/* ============================
      // 第三部分：贊助行動區域
      // ============================*/}
            <div id="section-support" data-trigger="support-section" className="sticky top-0 flex flex-col items-center justify-center h-screen">
                {/* 嵌入贊助區塊組件 */}
                <DonatePanel />
            </div>
        </section>
    );
}
