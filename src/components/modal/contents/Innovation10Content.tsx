'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';


export default function Innovation10Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, scrollContainer, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        <Shared.InnovationSlide className="flex items-center justify-center">
          <Shared.SlideIframe
            src="https://flo.uri.sh/visualisation/16352841/embed?auto=1"
          />
          <Shared.SlideTextCard
            text="2024立委選舉期間，《報導者》推出立委發言分析報導，在社群造成廣大迴響，顯示公眾對政治理解的高度渴望。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex items-center justify-center">
          <Shared.SlideIframe
            src="https://lawmaker.twreporter.org/"
          />
          <Shared.SlideTextCard
            text="2025年，我們進一步推出「報導者觀測站」，提供即時搜尋、摘要與跨議題查詢的民代監督工具。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-10/innovation-10-3.webp"
            alt="我們運用 A 技術將近4萬筆立委的發言紀錄進行議題分類與摘要，讓議場上的對話不再只是即時新聞中的破碎資訊，或像卷宗般束之高閣。"
            className="object-contain"
          />
          <Shared.SlideTextCard
            text="我們運用 AI 技術將近4萬筆立委的發言紀錄進行議題分類與摘要，讓議場上的對話不再只是即時新聞中的破碎資訊，或像卷宗般束之高閣。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="想知道你家立委關心什麼？你關注的議題有誰在討論？一起關注「報導者觀測站」，用數位科技強化公民與媒體監督的力量。"
            className="object-contain flex-shrink-0"
          />
          <Shared.SlideTextCard
            text="想知道你家立委關心什麼？你關注的議題有誰在討論？一起關注「報導者觀測站」，用數位科技強化公民與媒體監督的力量。"
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