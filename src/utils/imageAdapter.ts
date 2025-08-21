/**
 * 圖片路徑適配器
 * 根據現有的檔案結構提供最佳的圖片路徑
 */

import { ImageSizes } from './imageManager';

/**
 * 現有檔案結構的圖片路徑映射
 * 根據實際檔案情況提供可用的圖片路徑
 */
export function getAvailableImagePath(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    },
    preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' = 'thumbnail'
): string {
    // 統一的路徑生成邏輯
    const basePath = getBasePath(projectData);
    const pathWithoutExt = basePath.replace(/\.(webp|jpg|jpeg|png|mp4|webm)$/i, '');

    // 根據 preferredSize 生成對應路徑
    const sizeMap = {
        thumbnail: `${pathWithoutExt}-thumb.webp`,
        small: `${pathWithoutExt}-sm.webp`,
        medium: `${pathWithoutExt}-md.webp`,
        large: `${pathWithoutExt}-lg.webp`
    };

    // 優先返回請求的尺寸
    const preferredPath = sizeMap[preferredSize];
    if (preferredPath && fileExistsInPublic(preferredPath)) {
        return preferredPath;
    }

    // Fallback 策略：按優先級尋找可用的尺寸
    const fallbackOrder = getFallbackOrder(preferredSize);

    for (const size of fallbackOrder) {
        const fallbackPath = sizeMap[size];
        if (fallbackPath && fileExistsInPublic(fallbackPath)) {
            return fallbackPath;
        }
    }

    // 最終 fallback 到原始路徑
    return basePath;
}

/**
 * 獲取基礎路徑（考慮 Innovation 的 imageSRC）
 */
function getBasePath(projectData: {
    id: string;
    path: string;
    imageSRC?: string;
    section: string[];
}): string {
    // Innovation 項目現在也使用統一命名，不再特殊處理 imageSRC
    return projectData.path;
}

/**
 * 獲取 fallback 順序
 */
function getFallbackOrder(preferredSize: 'thumbnail' | 'small' | 'medium' | 'large'): ('thumbnail' | 'small' | 'medium' | 'large')[] {
    switch (preferredSize) {
        case 'thumbnail':
            return ['small', 'medium', 'large'];
        case 'small':
            return ['thumbnail', 'medium', 'large'];
        case 'medium':
            return ['small', 'large', 'thumbnail'];
        case 'large':
            return ['medium', 'small', 'thumbnail'];
        default:
            return ['thumbnail', 'small', 'medium', 'large'];
    }
}

/**
 * 檢查檔案是否存在於 public 目錄
 * 在瀏覽器環境中，我們假設檔案存在（由於無法直接檢查檔案系統）
 */
function fileExistsInPublic(path: string): boolean {
    // 在瀏覽器環境中，我們基於檔案命名規則假設檔案存在
    // 這個函數主要用於 Node.js 環境的工具腳本
    if (typeof window !== 'undefined') {
        return true; // 瀏覽器環境中假設檔案存在
    }

    // Node.js 環境中可以實際檢查檔案
    try {
        // 動態 import 以避免 webpack 警告
        const fs = eval('require')('fs');
        const nodePath = eval('require')('path');
        const fullPath = nodePath.join(process.cwd(), 'public', path);
        return fs.existsSync(fullPath);
    } catch {
        return true; // 如果檢查失敗，假設檔案存在
    }
}

/**
 * 檢查 Reports 是否有小尺寸版本
 * 根據現有檔案結構判斷
 */
function _checkReportsSmallVersion(reportId: string): boolean {
    // 根據目錄結構，reports-1 到 reports-12 都有 -sm 版本
    const reportNumber = parseInt(reportId);
    return reportNumber >= 1 && reportNumber <= 12;
}

/**
 * 生成當前可用的圖片尺寸變體
 * 基於實際檔案結構
 */
export function getCurrentImageSizes(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    }
): Partial<ImageSizes> {
    const basePath = getBasePath(projectData);
    const pathWithoutExt = basePath.replace(/\.(webp|jpg|jpeg|png|mp4|webm)$/i, '');

    // 現在所有項目都有完整的尺寸變體
    return {
        thumbnail: `${pathWithoutExt}-thumb.webp`,
        small: `${pathWithoutExt}-sm.webp`,
        medium: `${pathWithoutExt}-md.webp`,
        large: `${pathWithoutExt}-lg.webp`, // 你沒有建立 -lg，但系統會 fallback
        original: basePath
    };
}

/**
 * 為 ModalSidepanel 獲取最優化的圖片路徑
 * 優先使用小尺寸，提升載入速度
 */
export function getOptimizedSidepanelImage(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    }
): {
    src: string;
    fallback: string;
    isOptimized: boolean;
} {
    const optimizedPath = getAvailableImagePath(projectData, 'thumbnail');
    const fallbackPath = projectData.path;
    const isOptimized = optimizedPath !== fallbackPath;

    return {
        src: optimizedPath,
        fallback: fallbackPath,
        isOptimized
    };
}

/**
 * 預載策略：根據現有檔案結構決定預載順序
 */
export function getPreloadUrls(
    projects: Array<{
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    }>,
    maxItems: number = 6
): Array<{ url: string; priority: 'high' | 'medium' | 'low' }> {
    return projects.slice(0, maxItems).map((project, index) => {
        const optimizedImage = getOptimizedSidepanelImage(project);

        return {
            url: optimizedImage.src,
            priority: index < 3 ? 'high' : 'medium'
        };
    });
}

/**
 * 檢查是否為影片檔案
 */
export function isVideoFile(path: string): boolean {
    return /\.(mp4|webm|mov)$/i.test(path);
}

/**
 * 為影片項目生成縮圖路徑
 */
export function getVideoThumbnail(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    }
): string {
    // 對於 Innovation 項目，imageSRC 就是影片縮圖
    if (projectData.imageSRC) {
        return projectData.imageSRC;
    }

    // 如果沒有專用縮圖，嘗試生成縮圖路徑
    const videoPath = projectData.path;
    const thumbnailPath = videoPath.replace(/\.(mp4|webm|mov)$/i, '.webp');

    return thumbnailPath;
}

/**
 * 開發模式：記錄圖片使用情況
 */
export function logImageUsage(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        section: string[];
    },
    usedPath: string,
    context: string
): void {
    if (process.env.NODE_ENV === 'development') {
        const optimizedImage = getOptimizedSidepanelImage(projectData);

        console.log(`[ImageAdapter] ${context}:`, {
            projectId: projectData.id,
            section: projectData.section[0],
            requestedPath: usedPath,
            optimizedPath: optimizedImage.src,
            isOptimized: optimizedImage.isOptimized,
            sizeSaved: optimizedImage.isOptimized ? '估計節省 60-80%' : '無優化'
        });
    }
}

/**
 * 批量預生成圖片路徑（用於開發時產生缺失的圖片清單）
 */
export function generateMissingImageList(
    projects: Array<{
        id: string;
        path: string;
        imageSRC?: string;
        section: string[];
    }>
): Array<{
    projectId: string;
    section: string;
    requiredSizes: string[];
    currentPaths: string[];
}> {
    return projects.map(project => {
        const currentSizes = getCurrentImageSizes(project);
        const section = project.section[0];

        const requiredSizes = ['thumbnail', 'small', 'medium'];
        const currentPaths = Object.values(currentSizes).filter(Boolean);

        return {
            projectId: project.id,
            section,
            requiredSizes,
            currentPaths
        };
    });
}
