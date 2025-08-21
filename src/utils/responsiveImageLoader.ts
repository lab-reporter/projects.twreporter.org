/**
 * 響應式圖片載入系統
 * 根據裝置、網路狀況和使用情境智慧選擇最佳圖片尺寸
 */

import { getAvailableImagePath } from './imageAdapter';

export interface ResponsiveImageOptions {
    // 使用情境
    context: 'thumbnail' | 'list' | 'modal' | 'fullscreen' | 'preview';

    // 裝置資訊
    isMobile?: boolean;
    isTablet?: boolean;
    devicePixelRatio?: number;

    // 網路狀況
    connectionType?: 'slow' | 'fast' | 'unknown';
    saveData?: boolean;

    // 容器資訊
    containerWidth?: number;
    containerHeight?: number;

    // 載入優先級
    priority?: 'high' | 'medium' | 'low';
}

export interface ResponsiveImageResult {
    src: string;
    fallbackSrc: string;
    sizes: string;
    priority: boolean;
    loading: 'eager' | 'lazy';
    quality: number;
    estimatedSize: string;
    optimizationLevel: 'high' | 'medium' | 'low' | 'none';
}

/**
 * 獲取響應式圖片配置
 */
export function getResponsiveImageConfig(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    },
    options: ResponsiveImageOptions
): ResponsiveImageResult {
    const {
        context,
        isMobile = false,
        isTablet = false,
        devicePixelRatio = 1,
        connectionType = 'unknown',
        saveData = false,
        containerWidth = 320,
        priority = 'medium'
    } = options;

    // 根據情境決定基礎尺寸需求
    const baseSize = getBaseSizeForContext(context, isMobile, isTablet);

    // 根據網路狀況調整
    const adjustedSize = adjustSizeForNetwork(baseSize, connectionType, saveData);

    // 根據裝置像素比調整
    const finalSize = adjustSizeForPixelRatio(adjustedSize, devicePixelRatio, containerWidth);

    // 獲取最佳圖片路徑
    const src = getAvailableImagePath(projectData, finalSize);
    const fallbackSrc = getAvailableImagePath(projectData, 'small');

    // 生成 sizes 屬性
    const sizes = generateSizesAttribute(context, containerWidth, isMobile);

    // 決定載入策略
    const loadingStrategy = getLoadingStrategy(context, priority);

    // 決定品質設定
    const quality = getQualityForContext(context, connectionType, saveData);

    // 估算檔案大小節省
    const estimatedSize = estimateFileSize(finalSize, quality);

    // 評估優化程度
    const optimizationLevel = evaluateOptimization(projectData.path, src);

    return {
        src,
        fallbackSrc,
        sizes,
        priority: priority === 'high' || loadingStrategy.priority,
        loading: loadingStrategy.loading,
        quality,
        estimatedSize,
        optimizationLevel
    };
}

/**
 * 根據使用情境決定基礎尺寸
 */
function getBaseSizeForContext(
    context: string,
    isMobile: boolean,
    isTablet: boolean
): 'thumbnail' | 'small' | 'medium' | 'large' {
    switch (context) {
        case 'thumbnail':
            return 'thumbnail';

        case 'list':
            if (isMobile) return 'small';
            if (isTablet) return 'medium';
            return 'medium';

        case 'modal':
            if (isMobile) return 'medium';
            return 'large';

        case 'fullscreen':
            return 'large';

        case 'preview':
            return isMobile ? 'small' : 'medium';

        default:
            return 'medium';
    }
}

/**
 * 根據網路狀況調整尺寸
 */
function adjustSizeForNetwork(
    baseSize: 'thumbnail' | 'small' | 'medium' | 'large',
    connectionType: string,
    saveData: boolean
): 'thumbnail' | 'small' | 'medium' | 'large' {
    if (saveData || connectionType === 'slow') {
        // 降級策略
        const downgradeMap = {
            large: 'medium',
            medium: 'small',
            small: 'thumbnail',
            thumbnail: 'thumbnail'
        } as const;

        return downgradeMap[baseSize];
    }

    return baseSize;
}

/**
 * 根據裝置像素比調整尺寸
 */
function adjustSizeForPixelRatio(
    baseSize: 'thumbnail' | 'small' | 'medium' | 'large',
    devicePixelRatio: number,
    containerWidth: number
): 'thumbnail' | 'small' | 'medium' | 'large' {
    // 高 DPI 裝置可能需要更大的圖片
    if (devicePixelRatio >= 2 && containerWidth > 200) {
        const upgradeMap = {
            thumbnail: 'small',
            small: 'medium',
            medium: 'large',
            large: 'large'
        } as const;

        return upgradeMap[baseSize];
    }

    return baseSize;
}

/**
 * 生成 sizes 屬性
 */
