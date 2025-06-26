/**
 * 模型動畫系統
 * 
 * 負責 3D 模型的旋轉、浮動、聚焦等動畫效果
 */

'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { FocusConfig } from './types';

// 動畫配置
const ANIMATION_CONFIG: FocusConfig = {
  bufferStart: 0.1,
  bufferEnd: 0.9,
  rotationSpeed: {
    normal: 0.3,    // 正常旋轉速度
    focused: 0.8    // 聚焦時旋轉速度
  },
  floatAmplitude: 0.3  // 浮動幅度
} as const;

/**
 * 模型動畫 Hook
 * 
 * @param model 3D 模型
 * @param mixer 動畫混合器
 * @param focused 是否聚焦
 * @param modelPosition 模型位置 (用於浮動效果的隨機種子)
 */
export function useModelAnimator(
  model: THREE.Group | null,
  mixer: THREE.AnimationMixer | null,
  focused: boolean,
  modelPosition: { x: number; y: number; z: number }
) {
  useFrame((state, delta) => {
    if (!model) return;

    // 更新動畫混合器
    if (mixer) {
      mixer.update(delta);
    }

    // 旋轉動畫
    applyRotationAnimation(model, delta, focused);

    // 浮動效果 (非聚焦時)
    if (!focused) {
      applyFloatAnimation(model, state.clock.elapsedTime, modelPosition);
    }
  });
}

/**
 * 應用旋轉動畫
 * 
 * @param model 3D 模型
 * @param delta 時間增量
 * @param focused 是否聚焦
 */
function applyRotationAnimation(
  model: THREE.Group,
  delta: number,
  focused: boolean
) {
  const rotationSpeed = focused 
    ? ANIMATION_CONFIG.rotationSpeed.focused 
    : ANIMATION_CONFIG.rotationSpeed.normal;
    
  model.rotation.y += delta * rotationSpeed;
}

/**
 * 應用浮動動畫
 * 
 * @param model 3D 模型
 * @param elapsedTime 經過時間
 * @param modelPosition 模型位置 (用作隨機種子)
 */
function applyFloatAnimation(
  model: THREE.Group,
  elapsedTime: number,
  modelPosition: { x: number; y: number; z: number }
) {
  const originalY = model.userData.originalPosition?.y || modelPosition.y;
  
  // 使用模型 X 座標作為相位偏移，讓每個模型的浮動不同步
  const phaseOffset = modelPosition.x;
  const floatOffset = Math.sin(elapsedTime * 2 + phaseOffset) * ANIMATION_CONFIG.floatAmplitude;
  
  model.position.y = originalY + floatOffset;
}

/**
 * 取得動畫配置
 */
export function getAnimationConfig(): FocusConfig {
  return ANIMATION_CONFIG;
} 