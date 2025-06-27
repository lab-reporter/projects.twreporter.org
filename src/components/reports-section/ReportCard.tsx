'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import VideoCard, { type ReportData } from './VideoCard';
import './BentPlaneGeometry'; // 導入幾何體定義

// TypeScript 類型擴展
declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: any;
    }
  }
}

// 報導卡片組件 Props
export interface ReportCardProps {
  report: ReportData;
  index: number;
  count: number;
  radius?: number;
  focused?: boolean;
  onClick?: (report: ReportData) => void;
}

/**
 * 報導卡片組件
 * 
 * 統一管理圖片和影片格式的報導卡片，包含：
 * - 自動檢測檔案格式（圖片 vs 影片）
 * - 動態尺寸計算與圓柱位置算法
 * - 互動事件處理（hover、click）
 * - 縮放動畫效果
 * - 彎曲平面幾何體適配
 */
export default function ReportCard({ 
  report, 
  index, 
  count, 
  radius = 5, 
  focused = false, 
  onClick 
}: ReportCardProps) {
  const ref = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  
  // 根據原始 Combined3DScene 計算照片尺寸
  const calculateImageSize = () => {
    const circumference = 2 * Math.PI * radius;
    const availableSpacePerImage = circumference / count;
    const imageWidth = availableSpacePerImage * 0.75; // 適當間距避免重疊
    const imageHeight = imageWidth * 0.8; // 照片比例
    
    return {
      width: Math.max(imageWidth, 1.5), // 最小寬度限制
      height: Math.max(imageHeight, 1.0) // 最小高度限制
    };
  };
  
  const { width: imageWidth, height: imageHeight } = calculateImageSize();
  
  // 設定Carousel 圓柱位置
  const angle = (index / count) * Math.PI * 2;
  const position: [number, number, number] = [
    Math.sin(angle) * radius,
    0,
    1000 + Math.cos(angle) * radius  // 以 Z=1000 為中心的圓柱
  ];
  const rotation: [number, number, number] = [0, Math.PI + angle, 0];
  
  // 檢測是否為影片檔案
  const fileExtension = report.path.split('.').pop()?.toLowerCase() || '';
  const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];
  const isVideo = videoFormats.includes(fileExtension);
  
  const pointerOver = (e: any) => {
    e?.stopPropagation?.();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  
  const pointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  const handleClick = () => onClick?.(report);

  // 移除 hover 縮放效果

  return (
    <group>
      {isVideo ? (
        <VideoCard
          report={report}
          position={position}
          rotation={rotation}
          hovered={hovered}
          onPointerOver={pointerOver}
          onPointerOut={pointerOut}
          onClick={handleClick}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          cylinderRadius={radius}
        />
      ) : (
        <Image
          ref={ref}
          url={report.path}
          position={position}
          rotation={rotation}
          transparent
          side={THREE.DoubleSide}
          onPointerOver={pointerOver}
          onPointerOut={pointerOut}
          onClick={handleClick}
          scale={1}
          zoom={1}
          radius={0}
        >
          <bentPlaneGeometry args={[imageWidth, imageHeight, radius, 15]} />
        </Image>
      )}
      
      {/* 移除照片底下的標題顯示 */}
    </group>
  );
} 