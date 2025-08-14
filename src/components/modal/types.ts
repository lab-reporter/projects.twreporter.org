export interface ReportData {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  section: string[];
  bgColor?: string;
  imageSRC?: string; // 新增 imageSRC 屬性用於優化載入
  [key: string]: unknown;
}

export interface ContentProps {
  projectData: ReportData;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  adjacentProjects: AdjacentProjects;
  scrollContainer?: HTMLElement | null;
}

export interface AdjacentProjects {
  prev: ReportData | null;
  next: ReportData | null;
}