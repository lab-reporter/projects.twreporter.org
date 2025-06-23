// Three.js 資源管理工具
class ResourceManager {
    constructor() {
        this.textures = new Map();
        this.geometries = new Map();
        this.materials = new Map();
        this.loadQueue = [];
        this.isLoading = false;
    }

    // 紋理快取和優化
    async loadTexture(url, options = {}) {
        if (this.textures.has(url)) {
            return this.textures.get(url);
        }

        const {
            generateMipmaps = true,
            flipY = false,
            format = null,
            anisotropy = 1
        } = options;

        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();

            loader.load(
                url,
                (texture) => {
                    // 紋理優化設定
                    texture.generateMipmaps = generateMipmaps;
                    texture.flipY = flipY;
                    texture.anisotropy = Math.min(anisotropy, 4); // 限制各向異性過濾

                    if (format) texture.format = format;

                    // 快取紋理
                    this.textures.set(url, texture);
                    resolve(texture);
                },
                undefined,
                reject
            );
        });
    }

    // 批次載入資源
    async loadResourcesBatch(resources, batchSize = 3) {
        const results = [];

        for (let i = 0; i < resources.length; i += batchSize) {
            const batch = resources.slice(i, i + batchSize);
            const batchPromises = batch.map(resource => this.loadTexture(resource.url, resource.options));

            try {
                const batchResults = await Promise.allSettled(batchPromises);
                results.push(...batchResults);

                // 給瀏覽器一個喘息的機會
                await new Promise(resolve => setTimeout(resolve, 16));
            } catch (error) {
                console.error('Batch loading error:', error);
            }
        }

        return results;
    }

    // 清理資源
    dispose() {
        this.textures.forEach(texture => texture.dispose());
        this.geometries.forEach(geometry => geometry.dispose());
        this.materials.forEach(material => material.dispose());

        this.textures.clear();
        this.geometries.clear();
        this.materials.clear();
    }

    // 獲取記憶體使用情況
    getMemoryUsage() {
        return {
            textures: this.textures.size,
            geometries: this.geometries.size,
            materials: this.materials.size
        };
    }
}

export const resourceManager = new ResourceManager();

// WebP 支援檢測
export const detectWebPSupport = () => {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
};

// 響應式圖片載入
export const getOptimizedImageUrl = (baseUrl, width, format = 'webp') => {
    const isWebPSupported = sessionStorage.getItem('webp-support') === 'true';
    const targetFormat = isWebPSupported ? 'webp' : 'jpg';

    // 根據螢幕解析度選擇適當尺寸
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetWidth = Math.round(width * dpr);

    return `${baseUrl}?w=${targetWidth}&f=${targetFormat}&q=80`;
}; 