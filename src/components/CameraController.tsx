'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useStore } from '@/stores';
import * as THREE from 'three';
import projectsData from '@/app/data/projects.json';
import { 
  CAMERA_POSITIONS, 
  INTERPOLATION_CONFIG, 
  SCENE_CONFIG, 
  ORBIT_CONFIG,
  type CameraConfig 
} from './SceneConstants';

interface CameraControllerProps {
  focusedInnovationItem: any;
  orbitEnabled: boolean;
  onCameraInfoUpdate: (info: any) => void;
}

export default function CameraController({ 
  focusedInnovationItem, 
  orbitEnabled, 
  onCameraInfoUpdate 
}: CameraControllerProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { currentSection, sectionProgress } = useStore();
  const { pointer } = useThree();
  
  // 相機位置更新計時器
  const lastUpdateRef = useRef(0);

  // 計算 reports 項目總數
  const reportsCount = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ).length;
  }, []);

  // 相機平滑移動邏輯
  useEffect(() => {
    if (cameraRef.current && CAMERA_POSITIONS[currentSection]) {
      const targetCamera = CAMERA_POSITIONS[currentSection];
      
      // 直接設置位置（暫時移除 GSAP 動畫）
      cameraRef.current.position.set(
        targetCamera.position[0],
        targetCamera.position[1], 
        targetCamera.position[2]
      );
      
      cameraRef.current.fov = targetCamera.fov;
      cameraRef.current.updateProjectionMatrix();
      
      // 直接設置 lookAt（除了 reports section）
      if (currentSection !== 'reports') {
        cameraRef.current.lookAt(
          targetCamera.target[0],
          targetCamera.target[1],
          targetCamera.target[2]
        );
      }
    }
  }, [currentSection]);

  // 滑鼠視差效果和相機旋轉邏輯
  useFrame((state, delta) => {
    // 當 orbit 模式開啟時，不執行滾動控制相機邏輯
    if (orbitEnabled || !cameraRef.current) return;
    
    if (cameraRef.current && currentSection === 'innovation' && focusedInnovationItem) {
      // Innovation section: 移動到物件前方，使用漸進式旋轉避免跳躍
      const targetPosition = new THREE.Vector3(
        focusedInnovationItem.position.x,
        focusedInnovationItem.position.y,
        focusedInnovationItem.position.z + SCENE_CONFIG.innovation.focusDistance
      );
      
      // 平滑移動相機位置
      cameraRef.current.position.lerp(targetPosition, INTERPOLATION_CONFIG.innovationFocus);
      
      // 計算目標朝向，但使用漸進式更新避免大幅旋轉
      const lookAtTarget = new THREE.Vector3(
        focusedInnovationItem.position.x,
        focusedInnovationItem.position.y,
        focusedInnovationItem.position.z
      );
      
      // 創建目標四元數
      const currentPosition = cameraRef.current.position.clone();
      const direction = lookAtTarget.sub(currentPosition).normalize();
      const targetQuaternion = new THREE.Quaternion();
      const matrix = new THREE.Matrix4();
      matrix.lookAt(currentPosition, currentPosition.clone().add(direction), new THREE.Vector3(0, 1, 0));
      targetQuaternion.setFromRotationMatrix(matrix);
      
      // 使用非常小的插值係數避免劇烈旋轉
      cameraRef.current.quaternion.slerp(targetQuaternion, INTERPOLATION_CONFIG.innovationRotation);
      
    } else if (cameraRef.current && currentSection === 'reports') {
      // Reports section: 相機圍繞 carousel 旋轉
      const basePosition = CAMERA_POSITIONS[currentSection];
      const { radius, rotationBuffer, mouseInfluenceY, tiltInfluenceX } = SCENE_CONFIG.reports;
      
      // 根據滾動進度計算旋轉角度，停在最後一張照片
      // 加入緩衝區：0-95% 的滾動距離對應 0-100% 的旋轉進度
      const effectiveProgress = Math.min(sectionProgress / (1 - rotationBuffer), 1);
      const maxRotation = (Math.PI * 2) * (reportsCount - 1) / reportsCount;
      const rotationAngle = effectiveProgress * maxRotation;
      
      // 計算相機圍繞圓柱旋轉的目標位置
      const targetX = Math.sin(rotationAngle) * radius;
      const targetZ = basePosition.target[2] + Math.cos(rotationAngle) * radius;
      const targetY = basePosition.position[1] + (pointer.y * mouseInfluenceY);
      
      // 使用不同插值速度創造視覺落差效果
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * INTERPOLATION_CONFIG.reportsX;
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * INTERPOLATION_CONFIG.reportsZ;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * INTERPOLATION_CONFIG.reportsY;
      
      // 讓相機看向圓柱畫廊中心位置
      cameraRef.current.lookAt(0, 0, basePosition.target[2]);
      
      // 使用四元數添加相機滾轉效果
      const tiltAngle = pointer.x * tiltInfluenceX;
      const rollQuaternion = new THREE.Quaternion();
      rollQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), tiltAngle);
      cameraRef.current.quaternion.multiply(rollQuaternion);
      
    } else if (cameraRef.current && ['timeline', 'feedback', 'support'].includes(currentSection)) {
      // 其他 Section 使用基礎位置配合滑鼠視差效果
      const basePosition = CAMERA_POSITIONS[currentSection];
      const { mouseInfluenceX, mouseInfluenceY } = SCENE_CONFIG.otherSections;
      
      const targetX = basePosition.position[0] + pointer.x * mouseInfluenceX;
      const targetY = basePosition.position[1] + pointer.y * mouseInfluenceY;
      const targetZ = basePosition.position[2];
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * INTERPOLATION_CONFIG.otherSections;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * INTERPOLATION_CONFIG.otherSections;
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * INTERPOLATION_CONFIG.otherSections;
      
      // 設定相機朝向目標位置
      const targetLookAt = new THREE.Vector3(
        basePosition.target[0],
        basePosition.target[1], 
        basePosition.target[2]
      );
      cameraRef.current.lookAt(targetLookAt);
    }

    // 每秒更新一次相機位置信息
    const currentTime = state.clock.elapsedTime;
    if (currentTime - lastUpdateRef.current > SCENE_CONFIG.debug.updateInterval && cameraRef.current) {
      lastUpdateRef.current = currentTime;
      onCameraInfoUpdate({
        position: {
          x: Math.round(cameraRef.current.position.x * 100) / 100,
          y: Math.round(cameraRef.current.position.y * 100) / 100,
          z: Math.round(cameraRef.current.position.z * 100) / 100
        },
        target: {
          x: 0, y: 0, z: 0 // 大部分情況下看向原點
        },
        section: currentSection,
        progress: Math.round(sectionProgress * 100) / 100
      });
    }
  });

  return (
    <>
      {/* 相機設置 */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={SCENE_CONFIG.camera.defaultFov}
        near={SCENE_CONFIG.camera.near}
        far={SCENE_CONFIG.camera.far}
        position={SCENE_CONFIG.camera.defaultPosition}
      />

      {/* Orbit 控制 - 僅在啟用時顯示 */}
      {orbitEnabled && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={ORBIT_CONFIG.zoomSpeed}
          panSpeed={ORBIT_CONFIG.panSpeed}
          rotateSpeed={ORBIT_CONFIG.rotateSpeed}
          minDistance={ORBIT_CONFIG.minDistance}
          maxDistance={ORBIT_CONFIG.maxDistance}
          minPolarAngle={ORBIT_CONFIG.minPolarAngle}
          maxPolarAngle={ORBIT_CONFIG.maxPolarAngle}
        />
      )}
    </>
  );
} 