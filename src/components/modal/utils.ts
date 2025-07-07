import { ReportData, AdjacentProjects } from './types';

/**
 * 根據當前項目計算前一個和下一個項目（支援循環導航）
 * @param currentProject 當前項目
 * @param allProjects 所有項目列表
 * @returns 前一個和下一個項目
 */
export const getAdjacentProjects = (
  currentProject: ReportData,
  allProjects: ReportData[]
): AdjacentProjects => {
  if (!currentProject || !allProjects || allProjects.length === 0) {
    return { prev: null, next: null };
  }

  // 如果只有一個項目，沒有上一則和下一則
  if (allProjects.length === 1) {
    return { prev: null, next: null };
  }

  const currentIndex = allProjects.findIndex(project => project.id === currentProject.id);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // 循環導航邏輯
  // 上一則：如果是第一個項目，則上一則為最後一個項目
  const prevIndex = currentIndex === 0 ? allProjects.length - 1 : currentIndex - 1;
  const prev = allProjects[prevIndex];

  // 下一則：如果是最後一個項目，則下一則為第一個項目  
  const nextIndex = currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1;
  const next = allProjects[nextIndex];

  return { prev, next };
};

/**
 * 根據方向獲取相鄰項目
 * @param currentProject 當前項目
 * @param allProjects 所有項目列表
 * @param direction 方向
 * @returns 相鄰項目或 null
 */
export const getAdjacentProject = (
  currentProject: ReportData,
  allProjects: ReportData[],
  direction: 'prev' | 'next'
): ReportData | null => {
  const adjacent = getAdjacentProjects(currentProject, allProjects);
  return direction === 'prev' ? adjacent.prev : adjacent.next;
};

/**
 * 檢查項目是否為影片類型
 * @param project 項目資料
 * @returns 是否為影片
 */
export const isVideoProject = (project: ReportData): boolean => {
  if (!project.path) return false;

  const fileExtension = project.path.split('.').pop()?.toLowerCase() || '';
  const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];
  return videoFormats.includes(fileExtension);
};

/**
 * 格式化項目標籤
 * @param sections 項目分類陣列
 * @returns 格式化後的標籤陣列
 */
export const formatProjectTags = (sections: string[]): string[] => {
  const tagMap: Record<string, string> = {
    'reports': '深度報導',
    'innovation': '多元創新',
    'challenge': '挑戰'
  };

  return sections.map(section => tagMap[section] || section);
};