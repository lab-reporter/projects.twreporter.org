"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import OpenToReports from './OpenToReports';
import { useUiContext } from '../context/UiContext';

gsap.registerPlugin(ScrollTrigger);

const TransitionToReports = () => {
    const containerRef = useRef(null);
    const leftMaskRef = useRef(null);
    const rightMaskRef = useRef(null);

    // 取得 UI 上下文來控制導覽列顯示
    const { setIsBeforeReportsOpen } = useUiContext();

    // 🎛️ 可調整參數：各階段距離（vh 單位）
    const BUFFER_DISTANCE_VH = 300; // 緩衝距離
    const TRANSITION_DISTANCE_VH = 100; // 分割轉場動畫距離
    const STICKY_DISTANCE_VH = 50; // 停留距離

    useEffect(() => {
        if (!containerRef.current) return;

        console.log('🎬 初始化分割轉場動畫組件');
        console.log(`🎛️ 緩衝距離: ${BUFFER_DISTANCE_VH}vh`);
        console.log(`🎛️ 分割轉場距離: ${TRANSITION_DISTANCE_VH}vh`);
        console.log(`🎛️ 停留距離: ${STICKY_DISTANCE_VH}vh`);

        // 設置初始狀態：遮罩完全覆蓋畫面
        gsap.set([leftMaskRef.current, rightMaskRef.current], {
            x: 0,
            y: 0
        });

        // 計算總高度：緩衝 + 分割轉場 + 停留
        const totalHeight = BUFFER_DISTANCE_VH + TRANSITION_DISTANCE_VH + STICKY_DISTANCE_VH;

        // 創建轉場動畫的ScrollTrigger
        const transitionTrigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${totalHeight}vh`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
                const totalProgress = self.progress; // 總進度 (0-1)

                // 計算各階段的比例
                const bufferRatio = BUFFER_DISTANCE_VH / totalHeight;
                const transitionRatio = TRANSITION_DISTANCE_VH / totalHeight;
                const stickyRatio = STICKY_DISTANCE_VH / totalHeight;

                // 計算各階段的結束點
                const bufferEnd = bufferRatio;
                const transitionEnd = bufferEnd + transitionRatio;
                const stickyEnd = transitionEnd + stickyRatio; // = 1.0

                let splitAnimationProgress = 0; // 分割動畫進度

                if (totalProgress <= bufferEnd) {
                    // 🛑 階段1：緩衝區間
                    splitAnimationProgress = 0;
                    console.log('🛑 緩衝區間:', Math.round(totalProgress * 100) + '%');
                    setIsBeforeReportsOpen(true);

                } else if (totalProgress <= transitionEnd) {
                    // 🎬 階段2：分割轉場動畫區間
                    const transitionProgress = (totalProgress - bufferEnd) / transitionRatio;
                    splitAnimationProgress = transitionProgress;
                    console.log('🎬 分割轉場進度:', Math.round(splitAnimationProgress * 100) + '%');
                    setIsBeforeReportsOpen(true);

                } else {
                    // 📌 階段3：停留區間
                    splitAnimationProgress = 1.0;
                    const stickyProgress = (totalProgress - transitionEnd) / stickyRatio;
                    console.log('📌 停留區間:', Math.round(stickyProgress * 100) + '%');

                    // 當停留進度達到 80% 時，顯示導覽列
                    if (stickyProgress >= 0.8) {
                        setIsBeforeReportsOpen(false);
                    } else {
                        setIsBeforeReportsOpen(true);
                    }
                }

                // 🎭 分割遮罩動畫
                const moveDistance = splitAnimationProgress * window.innerWidth * 0.55;
                gsap.set(leftMaskRef.current, {
                    x: -moveDistance,
                    ease: "none"
                });
                gsap.set(rightMaskRef.current, {
                    x: moveDistance,
                    ease: "none"
                });
            },
            onComplete: () => {
                console.log('🎬 整個轉場滾動區間完成');
                setIsBeforeReportsOpen(false);
            },
            onLeave: () => {
                console.log('🎬 離開轉場區域 - 確保導覽列顯示');
                setIsBeforeReportsOpen(false);
            },
            onEnterBack: () => {
                console.log('🎬 重新進入轉場區域');
            },
            onLeaveBack: () => {
                console.log('🎬 向上離開轉場區域 - 隱藏導覽列');
                setIsBeforeReportsOpen(true);
            },
            id: 'transition-to-reports-split'
        });

        return () => {
            console.log('🧹 清理分割轉場動畫觸發器');
            transitionTrigger.kill();
        };
    }, [BUFFER_DISTANCE_VH, TRANSITION_DISTANCE_VH, STICKY_DISTANCE_VH, setIsBeforeReportsOpen]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[100vh] bg-transparent overflow-hidden"
        >
            {/* 上層：分割遮罩 */}
            {/* 左半邊遮罩 - 顯示 OpenToReports 的左半邊 */}
            <div
                ref={leftMaskRef}
                className="absolute top-0 left-0 w-1/2 h-full z-10 overflow-hidden bg-black"
                style={{
                    transformOrigin: 'right center'
                }}
            >
                <div
                    className="w-[100vw] h-full relative"
                    style={{
                        left: '0%',
                        transformOrigin: 'left center'
                    }}
                >
                    <OpenToReports />
                </div>
            </div>

            {/* 右半邊遮罩 - 顯示 OpenToReports 的右半邊 */}
            <div
                ref={rightMaskRef}
                className="absolute top-0 right-0 w-1/2 h-full z-10 overflow-hidden bg-black"
                style={{
                    transformOrigin: 'left center'
                }}
            >
                <div
                    className="w-[100vw] h-full relative"
                    style={{
                        left: '-100%',
                        transformOrigin: 'right center'
                    }}
                >
                    <OpenToReports />
                </div>
            </div>
        </div>
    );
};

export default TransitionToReports; 