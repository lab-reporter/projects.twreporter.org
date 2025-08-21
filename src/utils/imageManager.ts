/**
 * 圖片管理工具
 * 統一處理不同 section 的圖片路徑和尺寸變體
 */

export interface ImageSizes {
    thumbnail: string;  // 320x240 - 用於 ModalSidepanel
    small: string;      // 500x375 - 用於列表預覽
    medium: string;     // 800x600 - 用於一般顯示
    large: string;      // 1200x900 - 用於詳細檢視
    original: string;   // 原始尺寸
}

export interface MediaVariants {
    image: ImageSizes;
    video?: {
        webm: string;
        mp4: string;
        thumbnail: string;  // 影片縮圖
    };
}

/**
 * 圖片尺寸類型定義
 */
export type ImageSizeType = keyof ImageSizes;

/**
 * Section 類型定義
 */
export type SectionType = 'reports' | 'innovation' | 'challenges';

/**
 * 根據原始路徑生成不同尺寸的圖片路徑
 */
export function generateImageSizes(
    originalPath: string,
    section: SectionType
): ImageSizes {
    const pathWithoutExtension = originalPath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
    const extension = originalPath.match(/\.(webp|jpg|jpeg|png)$/i)?.[1] || 'webp';

    // 根據 section 調整路徑策略
    switch (section) {
        case 'reports':
            return {
                thumbnail: `${pathWithoutExtension}-thumb.${extension}`,
                small: `${pathWithoutExtension}-sm.${extension}`,
                medium: `${pathWithoutExtension}-md.${extension}`,
                large: `${pathWithoutExtension}-lg.${extension}`,
                original: originalPath
            };

        case 'innovation':
            return {
                thumbnail: `${pathWithoutExtension}-thumb.webp`,
                small: `${pathWithoutExtension}-sm.webp`,
                medium: `${pathWithoutExtension}-md.webp`,
                large: `${pathWithoutExtension}-lg.webp`,
                original: originalPath
            };

        case 'challenges':
            return {
                thumbnail: `${pathWithoutExtension}-thumb.webp`,
                small: `${pathWithoutExtension}-sm.webp`,
                medium: `${pathWithoutExtension}-md.webp`,
                large: `${pathWithoutExtension}-lg.webp`,
                original: originalPath
            };

        default:
            return {
                thumbnail: `${pathWithoutExtension}-thumb.webp`,
                small: `${pathWithoutExtension}-sm.webp`,
                medium: `${pathWithoutExtension}-md.webp`,
                large: `${pathWithoutExtension}-lg.webp`,
                original: originalPath
            };
    }
}

/**
 * 智慧選擇最適合的圖片尺寸
 * 根據使用情境和裝置類型自動選擇
 */
export function getOptimalImageSize(
    imageSizes: ImageSizes,
    context: 'thumbnail' | 'list' | 'modal' | 'fullscreen',
    isMobile: boolean = false
): string {
    switch (context) {
        case 'thumbnail':
            // ModalSidepanel 縮圖使用
            return imageSizes.thumbnail || imageSizes.small || imageSizes.original;

        case 'list':
            // 列表頁面使用
            return isMobile
                ? (imageSizes.small || imageSizes.thumbnail || imageSizes.original)
                : (imageSizes.medium || imageSizes.small || imageSizes.original);

        case 'modal':
            // Modal 內容使用
            return isMobile
                ? (imageSizes.medium || imageSizes.large || imageSizes.original)
                : (imageSizes.large || imageSizes.original);

        case 'fullscreen':
            // 全螢幕檢視使用
            return imageSizes.original;

        default:
            return imageSizes.original;
    }
}

/**
 * 檢查圖片檔案是否存在（用於 fallback）
 */
export function getImageWithFallback(
    preferredPath: string,
    _fallbackPaths: string[]
): string {
    // 在實際應用中，這裡可以加入檢查檔案是否存在的邏輯
    // 目前先回傳首選路徑，如果載入失敗會 fallback
    return preferredPath;
}

/**
 * 為專案資料生成完整的媒體變體
 */
export function generateMediaVariants(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    }
): MediaVariants {
    const section = projectData.section[0] as SectionType;
    const isInnovation = section === 'innovation';

    // 決定主要圖片路徑
    const mainImagePath = isInnovation && projectData.imageSRC
        ? projectData.imageSRC
        : projectData.path;

    // 生成圖片尺寸變體
    const imageSizes = generateImageSizes(mainImagePath, section);

    // 處理影片變體（主要針對 innovations）
    const videoVariants = isInnovation && projectData.videoSRC ? {
        webm: projectData.path, // 通常 .webm 格式
        mp4: projectData.videoSRC,
        thumbnail: imageSizes.thumbnail
    } : undefined;

    return {
        image: imageSizes,
        video: videoVariants
    };
}

/**
 * 為 ModalSidepanel 獲取最佳縮圖
 */
export function getThumbnailForSidepanel(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    },
    isMobile: boolean = false
): string {
    const mediaVariants = generateMediaVariants(projectData);
    return getOptimalImageSize(mediaVariants.image, 'thumbnail', isMobile);
}

/**
 * 預載圖片的優先級排序
 */
export function getPreloadPriority(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        section: string[];
    },
    context: 'sidepanel' | 'modal-content'
): ('thumbnail' | 'small' | 'medium' | 'large')[] {
    const section = projectData.section[0] as SectionType;

    if (context === 'sidepanel') {
        // ModalSidepanel 優先載入縮圖
        return ['thumbnail', 'small'];
    } else {
        // Modal 內容優先載入中大尺寸
        return section === 'innovation'
            ? ['small', 'medium', 'large']
            : ['medium', 'large', 'small'];
    }
}

/**
 * 開發環境：檢查缺失的圖片尺寸
 */
export function validateImageSizes(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        section: string[];
    }
): { missing: ImageSizeType[]; available: ImageSizeType[] } {
    if (process.env.NODE_ENV !== 'development') {
        return { missing: [], available: [] };
    }

    const mediaVariants = generateMediaVariants(projectData);
    const imageSizes = mediaVariants.image;

    // 這裡可以實作實際的檔案存在檢查
    // 目前回傳模擬結果
    const available: ImageSizeType[] = ['original'];
    const missing: ImageSizeType[] = [];

    Object.entries(imageSizes).forEach(([size, _path]) => {
        if (size !== 'original') {
            // 模擬檢查：reports 有 small，innovations 有 thumbnail
            const section = projectData.section[0];
            if (section === 'reports' && size === 'small') {
                available.push(size as ImageSizeType);
            } else if (section === 'innovation' && size === 'thumbnail') {
                available.push(size as ImageSizeType);
            } else {
                missing.push(size as ImageSizeType);
            }
        }
    });

    return { missing, available };
}
