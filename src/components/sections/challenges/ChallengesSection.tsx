'use client';

import { useRef, useMemo } from 'react';
import { useStore } from '@/stores';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useChallengesData } from './hooks/useChallengesData';
import { useChallengesScroll } from './hooks/useChallengesScroll';
import ChallengesSlider from './ChallengesSlider';
import ChallengesBackground from './ChallengesBackground';
import projectsData from '@/app/data/projects.json';

export default function ChallengesSection() {
  const { openModal } = useStore();
  const { challengeProjects } = useChallengesData();
  const imagesRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 計算容器高度：(挑戰數量 + 1) * 100vh
  const containerHeight = useMemo(() => {
    const totalSections = challengeProjects.length + 1; // +1 for intro
    return `${totalSections * 100}vh`;
  }, [challengeProjects.length]);

  // 註冊 section 狀態追蹤
  useScrollTrigger({
    sectionId: 'challenges-section',
    sectionName: 'challenges'
  });

  // 處理挑戰項目點擊
  const handleChallengeClick = (title: string) => {
    // 根據標題查找對應的項目數據
    const projectData = projectsData.find((p: any) =>
      p.title === title &&
      p.section &&
      (p.section.includes('challenge') || p.section === 'challenge')
    );

    if (projectData) {
      openModal(projectData.id, projectData);
    }
  };

  // 初始化滾動控制
  useChallengesScroll({
    challengeProjects,
    onChallengeClick: handleChallengeClick
  });

  return (
    <div
      className="relative"
      style={{ height: containerHeight }}
      id="challenges-section"
    >
      {/* Sticky 容器 */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 水平滑動容器 */}
        <ChallengesSlider
          challengeProjects={challengeProjects}
          onChallengeClick={handleChallengeClick}
        />

        {/* 背景照片動畫 */}
        <ChallengesBackground ref={imagesRef} />
      </div>
    </div>
  );
}