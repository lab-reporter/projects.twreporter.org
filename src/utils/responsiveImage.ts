/**
 * 響應式圖片工具函數
 * 適用於靜態部署環境，根據使用情境選擇最適合的圖片尺寸
 */

// 圖片尺寸類型定義
export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original';

// 項目資料類型（包含新的 paths 屬性）
export interface ProjectData {
    id: string;
    path: string;
    paths?: {
        thumbnail: string;
        small: string;
        medium: string;
        large: string;
        original: string;
    };
    imageSRC?: string;
    videoSRC?: string;
    title: string;
    subtitle?: string;
    section: string[];
    bgColor?: string;
    [key: string]: unknown;
}

// 使用情境類型定義
export type UsageContext =
    | 'modal-sidepanel'     // Modal 側邊欄縮圖
    | 'reports-swiper'      // 桌面版報導輪播
    | 'reports-mobile'      // 手機版報導輪播  
    | 'innovations-desktop' // 桌面版創新展示
    | 'innovations-mobile'  // 手機版創新輪播
    | 'challenges-swiper'   // 挑戰卡片輪播
    | 'modal-content'       // Modal 內容顯示
    | 'fullscreen';         // 全螢幕顯示

/**
 * 根據使用情境取得建議的圖片尺寸
 */
export function getRecommendedSize(context: UsageContext): ImageSize {
    const sizeMap: Record<UsageContext, ImageSize> = {
        'modal-sidepanel': 'thumbnail',     // 320px - 側邊欄小縮圖
        'reports-swiper': 'medium',         // 640px - 桌面版 3D 輪播
        'reports-mobile': 'small',          // 480px - 手機版輪播
        'innovations-desktop': 'medium',    // 640px - 桌面版創新展示
        'innovations-mobile': 'small',      // 480px - 手機版創新輪播
        'challenges-swiper': 'medium',      // 640px - 挑戰卡片（最大 600px）
        'modal-content': 'large',           // 800px - Modal 內容顯示
        'fullscreen': 'original'            // 原始尺寸 - 全螢幕顯示
    };

    return sizeMap[context] || 'medium';
}

/**
 * 從項目資料中取得指定尺寸的圖片路徑
 */
export function getImagePath(
    projectData: ProjectData,
    preferredSize: ImageSize = 'medium'
): string {
    // 如果沒有 paths 屬性，回退到原始 path 或 imageSRC
    if (!projectData.paths) {
        return projectData.imageSRC || projectData.path;
    }

    // 嘗試取得指定尺寸的圖片
    const targetPath = projectData.paths[preferredSize];
    if (targetPath) {
        return targetPath;
    }

    // 如果指定尺寸不存在，按優先順序回退
    const fallbackOrder: ImageSize[] = ['medium', 'small', 'large', 'original', 'thumbnail'];

    for (const fallbackSize of fallbackOrder) {
        const fallbackPath = projectData.paths[fallbackSize];
        if (fallbackPath) {
            return fallbackPath;
        }
    }

    // 最終回退到原始路徑
    return projectData.imageSRC || projectData.path;
}

/**
 * 根據使用情境取得最適合的圖片路徑（組合函數）
 */
export function getResponsiveImagePath(
    projectData: ProjectData,
    context: UsageContext
): string {
    const recommendedSize = getRecommendedSize(context);
    return getImagePath(projectData, recommendedSize);
}

/**
 * 取得圖片的預期檔案大小範圍（用於效能監控）
 */
export function getEstimatedFileSize(size: ImageSize): string {
    const sizeMap: Record<ImageSize, string> = {
        'thumbnail': '15-25KB',  // 320px
        'small': '25-40KB',      // 480px
        'medium': '40-60KB',     // 640px
        'large': '60-90KB',      // 800px
        'original': '80-150KB'   // 原始尺寸
    };

    return sizeMap[size] || '40-60KB';
}

/**
 * 檢查項目是否支援響應式圖片（有 paths 屬性）
 */
export function supportsResponsiveImages(projectData: ProjectData): boolean {
    return !!(projectData.paths && Object.keys(projectData.paths).length > 0);
}

/**
 * 取得項目可用的圖片尺寸列表
 */
export function getAvailableSizes(projectData: ProjectData): ImageSize[] {
    if (!projectData.paths) {
        return ['original'];
    }

    return Object.keys(projectData.paths).filter(
        key => projectData.paths![key as ImageSize]
    ) as ImageSize[];
}

/**
 * 開發模式下的除錯資訊
 */
export function getDebugInfo(
    projectData: ProjectData,
    context: UsageContext,
    _actualPath: string
): string {
    if (process.env.NODE_ENV !== 'development') {
        return '';
    }

    const recommendedSize = getRecommendedSize(context);
    const estimatedSize = getEstimatedFileSize(recommendedSize);
    const isResponsive = supportsResponsiveImages(projectData);

    return `[響應式圖片] ${projectData.id} | ${context} | ${recommendedSize} | ${estimatedSize} | 響應式: ${isResponsive ? '✅' : '❌'}`;
}
