"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from '../data/projects.json';
import { useUiContext } from '../context/UiContext';
import { getContentComponentByProjectId } from '../sidepanel-contents/contentMap';
import PathItem from '../components/PathItem';
import PathOpen from '../components/PathOpen';
import PathImageContainer from '../components/PathImageContainer';

gsap.registerPlugin(ScrollTrigger);

const Path = ({ setSelectedProject, setSidePanelContent }) => {
    const sectionRef = useRef(null);
    const titlesRef = useRef(null);
    const imagesRef = useRef(null);
    const scrollTriggerRef = useRef(null);
    const [isClient, setIsClient] = useState(false);

    // 使用全局 UI 上下文
    const { setIsSidePanelOpen } = useUiContext();

    // 挑戰標題資料：從 projectsData 中篩選出 challenge section 的項目
    const challengeProjects = projectsData
        .filter(p => p.section && (p.section.includes('challenge') || p.section === 'challenge'));

    const challengeTitles = challengeProjects.map(p => p.title);

    // 基於項目數量的智能計算
    const calculateScrollParams = () => {
        // 計算容器寬度：(項目數量 + intro區塊) × 100vw 
        const contentSections = challengeProjects.length + 1; // +1 for intro section
        const CONTAINER_WIDTH_VW = contentSections * 100; // 每個區塊100vw

        // 計算移動距離：容器總寬度減去一個視窗寬度
        const moveDistanceVW = CONTAINER_WIDTH_VW - 100;
        const moveDistance = (window.innerWidth * moveDistanceVW) / 100;

        // 滾動高度等於容器寬度（保持1:1比例）
        const scrollHeight = window.innerHeight * (CONTAINER_WIDTH_VW / 100);

        return {
            CONTAINER_WIDTH_VW,
            moveDistance,
            scrollHeight,
            moveDistanceVW
        };
    };

    // 處理標題點擊事件
    const handleTitleClick = (titleText) => {
        // 根據標題文字查找對應的項目數據，且必須屬於 challenge section
        const projectData = projectsData.find(p =>
            p.title === titleText &&
            p.section &&
            (p.section.includes('challenge') || p.section === 'challenge')
        );
        if (projectData) {
            handleProjectClick(projectData);
        }
    };

    // 修改點擊處理函數
    const handleProjectClick = (project) => {
        setSelectedProject(project);

        // 獲取對應的內容組件
        const ContentComponent = getContentComponentByProjectId(project.id);

        // 設置側邊欄內容組件，如果有定義的話
        if (setSidePanelContent && typeof setSidePanelContent === 'function') {
            setSidePanelContent({
                ContentComponent,
                contentProps: { projectData: project }
            });
        }

        // 打開側邊欄
        setIsSidePanelOpen(true);
    };

    // 確保只在客戶端執行
    useEffect(() => {
        setIsClient(true);
    }, []);

    // 初次掛載時註冊水平滾動 ScrollTrigger
    useEffect(() => {
        if (typeof window === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // 基於項目數量計算滾動參數
        const { CONTAINER_WIDTH_VW, moveDistance, scrollHeight, moveDistanceVW } = calculateScrollParams();

        // 📸 照片配置
        const PHOTO_CONFIG = {
            // 照片數量：移除上限限制，基於項目數量或您想要的數量
            count: challengeProjects.length * 3, // 可以根據需要調整倍數，或直接設定固定數字
            // 照片檔案前綴和起始編號
            filePrefix: 'img',
            startNumber: 1,
            // 照片大小
            size: { width: 200, height: 200 },
            // 是否隨機排列位置
            randomizePositions: false
        };

        // 擴展照片位置配置（支援更多照片）
        const cardPositions = [
            { top: "50%", left: "55%" },
            { top: "20%", left: "25%" },
            { top: "50%", left: "10%" },
            { top: "60%", left: "40%" },
            { top: "30%", left: "30%" },
            { top: "60%", left: "60%" },
            { top: "20%", left: "50%" },
            { top: "60%", left: "10%" },
            { top: "20%", left: "40%" },
            { top: "45%", left: "55%" },
            { top: "35%", left: "70%" },
            { top: "75%", left: "35%" },
            { top: "15%", left: "65%" },
            { top: "55%", left: "20%" },
            { top: "40%", left: "80%" },
        ];

        // 如果啟用隨機位置，打亂位置陣列 - 只在客戶端執行
        if (isClient && PHOTO_CONFIG.randomizePositions) {
            for (let i = cardPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cardPositions[i], cardPositions[j]] = [cardPositions[j], cardPositions[i]];
            }
        }

        const titlesContainer = titlesRef.current;
        const imagesContainer = imagesRef.current;

        if (!titlesContainer || !imagesContainer) return;

        // 動態設置容器寬度
        titlesContainer.style.width = `${CONTAINER_WIDTH_VW}vw`;

        // 動態創建照片卡片
        const cardCount = PHOTO_CONFIG.count;
        for (let i = 1; i <= cardCount; i++) {
            const card = document.createElement("div");
            card.className = `absolute w-[${PHOTO_CONFIG.size.width}px] h-[${PHOTO_CONFIG.size.height}px] rounded-2xl bg-gray-300 overflow-hidden will-change-transform card`;
            card.style.transformStyle = 'preserve-3d';
            card.classList.add(`card-${i}`);

            const img = document.createElement("img");
            // 循環使用照片檔案：如果照片數量超過實際檔案數量，會重複使用
            // 您可以調整這個數字來匹配實際擁有的照片檔案數量
            const availableImageCount = 30; // 調整為您實際擁有的照片檔案數量
            const imageNumber = PHOTO_CONFIG.startNumber + ((i - 1) % availableImageCount);
            img.src = `/assets/${PHOTO_CONFIG.filePrefix}${imageNumber}.png`;
            img.alt = `Image ${i}`;
            img.className = "w-full h-full object-cover";
            img.onerror = () => {
                // 如果照片載入失敗，使用預設照片
                img.src = `/assets/${PHOTO_CONFIG.filePrefix}${PHOTO_CONFIG.startNumber}.png`;
            };
            card.appendChild(img);

            // 循環使用位置配置：如果照片數量超過 cardPositions 陣列長度，會重複使用位置
            const positionIndex = (i - 1) % cardPositions.length;
            const position = cardPositions[positionIndex];
            card.style.top = position.top;
            card.style.left = position.left;

            imagesContainer.appendChild(card);
        }

        // 設置卡片初始狀態
        const cards = document.querySelectorAll(`.card`);
        cards.forEach((card) => {
            gsap.set(card, {
                z: -50000,
                scale: 0,
            });
        });

        // 為所有標題添加點擊事件
        document.querySelectorAll(`.challengeTitle`).forEach((title) => {
            title.style.cursor = 'pointer';
            title.addEventListener('click', () => handleTitleClick(title.textContent));
        });

        // 設置滾動觸發器 - 保持 1:1 滾動比例
        const scrollTrigger = ScrollTrigger.create({
            trigger: `#path-section`,
            start: "top top",
            end: `+=${scrollHeight}px`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                // 設定緩衝區域（參考 ReportsThree.jsx 的實現）
                const startBuffer = 0.05;
                const endBuffer = 0.05;
                const activeRange = 1 - startBuffer - endBuffer;

                let adjustedProgress = 0;
                if (self.progress >= startBuffer && self.progress <= (1 - endBuffer)) {
                    adjustedProgress = (self.progress - startBuffer) / activeRange;
                } else if (self.progress > (1 - endBuffer)) {
                    adjustedProgress = 1;
                }

                const xPosition = -moveDistance * adjustedProgress;
                gsap.set(titlesContainer, {
                    x: xPosition,
                });

                // 根據調整後的滾動進度計算當前顯示的挑戰項目
                const totalSections = challengeProjects.length + 1;
                const currentSectionIndex = Math.floor(adjustedProgress * totalSections);

                // 移除背景色更新功能

                const velocity = self.getVelocity();
                const normalizedVelocity = velocity / Math.abs(velocity) || 0;
                const maxOffset = 30;
                const currentSpeed = Math.min(Math.abs(velocity / 500), maxOffset);
                const isAtEdge = self.progress <= 0 || self.progress >= 1;

                document.querySelectorAll(`.challenge`).forEach((titleContainer) => {
                    const challengeTitle = titleContainer.querySelector(`.challengeTitle`);
                    const title3 = titleContainer.querySelector(`.title3`);

                    if (isAtEdge) {
                        gsap.to(challengeTitle, {
                            xPercent: -50,
                            x: 0,
                            duration: 0.3,
                            ease: "power2.out",
                            overwrite: true,
                        });
                    } else {
                        const baseOffset = normalizedVelocity * currentSpeed;
                        gsap.to(challengeTitle, {
                            xPercent: -50,
                            x: `${baseOffset * 4}px`,
                            duration: 0.2,
                            ease: "power1.out",
                            overwrite: "auto",
                        });
                    }

                    if (title3) {
                        gsap.set(title3, {
                            xPercent: -50,
                            x: 0,
                        });
                    }
                });

                // 更新卡片位置（使用調整後的進度）
                cards.forEach((card, index) => {
                    const staggerOffset = index * 0.075;
                    const scaledProgress = (adjustedProgress - staggerOffset) * 3;
                    const individualProgress = Math.max(0, Math.min(1, scaledProgress));
                    const targetZ = index === cards.length - 1 ? 1500 : 2000;
                    const newZ = -50000 + (targetZ + 50000) * individualProgress;
                    const scaleProgress = Math.min(1, individualProgress * 10);
                    const scale = Math.max(0, Math.min(1, scaleProgress));

                    gsap.set(card, {
                        z: newZ,
                        scale: scale,
                    });
                });
            },
        });

        // 保存ScrollTrigger引用
        scrollTriggerRef.current = scrollTrigger;

        // 清理函數
        return () => {
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
                scrollTriggerRef.current = null;
            }
            document.querySelectorAll(`.challengeTitle`).forEach((title) => {
                title.removeEventListener('click', () => handleTitleClick(title.textContent));
            });
        };
    }, [isClient]);

    return (
        <div className="relative h-screen overflow-hidden" id="path-section" ref={sectionRef}>
            <div
                className="absolute top-0 left-0 h-screen flex will-change-transform"
                ref={titlesRef}
            >
                <PathOpen />

                {challengeTitles.map((title, index) => (
                    <PathItem
                        key={index}
                        title={title}
                        onTitleClick={handleTitleClick}
                    />
                ))}
            </div>
            <PathImageContainer ref={imagesRef} />
        </div>
    );
};

export default Path; 