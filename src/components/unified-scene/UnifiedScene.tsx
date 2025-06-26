'use client';

import { useState, useEffect } from 'react';
import { LIGHTING_CONFIG, SCENE_CONFIG } from './SceneConstants';
import CameraController from './CameraController';
import DebugPanel from './DebugPanel';
import SectionRenderer from './SectionRenderer';

// 偵錯面板開關 - AI 可快速調整的開關
const DEBUG_ENABLED = false; // 設為 true 開啟偵錯面板，false 關閉

interface UnifiedSceneProps {
  onCurrentProjectChange?: (project: any) => void;
  onInnovationFocusChange?: (project: any) => void;
}

export default function UnifiedScene({ onCurrentProjectChange, onInnovationFocusChange }: UnifiedSceneProps) {
  // Innovation 聚焦物件狀態
  const [focusedInnovationItem, setFocusedInnovationItem] = useState<any>(null);

  // 相機位置顯示器狀態 - 只在偵錯模式下使用
  const [cameraInfo, setCameraInfo] = useState({
    position: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    section: '',
    progress: 0
  });

  // 軸線顯示控制狀態 - 只在偵錯模式下使用
  const [showAxes, setShowAxes] = useState(DEBUG_ENABLED);
  
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
      // 恢復滾動 - 但不覆蓋 Modal 的設定
      if (!document.querySelector('[data-modal-open="true"]')) {
        document.body.style.overflow = 'auto';
      }
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      // 清理 - 但不覆蓋 Modal 的設定
      if (!document.querySelector('[data-modal-open="true"]')) {
        document.body.style.overflow = 'auto';
      }
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [orbitEnabled]);

  // 確保初始狀態正確
  useEffect(() => {
    // 強制確保滾動條可見，除非 Modal 開啟或 orbit 模式啟用
    if (!document.querySelector('[data-modal-open="true"]') && !orbitEnabled) {
      document.body.style.overflow = 'auto';
    }
  }, [orbitEnabled]);

  // Innovation 聚焦處理
  const handleInnovationFocusChange = (item: any) => {
    setFocusedInnovationItem(item);
    onInnovationFocusChange?.(item);
  };

  // 相機資訊更新 - 只在偵錯模式下更新
  const handleCameraInfoUpdate = (info: any) => {
    if (DEBUG_ENABLED) {
      setCameraInfo(info);
    }
  };

  return (
    <>
      {/* 環境光照 */}
      <ambientLight intensity={LIGHTING_CONFIG.ambient.intensity} color={LIGHTING_CONFIG.ambient.color} />
      <directionalLight
        position={LIGHTING_CONFIG.directional.position}
        intensity={LIGHTING_CONFIG.directional.intensity}
        color={LIGHTING_CONFIG.directional.color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* 相機控制器 */}
      <CameraController
        focusedInnovationItem={focusedInnovationItem}
        orbitEnabled={orbitEnabled}
        onCameraInfoUpdate={handleCameraInfoUpdate}
      />

      {/* 場景內容渲染器 */}
      <SectionRenderer 
        onCurrentProjectChange={onCurrentProjectChange}
        onInnovationFocusChange={onInnovationFocusChange}
        onInnovationFocusedItemChange={setFocusedInnovationItem}
      />

      {/* 偵錯面板 - 只在 DEBUG_ENABLED 為 true 時渲染 */}
      {DEBUG_ENABLED && (
        <DebugPanel
          cameraInfo={cameraInfo}
          showAxes={showAxes}
          orbitEnabled={orbitEnabled}
          onAxesToggle={() => setShowAxes(!showAxes)}
          onOrbitToggle={() => setOrbitEnabled(!orbitEnabled)}
        />
      )}

      {/* 3D 輔助系統 - 只在偵錯模式下顯示 */}
      {DEBUG_ENABLED && showAxes && (
        <group>
          <axesHelper args={[SCENE_CONFIG.debug.axesSize]} />
          <gridHelper 
            args={[
              SCENE_CONFIG.debug.gridSize, 
              SCENE_CONFIG.debug.gridDivisions
            ]} 
          />
        </group>
      )}
    </>
  );
}