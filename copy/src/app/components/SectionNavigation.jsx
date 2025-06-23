"use client";

import { useState, useEffect, useMemo } from 'react';
import { useUiContext } from '../context/UiContext';

const SectionNavigation = () => {
    const [activeSection, setActiveSection] = useState('');
    const { isSidePanelOpen, isInOpenSection } = useUiContext();

    // NOTE: 區域高度配置 - 定義各區域的 vh 高度（移除 reportsOpen）
    const SECTION_HEIGHTS = {
        reports: 800,        // Reports 3D圓柱體場景：800vh
        transition: 200,     // 相機過渡區間：200vh
        innovation: 900      // Innovation 3D物件場景：900vh
    };

    // 自動計算滾動區間配置
    const SCROLL_SECTIONS = useMemo(() => {
        const totalHeight = Object.values(SECTION_HEIGHTS).reduce((sum, height) => sum + height, 0);

        let currentProgress = 0;
        const sections = {};

        // Reports 區域
        sections.reports = {
            start: currentProgress,
            end: currentProgress + (SECTION_HEIGHTS.reports / totalHeight)
        };
        currentProgress = sections.reports.end;

        // Transition 區域
        sections.transition = {
            start: currentProgress,
            end: currentProgress + (SECTION_HEIGHTS.transition / totalHeight)
        };
        currentProgress = sections.transition.end;

        // Innovation 區域
        sections.innovation = {
            start: currentProgress,
            end: 1.0
        };

        return sections;
    }, [SECTION_HEIGHTS]);

    // 定義導覽項目
    const navItems = useMemo(() => [
        {
            id: 'reports-area',
            label: '影響力報導',
            shortLabel: '影響力報導',
            isVirtual: true, // 虛擬區域，基於滾動進度判斷
            targetSection: 'combined-3d-section',
            scrollProgress: SCROLL_SECTIONS.reports
        },
        {
            id: 'innovation-area',
            label: '多元創新',
            shortLabel: '多元創新',
            isVirtual: true, // 虛擬區域，基於滾動進度判斷
            targetSection: 'combined-3d-section',
            scrollProgress: SCROLL_SECTIONS.innovation
        },
        {
            id: 'path-section',
            label: '非營利媒體',
            shortLabel: '非營利媒體'
        },
        {
            id: 'call-to-action',
            label: '捐款支持',
            shortLabel: '捐款支持'
        }
    ], [SCROLL_SECTIONS]);

    // 直接跳轉到指定區塊
    const scrollToSection = (sectionId) => {
        const navItem = navItems.find(item => item.id === sectionId);

        if (navItem && navItem.isVirtual) {
            // 處理虛擬區域的跳轉
            const targetElement = document.getElementById(navItem.targetSection);
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                const elementTop = window.scrollY + rect.top;
                const elementHeight = rect.height;

                // 計算目標滾動位置（根據scrollProgress）
                const targetScrollY = elementTop + (elementHeight * navItem.scrollProgress.start);

                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
            }
        } else {
            // 處理一般區域的跳轉
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    };

    // 檢測當前區塊，包含對 Combined3DScene 的特殊處理
    useEffect(() => {
        // 檢測當前應該激活哪個區域
        const detectActiveSection = () => {
            const scrollY = window.scrollY;

            // 特殊處理 Combined3DScene
            const combinedElement = document.getElementById('combined-3d-section');
            if (combinedElement) {
                const rect = combinedElement.getBoundingClientRect();
                const elementTop = scrollY + rect.top;
                const elementBottom = elementTop + rect.height;

                // 檢查是否在 Combined3DScene 範圍內
                if (scrollY >= elementTop && scrollY < elementBottom) {
                    // 計算在 Combined3DScene 內的滾動進度
                    const progress = (scrollY - elementTop) / rect.height;

                    // 根據進度判斷應該激活哪個虛擬區域
                    if (progress < SCROLL_SECTIONS.reports.end) {
                        return 'reports-area';
                    } else if (progress >= SCROLL_SECTIONS.innovation.start) {
                        return 'innovation-area';
                    } else {
                        // 在過渡區間，保持當前狀態或選擇較近的
                        return progress < 0.35 ? 'reports-area' : 'innovation-area';
                    }
                }
            }

            // 檢查其他一般區域
            let closestSection = '';
            let minDistance = Infinity;

            navItems.forEach(item => {
                // 跳過虛擬區域
                if (item.isVirtual) return;

                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = scrollY + rect.top;
                    const elementBottom = elementTop + rect.height;

                    // 檢查當前滾動位置是否在這個區塊範圍內
                    if (scrollY >= elementTop && scrollY < elementBottom) {
                        closestSection = item.id;
                        minDistance = 0;
                    } else {
                        // 計算距離
                        const distance = Math.abs(scrollY - elementTop);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestSection = item.id;
                        }
                    }
                }
            });

            return closestSection;
        };

        // 滾動監聽器
        const handleScroll = () => {
            const newActiveSection = detectActiveSection();
            if (newActiveSection && newActiveSection !== activeSection) {
                setActiveSection(newActiveSection);
            }
        };

        // 監聽滾動事件
        window.addEventListener('scroll', handleScroll, { passive: true });

        // 初始檢查
        setTimeout(() => {
            const initialSection = detectActiveSection();
            if (initialSection) {
                setActiveSection(initialSection);
            }
        }, 500);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [activeSection, SCROLL_SECTIONS, navItems]);

    // 當側邊欄打開時或在 Open 區塊中時隱藏導覽列
    if (isSidePanelOpen || isInOpenSection) {
        return null;
    }

    return (
        <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-[9998] ">
            <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`group relative flex items-center justify-center px-[4px] py-[8px] rounded-sm transition-all duration-300 hover:scale-105 active:scale-95 ${activeSection === item.id
                            ? 'bg-red-90 text-white'
                            : 'bg-transparent'
                            }`}
                        title={item.label}
                        aria-label={`跳到 ${item.label} 區塊`}
                    >
                        <span
                            className="text-sm text-inherit md:text-base font-medium tracking-wider"
                            style={{
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed'
                            }}
                        >
                            {item.shortLabel}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default SectionNavigation; 