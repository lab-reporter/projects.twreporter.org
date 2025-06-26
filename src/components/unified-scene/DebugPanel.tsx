'use client';

import { useEffect } from 'react';

interface CameraInfo {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  section: string;
  progress: number;
}

interface DebugPanelProps {
  cameraInfo: CameraInfo;
  showAxes: boolean;
  orbitEnabled: boolean;
  onAxesToggle: () => void;
  onOrbitToggle: () => void;
}

export default function DebugPanel({
  cameraInfo,
  showAxes,
  orbitEnabled,
  onAxesToggle,
  onOrbitToggle
}: DebugPanelProps) {
  
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
          ${(window as any).gsapScrollInfo ? ((window as any).gsapScrollInfo.progress * 100).toFixed(1) + '%' : 'N/A'}
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
        axesToggle.onclick = onAxesToggle;
      }
      
      if (orbitToggle) {
        orbitToggle.onclick = onOrbitToggle;
      }
    }
  }, [cameraInfo, showAxes, orbitEnabled, onAxesToggle, onOrbitToggle]);

  // 這個組件不渲染任何內容到 Three.js 場景中
  return null;
} 