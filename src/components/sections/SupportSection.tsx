'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Sphere } from '@react-three/drei';
import { useStore } from '@/stores';
import * as THREE from 'three';

// 粒子組件 (Section 5 的卡片聚集成的形狀)
function ParticleFormation({ progress }) {
  const particlesRef = useRef();
  const particleCount = 100;
  
  // 創建粒子位置
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    // 初始分散位置
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    
    // 顏色
    colors[i * 3] = 0.4 + Math.random() * 0.6;     // R
    colors[i * 3 + 1] = 0.2 + Math.random() * 0.4; // G
    colors[i * 3 + 2] = 0.6 + Math.random() * 0.4; // B
  }

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 目標位置（聚集成心形或其他形狀）
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3;
        const targetX = Math.cos(angle) * radius;
        const targetY = Math.sin(angle) * radius * 0.5;
        const targetZ = Math.sin(angle * 2) * 2 + 38;
        
        // 根據進度插值到目標位置
        const lerpFactor = Math.min(progress * 2, 1);
        
        positions[i3] = THREE.MathUtils.lerp(positions[i3], targetX, lerpFactor * 0.02);
        positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY, lerpFactor * 0.02);
        positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetZ, lerpFactor * 0.02);
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function SupportSection({ visible, progress }) {
  const [hoveredButton, setHoveredButton] = useState(null);
  const { openModal } = useStore();
  
  if (!visible) return null;

  return (
    <group position={[0, -100, 0]}>
      {/* Section 5 聚集的粒子效果 */}
      <ParticleFormation progress={progress} />
      
      {/* 主標題 */}
      <group position={[0, 4, 0]}>
        <Text
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="center"
          font="/fonts/inter-bold.woff"
        >
          支持報導者
        </Text>
        <Text
          position={[0, -1, 0]}
          fontSize={0.5}
          color="#cccccc"
          anchorX="center"
          anchorY="center"
        >
          讓深度報導持續影響台灣
        </Text>
      </group>

      {/* 統計數字 */}
      <group position={[0, 1, 0]}>
        <Text
          fontSize={0.8}
          color="#ffd700"
          anchorX="center"
          anchorY="center"
        >
          7,964 位贊助者
        </Text>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.6}
          color="#4ecdc4"
          anchorX="center"
          anchorY="center"
        >
          ❤️ 已達成 85% 募資目標
        </Text>
      </group>

      {/* 支持方式 */}
      <group position={[0, -2, 0]}>
        {/* 定期贊助按鈕 */}
        <Box
          position={[-2, 0, 0]}
          args={[1.5, 0.8, 0.2]}
          onPointerOver={() => setHoveredButton('monthly')}
          onPointerOut={() => setHoveredButton(null)}
          onClick={() => openModal('support-monthly', { 
            title: '定期贊助', 
            description: '每月支持報導者持續運作' 
          })}
        >
          <meshStandardMaterial
            color={hoveredButton === 'monthly' ? '#45b7d1' : '#4ecdc4'}
            emissive={hoveredButton === 'monthly' ? '#45b7d1' : '#000000'}
            emissiveIntensity={hoveredButton === 'monthly' ? 0.3 : 0}
          />
        </Box>
        <Text
          position={[-2, 0, 0.2]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="center"
        >
          定期贊助
        </Text>

        {/* 單次捐款按鈕 */}
        <Box
          position={[2, 0, 0]}
          args={[1.5, 0.8, 0.2]}
          onPointerOver={() => setHoveredButton('once')}
          onPointerOut={() => setHoveredButton(null)}
          onClick={() => openModal('support-once', { 
            title: '單次捐款', 
            description: '一次性支持報導者' 
          })}
        >
          <meshStandardMaterial
            color={hoveredButton === 'once' ? '#ff8a80' : '#ff6b6b'}
            emissive={hoveredButton === 'once' ? '#ff8a80' : '#000000'}
            emissiveIntensity={hoveredButton === 'once' ? 0.3 : 0}
          />
        </Box>
        <Text
          position={[2, 0, 0.2]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="center"
        >
          單次捐款
        </Text>
      </group>

      {/* 其他支持方式 */}
      <group position={[0, -4, 0]}>
        <Text
          fontSize={0.3}
          color="#888888"
          anchorX="center"
          anchorY="center"
        >
          或者透過以下方式支持我們：
        </Text>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color="#cccccc"
          anchorX="center"
          anchorY="center"
        >
          📢 分享報導  💌 訂閱電子報  🗣️ 推薦朋友
        </Text>
      </group>

      {/* 溫暖的環境光 */}
      <pointLight position={[0, 10, 10]} intensity={0.8} color="#ffd700" />
      <pointLight position={[-10, 0, 5]} intensity={0.5} color="#4ecdc4" />
      <pointLight position={[10, 0, 5]} intensity={0.5} color="#ff6b6b" />
      <ambientLight intensity={0.3} />
    </group>
  );
}