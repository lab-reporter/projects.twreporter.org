'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import './BentPlaneGeometry'; // 導入幾何體定義

// TypeScript 類型擴展
declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: any;
    }
  }
}

// 報導資料類型
export interface ReportData {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  section: string[];
  bgColor?: string;
}

// 影片卡片組件 Props
export interface VideoCardProps {
  report: ReportData;
  position: [number, number, number];
  rotation: [number, number, number];
  hovered: boolean;
  onPointerOver: (e: any) => void;
  onPointerOut: () => void;
  onClick: () => void;
  imageWidth: number;
  imageHeight: number;
  cylinderRadius: number;
}

/**
 * 影片卡片組件
 * 
 * 專門處理影片格式的報導卡片，包含：
 * - 動態影片載入與播放控制
 * - 紋理管理系統
 * - 錯誤處理與載入超時邏輯
 * - Hover 動畫效果
 * - 彎曲平面幾何體適配
 */
export default function VideoCard({ 
  report, 
  position, 
  rotation, 
  hovered, 
  onPointerOver, 
  onPointerOut, 
  onClick, 
  imageWidth, 
  imageHeight, 
  cylinderRadius 
}: VideoCardProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    setTexture(null); // 重置紋理狀態
    
    const videoElement = document.createElement('video');
    
    // 設置影片屬性（參考原始實作）
    videoElement.crossOrigin = 'anonymous';
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;
    videoElement.preload = 'metadata';
    videoElement.autoplay = false; // 明確設定不自動播放
    
    // 創建影片紋理
    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.generateMipmaps = false;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    
    let isDisposed = false; // 追蹤是否已清理
    let hasLoaded = false; // 追蹤是否已載入
    
    // 監聽影片載入事件
    const onCanPlayThrough = () => {
      if (isDisposed || hasLoaded) return;
      
      hasLoaded = true;
      
      // 嘗試播放影片
      videoElement.play().catch((error) => {
        // 自動播放可能失敗，靜默處理
      });
      
      videoTexture.needsUpdate = true;
      setTexture(videoTexture);
      setLoading(false);
    };
    
    const onLoadedMetadata = () => {
      if (isDisposed) return;
      
      // 設定影片到第一幀
      videoElement.currentTime = 0.1;
    };
    
    const onLoadedData = () => {
      if (isDisposed || hasLoaded) return;
      
      // 如果 canplaythrough 事件沒有觸發，這裡也可以設定紋理
      if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA - 降低要求
        hasLoaded = true;
        videoTexture.needsUpdate = true;
        setTexture(videoTexture);
        setLoading(false);
      }
    };
    
    const onError = (error: any) => {
      if (isDisposed) return;
      
      if (process.env.NODE_ENV === 'development') {
        console.error('影片載入錯誤:', report.path, error);
      }
      setTexture(null);
      setLoading(false);
    };
    
    const onLoadStart = () => {
      if (isDisposed) return;
      // 影片開始載入
    };
    
    // 綁定事件監聽器
    videoElement.addEventListener('loadstart', onLoadStart);
    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
    videoElement.addEventListener('loadeddata', onLoadedData);
    videoElement.addEventListener('canplaythrough', onCanPlayThrough);
    videoElement.addEventListener('error', onError);
    
    // 處理路徑編碼 - 確保中文字符正確編碼
    try {
      // 如果路徑已經編碼就直接使用，否則進行編碼
      const encodedPath = report.path.includes('%') ? report.path : encodeURI(report.path);
      videoElement.src = encodedPath;
      videoElement.load();
    } catch (encodingError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('路徑編碼失敗，使用原始路徑:', report.path);
      }
      videoElement.src = report.path; // 回退到原始路徑
      videoElement.load();
    }
    
    // 設置超時處理 - 只有在真正載入失敗時才觸發
    const timeout = setTimeout(() => {
      if (isDisposed || hasLoaded) return;
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('影片載入超時:', report.path);
      }
      setTexture(null);
      setLoading(false);
    }, 15000); // 15秒超時
    
    return () => {
      isDisposed = true;
      clearTimeout(timeout);
      
      // 移除所有事件監聽器
      videoElement.removeEventListener('loadstart', onLoadStart);
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      videoElement.removeEventListener('loadeddata', onLoadedData);
      videoElement.removeEventListener('canplaythrough', onCanPlayThrough);
      videoElement.removeEventListener('error', onError);
      
      // 清理影片元素
      videoElement.pause();
      videoElement.src = '';
      videoElement.load();
      
      // 清理紋理
      if (videoTexture) {
        videoTexture.dispose();
      }
    };
  }, [report.path]);

  // 更新影片紋理
  useFrame(() => {
    if (texture && texture.image && texture.image.tagName === 'VIDEO') {
      texture.needsUpdate = true;
    }
  });

  // 移除 hover 縮放效果
  
  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <bentPlaneGeometry args={[imageWidth, imageHeight, cylinderRadius, 15]} />
      <meshPhongMaterial 
        map={texture} 
        side={THREE.DoubleSide} 
        toneMapped={false}
        color={loading ? '#666666' : (texture ? '#ffffff' : '#333333')}
      />
    </mesh>
  );
} 