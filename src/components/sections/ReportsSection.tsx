'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/stores';
import { gsap } from 'gsap';

// 報導資料類型
interface ReportData {
  id: string;
  path: string;
  title: string;
  subtitle: string;
}

// 報導資料 - 使用真實圖片
const reportsData: ReportData[] = [
  {
    id: "reports-1",
    path: "/assets/report-1綁債．黑工．留學陷阱.jpg",
    title: "綁債．黑工．留學陷阱",
    subtitle: "失控的高教技職國際招生"
  },
  {
    id: "reports-2", 
    path: "/assets/六輕環境難民。.jpg",
    title: "六輕環境難民",
    subtitle: "科學戰爭下的環境難民"
  },
  {
    id: "reports-3",
    path: "/assets/廢墟裡的少年_(攝影余志偉).jpg", 
    title: "廢墟裡的少年",
    subtitle: "兩萬名被遺忘的高風險家庭孩子們"
  },
  {
    id: "reports-4",
    path: "/assets/笑氣濫用_(攝影蔡耀徵).jpg",
    title: "笑氣濫用風暴", 
    subtitle: "從娛樂用藥到社會問題"
  },
  {
    id: "reports-5",
    path: "/assets/國家不願面對的真相：獨家揭露台鐵體檢報告。（攝影蘇威銘）.jpg",
    title: "國家不願面對的真相",
    subtitle: "獨家揭露台鐵體檢報告"
  },
  {
    id: "reports-6",
    path: "/assets/中國虎視下的島鏈──沖繩如何成為台海危機的熱點.jpg",
    title: "中國虎視下的島鏈",
    subtitle: "沖繩如何成為台海危機的熱點"
  },
  {
    id: "reports-7",
    path: "/assets/出口禁令下的紅線交易──揭開MIT工具機流入俄羅斯軍工業隱蹤.png",
    title: "出口禁令下的紅線交易",
    subtitle: "揭開MIT工具機流入俄羅斯軍工業隱蹤"
  },
  {
    id: "reports-8",
    path: "/assets/img1.png",
    title: "更多調查報導",
    subtitle: "深度調查專題"
  }
];

// 報導卡片組件屬性類型
interface ReportCardProps {
  report: ReportData;
  index: number;
  count: number;
  radius?: number;
  focused?: boolean;
  onClick?: (report: ReportData) => void;
}

// 報導卡片組件 (基於 codesandbox Card 組件)
function ReportCard({ report, index, count, radius = 1.4, focused = false, onClick }: ReportCardProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // 計算位置 (基於 codesandbox)
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
      // 基於 codesandbox 的動畫效果
      const targetScale = (hovered || focused) ? 1.15 : 1;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // 聚焦卡片的輕微浮動效果
      if (focused) {
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0, 0.1);
      }
    }
  });

  return (
    <group position={[x, 0, z]} rotation={rotation}>
      <Image
        ref={ref}
        url={report.path}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        onClick={handleClick}
      />
      
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
  count?: number;
  progress?: number;
  onProjectClick?: (report: ReportData) => void;
}

