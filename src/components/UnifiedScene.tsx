'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls, Html } from '@react-three/drei';
import { useStore } from '@/stores';
import * as THREE from 'three';
import { gsap } from 'gsap';
import projectsData from '@/app/data/projects.json';

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

  // 計算 reports 項目總數
  const reportsCount = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ).length;
  }, []);

  // 旋轉緩衝區參數 - 控制最後項目的停留時間
  const ROTATION_BUFFER = 0.05; // 5% 的緩衝區，可調整

  // 定義每個 Section 的相機位置配置 - 統一使用 Z 軸往前移動
  const cameraPositions: Record<string, CameraConfig> = {
    reports: { position: [0, 0, 8], target: [0, 0, 0], fov: 80 }, // 起始位置，寬視角
    innovation: { position: [0, 0, 16], target: [0, 0, 8], fov: 45 }, // Z 軸往前移動
    timeline: { position: [0, 0, 24], target: [0, 0, 16], fov: 45 }, // 繼續往前
    feedback: { position: [0, 0, 32], target: [0, 0, 24], fov: 45 }, // 繼續往前
    support: { position: [0, 0, 40], target: [0, 0, 32], fov: 45 } // 最前位置
  };

  // 相機平滑移動（Reports section 由 useFrame 控制旋轉）
  useEffect(() => {
    if (cameraRef.current && cameraPositions[currentSection]) {
      const targetCamera = cameraPositions[currentSection];
      
      // Reports section 不強制重置位置，保持旋轉狀態
      if (currentSection !== 'reports') {
        gsap.to(cameraRef.current.position, {
          x: targetCamera.position[0],
          y: targetCamera.position[1],
          z: targetCamera.position[2],
          duration: 1.5,
          ease: "power2.out"
        });
      }

      // 所有 section 都需要調整 FOV
      gsap.to(cameraRef.current, {
        fov: targetCamera.fov,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          if (cameraRef.current) {
            cameraRef.current.updateProjectionMatrix();
            // Reports section 的 lookAt 由 useFrame 控制
            if (currentSection !== 'reports') {
              cameraRef.current.lookAt(
                targetCamera.target[0],
                targetCamera.target[1],
                targetCamera.target[2]
              );
            }
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
      
      // 根據滾動進度計算旋轉角度，停在最後一張照片
      // 加入緩衝區：0-95% 的滾動距離對應 0-100% 的旋轉進度
      const effectiveProgress = Math.min(sectionProgress / (1 - ROTATION_BUFFER), 1);
      const maxRotation = (Math.PI * 2) * (reportsCount - 1) / reportsCount;
      const rotationAngle = effectiveProgress * maxRotation;
      
      // 計算相機位置 (圍繞 Y 軸旋轉)
      const targetX = Math.sin(rotationAngle) * radius;
      const targetZ = Math.cos(rotationAngle) * radius;
      const targetY = basePosition.position[1] + (pointer.y * 2); // 滑鼠 Y 軸視差
      
      // 不同速度的插值：X 方向快，Z 方向慢，保留視覺落差效果
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.1; // X 方向正常速度
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.09; // Z方向移動速度由此控制
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