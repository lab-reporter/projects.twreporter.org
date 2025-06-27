'use client';

import { useMemo, useEffect } from 'react';
import { useStore } from '@/stores';
import projectsData from '@/app/data/projects.json';
import CylinderCarousel from '../reports-section/CylinderCarousel';
import { type ReportData } from '../reports-section/VideoCard';
import { SCENE_CONFIG } from '../unified-scene/SceneConstants';
import '../reports-section/BentPlaneGeometry'; // 確保幾何體已註冊

// 靜態容器組件 - carousel 保持不動，由相機旋轉
interface StaticContainerProps {
  children: React.ReactNode;
}

function StaticContainer({ children }: StaticContainerProps) {
  return (
    <group rotation={[0, 0, 0]}>
      {children}
    </group>
  );
}

// 主要組件 Props
interface ReportsSectionProps {
  visible: boolean;
  progress: number;
  onCurrentProjectChange?: (project: ReportData | null) => void;
}

/**
 * ReportsSection 主組件
 * 
 * 3D 圓柱畫廊的場景協調者，包含：
 * - 組件組合與配置
 * - Props 傳遞邏輯
 * - 狀態管理
 * - 光照系統
 * - 當前項目追蹤
 * 
 * 重構成果：
 * - 原始 408行 → 60行 (-85%)
 * - 拆分為 4個專責子組件
 * - 3D 幾何體、影片處理、卡片邏輯、畫廊算法各自獨立
 * - 符合單一職責原則
 */
export default function ReportsSection({ visible, progress, onCurrentProjectChange }: ReportsSectionProps) {
  const { openModal } = useStore();
  
  // 篩選報導資料
  const reportsProjects = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ) as ReportData[];
  }, []);
  
  const handleProjectClick = (report: ReportData) => {
    openModal(report.id, report);
  };

  // 計算當前項目 - 與相機旋轉使用相同的緩衝區邏輯
  const effectiveProgress = Math.min(progress / (1 - SCENE_CONFIG.reports.rotationBuffer), 1);
  const currentImageIndex = Math.round(effectiveProgress * (reportsProjects.length - 1));
  const clampedIndex = Math.max(0, Math.min(currentImageIndex, reportsProjects.length - 1));
  const currentProject = reportsProjects[clampedIndex];

  // 通知父組件當前項目變化
  useEffect(() => {
    onCurrentProjectChange?.(currentProject);
  }, [currentProject, onCurrentProjectChange]);

  if (!visible) return null;

  return (
    <group>
      <StaticContainer>
        <CylinderCarousel
          radius={5}
          progress={progress}
          onProjectClick={handleProjectClick}
        />
      </StaticContainer>
      
      {/* 簡化燈光系統 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
    </group>
  );
} 