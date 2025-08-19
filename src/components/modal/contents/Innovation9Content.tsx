'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation9Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
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
            src="/assets/innovations/innovation-9/innovation-9-11.webm"
            alt="《報導者》攝影專欄"
            className=""
          />
          <Shared.SlideTextCard
            text="《報導者》以攝影專欄推動影像識讀，產製並徵集圖輯、評論、導讀與訪談，打造影像知識網絡。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-10.webp"
            alt="深度影像工作坊"
            className=""
          />
          <Shared.SlideTextCard
            text="連續8年舉辦「深度影像工作坊」，培力新聞攝影新世代，扶植X位年輕人才轉任正職或特約攝影記者。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/攝影集.webp"
            alt="新聞攝影集"
            className=""
          />
          <Shared.SlideTextCard
            text="出版新聞攝影集並舉辦展覽，拓展影像公共參與的想像與可能。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-4.webp"
            alt="攝影展"
            className=""
          />
          <Shared.SlideTextCard
            text="透過合理分潤與影像共享機制，與攝影者建立共好關係，讓影像資產延續價值。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-1.webp"
            alt="攝影集錦"
            className=""
          />
          <Shared.SlideTextCard
            text="《報導者》累積大量影像作品、資料與論述，用視覺書寫關於這片土地的記憶。"
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