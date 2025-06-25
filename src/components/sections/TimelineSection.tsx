'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Text, Html } from '@react-three/drei';
import { useStore } from '@/stores';
import * as THREE from 'three';

// 時間線資料 - 配合相機 Z=24 的位置
const timelineData = [
  {
    id: "timeline-1",
    year: "2014",
    title: "報導者成立",
    description: "非營利媒體的起點",
    image: "/assets/img1.png",
    textPosition: [8, 2, 16] // 調整為相機前方
  },
  {
    id: "timeline-2", 
    year: "2015",
    title: "首次重大調查",
    description: "建立深度報導標準",
    image: "/assets/img2.png", 
    textPosition: [8, 1, 18] // 調整 Z 位置
  },
  {
    id: "timeline-3",
    year: "2016",
    title: "國際合作開始",
    description: "跨國調查報導",
    image: "/assets/img3.png",
    textPosition: [8, 0, 20]
  },
  {
    id: "timeline-4",
    year: "2017",
    title: "技術創新突破",
    description: "數位敘事工具開發",
    image: "/assets/img4.png",
    textPosition: [8, -1, 22]
  },
  {
    id: "timeline-5",
    year: "2018", 
    title: "社會影響力擴大",
    description: "政策改變推動者",
    image: "/assets/img5.png",
    textPosition: [8, 2, 24]
  },
  {
    id: "timeline-6",
    year: "2019",
    title: "獲得國際肯定",
    description: "亞洲新聞獎項",
    image: "/assets/img6.png",
    textPosition: [8, 1, 26]
  },
  {
    id: "timeline-7",
    year: "2020",
    title: "疫情報導先鋒",
    description: "公衛新聞專業",
    image: "/assets/img7.png",
    textPosition: [8, 0, 28]
  },
  {
    id: "timeline-8",
    year: "2021",
    title: "永續發展目標",
    description: "環境與社會責任",
    image: "/assets/img8.png",
    textPosition: [8, -1, 30]
  },
  {
    id: "timeline-9",
    year: "2022",
    title: "AI 輔助新聞",
    description: "技術與新聞結合", 
    image: "/assets/img9.png",
    textPosition: [8, 2, 18]
  },
  {
    id: "timeline-10",
    year: "2023",
    title: "十週年里程碑",
    description: "持續影響台灣社會",
    image: "/assets/img10.png",
    textPosition: [8, 1, 16]
  }
];

// 時間線照片組件
function TimelinePhoto({ item, index, focused, onClick, onHover, onUnhover }) {
  const meshRef = useRef();
  const textRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 聚焦時的縮放效果
      const targetScale = focused ? 1.2 : 1;
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
      
      // 輕微的浮動效果
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01;
    }
  });

  return (
    <group>
      {/* 照片 */}
      <Image
        ref={meshRef}
        url={item.image}
        position={[index * 4 - 18, 0, 16 + index * 1.5]}
        scale={[3, 2, 1]}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
        onClick={() => onClick(item)}
      />
      
      {/* 年份標記 */}
      <Text
        position={[index * 4 - 18, -2, 16 + index * 1.5]}
        fontSize={0.5}
        color="#ffd700"
        anchorX="center"
        anchorY="center"
        font="/fonts/inter-bold.woff"
      >
        {item.year}
      </Text>
    </group>
  );
}

// 水平滾動文字
function ScrollingText({ item, visible, onClick }) {
  const textRef = useRef();
  
  useFrame((state, delta) => {
    if (textRef.current && visible) {
      // 文字從右向左滾動
      textRef.current.position.x = 15 - (state.clock.elapsedTime * 2) % 30;
    }
  });

  if (!visible) return null;

  return (
    <group ref={textRef} position={item.textPosition}>
      <Text
        fontSize={0.4}
        color="white"
        anchorX="left"
        anchorY="center"
        maxWidth={6}
        onClick={() => onClick(item)}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto';
        }}
      >
        {item.title}
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="left"
        anchorY="center"
        maxWidth={8}
      >
        {item.description}
      </Text>
    </group>
  );
}

export default function TimelineSection({ visible, progress }) {
  const groupRef = useRef();
  const [hoveredPhoto, setHoveredPhoto] = useState(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { openModal } = useStore();
  
  useFrame((state, delta) => {
    if (groupRef.current && visible) {
      // 計算當前顯示的文字（移除 zOffset 動態位移）
      const textIndex = Math.floor((state.clock.elapsedTime * 0.5) % timelineData.length);
      if (textIndex !== currentTextIndex) {
        setCurrentTextIndex(textIndex);
      }
    }
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      <group ref={groupRef}>
        {/* 照片序列 */}
        {timelineData.map((item, index) => (
          <TimelinePhoto
            key={item.id}
            item={item}
            index={index}
            focused={hoveredPhoto === index}
            onClick={(item) => openModal(item.id, item)}
            onHover={() => setHoveredPhoto(index)}
            onUnhover={() => setHoveredPhoto(null)}
          />
        ))}
        
        {/* 滾動文字 */}
        {timelineData.map((item, index) => (
          <ScrollingText
            key={`text-${item.id}`}
            item={item}
            visible={index === currentTextIndex}
            onClick={(item) => openModal(item.id, item)}
          />
        ))}
      </group>

      {/* 時間線標題 */}
      <group position={[0, 4, 0]}>
        <Text
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="center"
        >
          非營利媒體之路
        </Text>
        <Text
          position={[0, -1, 0]}
          fontSize={0.4}
          color="#cccccc"
          anchorX="center"
          anchorY="center"
        >
          十年來的重要里程碑
        </Text>
      </group>

      {/* 進度指示器 */}
      <group position={[0, -4, 0]}>
        <mesh>
          <planeGeometry args={[10 * progress, 0.1]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[10, 0.1]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
      </group>

      {/* 動態光照 */}
      <pointLight position={[0, 3, 5]} intensity={0.8} color="#ffd700" />
      <spotLight
        position={[10, 5, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.5}
        target-position={[0, 0, 0]}
      />
    </group>
  );
}