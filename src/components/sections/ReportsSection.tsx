'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/stores';
import projectsData from '@/app/data/projects.json';

// 報導資料類型 - 基於 projects.json 結構
interface ReportData {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  section: string[];
  bgColor?: string;
}

// ✅ 完全參照原版的載入邏輯 - 簡單的 Promise-based + 修正中文路徑編碼
const loadMediaTexture = (mediaPath: string): Promise<THREE.Texture | null> => {
  return new Promise((resolve) => {
    const fileExtension = mediaPath.split('.').pop()?.toLowerCase() || '';
    const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];
    const isVideo = videoFormats.includes(fileExtension);

    // ✅ 修正中文路徑編碼問題
    let encodedPath = mediaPath;
    try {
      // 先解碼再重新編碼，處理已經編碼的路徑
      const decodedPath = decodeURIComponent(mediaPath);
      encodedPath = encodeURI(decodedPath);
      console.log(`🔄 載入媒體: ${decodedPath} -> ${encodedPath}, 類型: ${isVideo ? '影片' : '圖片'}`);
    } catch (error) {
      // 如果解碼失敗，直接使用原路徑
      encodedPath = encodeURI(mediaPath);
      console.log(`🔄 載入媒體: ${mediaPath} -> ${encodedPath}, 類型: ${isVideo ? '影片' : '圖片'}`);
    }

    if (isVideo) {
      // 影片載入邏輯 - 參照原版
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.generateMipmaps = false;
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBAFormat;
      videoTexture.colorSpace = THREE.SRGBColorSpace;

      const onCanPlayThrough = () => {
        console.log(`✅ 影片載入成功: ${mediaPath}`);
        video.play().catch(() => { });
        videoTexture.needsUpdate = true;
        resolve(videoTexture);
      };

      video.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
      video.addEventListener('error', (error) => {
        console.error(`❌ 影片載入失敗: ${mediaPath}`, error);
        resolve(null);
      }, { once: true });

      video.src = encodedPath;
      video.load();

      // 10秒超時
      setTimeout(() => {
        console.warn(`⏰ 影片載入超時: ${mediaPath}`);
        resolve(null);
      }, 10000);

    } else {
      // 圖片載入邏輯 - 完全參照原版 + 修正編碼
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        encodedPath,
        (loadedTexture) => {
          console.log(`✅ 圖片載入成功: ${mediaPath}`);
          loadedTexture.generateMipmaps = true;
          loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
          loadedTexture.magFilter = THREE.LinearFilter;
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          loadedTexture.needsUpdate = true;
          resolve(loadedTexture);
        },
        (progress) => {
          // 載入進度
          console.log(`📊 圖片載入進度: ${mediaPath} - ${Math.round((progress.loaded / progress.total) * 100)}%`);
        },
        (error) => {
          console.error(`❌ 圖片載入失敗: ${mediaPath}`, error);
          console.error(`❌ 嘗試的路徑: ${encodedPath}`);
          resolve(null);
        }
      );
    }
  });
};

// 報導卡片組件屬性類型
interface ReportCardProps {
  report: ReportData;
  index: number;
  count: number;
  radius?: number;
  focused?: boolean;
  onClick?: (report: ReportData) => void;
  texture?: THREE.Texture | null;
}

