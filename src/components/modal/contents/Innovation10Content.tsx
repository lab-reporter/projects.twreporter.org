'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation10Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-10/innovation-10-1.webm"
            alt="《報導者》AI 國會觀測站"
            className=""
          />
          <Shared.SlideTextCard
            text="《報導者》結合AI與國會採訪經驗，打造聚焦民代問政的分析平台。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-10/innovation-10-1.webm"
            alt="《報導者》AI 國會觀測站"
            className=""
          />
          <Shared.SlideTextCard
            text="2024立委選舉前首度推出立委發言分析，在社群造成巨大迴響，展現公眾對政治理解的高度渴望。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-10/innovation-10-2.webm"
            alt="《報導者》AI 國會觀測站"
            className=""
          />
          <Shared.SlideTextCard
            text="2025年進一步推出「報導者觀測站」，提供即時搜尋、摘要與跨議題查詢的民代監督工具。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-10/innovation-10-2.webm"
            alt="《報導者》AI 國會觀測站"
            className=""
          />
          <Shared.SlideTextCard
            text="透過數位科技縮小民主政治的資訊落差，希望藉此強化公民監督的力量、深化媒體的公共性。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="新聞遊戲是《報導者》邁向沉浸式敘事的開端，如果你還沒玩過，歡迎點我體驗！"
            className="object-contain flex-shrink-0"
          />
          <Shared.SlideTextCard
            text="新聞遊戲是《報導者》邁向沉浸式敘事的開端，如果你還沒玩過，歡迎點我體驗！"
            className="bottom-32"
          />
          <div className="absolute bottom-4 left-0 right-0">
            <Shared.ModalDonate onClose={onClose} />
          </div>
        </Shared.InnovationSlide>
      </Shared.InnovationSlidesContainer>
    </div>
  );
} 