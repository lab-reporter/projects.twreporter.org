'use client';

import { useState, useEffect } from 'react';
import { LIGHTING_CONFIG, SCENE_CONFIG } from './SceneConstants';
import CameraController from './CameraController';
import DebugPanel from './DebugPanel';
import SectionRenderer from './SectionRenderer';

interface UnifiedSceneProps {
  onCurrentProjectChange?: (project: any) => void;
  onInnovationFocusChange?: (project: any) => void;
}

export default function UnifiedScene({ onCurrentProjectChange, onInnovationFocusChange }: UnifiedSceneProps) {
  // Innovation 聚焦物件狀態
  const [focusedInnovationItem, setFocusedInnovationItem] = useState<any>(null);

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

  return (
    <>
      {/* 相機控制器 */}
      <CameraController
        focusedInnovationItem={focusedInnovationItem}
        orbitEnabled={orbitEnabled}
        onCameraInfoUpdate={setCameraInfo}
      />

      {/* 3D 輔助軸線 - 可切換顯示 */}
      {showAxes && (
        <>
          <axesHelper args={[SCENE_CONFIG.debug.axesSize]} />
          <gridHelper args={[SCENE_CONFIG.debug.gridSize, SCENE_CONFIG.debug.gridDivisions]} />
        </>
      )}
      
      {/* 基礎光照系統 */}
      <ambientLight 
        intensity={LIGHTING_CONFIG.ambient.intensity} 
        color={LIGHTING_CONFIG.ambient.color} 
      />
      <directionalLight 
        position={LIGHTING_CONFIG.directional.position} 
        intensity={LIGHTING_CONFIG.directional.intensity} 
        color={LIGHTING_CONFIG.directional.color} 
        castShadow={LIGHTING_CONFIG.directional.castShadow}
      />

      {/* Section 組件渲染器 */}
      <SectionRenderer
        onCurrentProjectChange={onCurrentProjectChange}
        onInnovationFocusChange={onInnovationFocusChange}
        onInnovationFocusedItemChange={setFocusedInnovationItem}
      />

      {/* 偵錯面板 */}
      <DebugPanel
        cameraInfo={cameraInfo}
        showAxes={showAxes}
        orbitEnabled={orbitEnabled}
        onAxesToggle={() => setShowAxes(prev => !prev)}
        onOrbitToggle={() => setOrbitEnabled(prev => !prev)}
      />
    </>
  );
}