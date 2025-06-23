'use client';

import React, { useEffect, useState, useRef } from 'react';

const SidePanel = ({ isOpen, onClose, projectData, ContentComponent, contentProps, setSelectedProject, setSidePanelContent }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollContainerRef = useRef(null);

    // 重置滾動位置到頂部
    useEffect(() => {
        if (isOpen && scrollContainerRef.current) {
            // 強制重置滾動位置到頂部
            scrollContainerRef.current.scrollTop = 0;
            setScrollProgress(0);
        }
    }, [isOpen, ContentComponent, projectData]);

    // 處理滾動進度
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            const maxScroll = scrollHeight - clientHeight;

            // 計算滾動進度
            let progress = 0;
            if (maxScroll > 0) {
                progress = scrollTop / maxScroll;
            }
            const clampedProgress = Math.min(Math.max(progress, 0), 1);

            setScrollProgress(clampedProgress);
        };

        // 監聽滾動事件
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

        // 監聽容器大小變化，當內容載入完成後重新計算
        const resizeObserver = new ResizeObserver(() => {
            setTimeout(handleScroll, 50);
        });

        resizeObserver.observe(scrollContainer);

        // 初始化進度
        setTimeout(handleScroll, 100);

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, [isOpen, ContentComponent]);

    // 處理 ESC 鍵關閉側邊欄
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // 防止背景滾動
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // 如果沒有開啟，不渲染任何內容
    if (!isOpen) return null;

    // 計算圓圈的填充角度（從 12 點鐘開始，順時針）
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (scrollProgress * circumference);

    return (
        <>
            {/* 背景遮罩 */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300"
                onClick={onClose}
            />

            {/* 側邊欄主體 */}
            <div className={`fixed top-0 right-0 h-full w-full px-[5vw] py-[5vh] backdrop-blur-lg z-[9999] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>

                {/* 內容區域 */}
                <div
                    ref={scrollContainerRef}
                    data-scroll-container
                    className="sidepanel-scroll-container relative h-full overflow-y-auto bg-gray-100 shadow-2xl rounded-md"
                    style={{ scrollBehavior: 'auto' }} // 確保不使用平滑滾動
                >
                    {/* 水平滾動進度條 - 顯示在內容上方 */}
                    <div className="sticky top-0 left-0 mb-[-4px] w-full h-1 bg-transparent z-20">
                        <div
                            className="h-full bg-red-70"
                            style={{
                                width: `${scrollProgress * 100}%`
                            }}
                        ></div>
                    </div>

                    {/* 這邊會動態載入對應的SidepanelContent */}
                    <div className="sidepanel-content">
                        {ContentComponent ? (
                            <ContentComponent
                                projectData={projectData}
                                onClose={onClose}
                                setSelectedProject={setSelectedProject}
                                setSidePanelContent={setSidePanelContent}
                                {...contentProps}
                            />
                        ) : (
                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-4">專案詳情</h2>
                                {projectData ? (
                                    <div>
                                        <h3 className="text-xl mb-2">{projectData.title}</h3>
                                        <p className="text-gray-300">{projectData.description}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-300">沒有可顯示的內容</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 關閉按鈕結合滾動進度圓圈 - 固定在視窗位置 */}
                <div className="fixed top-[7vh] right-[6vw] z-[10000]">
                    <div className="relative w-12 h-12">
                        {/* 背景圓環 - 灰色環狀 */}
                        {/* <div
                            className="absolute inset-0 rounded-full bg-gray-300 opacity-30"
                            style={{
                                mask: 'radial-gradient(circle, transparent 60%, #CCC 60%)',
                                WebkitMask: 'radial-gradient(circle, transparent 60%, #CCC 60%)'
                            }}
                        ></div> */}

                        {/* 進度圓環 - 使用 conic-gradient 配合遮罩 */}
                        {/* <div
                            className="absolute inset-0 rounded-full transition-all duration-150 ease-out"
                            style={{
                                background: `conic-gradient(from 0deg, #CCC 0deg, #CCC ${scrollProgress * 360}deg, transparent ${scrollProgress * 360}deg, transparent 360deg)`,
                                mask: 'radial-gradient(circle, transparent 60%, #CCC 60%)',
                                WebkitMask: 'radial-gradient(circle, transparent 60%, #CCC 60%)'
                            }}
                        ></div> */}

                        {/* 關閉按鈕 - 置於圓環中央 */}
                        <button
                            onClick={onClose}
                            className="group absolute inset-0 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.25)] backdrop-blur-xl shadow-md hover:bg-black transition-colors duration-300"
                            aria-label="關閉側邊欄"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="stroke-current group-hover:stroke-white"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SidePanel;
