'use client';

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import DonatePanel from "../support/DonatePanel";


// 註冊 GSAP 插件
gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);



// ============================
// 主要組件
// ============================
// 證言回饋頁面主要組件：展示使用者回饋並引導至贊助頁面
export default function CallToActionSection() {
    // ============================
    // Refs 和狀態管理
    // ============================
    // 方格背景容器的參考
    const gridContainerRef = useRef<HTMLDivElement>(null);
    // 方格元素的參考陣列
    const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);
    // 觸發容器的參考（用於 ScrollTrigger）
    const triggerContainerRef = useRef<HTMLDivElement>(null);

    // ============================
    // 響應式方格計算
    // ============================
    // 網格佈局狀態
    const [gridLayout, setGridLayout] = useState(() => {
        // 預設值，避免 SSR 問題
        return {
            cols: 34,
            rows: 23,
            totalCells: 782,
            cellWidth: 3,
            cellHeight: 4.5,
            offsetX: 1,
            offsetY: 1.75
        };
    });

    // 計算響應式方格數量和佈局
    const calculateGridLayout = () => {
        // 方格尺寸設定
        const cellWidth = 3; // 3vw
        const cellHeight = 9; // 9vh

        // 計算需要的方格數量（向上取整以確保覆蓋整個畫面）
        const cols = Math.ceil(100 / cellWidth); // 100vw / 3vw
        const rows = Math.ceil(100 / cellHeight); // 100vh / 9vh

        return {
            cols,
            rows,
            totalCells: cols * rows,
            cellWidth,
            cellHeight,
            // 計算置中偏移量
            offsetX: (cols * cellWidth - 100) / 2, // 超出部分的一半
            offsetY: (rows * cellHeight - 100) / 2  // 超出部分的一半
        };
    };

    // 監聽視窗大小變化
    useEffect(() => {
        const updateGridLayout = () => {
            setGridLayout(calculateGridLayout());
        };

        updateGridLayout(); // 初始計算
        window.addEventListener('resize', updateGridLayout);

        return () => {
            window.removeEventListener('resize', updateGridLayout);
        };
    }, []);

    // ============================
    // GSAP 動畫設定
    // ============================
    // 方格背景從中央擴散的動畫效果
    useGSAP(() => {
        if (!triggerContainerRef.current || gridItemsRef.current.length === 0) return;

        const gridItems = gridItemsRef.current.filter(Boolean);
        const { cols, rows } = gridLayout;

        // 設定初始狀態：所有方格透明度為 0
        gsap.set(gridItems, { opacity: 0 });

        // 計算視覺中央點（考慮實際的畫面中心，而非網格中心）
        // 由於網格超出了 100vw/100vh 範圍，我們需要找到對應畫面中央的網格位置
        const viewportCenterX = 50; // 50vw (畫面中央)
        const viewportCenterY = 50; // 50vh (畫面中央)

        // 考慮偏移量，計算畫面中央對應的網格座標
        const centerCol = (viewportCenterX + gridLayout.offsetX) / gridLayout.cellWidth;
        const centerRow = (viewportCenterY + gridLayout.offsetY) / gridLayout.cellHeight;

        // 為每個方格計算到中央的距離，用於自訂 stagger
        const staggerArray = gridItems.map((_, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const distance = Math.sqrt(
                Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
            );
            return distance;
        });

        // 找出最大距離來正規化
        const maxDistance = Math.max(...staggerArray);
        const normalizedStagger = staggerArray.map(distance => distance / maxDistance);

        // 使用 timeline 配合自訂 stagger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerContainerRef.current,
                start: "center center",
                end: "center top",
                scrub: 1,
                markers: true,
            }
        });

        // 為每個元素分別設定動畫，實現真正的中央擴散
        // 先設定所有方格從 0 到 1 的完整動畫
        gridItems.forEach((item, index) => {
            const delay = normalizedStagger[index] * 1; // 基於距離計算延遲

            // 添加從透明到不透明的動畫
            tl.fromTo(item,
                { opacity: 0 }, // 起始狀態
                {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                },
                delay
            );
        });

    }, [gridLayout]);

    // ============================
    // 渲染區塊
    // ============================
    // 組件渲染輸出
    return (
        // 主容器：設定總體滾動高度以容納所有動畫階段
        <section
            id="section-feedbacks"
            className="w-full text-white"
        >

            <div
                ref={gridContainerRef}
                className="sticky top-0 left-0 w-full h-screen overflow-hidden"
            >


                {/* 響應式方格背景 */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${gridLayout.cols}, ${gridLayout.cellWidth}vw)`,
                        gridTemplateRows: `repeat(${gridLayout.rows}, ${gridLayout.cellHeight}vh)`,
                        // 水平和垂直置中，允許超出範圍
                        transform: `translate(-${gridLayout.offsetX}vw, -${gridLayout.offsetY}vh)`,
                        transformOrigin: 'center center'
                    }}
                >
                    {Array.from({ length: gridLayout.totalCells }, (_, index) => {
                        return (
                            <div
                                key={index}
                                ref={(el) => {
                                    gridItemsRef.current[index] = el;
                                }}
                                className="border border-gray-800"
                                style={{
                                    // 初始透明度為 0，將由 GSAP 控制
                                    opacity: 0
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ============================
      // 第一部分：證言展示區域
      // ============================*/}
            {/* GSAP trigger改用這個，讓動畫從這邊開始 */}
            <div ref={triggerContainerRef} className="">
                {/* 背景證言卡片 */}
                <div
                    className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
                    style={{
                        transformStyle: 'preserve-3d',
                        perspective: 'var(--perspective, 10vw)',
                        willChange: 'perspective-origin',
                        // 使用 transform 來啟用 GPU 加速
                        transform: 'translateZ(0)'
                    }}>

                    <div>
                        <h2 className="mb-4 leading-relaxed">
                            持續求真的路上
                            <br />
                            感謝有眾聲同行
                        </h2>
                    </div>
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
