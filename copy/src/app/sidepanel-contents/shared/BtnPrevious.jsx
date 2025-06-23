import React from 'react';
import projectsData from '../../data/projects.json';
import { getContentComponentByProjectId } from '../contentMap';

const BtnPrevious = ({
    currentProjectId,
    onNavigate,
    setSelectedProject,
    setSidePanelContent,
    className = ""
}) => {
    const handlePrevious = () => {
        // 取得所有 reports 相關的項目
        const reportsProjects = projectsData.filter(project =>
            project.section && project.section.includes('reports')
        );

        if (reportsProjects.length === 0) return;

        // 找到當前項目在 reports 中的索引
        const currentIndex = reportsProjects.findIndex(project => project.id === currentProjectId);

        // 計算上一個項目的索引（循環）
        const previousIndex = currentIndex <= 0 ? reportsProjects.length - 1 : currentIndex - 1;
        const previousProject = reportsProjects[previousIndex];

        if (previousProject) {
            // 重置滾動到頂部
            setTimeout(() => {
                const scrollContainer = document.querySelector('[data-scroll-container]');
                if (scrollContainer) {
                    scrollContainer.scrollTop = 0;
                }
            }, 100);

            // 更新項目數據
            if (setSelectedProject) {
                setSelectedProject(previousProject);
            }

            // 獲取對應的內容組件並設置側邊欄內容
            if (setSidePanelContent) {
                const ContentComponent = getContentComponentByProjectId(previousProject.id);
                setSidePanelContent({
                    ContentComponent,
                    contentProps: { projectData: previousProject }
                });
            }

            // 如果有自定義導航函數也調用它
            if (onNavigate) {
                onNavigate(previousProject);
            }
        }
    };

    return (
        <button
            onClick={handlePrevious}
            className={`bg-gray-300 hover:bg-gray-700 transition-colors duration-300 text-white px-4 py-2 border-[1px] border-gray-300 ${className}`}   
        >
            previous
        </button>
    );
};

export default BtnPrevious; 