'use client';

import ChallengesIntro from './ChallengesIntro';
import ChallengeItem from './ChallengeItem';
import { ChallengeProject } from './hooks/useChallengesData';

interface ChallengesSliderProps {
  challengeProjects: ChallengeProject[];
  onChallengeClick: (title: string) => void;
  className?: string;
}

export default function ChallengesSlider({
  challengeProjects,
  onChallengeClick,
  className = ''
}: ChallengesSliderProps) {
  return (
    <div
      className={`absolute top-0 left-0 h-screen flex will-change-transform ${className}`}
      data-challenges-container
    >
      {/* 開場介紹區塊 */}
      <ChallengesIntro />

      {/* 挑戰項目 */}
      {challengeProjects.map((challenge, index) => (
        <ChallengeItem
          key={challenge.id}
          title={challenge.title}
          onClick={onChallengeClick}
        />
      ))}
    </div>
  );
}