function generateSizesAttribute(
    context: string,
    containerWidth: number,
    isMobile: boolean
): string {
    switch (context) {
        case 'thumbnail':
            return '320px';

        case 'list':
            if (isMobile) {
                return '(max-width: 768px) 100vw, 50vw';
            }
            return '(max-width: 1024px) 50vw, 33vw';

        case 'modal':
            return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw';

        case 'fullscreen':
            return '100vw';

        case 'preview':
            return `${containerWidth}px`;

        default:
            return '(max-width: 768px) 100vw, 50vw';
    }
}

/**
 * 決定載入策略
 */
function getLoadingStrategy(
    context: string,
    priority: 'high' | 'medium' | 'low'
): { priority: boolean; loading: 'eager' | 'lazy' } {
    // 高優先級或關鍵內容使用 eager loading
    if (priority === 'high' || context === 'thumbnail') {
        return { priority: true, loading: 'eager' };
    }

    // 其他情況使用 lazy loading
    return { priority: false, loading: 'lazy' };
}

/**
 * 根據情境決定品質設定
 */
function getQualityForContext(
    context: string,
    connectionType: string,
    saveData: boolean
): number {
    if (saveData || connectionType === 'slow') {
        return 75; // 較低品質以節省頻寬
    }

    switch (context) {
        case 'thumbnail':
            return 80;
        case 'list':
            return 85;
        case 'modal':
            return 90;
        case 'fullscreen':
            return 95;
        default:
            return 85;
    }
}

/**
 * 估算檔案大小
 */
function estimateFileSize(
    size: 'thumbnail' | 'small' | 'medium' | 'large',
    quality: number
): string {
    const baseSizes = {
        thumbnail: '10-20KB',
        small: '20-40KB',
        medium: '40-80KB',
        large: '80-150KB'
    };

    const qualityMultiplier = quality / 85; // 以 85% 為基準
    const sizeRange = baseSizes[size];

    if (qualityMultiplier < 0.9) {
        return `${sizeRange} (優化)`;
    } else if (qualityMultiplier > 1.1) {
        return `${sizeRange} (高品質)`;
    }

    return sizeRange;
}

/**
 * 評估優化程度
 */
function evaluateOptimization(
    originalPath: string,
    optimizedPath: string
): 'high' | 'medium' | 'low' | 'none' {
    if (originalPath === optimizedPath) {
        return 'none';
    }

    if (optimizedPath.includes('-thumb')) {
        return 'high';
    } else if (optimizedPath.includes('-sm')) {
        return 'medium';
    } else if (optimizedPath.includes('-md')) {
        return 'low';
    }

    return 'none';
}

/**
 * 為 ModalSidepanel 獲取最佳配置
 */
export function getModalSidepanelImageConfig(
    projectData: {
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    },
    isMobile: boolean = false,
    connectionType: 'slow' | 'fast' | 'unknown' = 'unknown'
): ResponsiveImageResult {
    return getResponsiveImageConfig(projectData, {
        context: 'thumbnail',
        isMobile,
        connectionType,
        containerWidth: 320,
        priority: 'high',
        saveData: connectionType === 'slow'
    });
}

/**
 * 批次獲取多個項目的配置（用於預載）
 */
export function getBatchImageConfigs(
    projects: Array<{
        id: string;
        path: string;
        imageSRC?: string;
        videoSRC?: string;
        section: string[];
    }>,
    options: ResponsiveImageOptions,
    maxItems: number = 6
): ResponsiveImageResult[] {
    return projects
        .slice(0, maxItems)
        .map(project => getResponsiveImageConfig(project, options));
}

/**
 * 網路狀況檢測（簡化版）
 */
export function detectNetworkCondition(): 'slow' | 'fast' | 'unknown' {
    if (typeof navigator === 'undefined') return 'unknown';

    // 使用 Network Information API（如果可用）
    const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection ||
        (navigator as unknown as { mozConnection?: { effectiveType?: string } }).mozConnection ||
        (navigator as unknown as { webkitConnection?: { effectiveType?: string } }).webkitConnection;

    if (connection) {
        const effectiveType = connection.effectiveType;

        if (effectiveType === '4g') return 'fast';
        if (effectiveType === '3g') return 'fast';
        if (effectiveType === '2g' || effectiveType === 'slow-2g') return 'slow';
    }

    return 'unknown';
}

/**
 * 裝置資訊檢測
 */
export function detectDeviceInfo(): {
    isMobile: boolean;
    isTablet: boolean;
    devicePixelRatio: number;
} {
    if (typeof window === 'undefined') {
        return { isMobile: false, isTablet: false, devicePixelRatio: 1 };
    }

    const width = window.innerWidth;
    const devicePixelRatio = window.devicePixelRatio || 1;

    return {
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        devicePixelRatio
    };
}
