'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { useStore } from '@/stores';
import projectsData from '@/app/data/projects.json';

// 報導資料類型
interface ReportData {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  section: string[];
  bgColor?: string;
}

// 彎曲平面幾何 - 基於原始 Combined3DScene 的實作
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(width: number, height: number, cylinderRadius: number, segments: number = 15) {
    // 計算合適的分段數
    const segmentsX = segments * 6; // X軸分段數：90
    const segmentsY = Math.floor(height * 15); // Y軸分段數：根據高度計算
    
    super(width, height, segmentsX, segmentsY);
    
    // 計算彎曲角度 - 照片寬度與圓柱半徑的關係
    const theta = (width / cylinderRadius) * 1.2; // 1.2 係數增加彎曲效果
    
    const position = this.attributes.position;
    const uv = this.attributes.uv;
    
    // 遍歷所有頂點重新計算位置
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      
      // 計算 X 軸上的角度比例 (-0.5 到 0.5)
      const xRatio = x / width;
      const xAngle = xRatio * theta;
      
      // 計算圓弧上的新位置
      const newX = Math.sin(xAngle) * cylinderRadius;
      const newZ = Math.cos(xAngle) * cylinderRadius - cylinderRadius; // 減去半徑使中心在原點
      
      position.setXYZ(i, newX, y, newZ);
      
      // 調整 UV 座標避免邊緣拉伸
      const u = uv.getX(i);
      const v = uv.getY(i);
      uv.setXY(i, u * 0.8 + 0.1, v); // U 座標留 10% 邊距
    }
    
    position.needsUpdate = true;
    uv.needsUpdate = true;
    this.computeVertexNormals(); // 重新計算法向量
  }
}

// 註冊自定義幾何體
extend({ BentPlaneGeometry });

// 影片卡片組件
interface VideoCardProps {
  report: ReportData;
  position: [number, number, number];
  rotation: [number, number, number];
  hovered: boolean;
  onPointerOver: (e: any) => void;
  onPointerOut: () => void;
  onClick: () => void;
  imageWidth: number;
  imageHeight: number;
  cylinderRadius: number;
}

function VideoCard({ report, position, rotation, hovered, onPointerOver, onPointerOut, onClick, imageWidth, imageHeight, cylinderRadius }: VideoCardProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('🎥 開始載入影片:', report.path);
    setLoading(true);
    
    const videoElement = document.createElement('video');
    // 測試絕對路徑
    const absolutePath = `http://localhost:3001${report.path}`;
    console.log('🔗 使用絕對路徑:', absolutePath);
    videoElement.src = absolutePath;
    // 移除 crossOrigin 設定以避免 CORS 問題
    // videoElement.crossOrigin = 'anonymous';
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.autoplay = false;
    videoElement.preload = 'metadata';
    
    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.flipY = false;
    
    // 多個事件監聽器確保載入
    const handleCanPlay = () => {
      console.log('✅ 影片可以播放:', report.path);
      videoElement.currentTime = 1; // 跳到第一秒確保有內容
      setTexture(videoTexture);
      setLoading(false);
      
      // 嘗試播放
      const playPromise = videoElement.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.log('影片自動播放被阻擋:', error);
        });
      }
    };
    
    const handleError = (event: any) => {
      console.error('❌ 影片載入失敗:', report.path, event);
      setTexture(null);
      setLoading(false);
    };
    
    const handleLoadStart = () => {
      console.log('🔄 影片開始載入:', report.path);
    };
    
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadedmetadata', () => {
      console.log('📊 影片元數據載入完成:', report.path);
    });
    
    // 超時處理
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ 影片載入超時:', report.path);
        setTexture(null);
        setLoading(false);
      }
    }, 10000);
    
    return () => {
      clearTimeout(timeout);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.pause();
      videoElement.src = '';
      videoTexture.dispose();
    };
  }, [report.path, loading]);

  useFrame((state, delta) => {
    if (ref.current) {
      easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    }
  });
  
  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <bentPlaneGeometry args={[imageWidth, imageHeight, cylinderRadius, 15]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.DoubleSide} 
        toneMapped={false}
        color={loading ? '#444444' : (texture ? '#ffffff' : '#ff0000')}
      />
    </mesh>
  );
}

// 報導卡片組件
interface ReportCardProps {
  report: ReportData;
  index: number;
  count: number;
  radius?: number;
  focused?: boolean;
  onClick?: (report: ReportData) => void;
}

