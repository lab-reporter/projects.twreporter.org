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

  // 定義每個 Section 的相機位置配置 - 統一使用 Z 軸往前移動
  const cameraPositions: Record<string, CameraConfig> = {
    reports: { position: [0, 0, 8], target: [0, 0, 0], fov: 80 }, // 起始位置，寬視角
    innovation: { position: [0, 0, 16], target: [0, 0, 8], fov: 45 }, // Z 軸往前移動
    timeline: { position: [0, 0, 24], target: [0, 0, 16], fov: 45 }, // 繼續往前
    feedback: { position: [0, 0, 32], target: [0, 0, 24], fov: 45 }, // 繼續往前
    support: { position: [0, 0, 40], target: [0, 0, 32], fov: 45 } // 最前位置
  };

  // 相機平滑移動
  useEffect(() => {
    if (cameraRef.current && cameraPositions[currentSection]) {
      const targetCamera = cameraPositions[currentSection];
      
      // Reports section 需要設定基礎位置，其他 section 進行位置移動
      if (currentSection === 'reports') {
        // Reports section 設定基礎圓形軌道位置，具體旋轉由 useFrame 控制
        gsap.to(cameraRef.current.position, {
          x: targetCamera.position[0],
          y: targetCamera.position[1], 
          z: targetCamera.position[2],
          duration: 1.5,
          ease: "power2.out"
        });
      } else {
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
    
    if (cameraRef.current && currentSection === 'reports') {
      // Reports section: 相機圍繞 carousel 旋轉
      const basePosition = cameraPositions[currentSection];
      const radius = 8; // 相機距離 carousel 中心的半徑
      
      // 根據滾動進度計算旋轉角度，停在最後一張照片
      // 加入緩衝區：0-95% 的滾動距離對應 0-100% 的旋轉進度
      const effectiveProgress = Math.min(sectionProgress / (1 - ROTATION_BUFFER), 1);
      const maxRotation = (Math.PI * 2) * (reportsCount - 1) / reportsCount;
      const rotationAngle = effectiveProgress * maxRotation;
      
      // 計算相機位置 (圍繞 Y 軸旋轉)，從基礎位置開始
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
        far={1000}
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
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      )}

      {/* 3D 輔助軸線 - 可切換顯示 */}
      {showAxes && (
        <>
          <axesHelper args={[10]} />
          <gridHelper args={[20, 20]} />
        </>
      )}
      
      {/* 環境光照 - 調整為更接近 codesandbox */}
      <Environment preset="dawn" background={false} blur={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      {/* 移除霧化效果，避免遠處物件顯示為粉紅色 */}

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