// ✅ 簡化的報導卡片組件 - 接收預載入的 texture
function ReportCard({ report, index, count, radius = 2, focused = false, onClick, texture }: ReportCardProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // 計算位置
  const angle = (index / count) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const rotation: [number, number, number] = [0, Math.PI + angle, 0];
  
  const pointerOver = (e: any) => {
    e?.stopPropagation?.();
    setHovered(true);
  };
  
  const pointerOut = () => setHovered(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(report);
    }
  };

  useFrame((state, delta) => {
    if (ref.current) {
      const targetScale = (hovered || focused) ? 1.15 : 1;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      if (focused) {
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0, 0.1);
      }
    }
  });

  // ✅ 參照原版的失敗處理邏輯 - 改善視覺回饋
  if (!texture) {
    // 創建載入失敗的 Canvas 紋理 - 完全參照原版，但改善視覺效果
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // 使用漸層背景而不是純色，避免與 THREE.js 預設粉紅色混淆
    const gradient = context!.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#34495e');
    context!.fillStyle = gradient;
    context!.fillRect(0, 0, 512, 256);
    
    // 添加邊框
    context!.strokeStyle = '#ecf0f1';
    context!.lineWidth = 4;
    context!.strokeRect(2, 2, 508, 252);
    
    // 主要文字
    context!.fillStyle = '#ecf0f1';
    context!.font = 'bold 28px Arial';
    context!.textAlign = 'center';
    context!.fillText('📷 載入失敗', 256, 100);
    
    // 副標題
    context!.fillStyle = '#bdc3c7';
    context!.font = '20px Arial';
    context!.fillText(report.title, 256, 140);
    
    // 提示文字
    context!.fillStyle = '#95a5a6';
    context!.font = '16px Arial';
    context!.fillText('請檢查檔案路徑', 256, 180);

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.needsUpdate = true;

    return (
      <group position={[x, 0, z]} rotation={rotation}>
        <mesh
          ref={ref}
          onPointerOver={pointerOver}
          onPointerOut={pointerOut}
          onClick={handleClick}
        >
          <planeGeometry args={[0.96, 0.64]} />
          <meshStandardMaterial 
            map={canvasTexture} 
            side={THREE.DoubleSide}
            transparent={false}
            alphaTest={0}
            roughness={1}
            metalness={0}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[x, 0, z]} rotation={rotation}>
      <mesh
        ref={ref}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        onClick={handleClick}
      >
        <planeGeometry args={[0.96, 0.64]} />
        <meshStandardMaterial 
          map={texture} 
          side={THREE.DoubleSide}
          transparent={false}
          alphaTest={0}
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      {/* 聚焦時顯示標題 */}
      {focused && (
        <group position={[0, -0.8, 0.1]}>
          <Text
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            textAlign="center"
            outlineWidth={0.02}
            outlineColor="black"
          >
            {report.title}
          </Text>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.1}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.5}
            textAlign="center"
            outlineWidth={0.01}
            outlineColor="black"
          >
            {report.subtitle}
          </Text>
        </group>
      )}
    </group>
  );
}

// Carousel 組件屬性類型
interface CarouselProps {
  radius?: number;
  progress?: number;
  onProjectClick?: (report: ReportData) => void;
  loadedTextures?: Map<string, THREE.Texture | null>;
}

// ✅ 主要 Carousel 組件 - 接收預載入的紋理
function Carousel({ radius = 2, progress = 0, onProjectClick, loadedTextures }: CarouselProps) {
  const ref = useRef<THREE.Group>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 從 projects.json 篩選 reports 資料 - 參考原版
  const reportsProjects = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ) as ReportData[];
  }, []);

  console.log(`📊 載入 Reports 項目數量: ${reportsProjects.length}`);
  
  // 相機旋轉邏輯（帶緩衝區）- 參考原版
  const startBuffer = 0.05;
  const endBuffer = 0.05;
  const activeRange = 1 - startBuffer - endBuffer;

  let rotationFraction = 0;
  if (progress >= startBuffer && progress <= (1 - endBuffer)) {
    rotationFraction = (progress - startBuffer) / activeRange;
  } else if (progress > (1 - endBuffer)) {
    rotationFraction = 1;
  }

  // 計算當前應該顯示哪張圖片
  const totalProjects = reportsProjects.length;
  const currentImageIndex = Math.round(rotationFraction * (totalProjects - 1));
  const clampedIndex = Math.max(0, Math.min(currentImageIndex, totalProjects - 1));
  
  useEffect(() => {
    setCurrentSlide(clampedIndex);
  }, [clampedIndex]);

  useFrame((state, delta) => {
    if (ref.current) {
      const targetRotation = -rotationFraction * (Math.PI * 2) * 3;
      const lerpSpeed = progress > 0 ? 0.3 : 0.1;
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetRotation,
        lerpSpeed
      );
    }
  });

  if (reportsProjects.length === 0) {
    return (
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        無法載入報導資料
      </Text>
    );
  }

  return (
    <group ref={ref} rotation={[0, 0, 0.15]}>
      {reportsProjects.map((report, i) => (
        <ReportCard
          key={report.id}
          report={report}
          index={i}
          count={reportsProjects.length}
          radius={radius}
          focused={i === clampedIndex}
          onClick={onProjectClick}
          texture={loadedTextures?.get(report.path) || null}
        />
      ))}
    </group>
  );
}

