'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { useStore } from '@/stores';
import * as THREE from 'three';
import { gsap } from 'gsap';

// 匯入各個 Section 組件 (移除 OpeningSection)
import ReportsSection from './sections/ReportsSection';
import InnovationSection from './sections/InnovationSection';
import TimelineSection from './sections/TimelineSection';
import FeedbackSection from './sections/FeedbackSection';
import SupportSection from './sections/SupportSection';

// 相機位置配置類型
interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

interface UnifiedSceneProps {
  onCurrentProjectChange?: (project: any) => void;
}

export default function UnifiedScene({ onCurrentProjectChange }: UnifiedSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { currentSection, sectionProgress } = useStore();
  const { pointer } = useThree();

  // 定義每個 Section 的相機位置 - 調整 reports section 距離
  const cameraPositions: Record<string, CameraConfig> = {
    reports: { position: [0, 0, 8], target: [0, 0, 0], fov: 80 }, // 增加 FOV 創造魚眼效果，移近相機
    innovation: { position: [0, -20, 12], target: [0, -20, 0], fov: 45 },
    timeline: { position: [0, -40, 10], target: [0, -40, 0], fov: 45 },
    feedback: { position: [0, -60, 15], target: [0, -60, 0], fov: 45 },
    support: { position: [0, -80, 10], target: [0, -80, 0], fov: 45 }
  };

  // 相機平滑移動
  useEffect(() => {
    if (cameraRef.current && cameraPositions[currentSection]) {
      const targetCamera = cameraPositions[currentSection];
      
      gsap.to(cameraRef.current.position, {
        x: targetCamera.position[0],
        y: targetCamera.position[1],
        z: targetCamera.position[2],
        duration: 1.5,
        ease: "power2.out"
      });

      // 調整 FOV - 減少動畫時間避免尺寸閣動
      gsap.to(cameraRef.current, {
        fov: targetCamera.fov,
        duration: 0.5, // 縮短時間
        ease: "power2.out",
        onUpdate: () => {
          if (cameraRef.current) {
            cameraRef.current.updateProjectionMatrix();
            cameraRef.current.lookAt(
              targetCamera.target[0],
              targetCamera.target[1],
              targetCamera.target[2]
            );
          }
        }
      });
    }
  }, [currentSection]);

  // 滑鼠視差效果和相機旋轉邏輯
  useFrame((state, delta) => {
    if (cameraRef.current && currentSection === 'reports') {
      // Reports section: 相機圍繞 carousel 旋轉
      const basePosition = cameraPositions[currentSection];
      const radius = 8; // 相機距離 carousel 中心的半徑
      
      // 根據 sectionProgress 計算旋轉角度 (一圈) - 恢復原本邏輯
      const rotationAngle = sectionProgress * Math.PI * 2;
      
      // 計算相機位置 (圍繞 Y 軸旋轉)
      const targetX = Math.sin(rotationAngle) * radius;
      const targetZ = Math.cos(rotationAngle) * radius;
      const targetY = basePosition.position[1] + (pointer.y * 2); // 滑鼠 Y 軸視差
      
      // 不同速度的插值：X 方向快，Z 方向慢，保留視覺落差效果
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.1; // X 方向正常速度
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.075; // Z方向移動速度由此控制
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.1; // Y 方向正常速度
      
      // 先讓相機看向 carousel 中心
      cameraRef.current.lookAt(0, 0, 0);
      
      // 使用四元數安全地添加 Z 軸傾斜 (roll)
      const tiltAngle = pointer.x * 0.1; // 傾斜角度係數 
      const rollQuaternion = new THREE.Quaternion();
      rollQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), tiltAngle);
      cameraRef.current.quaternion.multiply(rollQuaternion);
    } else if (cameraRef.current) {
      // 其他 section 使用原來的輕微視差效果
      const targetX = pointer.x * 0.5;
      const targetY = pointer.y * 0.5;
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.02;
    }
  });

  return (
    <>
      {/* 相機設置 */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={45}
        near={0.1}
        far={1000}
        position={[0, 0, 10]}
      />

      {/* 3D 輔助軸線 */}
      <axesHelper args={[10]} />
      <gridHelper args={[20, 20]} />
      
      {/* 環境光照 - 調整為更接近 codesandbox */}
      <Environment preset="dawn" background={false} blur={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <fog attach="fog" args={['#a79', 8.5, 12]} />

      {/* Section 組件 (移除 OpeningSection) */}
      <ReportsSection 
        visible={currentSection === 'reports'} 
        progress={sectionProgress}
        onCurrentProjectChange={onCurrentProjectChange}
      />
      
      <InnovationSection 
        visible={currentSection === 'innovation'} 
        progress={sectionProgress}
      />
      
      <TimelineSection 
        visible={currentSection === 'timeline'} 
        progress={sectionProgress}
      />
      
      <FeedbackSection 
        visible={currentSection === 'feedback'} 
        progress={sectionProgress}
      />
      
      <SupportSection 
        visible={currentSection === 'support'} 
        progress={sectionProgress}
      />
    </>
  );
}