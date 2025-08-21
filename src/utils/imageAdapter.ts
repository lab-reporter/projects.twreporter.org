/**
 * 圖片路徑適配器
 * 根據現有的檔案結構提供最佳的圖片路徑
 */

import { ImageSizes, SectionType } from './imageManager';

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
    const section = projectData.section[0] as SectionType;
    const isInnovation = section === 'innovation';

    // 對於 Innovation 項目，優先使用 imageSRC（webp 圖片）
    if (isInnovation && projectData.imageSRC) {
        return projectData.imageSRC;
    }

    // 對於 Reports 項目，檢查是否有小尺寸版本
    if (section === 'reports') {
        const reportId = projectData.id.replace('reports-', '');
        const hasSmallVersion = checkReportsSmallVersion(reportId);

        if (preferredSize === 'thumbnail' || preferredSize === 'small') {
            if (hasSmallVersion) {
                return `/assets/reports/reports-${reportId}-sm.webp`;
            }
        }

        // Fallback 到原始圖片
        return projectData.path;
    }

    // 對於 Challenges 或其他項目
    return projectData.path;
}

/**
 * 檢查 Reports 是否有小尺寸版本
 * 根據現有檔案結構判斷
 */
function checkReportsSmallVersion(reportId: string): boolean {
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
    const section = projectData.section[0] as SectionType;
    const isInnovation = section === 'innovation';

    if (isInnovation && projectData.imageSRC) {
        // Innovation 項目有 imageSRC 作為縮圖
        return {
            thumbnail: projectData.imageSRC,
            small: projectData.imageSRC,
            original: projectData.path
        };
    }

    if (section === 'reports') {
        const reportId = projectData.id.replace('reports-', '');
        const hasSmallVersion = checkReportsSmallVersion(reportId);

        if (hasSmallVersion) {
            return {
                thumbnail: `/assets/reports/reports-${reportId}-sm.webp`,
                small: `/assets/reports/reports-${reportId}-sm.webp`,
                medium: projectData.path,
                original: projectData.path
            };
        }
    }

    // 預設情況：只有原始圖片
    return {
        original: projectData.path
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
