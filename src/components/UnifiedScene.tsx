'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Html } from '@react-three/drei';
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
  onInnovationFocusChange?: (project: any) => void;
}

export default function UnifiedScene({ onCurrentProjectChange, onInnovationFocusChange }: UnifiedSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { currentSection, sectionProgress } = useStore();
  const { pointer } = useThree();
  
  // Innovation 聚焦物件狀態
  const [focusedInnovationItem, setFocusedInnovationItem] = useState<any>(null);

  // 計算 reports 項目總數
  const reportsCount = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ).length;
  }, []);

  // 旋轉緩衝區參數 - 控制最後項目的停留時間
  const ROTATION_BUFFER = 0.05; // 5% 的緩衝區，可調整

  // 相機位置顯示器狀態
  const [cameraInfo, setCameraInfo] = useState({
    position: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    section: '',
    progress: 0
  });

  // 軸線顯示控制狀態
  const [showAxes, setShowAxes] = useState(true);
  
  // Orbit 控制狀態
  const [orbitEnabled, setOrbitEnabled] = useState(false);

  // 定義每個 Section 的相機位置配置 - Z 軸遞減實現向前推進
  const cameraPositions: Record<string, CameraConfig> = {
    reports: { position: [0, 0, 950], target: [0, 0, 1000], fov: 80 }, // 從遠處開始，寬視角
    innovation: { position: [0, 0, 880], target: [0, 0, 500], fov: 45 }, // 確保大於聚焦時的相機位置
    timeline: { position: [0, 5, 600], target: [0, 0, 650], fov: 75 }, // 繼續向前
    feedback: { position: [0, 0, 400], target: [0, 0, 450], fov: 45 }, // 持續向前
    support: { position: [0, 0, 200], target: [0, 0, 250], fov: 45 } // 最近位置
  };

  // 相機平滑移動 - 暫時禁用 GSAP 動畫測試
  useEffect(() => {
    if (cameraRef.current && cameraPositions[currentSection]) {
      const targetCamera = cameraPositions[currentSection];
      
      // 相機移動日誌已禁用
      
      // 暫時移除 GSAP 動畫，直接設置位置
      cameraRef.current.position.set(
        targetCamera.position[0],
        targetCamera.position[1], 
        targetCamera.position[2]
      );
      
      cameraRef.current.fov = targetCamera.fov;
      cameraRef.current.updateProjectionMatrix();
      
      // 直接設置 lookAt
      if (currentSection !== 'reports') {
        cameraRef.current.lookAt(
          targetCamera.target[0],
          targetCamera.target[1],
          targetCamera.target[2]
        );
      }
      
      // 相機位置設置完成
    }
  }, [currentSection]);

  // 相機位置更新計時器
  const lastUpdateRef = useRef(0);

  // 控制滾動禁用
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    if (orbitEnabled) {
      // 禁用滾動
      document.body.style.overflow = 'hidden';
      window.addEventListener('scroll', preventScroll, { passive: false });
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      // 恢復滾動
      document.body.style.overflow = 'auto';
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      // 清理
      document.body.style.overflow = 'auto';
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [orbitEnabled]);

  // 在DOM中添加偵錯面板
  useEffect(() => {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'camera-debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      top: 8px;
      left: 8px;
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 16px;
      border-radius: 12px;
      font-size: 14px;
      font-family: monospace;
      z-index: 99999;
      min-width: 240px;
      max-width: 280px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    document.body.appendChild(debugPanel);

    return () => {
      const panel = document.getElementById('camera-debug-panel');
      if (panel) {
        document.body.removeChild(panel);
      }
    };
  }, []);

  // 更新偵錯面板內容
  useEffect(() => {
    const panel = document.getElementById('camera-debug-panel');
    if (panel) {
      panel.innerHTML = `
        <div style="color: #4CAF50; font-weight: bold; margin-bottom: 8px;">
          📷 相機位置偵錯器
        </div>
        <div>相機位置:</div>
        <div style="margin-left: 10px; color: #FFD700;">
          X: ${cameraInfo.position.x}<br/>
          Y: ${cameraInfo.position.y}<br/>
          Z: ${cameraInfo.position.z}
        </div>
        <div style="margin-top: 8px;">目標位置:</div>
        <div style="margin-left: 10px; color: #87CEEB;">
          X: ${cameraInfo.target.x}<br/>
          Y: ${cameraInfo.target.y}<br/>
          Z: ${cameraInfo.target.z}
        </div>
        <div style="margin-top: 8px;">當前段落:</div>
        <div style="margin-left: 10px; color: #FF6B6B;">
          ${cameraInfo.section}
        </div>
        <div style="margin-top: 8px;">進度:</div>
        <div style="margin-left: 10px; color: #4ECDC4;">
          ${(cameraInfo.progress * 100).toFixed(1)}%
        </div>
        <div style="margin-top: 8px;">滾動位置:</div>
        <div style="margin-left: 10px; color: #FFA500;">
          ${Math.round(window.scrollY)}px / ${Math.round(document.documentElement.scrollHeight)}px
        </div>
        <div style="margin-top: 8px;">GSAP 進度:</div>
        <div style="margin-left: 10px; color: #9370DB;">
          ${window.gsapScrollInfo ? (window.gsapScrollInfo.progress * 100).toFixed(1) + '%' : 'N/A'}
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #ffffff; font-size: 12px;">軸線輔助</span>
            <div 
              id="axes-toggle"
              style="
                position: relative;
                width: 44px;
                height: 24px;
                background: ${showAxes ? '#4ecdc4' : '#666666'};
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                outline: none;
              "
            >
              <div style="
                position: absolute;
                top: 2px;
                left: ${showAxes ? '22px' : '2px'};
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              "></div>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #ffffff; font-size: 12px;">手動控制</span>
            <div 
              id="orbit-toggle"
              style="
                position: relative;
                width: 44px;
                height: 24px;
                background: ${orbitEnabled ? '#ff9500' : '#666666'};
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                outline: none;
              "
            >
              <div style="
                position: absolute;
                top: 2px;
                left: ${orbitEnabled ? '22px' : '2px'};
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              "></div>
            </div>
          </div>
        </div>
      `;
      
      // 添加toggle按鈕事件監聽器
      const axesToggle = document.getElementById('axes-toggle');
      const orbitToggle = document.getElementById('orbit-toggle');
      
      if (axesToggle) {
        axesToggle.onclick = () => {
          setShowAxes(prev => !prev);
        };
      }
      
      if (orbitToggle) {
        orbitToggle.onclick = () => {
          setOrbitEnabled(prev => !prev);
        };
      }
    }
  }, [cameraInfo, showAxes, orbitEnabled]);

  // 滑鼠視差效果和相機旋轉邏輯
  useFrame((state, delta) => {
    // 當 orbit 模式開啟時，不執行滾動控制相機邏輯
    if (orbitEnabled || !cameraRef.current) return;
    
    if (cameraRef.current && currentSection === 'innovation' && focusedInnovationItem) {
      // Innovation section: 移動到物件前方，使用漸進式旋轉避免跳躍
      const targetPosition = new THREE.Vector3(
        focusedInnovationItem.position.x,
        focusedInnovationItem.position.y,
        focusedInnovationItem.position.z + 20  // 相機在物件後方
      );
      
      // 平滑移動相機位置
      cameraRef.current.position.lerp(targetPosition, 0.05);
      
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
      cameraRef.current.quaternion.slerp(targetQuaternion, 0.005);
      
    } else if (cameraRef.current && currentSection === 'reports') {
      // Reports section: 相機圍繞 carousel 旋轉
      const basePosition = cameraPositions[currentSection];
      const radius = 8; // 相機距離圓柱中心的半徑
      
      // 根據滾動進度計算旋轉角度，停在最後一張照片
      // 加入緩衝區：0-95% 的滾動距離對應 0-100% 的旋轉進度
      const effectiveProgress = Math.min(sectionProgress / (1 - ROTATION_BUFFER), 1);
      const maxRotation = (Math.PI * 2) * (reportsCount - 1) / reportsCount;
      const rotationAngle = effectiveProgress * maxRotation;
      
      // 計算相機圍繞圓柱旋轉的目標位置
      const targetX = Math.sin(rotationAngle) * radius;
      const targetZ = basePosition.target[2] + Math.cos(rotationAngle) * radius; // 計算相機圍繞圓柱的 Z 軸位置
      const targetY = basePosition.position[1] + (pointer.y * 2); // 滑鼠 Y 軸控制相機高度
      
      // 使用不同插值速度創造視覺落差效果
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.1; // 平滑移動相機 X 軸位置
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.09; // 平滑移動相機 Z 軸位置
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.1; // 平滑移動相機 Y 軸位置
      
      // 讓相機看向圓柱畫廊中心位置
      cameraRef.current.lookAt(0, 0, basePosition.target[2]);
      
      // 使用四元數添加相機滾轉效果
      const tiltAngle = pointer.x * 0.1; // 滑鼠 X 軸控制相機傾斜角度
      const rollQuaternion = new THREE.Quaternion();
      rollQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), tiltAngle);
      cameraRef.current.quaternion.multiply(rollQuaternion);
    } else if (cameraRef.current && ['timeline', 'feedback', 'support'].includes(currentSection)) {
      // 其他 Section 使用基礎位置配合滑鼠視差效果
      const basePosition = cameraPositions[currentSection];
      const targetX = basePosition.position[0] + pointer.x * 0.5;
      const targetY = basePosition.position[1] + pointer.y * 0.5;
      const targetZ = basePosition.position[2]; // 維持 Z 軸深度位置
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.02;
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.02; // 更新相機 Z 軸位置
      
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
    if (currentTime - lastUpdateRef.current > 1 && cameraRef.current) {
      lastUpdateRef.current = currentTime;
      setCameraInfo({
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
        fov={45}
        near={0.1}
        far={10000}
        position={[0, 0, 10]}
      />

      {/* Orbit 控制 - 僅在啟用時顯示 */}
      {orbitEnabled && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.5}
          panSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={500}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      )}

      {/* 3D 輔助軸線 - 可切換顯示 */}
      {showAxes && (
        <>
          <axesHelper args={[10]} />
          <gridHelper args={[3000, 300]} />
        </>
      )}
      
      {/* 基礎光照系統 - 匹配原始 Combined3DScene.jsx */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={1} 
        color="#ffffff" 
        castShadow 
      />
      {/* 移除 Environment 組件，避免影響材質顏色 */}

      {/* Section 組件 (移除 OpeningSection) */}
      <ReportsSection 
        visible={currentSection === 'reports'} 
        progress={sectionProgress}
        onCurrentProjectChange={onCurrentProjectChange}
      />
      
      <InnovationSection 
        visible={currentSection === 'innovation'} 
        progress={sectionProgress}
        onFocusedItemChange={setFocusedInnovationItem}
        onCurrentProjectChange={onInnovationFocusChange}
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