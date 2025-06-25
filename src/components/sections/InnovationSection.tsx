'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useStore } from '@/stores';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import projectsData from '@/app/data/projects.json';
import { applyMaterialConfig, defaultMaterialConfigs, debugModelStructure } from '@/utils/materialUtils';

// 類型定義
interface ModelData {
  id: string;
  path: string;
  title: string;
  subtitle?: string;
  section: string[];
  position: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  is3DModel: boolean;
}

interface InnovationModelProps {
  modelData: ModelData;
  focused: boolean;
  onClick: (item: ModelData) => void;
  onHover: () => void;
  onUnhover: () => void;
}

interface InnovationSectionProps {
  visible: boolean;
  progress: number;
  onFocusedItemChange?: (item: ModelData | null) => void;
  onCurrentProjectChange?: (project: any) => void;
}

// 創新 3D 模型組件
function InnovationModel({ modelData, focused, onClick, onHover, onUnhover }: InnovationModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 載入 3D 模型
  const loadModel = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      const gltf = await new Promise<any>((resolve, reject) => {
        gltfLoader.load(
          modelData.path,
          resolve,
          undefined,
          reject
        );
      });

      const loadedModel = gltf.scene as THREE.Group;

      // 處理動畫
      if (gltf.animations && gltf.animations.length > 0) {
        const animationMixer = new THREE.AnimationMixer(loadedModel);
        gltf.animations.forEach((clip: THREE.AnimationClip) => {
          const action = animationMixer.clipAction(clip);
          action.loop = THREE.LoopRepeat;
          action.play();
        });
        setMixer(animationMixer);
      }

      // 設置材質和陰影
      loadedModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.renderOrder = 1;
          child.visible = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      loadedModel.castShadow = true;
      loadedModel.receiveShadow = true;

      // 設置比例
      if (modelData.scale) {
        loadedModel.scale.set(modelData.scale.x, modelData.scale.y, modelData.scale.z);
      } else {
        loadedModel.scale.set(0.25, 0.25, 0.25);
      }

      // 設置旋轉
      if (modelData.rotation) {
        loadedModel.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);
      }

      // 設置位置
      loadedModel.position.set(modelData.position.x, modelData.position.y, modelData.position.z);

      // 儲存原始比例和位置資訊
      loadedModel.userData = {
        originalScale: loadedModel.scale.clone(),
        originalPosition: loadedModel.position.clone(),
        projectId: modelData.id,
        targetPosition: {
          x: modelData.position.x,
          y: modelData.position.y,
          z: modelData.position.z
        }
      };

      // 應用材質配置 - 這是關鍵步驟，防止粉紅色材質
      debugModelStructure(loadedModel, modelData.id);
      const materialConfig = defaultMaterialConfigs[modelData.id];
      applyMaterialConfig(loadedModel, materialConfig);

      setModel(loadedModel);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading GLTF model:', modelData.id, error);
      setError(error as Error);
      setIsLoading(false);
    }
  }, [modelData]);

  // 載入模型
  useEffect(() => {
    loadModel();
    
    return () => {
      // 清理資源
      if (mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(mixer.getRoot());
      }
    };
  }, [loadModel, mixer]);

  useFrame((state, delta) => {
    if (groupRef.current && model) {
      // 更新動畫
      if (mixer) {
        mixer.update(delta);
      }

      // 旋轉動畫（不移動物件位置，不縮放）
      if (focused) {
        // 聚焦時加速旋轉，不放大
        model.rotation.y += delta * 0.8; // 聚焦時旋轉更快
      } else {
        // 緩慢自轉
        model.rotation.y += delta * 0.3; // 正常自轉速度
      }

      // 浮動效果
      const originalY = model.userData.originalPosition.y;
      const floatOffset = Math.sin(state.clock.elapsedTime * 2 + modelData.position.x) * 0.3;
      if (!focused) {
        model.position.y = originalY + floatOffset;
      }
    }
  });

  if (isLoading) {
    return (
      <group position={[modelData.position.x, modelData.position.y, modelData.position.z]}>
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

  if (error) {
    return (
      <group position={[modelData.position.x, modelData.position.y, modelData.position.z]}>
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

  return (
    <group 
      ref={groupRef}
      onPointerOver={onHover}
      onPointerOut={onUnhover}
      onClick={() => onClick(modelData)}
    >
      {model && <primitive object={model} />}
      
      {/* 項目標題（聚焦時顯示） */}
      {focused && (
        <Text
          position={[0, 8, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={6}
          textAlign="center"
        >
          {modelData.title}
        </Text>
      )}
    </group>
  );
}

export default function InnovationSection({ visible, progress, onFocusedItemChange, onCurrentProjectChange }: InnovationSectionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [focusedItem, setFocusedItem] = useState<ModelData | null>(null);
  const { openModal } = useStore();

  // 篩選創新項目資料
  const innovationProjects = projectsData.filter((p) => {
    const hasInnovationSection = p.section && 
      (Array.isArray(p.section) ? p.section.includes('innovation') : p.section === 'innovation');
    const hasRequiredFields = 'is3DModel' in p && p.is3DModel === true && 'position' in p;
    return hasInnovationSection && hasRequiredFields;
  }) as ModelData[];

  useFrame((state, delta) => {
    if (groupRef.current && visible && innovationProjects.length > 0) {
      // 根據滾動進度計算當前聚焦的項目
      const bufferStart = 0.1;    // 前10%緩衝區
      const bufferEnd = 0.9;      // 後10%緩衝區
      
      let currentIndex = -1;      // 當前在鏡頭前的模型索引，-1表示無
      if (progress >= bufferStart && progress <= bufferEnd) {
        // 在有效區間內，計算當前應該顯示哪個模型
        const effectiveProgress = (progress - bufferStart) / (bufferEnd - bufferStart);
        currentIndex = Math.floor(effectiveProgress * innovationProjects.length);
        currentIndex = Math.min(currentIndex, innovationProjects.length - 1);
      }

      const currentItem = currentIndex >= 0 ? innovationProjects[currentIndex] : null;
      if (currentItem && currentItem.id !== focusedItem?.id) {
        setFocusedItem(currentItem);
        onFocusedItemChange?.(currentItem); // 通知父組件
        onCurrentProjectChange?.(currentItem); // 通知標題顯示
      } else if (!currentItem && focusedItem) {
        setFocusedItem(null);
        onFocusedItemChange?.(null); // 通知父組件
        onCurrentProjectChange?.(null); // 通知標題顯示
      }
    }
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      <group ref={groupRef}>
        {innovationProjects.map((item, index) => (
          <InnovationModel
            key={item.id}
            modelData={item}
            focused={focusedItem?.id === item.id || hoveredItem === index}
            onClick={(item) => openModal(item.id, item)}
            onHover={() => setHoveredItem(index)}
            onUnhover={() => setHoveredItem(null)}
          />
        ))}
      </group>

      {/* 移除內部標題顯示，改由外部統一顯示 */}

      {/* 光照系統 - 匹配原始 Combined3DScene.jsx 設定 */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={1} 
        color="#ffffff"
        castShadow={true}
      />
      
      {/* 主要聚光燈 - 使用原始程式碼的高強度設定 */}
      <spotLight
        position={[0, 15, 20]}
        target-position={[0, 0, 0]}
        intensity={5}
        angle={Math.PI * 0.6}
        penumbra={0.2}
        distance={60}
        decay={1}
        color="#ffffff"
        castShadow={true}
      />
    </group>
  );
}