/**
 * 單個創新 3D 模型組件
 * 
 * 整合模型載入、動畫、互動等功能
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useModelLoader, cleanupModelResources } from './ModelLoader';
import { useModelAnimator } from './ModelAnimator';
import type { InnovationModelProps, ModelLoadState } from './types';

/**
 * 創新 3D 模型組件
 */
export default function InnovationModel({ 
  modelData, 
  focused, 
  onClick, 
  onHover, 
  onUnhover 
}: InnovationModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // 模型載入狀態
  const [loadState, setLoadState] = useState<ModelLoadState>({
    isLoading: true,
    error: null,
    model: null,
    mixer: null
  });

  // 模型載入器
  const loadModel = useModelLoader(modelData, (state) => {
    setLoadState(prevState => ({ ...prevState, ...state }));
  });

  // 模型動畫
  useModelAnimator(
    loadState.model,
    loadState.mixer,
    focused,
    modelData.position
  );

  // 載入模型
  useEffect(() => {
    loadModel();
    
    return () => {
      // 清理資源
      cleanupModelResources(loadState.mixer);
    };
  }, [modelData.id]); // 只在 modelData.id 變化時重新載入

  // 載入中狀態
  if (loadState.isLoading) {
    return <LoadingState position={modelData.position} />;
  }

  // 錯誤狀態
  if (loadState.error) {
    return <ErrorState position={modelData.position} />;
  }

  // 正常渲染
  return (
    <group 
      ref={groupRef}
      onPointerOver={onHover}
      onPointerOut={onUnhover}
      onClick={() => onClick(modelData)}
    >
      {loadState.model && <primitive object={loadState.model} />}
    </group>
  );
}

/**
 * 載入中狀態組件
 */
function LoadingState({ position }: { position: { x: number; y: number; z: number } }) {
  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#666666" transparent opacity={0.5} />
      </mesh>
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        載入中...
      </Text>
    </group>
  );
}

/**
 * 錯誤狀態組件
 */
function ErrorState({ position }: { position: { x: number; y: number; z: number } }) {
  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        載入失敗
      </Text>
    </group>
  );
} 