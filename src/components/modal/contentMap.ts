import { ComponentType } from 'react';
import { ContentProps } from './types';

// 動態引入內容組件
import DefaultContent from './contents/DefaultContent';
import Reports1Content from './contents/Reports1Content';
import Reports3Content from './contents/Reports3Content';

// 內容組件映射表
const contentMap: Record<string, ComponentType<ContentProps>> = {
  // Reports section
  'reports-1': Reports1Content,
  'reports-3': Reports3Content,
  
  // 可以繼續添加更多組件
  // 'reports-2': Reports2Content,
  // 'innovation-1': Innovation1Content,
  
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