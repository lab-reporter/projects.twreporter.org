import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 啟用靜態導出
  output: 'export',
  // 靜態導出目錄
  distDir: 'out',
  // 禁用尾隨斜線（避免路徑問題）
  trailingSlash: false,
  // 不設定 assetPrefix，使用預設的絕對路徑（適用於根目錄部署）
  // 如果需要部署到子目錄，請設定 basePath: '/your-subdirectory'
  // 靜態部署時禁用圖片優化（因為需要伺服器）
  images: {
    unoptimized: true,
    // 允許的外部圖片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
    // 啟用現代圖片格式
    formats: ['image/webp', 'image/avif'],
    // 設定圖片快取時間（1年）
    minimumCacheTTL: 31536000,
    // 允許的圖片大小
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 500, 750, 1000],
    // 允許的設備尺寸
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // 實驗性功能
  experimental: {
    // 優化套件匯入
    optimizePackageImports: ['gsap', 'zustand'],
  },
  // 編譯器優化
  compiler: {
    // 移除 console.log（生產環境）
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
