/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
import bundleAnalyzer from '@next/bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bundle Analyzer (開發時使用)
const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    // 基本配置
    experimental: {
        optimizeCss: true, // CSS 優化
        scrollRestoration: true, // 滾動位置恢復
    },

    // 編譯器優化
    compiler: {
        // 移除 console.log（生產環境）
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn']
        } : false,
    },

    // 圖片優化
    images: {
        // 啟用 AVIF 支援（更好的壓縮）
        formats: ['image/avif', 'image/webp'],
        // 圖片尺寸配置
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // 允許的圖片域名
        domains: [
            'www.twreporter.org',
            'picsum.photos'
        ],
        // 圖片載入器設定
        loader: 'default',
        // 啟用危險的允許 SVG
        dangerouslyAllowSVG: true,
        // SVG 的 Content Security Policy
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Webpack 優化
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // 別名設定
        config.resolve.alias = {
            ...config.resolve.alias,
            '@components': path.resolve(__dirname, './src/app/sidepanel-contents/shared'),
            '@projects': path.resolve(__dirname, './src/app/sidepanel-contents/projects'),
            '@shared': path.resolve(__dirname, './src/app/sidepanel-contents/shared'),
        };

        // 生產環境優化
        if (!dev) {
            // 代碼分割優化
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        maxSize: 244000, // 244KB
                    },
                    threeJs: {
                        test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
                        name: 'three-js',
                        chunks: 'all',
                        priority: 20,
                    },
                    gsap: {
                        test: /[\\/]node_modules[\\/]gsap[\\/]/,
                        name: 'gsap',
                        chunks: 'all',
                        priority: 20,
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 10,
                        enforce: true,
                    },
                },
            };

            // Tree shaking 優化
            config.optimization.usedExports = true;
            config.optimization.sideEffects = false;
        }

        // 生產環境優化
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }

        return config;
    },

    // 功能標誌
    poweredByHeader: false, // 移除 X-Powered-By header

    // 壓縮
    compress: true,

    // 重定向和重寫
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
            // 靜態資源快取
            {
                source: '/assets/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // 字型快取
            {
                source: '/fonts/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    // 環境變數
    env: {
        ANALYZE: process.env.ANALYZE,
    },
};

// 根據需要啟用 bundle analyzer
export default process.env.ANALYZE === 'true'
    ? withBundleAnalyzer(nextConfig)
    : nextConfig;
