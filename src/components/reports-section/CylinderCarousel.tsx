'use client';

import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import projectsData from '@/app/data/projects.json';
import ReportCard, { type ReportCardProps } from './ReportCard';
import { type ReportData } from './VideoCard';

// 圓柱畫廊組件 Props
export interface CylinderCarouselProps {
  radius?: number;
  progress?: number;
  onProjectClick?: (report: ReportData) => void;
}

/**
 * 圓柱畫廊組件
 * 
 * 圓柱畫廊的核心邏輯，包含：
 * - 報導數據篩選與管理
 * - 圓柱位置計算與佈局
 * - 進度追蹤系統
 * - 聚焦項目管理
 * - 錯誤狀態處理
 */
export default function CylinderCarousel({ 
  radius = 5, 
  progress = 0, 
  onProjectClick 
}: CylinderCarouselProps) {
  // 篩選報導資料
  const reportsProjects = useMemo(() => {
    return projectsData.filter((p: any) =>
      p.section && (p.section.includes('reports') || p.section === 'reports')
    ) as ReportData[];
  }, []);
  
  // 計算當前聚焦項目
  const currentImageIndex = Math.round(progress * (reportsProjects.length - 1));
  const clampedIndex = Math.max(0, Math.min(currentImageIndex, reportsProjects.length - 1));

  // 錯誤狀態處理
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