'use client';

import { Text, Image } from '@react-three/drei';
import * as THREE from 'three';

export default function TimelineSection({ visible, progress }) {
  if (!visible) return null;

  return (
    <group position={[0, 0, 25]}>
      {/* 保留一個紅色正方體作為參考 */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="red" />
      </mesh>
      
      {/* 測試：使用和 ReportsSection 相同的 Image 配置 */}
      <Image
        url="/assets/img1.png"
        position={[-5, 0, 0]}
        scale={1}
        zoom={1}
        radius={0}
        transparent
        side={THREE.DoubleSide}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ img1.png 載入失敗:', error);
          }
        }}
      >
        <planeGeometry args={[3, 2]} />
      </Image>
      
      {/* 測試報導者 JPG 圖片 - 使用相同配置 */}
      <Image
        url="/assets/六輕環境難民。.jpg"
        position={[-5, -4, 0]}
        scale={1}
        zoom={1}
        radius={0}
        transparent
        side={THREE.DoubleSide}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ JPG 載入失敗:', error);
          }
        }}
      >
        <planeGeometry args={[3, 2]} />
      </Image>
      
      {/* 測試 SVG 圖片 */}
      <Image
        url="/assets/nav_logo--light.svg"
        position={[-10, 0, 0]}
        scale={[2, 2, 1]}
        transparent
        side={THREE.DoubleSide}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ SVG logo 載入失敗:', error);
          }
        }}
      >
        <planeGeometry args={[2, 2]} />
      </Image>
      
      {/* 內嵌 SVG - 這個應該一定能顯示 */}
      <Image
        url="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='blue'/%3E%3C/svg%3E"
        position={[-15, 0, 0]}
        scale={[2, 2, 1]}
        transparent
        side={THREE.DoubleSide}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ 內嵌 SVG 載入失敗:', error);
          }
        }}
      >
        <planeGeometry args={[2, 2]} />
      </Image>
      
      {/* 測試基本 Text 元素 */}
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="center"
      >
        非營利媒體之路
      </Text>
      
      {/* 測試小一點的文字 */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#cccccc"
        anchorX="center"
        anchorY="center"
      >
        十年來的重要里程碑
      </Text>
      
      {/* 測試年份文字 */}
      <Text
        position={[5, 0, 0]}
        fontSize={0.8}
        color="#ffd700"
        anchorX="center"
        anchorY="center"
      >
        2024
      </Text>
    </group>
  );
}