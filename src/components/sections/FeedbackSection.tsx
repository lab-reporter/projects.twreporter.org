'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Text } from '@react-three/drei';
import { useStore } from '@/stores';
import * as THREE from 'three';

// 贊助者證言資料
const feedbackData = [
  "報導者的深度報導讓我看見台灣社會的真實面貌",
  "專業的調查新聞是民主社會的重要支柱",
  "感謝報導者持續關注弱勢族群的聲音",
  "技術創新讓新聞報導更加生動有力",
  "非營利模式證明了另一種媒體可能性",
  "每一篇報導都體現了記者的專業與良心",
  "報導者改變了我對新聞媒體的看法",
  "深度調查報導是推動社會進步的力量"
];

// 漂浮的背景卡片
function FloatingCard({ position, rotation, index }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01;
    }
  });

  return (
    <Plane
      ref={meshRef}
      position={position}
      rotation={rotation}
      args={[1, 1.4]}
    >
      <meshStandardMaterial
        color="#663399"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </Plane>
  );
}

// 中央證言卡片
function TestimonialCard({ text, active, position }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current && active) {
      const targetScale = 1.1;
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1);
    }
  });

  return (
    <group position={position}>
      <Plane ref={meshRef} args={[4, 2]}>
        <meshStandardMaterial
          color="white"
          side={THREE.DoubleSide}
        />
      </Plane>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.2}
        color="#333333"
        anchorX="center"
        anchorY="center"
        maxWidth={3.5}
        textAlign="center"
      >
        "{text}"
      </Text>
    </group>
  );
}

export default function FeedbackSection({ visible, progress }) {
  const groupRef = useRef();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { openModal } = useStore();
  
  useFrame((state, delta) => {
    if (groupRef.current && visible) {
      // 背景從淺灰變黑色（通過 fog 控制）
      const fogIntensity = progress;
      // 這裡可以動態調整 fog 顏色
      
      // 證言卡片切換
      const testimonialIndex = Math.floor((state.clock.elapsedTime * 0.5) % feedbackData.length);
      if (testimonialIndex !== currentTestimonial) {
        setCurrentTestimonial(testimonialIndex);
      }
    }
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* 背景漂浮卡片 */}
      <group ref={groupRef}>
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingCard
            key={i}
            position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 20,
              Math.random() * 14 + 24
            ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ]}
            index={i}
          />
        ))}
      </group>

      {/* 中央證言卡片 */}
      <group position={[0, 0, 0]}>
        {feedbackData.map((text, index) => (
          <TestimonialCard
            key={index}
            text={text}
            active={index === currentTestimonial}
            position={[
              (index - currentTestimonial) * 5,
              Math.sin((index - currentTestimonial) * 0.5) * 2,
              30
            ]}
          />
        ))}
      </group>

      {/* 標題 */}
      <group position={[0, 4, 0]}>
        <Text
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="center"
        >
          贊助者證言
        </Text>
        <Text
          position={[0, -1, 0]}
          fontSize={0.4}
          color="#cccccc"
          anchorX="center"
          anchorY="center"
        >
          感謝每一位支持者的信任
        </Text>
      </group>

      {/* 互動提示 */}
      <Text
        position={[0, -4, 0]}
        fontSize={0.3}
        color="#888888"
        anchorX="center"
        anchorY="center"
      >
        點擊卡片查看更多證言
      </Text>

      {/* 動態光照 */}
      <pointLight position={[0, 10, 10]} intensity={0.8} color="#663399" />
      <ambientLight intensity={0.2} />
      
      {/* 背景霧效 */}
      <fog attach="fog" args={[`hsl(${280}, 50%, ${20 - progress * 15}%)`, 10, 50]} />
    </group>
  );
}