function ReportCard({ report, index, count, radius = 5, focused = false, onClick }: ReportCardProps) {
  const ref = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  
  // 根據原始 Combined3DScene 計算照片尺寸
  const calculateImageSize = () => {
    const circumference = 2 * Math.PI * radius;
    const availableSpacePerImage = circumference / count;
    const imageWidth = availableSpacePerImage * 0.75; // 75% 避免重疊
    const imageHeight = imageWidth * 0.8; // 4:5 比例
    
    return {
      width: Math.max(imageWidth, 1.5), // 最小寬度
      height: Math.max(imageHeight, 1.0) // 最小高度
    };
  };
  
  const { width: imageWidth, height: imageHeight } = calculateImageSize();
  
  // 計算位置
  const angle = (index / count) * Math.PI * 2;
  const position: [number, number, number] = [
    Math.sin(angle) * radius,
    0,
    Math.cos(angle) * radius
  ];
  const rotation: [number, number, number] = [0, Math.PI + angle, 0];
  
  // 檢測是否為影片檔案
  const fileExtension = report.path.split('.').pop()?.toLowerCase() || '';
  const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];
  const isVideo = videoFormats.includes(fileExtension);
  
  const pointerOver = (e: any) => {
    e?.stopPropagation?.();
    setHovered(true);
  };
  
  const pointerOut = () => setHovered(false);
  const handleClick = () => onClick?.(report);

  useFrame((state, delta) => {
    if (ref.current && !isVideo) {
      // 只對圖片卡片應用簡化的縮放動畫
      easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
      // 移除 material 動畫以避免尺寸震動
    }
  });

  return (
    <group>
      {isVideo ? (
        <VideoCard
          report={report}
          position={position}
          rotation={rotation}
          hovered={hovered}
          onPointerOver={pointerOver}
          onPointerOut={pointerOut}
          onClick={handleClick}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          cylinderRadius={radius}
        />
      ) : (
        <Image
          ref={ref}
          url={report.path}
          position={position}
          rotation={rotation}
          transparent
          side={THREE.DoubleSide}
          onPointerOver={pointerOver}
          onPointerOut={pointerOut}
          onClick={handleClick}
          scale={1}
          zoom={1}
          radius={0}
        >
          <bentPlaneGeometry args={[imageWidth, imageHeight, radius, 15]} />
        </Image>
      )}
      
      {/* 移除照片底下的標題顯示 */}
    </group>
  );
}

// Rig 組件 - 負責旋轉控制
interface RigProps {
  children: React.ReactNode;
  progress: number;
}

function Rig({ children, progress }: RigProps) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (ref.current) {
      // 根據滾動進度旋轉 - 調整為1圈
      const rotationY = -progress * (Math.PI * 2); // 1圈
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        rotationY,
        0.1
      );
    }
  });

  return (
    <group ref={ref} rotation={[0, 0, 0.15]}>
      {children}
    </group>
  );
}

// 圓柱畫廊組件
interface CarouselProps {
  radius?: number;
  progress?: number;
  onProjectClick?: (report: ReportData) => void;
}

function Carousel({ radius = 5, progress = 0, onProjectClick }: CarouselProps) {
  // 篩選報導資料
  const reportsProjects = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ) as ReportData[];
  }, []);
  
  // 計算當前聚焦項目
  const currentImageIndex = Math.round(progress * (reportsProjects.length - 1));
  const clampedIndex = Math.max(0, Math.min(currentImageIndex, reportsProjects.length - 1));

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
    <>
      {reportsProjects.map((report, i) => (
        <ReportCard
          key={report.id}
          report={report}
          index={i}
          count={reportsProjects.length}
          radius={radius}
          focused={i === clampedIndex}
          onClick={onProjectClick}
        />
      ))}
    </>
  );
}

// 主要組件
interface ReportsSectionProps {
  visible: boolean;
  progress: number;
  onCurrentProjectChange?: (project: ReportData | null) => void;
}

export default function ReportsSection({ visible, progress, onCurrentProjectChange }: ReportsSectionProps) {
  const { openModal } = useStore();
  
  // 篩選報導資料
  const reportsProjects = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ) as ReportData[];
  }, []);
  
  const handleProjectClick = (report: ReportData) => {
    console.log('點擊報導:', report.title);
    // openModal(report.id, report);
  };

  // 計算當前項目
  const currentImageIndex = Math.round(progress * (reportsProjects.length - 1));
  const clampedIndex = Math.max(0, Math.min(currentImageIndex, reportsProjects.length - 1));
  const currentProject = reportsProjects[clampedIndex];

  // 通知父組件當前項目變化
  useEffect(() => {
    onCurrentProjectChange?.(currentProject);
  }, [currentProject, onCurrentProjectChange]);

  if (!visible) return null;

  return (
    <group>
      <Rig progress={progress}>
        <Carousel
          radius={5}
          progress={progress}
          onProjectClick={handleProjectClick}
        />
      </Rig>
      
      {/* 簡化燈光系統 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
    </group>
  );
}

// 擴展 THREE.js 幾何體類型
declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: any;
    }
  }
}