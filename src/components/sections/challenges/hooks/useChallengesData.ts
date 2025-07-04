import { useMemo } from 'react';
import projectsData from '@/app/data/projects.json';

export interface ChallengeProject {
  id: string;
  path: string;
  title: string;
  section: string[];
  bgColor?: string;
  [key: string]: unknown;
}

// 獲取挑戰數據的 hook
export const useChallengesData = () => {
  return useMemo(() => {
    interface ProjectItem {
      section: string | string[];
      [key: string]: unknown;
    }
    const challengeProjects = (projectsData as ProjectItem[]).filter((p: ProjectItem) =>
      p.section && (p.section.includes('challenge') || p.section === 'challenge')
    ) as ChallengeProject[];

    const challengeTitles = challengeProjects.map(p => p.title);

    return {
      challengeProjects,
      challengeTitles
    };
  }, []);
};