// 主要 Carousel 組件 (基於 Combined3DScene.jsx 的旋轉機制)
function Carousel({ radius = 1.4, count = 8, progress = 0, onProjectClick }: CarouselProps) {
  const ref = useRef<THREE.Group>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 🔄 相機旋轉邏輯（帶緩衝區）- 基於 Combined3DScene.jsx
  const startBuffer = 0.05;   // 開始5%為緩衝區，不旋轉
  const endBuffer = 0.05;     // 結束5%為緩衝區，不旋轉
  const activeRange = 1 - startBuffer - endBuffer; // 中間90%為有效旋轉區間

  let rotationFraction = 0;   // 旋轉比例，0-1之間
  if (progress >= startBuffer && progress <= (1 - endBuffer)) {
    // 在有效區間內，計算旋轉比例
    rotationFraction = (progress - startBuffer) / activeRange;
  } else if (progress > (1 - endBuffer)) {
    // 超過結束緩衝區，保持最大旋轉
    rotationFraction = 1;
  }

  // 🎯 計算當前應該顯示哪張圖片
  const totalProjects = reportsData.length;
  const currentImageIndex = Math.round(rotationFraction * (totalProjects - 1));
  const clampedIndex = Math.max(0, Math.min(currentImageIndex, totalProjects - 1));
  
  // 更新當前幻燈片索引
  useEffect(() => {
    setCurrentSlide(clampedIndex);
  }, [clampedIndex]);

  useFrame((state, delta) => {
    if (ref.current) {
      // 基於滾動進度的旋轉 - 參考 Combined3DScene.jsx
      // 注意：這裡是旋轉整個圓柱體，而不是相機
      // 增加旋轉範圍，讓效果更明顯
      const targetRotation = -rotationFraction * (Math.PI * 2) * 3; // 增加到3圈
      
      // 使用更快的 lerp 速度實現即時響應
      const lerpSpeed = progress > 0 ? 0.3 : 0.1; // 有滾動時加速響應
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetRotation,
        lerpSpeed
      );
      
      // 除錯資訊 - 每60幀輸出一次以確認 useFrame 在運行
      if (Math.floor(state.clock.elapsedTime * 60) % 60 === 0) {
        console.log(`🔄 useFrame 運行中 - progress: ${progress.toFixed(3)}, targetRotation: ${(targetRotation * 180 / Math.PI).toFixed(1)}°, currentRotation: ${(ref.current.rotation.y * 180 / Math.PI).toFixed(1)}°`);
      }
      
      // 更新射線檢測
      state.events?.update?.();
    }
  });

  return (
    <group ref={ref} rotation={[0, 0, 0.15]}>
      {Array.from({ length: count }, (_, i) => (
        <ReportCard
          key={i}
          report={reportsData[i % reportsData.length]}
          index={i}
          count={count}
          radius={radius}
          focused={i === clampedIndex}
          onClick={onProjectClick}
        />
      ))}
    </group>
  );
}

// ReportsSection 組件屬性類型
interface ReportsSectionProps {
  visible: boolean;
  progress: number;
}

export default function ReportsSection({ visible, progress }: ReportsSectionProps) {
  const { openModal } = useStore();
  
  const handleProjectClick = (report: ReportData) => {
    console.log('🎯 點擊報導:', report.title);
    // 這裡可以開啟 Modal 或 SidePanel
    // openModal(report.id, report);
  };

  if (!visible) return null;

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
  
  const currentImageIndex = Math.round(rotationFraction * (reportsData.length - 1));
  const clampedIndex = Math.max(0, Math.min(currentImageIndex, reportsData.length - 1));
  const currentProject = reportsData[clampedIndex];

  // 除錯資訊 - 簡化輸出
  if (visible) {
    console.log(`🎠 ReportsSection VISIBLE - progress: ${progress.toFixed(3)}, rotationFraction: ${rotationFraction.toFixed(3)}, currentIndex: ${clampedIndex}`);
  }

  return (
    <group>
      {/* 標題 */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="#ff6b6b"
        anchorX="center"
        anchorY="middle"
      >
        影響力報導
      </Text>
      
      {/* 3D 圓柱畫廊 */}
      <Carousel 
        radius={1.4} 
        count={8} 
        progress={progress} 
        onProjectClick={handleProjectClick}
      />
      
      {/* 當前報導資訊顯示 */}
      {currentProject && (
        <group position={[0, -3, 0]}>
          <Text
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={6}
            textAlign="center"
          >
            {currentProject.title}
          </Text>
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.25}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            maxWidth={8}
            textAlign="center"
          >
            {currentProject.subtitle}
          </Text>
          
          {/* 進度指示器 */}
          <group position={[0, -1.2, 0]}>
            <Text
              fontSize={0.2}
              color="#999999"
              anchorX="center"
              anchorY="middle"
            >
              {`${clampedIndex + 1} / ${reportsData.length}`}
            </Text>
          </group>
        </group>
      )}
      
      {/* 動態聚光燈系統 */}
      <spotLight
        position={[0, 5, 3]}
        angle={Math.PI * 0.3}
        penumbra={0.1}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />
      
      {/* 環境照明增強 */}
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#4ecdc4" />
      <pointLight position={[0, -2, 0]} intensity={0.3} color="#ff6b6b" />
    </group>
  );
}