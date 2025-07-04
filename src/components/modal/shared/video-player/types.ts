export interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onError?: (error: Event) => void;
}

export interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  title?: string;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onToggleFullscreen: () => void;
}

export interface VideoProgressBarProps {
  currentTime: number;
  duration: number;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface VideoControlButtonsProps {
  isPlaying: boolean;
  isMuted: boolean;
  title?: string;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export interface VideoErrorStateProps {
  className?: string;
  onReload: () => void;
}

export interface VideoLoadingStateProps {
  className?: string;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  hasError: boolean;
}

export interface VideoPlayerActions {
  togglePlay: () => Promise<void>;
  toggleMute: () => void;
  reload: () => void;
  toggleFullscreen: () => void;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (time: number) => string;
} 