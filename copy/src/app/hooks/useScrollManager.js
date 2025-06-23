import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 統一的滾動管理 Hook
 * 整合導航欄顯示/隱藏、深色模式切換等滾動相關邏輯
 */
export const useScrollManager = () => {
    const [showNav, setShowNav] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const scrollThreshold = 30; // 滾動閾值

    // 使用 useCallback 優化性能
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // 導航欄顯示/隱藏邏輯
        // if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        //     if (currentScrollY > lastScrollY) {
        //         setShowNav(false); // 向下滾動，隱藏
        //     } else {
        //         setShowNav(true); // 向上滾動，顯示
        //     }
        //     setLastScrollY(currentScrollY);
        // }

        //讓導覽列總是顯示
        setShowNav(true);

        // 深色模式切換邏輯
        const callToAction = document.getElementById('call-to-action');
        if (callToAction) {
            const callToActionRect = callToAction.getBoundingClientRect();
            const shouldBeDarkMode = callToActionRect.top <= 0;

            if (isDarkMode !== shouldBeDarkMode) {
                setIsDarkMode(shouldBeDarkMode);
            }
        }
    }, [lastScrollY, isDarkMode, scrollThreshold]);

    useEffect(() => {
        // 使用節流來優化滾動性能
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledHandleScroll, { passive: true });

        // 初始檢查
        handleScroll();

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [handleScroll]);

    return {
        showNav,
        setShowNav,
        isDarkMode,
        setIsDarkMode,
        lastScrollY
    };
}; 