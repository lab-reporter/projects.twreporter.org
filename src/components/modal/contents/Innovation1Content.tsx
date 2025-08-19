'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';
import image from 'next/image';

export default function Innovation1Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        <Shared.InnovationSlide>
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-1/innovation-1-1.webp"
            alt="2015年6月八仙塵爆後，台灣急診室壅塞的問題引發社會關注。"
            className=""
          />
          <Shared.SlideTextCard
            text="2015年6月八仙塵爆後，台灣急診室壅塞的問題引發社會關注。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide>
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-1/innovation-1-2.webp"
            alt="為了讓讀者體會台灣急診的忙碌程度，《報導者》團隊走進急診室實地採訪後，將醫師真實處境轉化為遊戲體驗。"
          />
          <Shared.SlideTextCard
            text="為了讓讀者體會台灣急診的忙碌程度，《報導者》團隊走進急診室實地採訪後，將醫師真實處境轉化為遊戲體驗。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide>
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-1/innovation-1-3.webm"
            alt="記者、設計師與工程師花費兩個多月協作，以童年養成遊戲風格呈現急診室制度與人力的多重壓力。"
          />
          <Shared.SlideTextCard
            text="記者、設計師與工程師花費兩個多月協作，以童年養成遊戲風格呈現急診室制度與人力的多重壓力。"
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
    </div >
  );
}