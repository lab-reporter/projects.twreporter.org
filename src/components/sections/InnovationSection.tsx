'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { useStore } from '@/stores';
import * as THREE from 'three';

// 創新項目資料 - 配合相機 Z=16 的位置
const innovationData = [
  {
    id: "innovation-1",
    title: "數位敘事平台",
    description: "互動式多媒體報導工具",
    color: "#ff6b6b",
    position: [-3, 2, 8] // 放在相機前方
  },
  {
    id: "innovation-2", 
    title: "資料視覺化引擎",
    description: "動態圖表與地圖系統",
    color: "#4ecdc4",
    position: [2, -1, 10] // 稍微遠一點
  },
  {
    id: "innovation-3",
    title: "AI 輔助寫作",
    description: "智能新聞編輯工具",
    color: "#45b7d1",
    position: [-1, 3, 12] // 更遠的位置
  },
  {
    id: "innovation-4",
    title: "VR 沉浸式報導",
    description: "虛擬實境新聞體驗",
    color: "#96ceb4",
    position: [4, 0, 14] // 調整為正值
  },
  {
    id: "innovation-5",
    title: "區塊鏈驗證",
    description: "新聞真實性認證系統",
    color: "#feca57",
    position: [-2, -2, 16] // 調整為正值
  },
  {
    id: "innovation-6",
    title: "開源工具包",
    description: "媒體技術開發框架",
    color: "#ff9ff3",
    position: [1, 1, 18] // 調整為正值
  },
  {
    id: "innovation-7",
    title: "社群互動平台",
    description: "讀者參與式新聞",
    color: "#54a0ff",
    position: [-4, -1, 20] // 調整為正值
  },
  {
    id: "innovation-8",
    title: "跨媒體協作",
    description: "國際媒體合作網絡",
    color: "#5f27cd",
    position: [3, 2, 22] // 調整為正值
  },
  {
    id: "innovation-9",
    title: "事實查核AI",
    description: "自動化假訊息檢測",
    color: "#00d2d3",
    position: [0, -3, 24] // 調整為正值
  },
  {
    id: "innovation-10",
    title: "永續媒體模式",
    description: "非營利營運創新",
    color: "#ff6348",
    position: [-1, 1, 26] // 調整為正值
  }
];

// 創新項目立方體
function InnovationCube({ item, focused, onClick, onHover, onUnhover }) {
  const meshRef = useRef();
  const textRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 緩慢旋轉
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.3;
      
      // 聚焦縮放效果
      const targetScale = focused ? 1.5 : 1;
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
      
      // 浮動效果
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.01;
    }
    
    if (textRef.current && focused) {
      // 聚焦時文字輕微擺動
      textRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group position={item.position}>
      <Box
        ref={meshRef}
        args={[1, 1, 1]}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
        onClick={() => onClick(item)}
      >
        <meshStandardMaterial
          color={item.color}
          emissive={focused ? item.color : '#000000'}
          emissiveIntensity={focused ? 0.3 : 0}
          roughness={0.3}
          metalness={0.8}
        />
      </Box>
      
      {/* 項目標題（聚焦時顯示） */}
      {focused && (
        <Text
          ref={textRef}
          position={[0, 2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="center"
          maxWidth={4}
          textAlign="center"
        >
          {item.title}
        </Text>
      )}
    </group>
  );
}

export default function InnovationSection({ visible, progress }) {
  const groupRef = useRef();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [focusedItem, setFocusedItem] = useState(null);
  const { openModal } = useStore();
  
  useFrame((state, delta) => {
    if (groupRef.current && visible) {
      // 相機向前移動，讓物件由遠而近出現
      const zOffset = progress * 30; // 向前移動 30 單位
      groupRef.current.position.z = zOffset;
      
      // 計算當前聚焦的項目
      const currentIndex = Math.floor(progress * innovationData.length);
      const currentItem = innovationData[currentIndex];
      if (currentItem && currentItem.id !== focusedItem?.id) {
        setFocusedItem(currentItem);
      }
    }
  });

  if (!visible) return null;

  return (
    <group position={[0, -40, 0]}>
      <group ref={groupRef}>
        {innovationData.map((item, index) => (
          <InnovationCube
            key={item.id}
            item={item}
            focused={focusedItem?.id === item.id || hoveredItem === index}
            onClick={(item) => openModal(item.id, item)}
            onHover={() => setHoveredItem(index)}
            onUnhover={() => setHoveredItem(null)}
          />
        ))}
      </group>

      {/* 當前聚焦項目的詳細資訊 */}
      {focusedItem && (
        <group position={[0, -6, 0]}>
          <Text
            fontSize={0.6}
            color="white"
            anchorX="center"
            anchorY="center"
            maxWidth={8}
            textAlign="center"
          >
            {focusedItem.title}
          </Text>
          <Text
            position={[0, -1, 0]}
            fontSize={0.3}
            color="#cccccc"
            anchorX="center"
            anchorY="center"
            maxWidth={10}
            textAlign="center"
          >
            {focusedItem.description}
          </Text>
        </group>
      )}

      {/* 環境光照增強 */}
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-5, 0, -10]} intensity={0.3} color={focusedItem?.color || "#ffffff"} />
      <pointLight position={[5, 0, -10]} intensity={0.3} color={focusedItem?.color || "#ffffff"} />
    </group>
  );
}