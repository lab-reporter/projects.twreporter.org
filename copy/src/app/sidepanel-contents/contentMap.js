"use client";

import DefaultContent from './DefaultContent';

// 動態引入所有 section 相關的內容組件
const sectionModules = require.context('./projects', false, /(Reports|Innovation|Challenge)\d+Content\.jsx$/);

const contentMap = { default: DefaultContent };

// 建立 ID 到組件的映射關係
sectionModules.keys().forEach((fileName) => {
    // 從檔案名提取 section 和編號
    // 例如從 "Reports1Content.jsx" 提取 "Reports" 和 "1"
    const match = fileName.match(/(Reports|Innovation|Challenge)(\d+)Content\.jsx$/);

    if (match) {
        // 提取 section 名稱和編號
        const section = match[1].toLowerCase(); // 轉為小寫以符合 ID 格式
        const number = match[2];

        // 建立 ID，例如 "reports-1"
        const id = `${section}-${number}`;

        // 將 ID 映射到對應的組件
        contentMap[id] = sectionModules(fileName).default;
    }
});

/**
 * 根據項目ID獲取對應的內容組件
 * @param {string} projectId 項目ID，例如 "reports-1"、"innovation-2" 等
 * @returns {React.Component} 對應的內容組件，若無對應則返回預設組件
 */
export const getContentComponentByProjectId = (projectId) => {
    // 如果找到對應的內容組件，則返回該組件
    if (contentMap[projectId]) {
        return contentMap[projectId];
    }

    // 未找到對應組件時返回預設組件
    return contentMap.default;
};

export default contentMap; 