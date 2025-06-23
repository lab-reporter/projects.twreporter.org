"use client";

import { useEffect } from 'react';
import { useUiContext } from '../context/UiContext';
import { useScrollManager } from '../hooks/useScrollManager';

const Menu = () => {
    const { isSidePanelOpen, preloaderVisible, isInOpenSection } = useUiContext();
    const { showNav, setShowNav, isDarkMode } = useScrollManager();

    // 當 Preloader 消失時，確保導航欄顯示
    useEffect(() => {
        if (!preloaderVisible) {
            setShowNav(true);
        }
    }, [preloaderVisible, setShowNav]);

    // 當 SidePanel 打開時，強制隱藏導航欄
    useEffect(() => {
        if (isSidePanelOpen) {
            setShowNav(false);
        }
    }, [isSidePanelOpen, setShowNav]);

    // 決定是否顯示導航欄：
    // 1. Preloader 可見時不顯示
    // 2. 在 Open 區塊中時不顯示
    // 3. SidePanel 打開時不顯示
    // 4. 否則根據滾動狀態決定
    const shouldShowNav = !preloaderVisible && !isInOpenSection && showNav && !isSidePanelOpen;

    return (
        <>
            {/* navigation外層容器 */}
            <div
                className={`w-full fixed top-0 right-auto left-auto flex justify-center z-[9999] transition-colors duration-500 ease-in-out ${isDarkMode ? 'text-white' : 'text-black'}`}
                style={{ transform: shouldShowNav ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.3s ease-in-out' }}
            >
                {/* navigation本體 */}
                <div className={`px-8 m-8 mx-auto w-auto h-auto flex flex-row justify-between items-center rounded-sm transition-colors duration-500 ease-in-out`}>
                    {/* LOGO */}
                    <img className="h-6 w-auto" src={isDarkMode ? "/assets/nav_logo--dark.svg" : "/assets/nav_logo--light.svg"} alt="Logo" />
                </div>
            </div>
        </>
    );
};

export default Menu;