// ReportsSection 組件屬性類型
interface ReportsSectionProps {
  visible: boolean;
  progress: number;
  onCurrentProjectChange?: (project: ReportData | null) => void;
}

export default function ReportsSection({ visible, progress, onCurrentProjectChange }: ReportsSectionProps) {
  const { openModal } = useStore();
  const [loadedTextures, setLoadedTextures] = useState<Map<string, THREE.Texture | null>>(new Map());
  const [loading, setLoading] = useState(true);
  
  // 從 projects.json 篩選 reports 資料
  const reportsProjects = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ) as ReportData[];
  }, []);

  // ✅ 參照原版的初始化載入邏輯 + 詳細除錯
  useEffect(() => {
    const loadAllTextures = async () => {
      console.log('🔄 開始載入所有報導媒體...');
      console.log(`📊 需要載入的項目數量: ${reportsProjects.length}`);
      setLoading(true);
      
      const textureMap = new Map<string, THREE.Texture | null>();
      let loadedCount = 0;
      let successCount = 0;
      let failureCount = 0;
      
      for (const report of reportsProjects) {
        console.log(`📸 載入項目 ${loadedCount + 1}/${reportsProjects.length}: ${report.title}`);
        console.log(`📁 檔案路徑: ${report.path}`);
        
        try {
          const texture = await loadMediaTexture(report.path);
          textureMap.set(report.path, texture);
          
          if (texture) {
            console.log(`✅ 載入成功: ${report.title}`);
            successCount++;
          } else {
            console.warn(`⚠️ 載入失敗但沒有錯誤: ${report.title}`);
            failureCount++;
          }
        } catch (error) {
          console.error(`❌ 載入過程中出現錯誤: ${report.title}`, error);
          textureMap.set(report.path, null);
          failureCount++;
        }
        
        loadedCount++;
      }
      
      console.log(`🎯 載入完成統計:`);
      console.log(`   ✅ 成功: ${successCount}/${reportsProjects.length}`);
      console.log(`   ❌ 失敗: ${failureCount}/${reportsProjects.length}`);
      console.log(`   📊 成功率: ${Math.round((successCount / reportsProjects.length) * 100)}%`);
      
      setLoadedTextures(textureMap);
      setLoading(false);
    };

    if (reportsProjects.length > 0) {
      loadAllTextures();
    }
  }, [reportsProjects]);
  
  const handleProjectClick = (report: ReportData) => {
    console.log('🎯 點擊報導:', report.title);
    // openModal(report.id, report);
  };

  // 計算當前項目用於標題顯示
  const startBuffer = 0.05;
  const endBuffer = 0.05;
  const activeRange = 1 - startBuffer - endBuffer;
  
  let rotationFraction = 0;
  if (progress >= startBuffer && progress <= (1 - endBuffer)) {
    rotationFraction = (progress - startBuffer) / activeRange;
  } else if (progress > (1 - endBuffer)) {
    rotationFraction = 1;
  }
  
  const currentImageIndex = Math.round(rotationFraction * (reportsProjects.length - 1));
  const clampedIndex = Math.max(0, Math.min(currentImageIndex, reportsProjects.length - 1));
  const currentProject = reportsProjects[clampedIndex];

  // 通知父組件當前項目變化 - 移到條件渲染之前
  useEffect(() => {
    if (onCurrentProjectChange) {
      onCurrentProjectChange(currentProject);
    }
  }, [currentProject, onCurrentProjectChange]);

  if (!visible) return null;

  // 載入中顯示
  if (loading) {
    return (
      <group>
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          載入報導中...
        </Text>
      </group>
    );
  }

  return (
    <group>
      <Carousel
        radius={2}
        progress={progress}
        onProjectClick={handleProjectClick}
        loadedTextures={loadedTextures}
      />
      
      {/* 燈光系統 - 增強為 meshStandardMaterial */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      <directionalLight
        position={[0, 5, 3]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, -2, 0]} intensity={0.6} color="#ffffff" />
    </group>
  );
}