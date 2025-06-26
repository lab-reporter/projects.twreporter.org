'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

// 漂浮的背景卡片
function FloatingCard({ position, rotation, index }: { position: [number, number, number], rotation: [number, number, number], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
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

interface CallToActionSectionProps {
  visible: boolean;
  progress: number;
}

export default function CallToActionSection({ visible, progress }: CallToActionSectionProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current && visible) {
      // 背景從淺灰變黑色的效果
      const fogIntensity = progress;
      // 可以在這裡添加其他動畫效果
    }
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, 350]}> {/* 位於 Feedback 和 Support 之間 */}
      {/* 背景漂浮卡片 */}
      <group ref={groupRef}>
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingCard
            key={i}
            position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 20,
              Math.random() * 14 + 0
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

      {/* 動態光照 */}
      <pointLight position={[0, 10, 10]} intensity={0.8} color="#663399" />
      <ambientLight intensity={0.2} />
    </group>
  );
} 