/**
 * Innovation Section 光照系統
 * 
 * 提供環境光、方向光、聚光燈等光源配置
 */

'use client';

// 光照配置
const LIGHTING_CONFIG = {
  ambient: {
    intensity: 0.3,
    color: '#ffffff'
  },
  directional: {
    position: [10, 10, 10] as [number, number, number],
    intensity: 1,
    color: '#ffffff',
    castShadow: true
  },
  spot: {
    position: [0, 15, 20] as [number, number, number],
    targetPosition: [0, 0, 0] as [number, number, number],
    intensity: 5,
    angle: Math.PI * 0.6,
    penumbra: 0.2,
    distance: 60,
    decay: 1,
    color: '#ffffff',
    castShadow: true
  }
} as const;

/**
 * 光照設定組件
 * 
 * 匹配原始 Combined3DScene.jsx 的光照配置
 */
export default function LightingSetup() {
  return (
    <>
      {/* 環境光 - 提供基礎照明 */}
      <ambientLight 
        intensity={LIGHTING_CONFIG.ambient.intensity} 
        color={LIGHTING_CONFIG.ambient.color} 
      />
      
      {/* 方向光 - 提供主要光源和陰影 */}
      <directionalLight 
        position={LIGHTING_CONFIG.directional.position} 
        intensity={LIGHTING_CONFIG.directional.intensity} 
        color={LIGHTING_CONFIG.directional.color}
        castShadow={LIGHTING_CONFIG.directional.castShadow}
      />
      
      {/* 主要聚光燈 - 高強度聚焦照明 */}
      <spotLight
        position={LIGHTING_CONFIG.spot.position}
        target-position={LIGHTING_CONFIG.spot.targetPosition}
        intensity={LIGHTING_CONFIG.spot.intensity}
        angle={LIGHTING_CONFIG.spot.angle}
        penumbra={LIGHTING_CONFIG.spot.penumbra}
        distance={LIGHTING_CONFIG.spot.distance}
        decay={LIGHTING_CONFIG.spot.decay}
        color={LIGHTING_CONFIG.spot.color}
        castShadow={LIGHTING_CONFIG.spot.castShadow}
      />
    </>
  );
} 