import { type ProjectData } from '@/utils/responsiveImage';

export interface ContentProps {
  projectData: ProjectData;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  adjacentProjects: AdjacentProjects;
  scrollContainer?: HTMLElement | null;
}

export interface AdjacentProjects {
  prev: ProjectData | null;
  next: ProjectData | null;
}