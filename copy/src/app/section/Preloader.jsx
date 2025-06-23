"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUiContext } from '../context/UiContext';
import FlipClock from '../components/FlipClock';
import IndicatorScroll from '../components/IndicatorScroll';

export default function Preloader() {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [flipClockCompleted, setFlipClockCompleted] = useState(false);
    const [textVisible, setTextVisible] = useState(false);
    const [scrollHintVisible, setScrollHintVisible] = useState(false);
    const [preloaderVisible, setPreloaderVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const scrollAmount = useRef(0);
    const loadedResources = useRef(0);
    const totalResources = useRef(0);
    const startTime = useRef(Date.now());

    // 使用 UiContext 來共享預載器的可見狀態
    const { setPreloaderVisible: setGlobalPreloaderVisible } = useUiContext();

    // 最小載入時間（毫秒）
    const MIN_LOADING_TIME = 2000;

    // 確保只在客戶端執行
    useEffect(() => {
        setIsClient(true);
    }, []);

    // 需要預載的資源列表
    const resourcesToPreload = [
        // 3D 模型檔案
        '/assets/room3D-2.glb',
        '/assets/robot.glb',
        '/assets/telecope.glb',
        '/assets/camera.glb',
        '/assets/room3D.glb',
        '/assets/earth.glb',
        '/assets/magazine_mockup_in_case.glb',
        '/assets/head_phones.glb',
        '/assets/cute_computer_follow_cursor.glb',
        '/assets/chat_gpt_keyboard.glb',
        '/assets/macbook.glb',
        '/assets/animationTest.glb',

        // 重要圖片資源
        '/assets/nav_logo--light.svg',
        '/assets/nav_logo--dark.svg',
        '/assets/nav_hamburger.svg',
        '/assets/nav_close.svg',
        '/assets/close.svg',
        '/assets/img1.png',
        '/assets/img2.png',
        '/assets/img3.png',
        '/assets/img4.png',
        '/assets/img5.png',
        '/assets/img6.png',
        '/assets/img7.png',
        '/assets/img8.png',
        '/assets/img9.png',
        '/assets/img10.png',
        '/assets/出口禁令下的紅線交易──揭開MIT工具機流入俄羅斯軍工業隱蹤.png',
        '/assets/中國虎視下的島鏈──沖繩如何成為台海危機的熱點.jpg',
        '/assets/笑氣濫用_(攝影蔡耀徵).jpg',
        '/assets/國家不願面對的真相：獨家揭露台鐵體檢報告。（攝影蘇威銘）.jpg',
        '/assets/六輕環境難民。.jpg',
        '/assets/廢墟裡的少年_(攝影余志偉).jpg',
        '/assets/report-1綁債．黑工．留學陷阱.jpg',

        // 重要影片資源
        '/assets/獵童風暴：揭開未成年性剝削影像的暗黑產業鏈 - 報導者 The Reporter.mp4',
        '/assets/看不見的線上博弈帝國 - 報導者 The Reporter.mp4',
        '/assets/每天我們失去5個孩子——搶救兒童高死亡率 - 報導者 The Reporter.mp4',
        '/assets/造假．剝削．血淚漁場──跨國直擊台灣遠洋漁業真相 - 報導者 The Reporter.mp4',
        '/assets/report-2山頭上的掠奪.mp4'
    ];

    // 預載單一資源的函數
    const preloadResource = (url) => {
        return new Promise((resolve) => {
            const fileExtension = url.split('.').pop().toLowerCase();

            // 只在客戶端加入隨機延遲，讓載入更平滑
            let randomDelay = 0;
            if (isClient) {
                const minDelay = 100;
                const maxDelay = 800;
                randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
            }

            const completeLoading = () => {
                setTimeout(() => {
                    loadedResources.current++;
                    updateProgress();
                    resolve();
                }, randomDelay);
            };

            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
                // 圖片資源
                const img = new Image();
                img.onload = completeLoading;
                img.onerror = completeLoading; // 即使載入失敗也繼續，避免卡住
                img.src = url;
            } else if (['mp4', 'webm', 'mov'].includes(fileExtension)) {
                // 影片資源 - 只載入 metadata 而不是整個影片
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = completeLoading;
                video.onerror = completeLoading;
                video.src = url;
                video.load();
            } else {
                // 其他資源（如 .glb 檔案）使用 fetch，但只載入前幾個 bytes 來檢查存在性
                fetch(url, {
                    method: 'HEAD' // 只取得 header，不下載完整檔案
                })
                    .then(() => completeLoading())
                    .catch(() => completeLoading());
            }
        });
    };

    // FlipClock 動畫完成的回調
    const handleFlipClockComplete = useCallback(() => {
        setFlipClockCompleted(true);
    }, []);

    // 當 FlipClock 完成且資源載入完成時，立即顯示文字
    useEffect(() => {
        if (flipClockCompleted && !isLoading) {
            // 立即淡入文字效果
            setTextVisible(true);

            // 短暫延遲後顯示向下捲動提示
            setTimeout(() => {
                setScrollHintVisible(true);
            }, 300);
        }
    }, [flipClockCompleted, isLoading]);

    // 更新載入進度
    const updateProgress = () => {
        const progress = Math.round((loadedResources.current / totalResources.current) * 100);
        setLoadingProgress(progress);

        if (loadedResources.current >= totalResources.current) {
            // 檢查是否已經過了最小載入時間
            const elapsedTime = Date.now() - startTime.current;
            const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

            // 載入完成，但不立即顯示文字，要等 FlipClock 完成
            setTimeout(() => {
                setIsLoading(false);
            }, remainingTime + 500);
        }
    };

    useEffect(() => {
        // 同步組件內部狀態到全局狀態
        setGlobalPreloaderVisible(preloaderVisible);
    }, [preloaderVisible, setGlobalPreloaderVisible]);

    useEffect(() => {
        // 防止在初始加載時自動滾動到先前位置
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        }

        // 開始預載資源
        totalResources.current = resourcesToPreload.length;

        // 並行載入所有資源
        Promise.all(resourcesToPreload.map(url => preloadResource(url)));

        // 捲動監聽器
        const handleScroll = () => {
            // 只有在載入完成且文字顯示後才允許滾動離開
            if (!isLoading && textVisible) {
                scrollAmount.current = window.scrollY;

                // 如果捲動超過 100px，先啟動淡出效果
                if (scrollAmount.current > 100 && !fadeOut) {
                    setFadeOut(true);

                    // 淡出動畫結束後再移除元素
                    setTimeout(() => {
                        setPreloaderVisible(false);
                    }, 800);
                }
            }
        };

        // 添加捲動事件監聽器
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, textVisible, fadeOut]);

    // 如果 preloaderVisible 為 false，則不渲染任何內容
    if (!preloaderVisible) return null;

    return (
        <div className={`preloader fixed top-0 left-0 w-full h-screen z-[9999] transition-opacity duration-500 ease-out ${fadeOut ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>

            {/* 載入中的全畫面進度效果 */}
            {(isLoading || !flipClockCompleted) && (
                <>
                    <div className="absolute inset-0 bg-black"></div>

                    {/* FlipClock 日期翻牌動畫 - 取代黑色進度條 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FlipClock onComplete={handleFlipClockComplete} />
                    </div>
                </>
            )}

            {/* 載入完成且 FlipClock 動畫完成後顯示的主要內容 */}
            {!isLoading && flipClockCompleted && (
                <>
                    <div className="absolute inset-0 bg-black flex flex-col justify-center items-center">
                        <div
                            className={`absolute top-10 left-auto right-auto transition-all duration-1000 ease-in-out ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                        >
                            <img src="/assets/preloader-logo.svg" alt="logo" className="w-[2rem] h-auto" />
                        </div>
                        <h1
                            className={`text-4xl font-bold md:text-5xl lg:text-6xl text-white mb-8 transition-all duration-1000 ease-in-out font-alverata-mixed ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                        >
                            深度求真 眾聲同行
                        </h1>

                        {/* 捲動提示 */}
                        <div
                            className={`absolute bottom-[50px] md:bottom-[50px] sm:bottom-[30px] flex flex-col items-center transition-all duration-1000 ease-in-out ${scrollHintVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                        >
                            <IndicatorScroll>
                                <p className="text-white text-base md:text-base sm:text-sm uppercase tracking-wider mb-4 font-light">
                                    向下滾動 開始探索
                                </p>
                            </IndicatorScroll>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 