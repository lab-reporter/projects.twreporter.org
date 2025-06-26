/**
 * Innovation Section 主組件
 * 
 * 簡化的組合器，使用專責子組件處理各項功能
 */

'use client';

import { useRef, useState } from 'react';
import { useStore } from '@/stores';
import * as THREE from 'three';
import projectsData from '@/app/data/projects.json';
import InnovationModel from './InnovationModel';
import LightingSetup from './LightingSetup';
import { useFocusController, shouldItemBeFocused } from './FocusController';
import type { ModelData, InnovationSectionProps } from './types';

/**
 * Innovation Section 主組件
 */
export default function InnovationSection({ 
  visible, 
  progress, 
  onFocusedItemChange, 
  onCurrentProjectChange 
}: InnovationSectionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const { openModal } = useStore();

  // 篩選創新項目資料
  const innovationProjects = projectsData.filter((p) => {
    const hasInnovationSection = p.section && 
      (Array.isArray(p.section) ? p.section.includes('innovation') : p.section === 'innovation');
    const hasRequiredFields = 'is3DModel' in p && p.is3DModel === true && 'position' in p;
    return hasInnovationSection && hasRequiredFields;
  }) as ModelData[];

  // 聚焦控制
  const focusedItem = useFocusController(
    visible,
    progress,
    innovationProjects,
    onFocusedItemChange,
    onCurrentProjectChange
  );

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      <group ref={groupRef}>
        {innovationProjects.map((item, index) => (
          <InnovationModel
            key={item.id}
            modelData={item}
            focused={shouldItemBeFocused(item, focusedItem, hoveredItem, index)}
            onClick={(item) => openModal(item.id, item)}
            onHover={() => setHoveredItem(index)}
            onUnhover={() => setHoveredItem(null)}
          />
        ))}
      </group>

      {/* 光照系統 */}
      <LightingSetup />
    </group>
  );
} 