export interface ReportData {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  section: string[];
  bgColor?: string;
}

export interface ContentProps {
  projectData: ReportData;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export interface AdjacentProjects {
  prev: ReportData | null;
  next: ReportData | null;
}