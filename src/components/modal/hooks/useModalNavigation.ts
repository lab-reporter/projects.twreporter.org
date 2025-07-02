import { useMemo } from 'react';
import { useStore } from '@/stores';
import { getAdjacentProjects } from '../utils';
import projectsData from '@/app/data/projects.json';

export const useModalNavigation = () => {
    const { modal, openModal } = useStore();

    // 根據當前項目的 section 篩選同類型項目
    const sameTypeProjects = useMemo(() => {
        const dataToUse = modal.data;
        if (!dataToUse) return [];

        const currentSection = Array.isArray(dataToUse.section)
            ? dataToUse.section[0]
            : dataToUse.section;

        return projectsData.filter((p: any) => {
            if (!p.section) return false;
            const pSection = Array.isArray(p.section) ? p.section[0] : p.section;
            return pSection === currentSection;
        });
    }, [modal.data]);

    // 計算相鄰項目
    const adjacentProjects = useMemo(() => {
        const dataToUse = modal.data;
        if (!dataToUse) {
            return { prev: null, next: null };
        }
        return getAdjacentProjects(dataToUse, sameTypeProjects as any);
    }, [modal.data, sameTypeProjects]);

    // 處理導航
    const handleNavigate = (direction: 'prev' | 'next') => {
        const targetProject = direction === 'prev' ? adjacentProjects.prev : adjacentProjects.next;
        if (targetProject) {
            openModal(targetProject.id, targetProject);
        }
    };

    return {
        adjacentProjects,
        handleNavigate
    };
}; 