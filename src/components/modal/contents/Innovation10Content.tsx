'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation10Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        {/* 第一頁：Banner */}
        <Shared.InnovationSlide>
          <Shared.InnovationBanner
            videoSrc={projectData.path}
            title={projectData.title}
            subtitle={projectData.subtitle}
          />
        </Shared.InnovationSlide>

        {/* 第二頁：AI與國會採訪結合 */}
        <Shared.InnovationSlide className="relative p-8">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-10/innovation-10-1.webm"
            alt="《報導者》AI 國會觀測站"
          />
          <Shared.SlideTextCard
            text="《報導者》結合AI與國會採訪經驗，打造聚焦民代問政的分析平台。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第三頁：立委發言分析首度推出 */}
        <Shared.InnovationSlide className="relative p-8">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-10/innovation-10-1.webm"
            alt="《報導者》AI 國會觀測站"
          />
          <Shared.SlideTextCard
            text="2024立委選舉前首度推出立委發言分析，在社群造成巨大迴響，展現公眾對政治理解的高度渴望。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第四頁：報導者觀測站 */}
        <Shared.InnovationSlide className="relative p-8">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-10/innovation-10-2.webm"
            alt="《報導者》AI 國會觀測站"
          />
          <Shared.SlideTextCard
            text="2025年進一步推出「報導者觀測站」，提供即時搜尋、摘要與跨議題查詢的民代監督工具。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第五頁：強化公民監督 */}
        <Shared.InnovationSlide className="relative p-8">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-10/innovation-10-2.webm"
            alt="《報導者》AI 國會觀測站"
          />
          <Shared.SlideTextCard
            text="透過數位科技縮小民主政治的資訊落差，希望藉此強化公民監督的力量、深化媒體的公共性。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 最後一頁：導航控制 */}
        <Shared.InnovationSlide>
          <div className="flex items-center justify-center h-full bg-white">
            <Shared.NavigationControls
              onNavigate={onNavigate}
              adjacentProjects={adjacentProjects}
            />
          </div>
        </Shared.InnovationSlide>
      </Shared.InnovationSlidesContainer>
    </div>
  );
} 