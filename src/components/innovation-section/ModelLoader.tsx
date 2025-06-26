/**
 * 3D 模型載入系統
 * 
 * 負責 GLTF 模型的載入、材質配置、動畫處理等功能
 */

'use client';

import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { applyMaterialConfig, defaultMaterialConfigs, debugModelStructure } from '@/utils/materialUtils';
import type { ModelData, ModelLoadState } from './types';

// 模型載入配置
const LOADER_CONFIG = {
  dracoPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/',
  defaultScale: { x: 0.25, y: 0.25, z: 0.25 }
} as const;

/**
 * 3D 模型載入 Hook
 * 
 * @param modelData 模型資料
 * @param onStateChange 狀態變更回調
 * @returns 載入函數
 */
export function useModelLoader(
  modelData: ModelData,
  onStateChange: (state: Partial<ModelLoadState>) => void
) {
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  const loadModel = useCallback(async () => {
    try {
      onStateChangeRef.current({ isLoading: true, error: null });

      // 設定 DRACO 載入器
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(LOADER_CONFIG.dracoPath);

      // 設定 GLTF 載入器
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      // 載入模型
      const gltf = await new Promise<any>((resolve, reject) => {
        gltfLoader.load(
          modelData.path,
          resolve,
          undefined,
          reject
        );
      });

      const loadedModel = gltf.scene as THREE.Group;

      // 處理動畫系統
      let mixer: THREE.AnimationMixer | null = null;
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(loadedModel);
        gltf.animations.forEach((clip: THREE.AnimationClip) => {
          const action = mixer!.clipAction(clip);
          action.loop = THREE.LoopRepeat;
          action.play();
        });
      }

      // 配置模型屬性
      configureModel(loadedModel, modelData);

      // 應用材質配置
      applyModelMaterials(loadedModel, modelData.id);

      onStateChangeRef.current({ 
        model: loadedModel, 
        mixer, 
        isLoading: false 
      });

    } catch (error) {
      // 只在開發環境且非 Array buffer allocation 錯誤時輸出
      if (process.env.NODE_ENV === 'development' && 
          !(error instanceof Error && error.message.includes('Array buffer allocation failed'))) {
        console.error('Error loading GLTF model:', modelData.id, error);
      }
      onStateChangeRef.current({ 
        error: error as Error, 
        isLoading: false 
      });
    }
  }, [modelData.id, modelData.path]); // 只依賴模型的關鍵屬性

  return loadModel;
}

/**
 * 配置載入的 3D 模型
 * 
 * @param model 載入的模型
 * @param modelData 模型資料
 */
function configureModel(model: THREE.Group, modelData: ModelData) {
  // 設置陰影和渲染順序
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.renderOrder = 1;
      child.visible = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  model.castShadow = true;
  model.receiveShadow = true;

  // 設置比例
  if (modelData.scale) {
    model.scale.set(modelData.scale.x, modelData.scale.y, modelData.scale.z);
  } else {
    const { x, y, z } = LOADER_CONFIG.defaultScale;
    model.scale.set(x, y, z);
  }

  // 設置旋轉
  if (modelData.rotation) {
    model.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);
  }

  // 設置位置
  model.position.set(modelData.position.x, modelData.position.y, modelData.position.z);

  // 儲存原始資料到 userData
  model.userData = {
    originalScale: model.scale.clone(),
    originalPosition: model.position.clone(),
    projectId: modelData.id,
    targetPosition: {
      x: modelData.position.x,
      y: modelData.position.y,
      z: modelData.position.z
    }
  };
}

/**
 * 應用模型材質配置
 * 
 * @param model 3D 模型
 * @param modelId 模型 ID
 */
function applyModelMaterials(model: THREE.Group, modelId: string) {
  // 調試模型結構
  if (process.env.NODE_ENV === 'development') {
    debugModelStructure(model, modelId);
  }
  
  // 應用材質配置
  const materialConfig = defaultMaterialConfigs[modelId];
  applyMaterialConfig(model, materialConfig);
}

/**
 * 清理模型資源
 * 
 * @param mixer 動畫混合器
 */
export function cleanupModelResources(mixer: THREE.AnimationMixer | null) {
  if (mixer) {
    mixer.stopAllAction();
    mixer.uncacheRoot(mixer.getRoot());
  }
} 