// 清除教學提示快取的工具函數
export const clearReportsTutorialCache = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('reports-tutorial-seen');
        console.log('Reports tutorial cache cleared');
    }
};

// 清除所有教學提示快取
export const clearAllTutorialCache = () => {
    if (typeof window !== 'undefined') {
        // 清除 reports 教學
        localStorage.removeItem('reports-tutorial-seen');
        
        // 未來可以在這裡加入其他章節的教學快取清除
        // localStorage.removeItem('innovations-tutorial-seen');
        // localStorage.removeItem('challenges-tutorial-seen');
        
        console.log('All tutorial caches cleared');
    }
};

// 檢查教學是否已經看過
export const hasSeenReportsTutorial = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('reports-tutorial-seen') === 'true';
    }
    return false;
};

// 在瀏覽器 console 中使用的全域函數（僅開發環境）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).clearReportsTutorial = clearReportsTutorialCache;
    (window as any).clearAllTutorials = clearAllTutorialCache;
    console.log('Tutorial cache utilities available:');
    console.log('- window.clearReportsTutorial()');
    console.log('- window.clearAllTutorials()');
}