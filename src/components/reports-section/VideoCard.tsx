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
    
    const videoElement = document.createElement('video');
    // 構建完整 URL 路徑
    const absolutePath = `http://localhost:3001${report.path}`;
    videoElement.src = absolutePath;
    // 移除 crossOrigin 設定以避免 CORS 問題
    // videoElement.crossOrigin = 'anonymous';
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.autoplay = false;
    videoElement.preload = 'metadata';
    
    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.flipY = false;
    
    // 多個事件監聽器確保載入
    const handleCanPlay = () => {
      videoElement.currentTime = 1; // 跳過開頭確保有畫面內容
      setTexture(videoTexture);
      setLoading(false);
      
      // 嘗試播放
      const playPromise = videoElement.play();
      if (playPromise) {
        playPromise.catch(() => {
          // 影片自動播放被阻擋，不做處理
        });
      }
    };
    
    const handleError = (event: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('影片載入失敗:', report.path, event);
      }
      setTexture(null);
      setLoading(false);
    };
    
    const handleLoadStart = () => {
      // 影片開始載入
    };
    
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadedmetadata', () => {
      // 影片元數據載入完成
    });
    
    // 載入超時處理
    const timeout = setTimeout(() => {
      if (loading) {
        setTexture(null);
        setLoading(false);
      }
    }, 10000);
    
    return () => {
      clearTimeout(timeout);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.pause();
      videoElement.src = '';
      videoTexture.dispose();
    };
  }, [report.path, loading]);

  useFrame((state, delta) => {
    if (ref.current) {
      easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    }
  });
  
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
      <meshBasicMaterial 
        map={texture} 
        side={THREE.DoubleSide} 
        toneMapped={false}
        color={loading ? '#444444' : (texture ? '#ffffff' : '#ff0000')}
      />
    </mesh>
  );
} 