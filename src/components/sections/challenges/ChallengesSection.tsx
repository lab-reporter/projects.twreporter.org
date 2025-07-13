'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { useStore } from '@/stores';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMouseTracking3D } from '@/hooks/useMouseTracking3D';
import { useChallengesData } from './hooks/useChallengesData';
import { useChallengesScroll } from './hooks/useChallengesScroll';
import ChallengesSlider from './ChallengesSlider';
import ChallengesBackground from './ChallengesBackground';
import projectsData from '@/app/data/projects.json';

export default function ChallengesSection() {
  const { openModal } = useStore();
  const { challengeProjects } = useChallengesData();
  const imagesRef = useRef<HTMLDivElement>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  // 3D 容器引用
  const perspectiveContainerRef = useRef<HTMLDivElement>(null);
  
  // 使用視窗可見性偵測
  const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  // 使用 useMouseTracking3D 控制 perspectiveOrigin
  useMouseTracking3D({
    enabled: isVisible,
    targetRef: perspectiveContainerRef,
    useLerp: true,
    lerpFactor: 0.15,
    cssProperty: 'perspectiveOrigin'
  });

  // 計算容器高度：(挑戰數量 + 1) * 100vh
  const containerHeight = useMemo(() => {
    const totalSections = challengeProjects.length + 1; // +1 for intro
    return `${totalSections * 100}vh`;
  }, [challengeProjects.length]);

  // 註冊 section 狀態追蹤
  useScrollTrigger({
    sectionId: 'section-challenges',
    sectionName: 'challenges'
  });

  // 處理挑戰項目點擊
  const handleChallengeClick = (title: string) => {
    // 根據標題查找對應的項目數據
    interface ProjectItem {
      id: string;
      title: string;
      section: string | string[];
      [key: string]: unknown;
    }
    const projectData = (projectsData as ProjectItem[]).find((p: ProjectItem) =>
      p.title === title &&
      p.section &&
      (p.section.includes('challenge') || p.section === 'challenge')
    );

    if (projectData) {
      openModal(projectData.id, projectData);
    }
  };

  // 初始化滾動控制
  const { scrollProgress } = useChallengesScroll({
    challengeProjects,
    onChallengeClick: handleChallengeClick,
    onProjectIndexChange: useCallback((index: number) => {
      setCurrentProjectIndex(index);
    }, [])
  });

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: containerHeight }}
      id="section-challenges"
    >
      {/* Sticky 容器 */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 3D 容器 - 添加 perspectiveOrigin 控制 */}
        <div
          ref={perspectiveContainerRef}
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '2000px',
            perspectiveOrigin: 'center center' // 初始值，會被 useMouseTracking3D 更新
          }}
        >
          {/* 水平滑動容器 */}
          <ChallengesSlider
            challengeProjects={challengeProjects}
            onChallengeClick={handleChallengeClick}
          />

          {/* 背景照片動畫 */}
          <ChallengesBackground
            ref={imagesRef}
            currentProjectIndex={currentProjectIndex}
            scrollProgress={scrollProgress}
          />
        </div>
      </div>
    </div>
  );
}