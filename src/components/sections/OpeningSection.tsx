'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import { gsap } from 'gsap';

export default function OpeningSection({ visible, progress }) {
  const boxRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const hintRef = useRef();
  const [animationStarted, setAnimationStarted] = useState(false);


  // 開場動畫序列
  useEffect(() => {
    if (visible && !animationStarted) {
      setAnimationStarted(true);
      
      // 標題動畫
      if (titleRef.current) {
        gsap.set(titleRef.current.scale, { x: 0, y: 0, z: 0 });
        gsap.set(titleRef.current.position, { y: 5 });
        
        gsap.to(titleRef.current.scale, {
          x: 1, y: 1, z: 1, 
          duration: 1.5, 
          ease: "elastic.out(1, 0.5)", 
          delay: 0.3
        });
        gsap.to(titleRef.current.position, {
          y: 2, 
          duration: 1.5, 
          ease: "power2.out", 
          delay: 0.3
        });
      }
      
      // 副標題動畫
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current.material, { opacity: 0 });
        gsap.to(subtitleRef.current.material, {
          opacity: 1, 
          duration: 1, 
          delay: 1.5
        });
      }
      
      // 立方體動畫
      if (boxRef.current) {
        gsap.set(boxRef.current.position, { y: -5, z: -10 });
        gsap.to(boxRef.current.position, {
          y: -1.5, z: 0, 
          duration: 2, 
          ease: "bounce.out", 
          delay: 0.8
        });
      }
      
      // 提示文字動畫
      if (hintRef.current) {
        gsap.set(hintRef.current.material, { opacity: 0 });
        gsap.to(hintRef.current.material, {
          opacity: 1, 
          duration: 1, 
          delay: 2.5
        });
      }
    }
  }, [visible, animationStarted]);

  useFrame((state, delta) => {
    if (boxRef.current && visible) {
      boxRef.current.rotation.y += delta * 0.5;
      boxRef.current.rotation.x += delta * 0.3;
      
      // 浮動效果
      boxRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    
    // 標題微動效果
    if (titleRef.current && visible && animationStarted) {
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      titleRef.current.scale.setScalar(breathe);
    }
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* 主標題 */}
      <Text
        ref={titleRef}
        position={[0, 5, 0]}
        fontSize={1.8}
        color="white"
        anchorX="center"
        anchorY="center"
      >
        報導者十週年
      </Text>
      
      {/* 副標題 */}
      <Text
        ref={subtitleRef}
        position={[0, 0.5, 0]}
        fontSize={0.6}
        color="#cccccc"
        anchorX="center"
        anchorY="center"
      >
        深度報導 × 技術創新 × 社會影響
      </Text>
      
      {/* 標誌性立方體 */}
      <Box ref={boxRef} position={[0, -5, -10]} args={[1.2, 1.2, 1.2]}>
        <meshStandardMaterial
          color="#4ecdc4"
          emissive="#4ecdc4"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </Box>
      
      {/* 滾動提示 */}
      <Text
        ref={hintRef}
        position={[0, -3.5, 0]}
        fontSize={0.4}
        color="#888888"
        anchorX="center"
        anchorY="center"
      >
        ↓ 向下滾動開始探索 ↓
      </Text>
      
      {/* 動態光效 */}
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#4ecdc4" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#ff6b6b" />
      <spotLight 
        position={[0, 8, 5]} 
        angle={0.5} 
        penumbra={0.5} 
        intensity={0.8}
        target-position={[0, 0, 0]}
      />
    </group>
  );
}