import React from 'react';
import projectsData from '../../data/projects.json';
import { getContentComponentByProjectId } from '../contentMap';

const BtnNext = ({
    currentProjectId,
    onNavigate,
    setSelectedProject,
    setSidePanelContent,
    className = ""
}) => {
    const handleNext = () => {
        // 取得所有 reports 相關的項目
        const reportsProjects = projectsData.filter(project =>
            project.section && project.section.includes('reports')
        );

        if (reportsProjects.length === 0) return;

        // 找到當前項目在 reports 中的索引
        const currentIndex = reportsProjects.findIndex(project => project.id === currentProjectId);

        // 計算下一個項目的索引（循環）
        const nextIndex = currentIndex >= reportsProjects.length - 1 ? 0 : currentIndex + 1;
        const nextProject = reportsProjects[nextIndex];

        if (nextProject) {
            // 重置滾動到頂部
            setTimeout(() => {
                const scrollContainer = document.querySelector('[data-scroll-container]');
                if (scrollContainer) {
                    scrollContainer.scrollTop = 0;
                }
            }, 100);

            // 更新項目數據
            if (setSelectedProject) {
                setSelectedProject(nextProject);
            }

            // 獲取對應的內容組件並設置側邊欄內容
            if (setSidePanelContent) {
                const ContentComponent = getContentComponentByProjectId(nextProject.id);
                setSidePanelContent({
                    ContentComponent,
                    contentProps: { projectData: nextProject }
                });
            }

            // 如果有自定義導航函數也調用它
            if (onNavigate) {
                onNavigate(nextProject);
            }
        }
    };

    return (
        <button
            onClick={handleNext}
            className={`bg-gray-300 hover:bg-gray-700 transition-colors duration-300 text-white px-4 py-2 border-[1px] border-gray-300 ${className}`}
        >
            next
        </button>
    );
};

export default BtnNext; 