import { ComponentType } from 'react';
import { ContentProps } from './types';

// 動態引入內容組件
import DefaultContent from './contents/DefaultContent';

// Reports 系列組件
import Reports1Content from './contents/Reports1Content';
import Reports2Content from './contents/Reports2Content';
import Reports3Content from './contents/Reports3Content';
import Reports4Content from './contents/Reports4Content';
import Reports5Content from './contents/Reports5Content';
import Reports6Content from './contents/Reports6Content';
import Reports7Content from './contents/Reports7Content';
import Reports8Content from './contents/Reports8Content';
import Reports9Content from './contents/Reports9Content';
import Reports10Content from './contents/Reports10Content';
import Reports11Content from './contents/Reports11Content';
import Reports12Content from './contents/Reports12Content';

// Innovation 系列組件
import Innovation1Content from './contents/Innovation1Content';
import Innovation2Content from './contents/Innovation2Content';
import Innovation3Content from './contents/Innovation3Content';
import Innovation4Content from './contents/Innovation4Content';

// Enhanced 版本
import EnhancedReports3Content from './contents/EnhancedReports3Content';

// 內容組件映射表
const contentMap: Record<string, ComponentType<ContentProps>> = {
  // Reports section - 完整的 12 個報導
  'reports-1': Reports1Content,
  'reports-2': Reports2Content,
  'reports-3': Reports3Content,
  'reports-4': Reports4Content,
  'reports-5': Reports5Content,
  'reports-6': Reports6Content,
  'reports-7': Reports7Content,
  'reports-8': Reports8Content,
  'reports-9': Reports9Content,
  'reports-10': Reports10Content,
  'reports-11': Reports11Content,
  'reports-12': Reports12Content,
  
  // Innovation section - 4 個創新項目
  'innovation-1': Innovation1Content,
  'innovation-2': Innovation2Content,
  'innovation-3': Innovation3Content,
  'innovation-4': Innovation4Content,
  
  // Enhanced 版本（可選用）
  'enhanced-reports-3': EnhancedReports3Content,
  
  // 默認組件
  default: DefaultContent
};

/**
 * 根據項目 ID 獲取對應的內容組件
 * @param projectId 項目 ID，例如 'reports-1'
 * @returns React 組件
 */
export const getContentComponentByProjectId = (projectId: string): ComponentType<ContentProps> => {
  // 檢查是否有對應的組件
  if (contentMap[projectId]) {
    console.log(`✅ 找到對應內容組件: ${projectId}`);
    return contentMap[projectId];
  }
  
  console.log(`⚠️ 未找到對應內容組件，使用預設組件: ${projectId}`);
  return contentMap.default;
};

/**
 * 獲取所有可用的內容組件 ID
 * @returns 內容組件 ID 列表
 */
export const getAvailableContentIds = (): string[] => {
  return Object.keys(contentMap).filter(id => id !== 'default');
};

/**
 * 檢查是否有對應的內容組件
 * @param projectId 項目 ID
 * @returns 是否存在對應組件
 */
export const hasContentComponent = (projectId: string): boolean => {
  return contentMap.hasOwnProperty(projectId);
};