"use client";

import { createContext, useContext, useState } from 'react';

// 創建 UI 上下文
const UiContext = createContext(null);

// 上下文提供者組件
export function UiProvider({ children }) {
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [preloaderVisible, setPreloaderVisible] = useState(true);
    const [isBeforeReportsOpen, setIsBeforeReportsOpen] = useState(true);

    // 提供共享狀態和修改函數
    const value = {
        isSidePanelOpen,
        setIsSidePanelOpen,
        preloaderVisible,
        setPreloaderVisible,
        isBeforeReportsOpen,
        setIsBeforeReportsOpen,
        isInOpenSection: isBeforeReportsOpen,
        setIsInOpenSection: setIsBeforeReportsOpen,
    };

    return (
        <UiContext.Provider value={value}>
            {children}
        </UiContext.Provider>
    );
}

// 使用上下文的自定義 Hook
export function useUiContext() {
    const context = useContext(UiContext);
    if (!context) {
        throw new Error('useUiContext must be used within a UiProvider');
    }
    return context;
} 