'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation7Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-7/黑工.webp"
            alt="《困在隧道的青春》漫畫圖檔"
            className=""
          />
          <Shared.SlideTextCard
            text="《報導者》持續探索深度敘事的多元形式，2022年首度以漫畫開啟感性與視覺的報導新可能。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-7/森林.webp"
            alt="《森林傷痕》漫畫圖檔"
            className=""
          />
          <Shared.SlideTextCard
            text="透過漫畫的重構，帶領讀者走過主角們親歷的現場。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-7/小宅.webp"
            alt="《鳥籠時代》漫畫圖檔"
            className=""
          />
          <Shared.SlideTextCard
            text="以漫畫形式詮釋深度報導，讓那些費時數月完成的作品，在視覺重構中延續生命力。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-7.webm"
            alt="《報導者事件簿》立體書封"
            className=""
          />
          <Shared.SlideTextCard
            text="2022年起攜手蓋亞文化，《報導者事件簿》結合調查報導與圖像敘事，讓讀者對議題產生共感。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-7/無體溫.webp"
            alt="《陪伴｜娃娃》立體書封"
            className=""
          />
          <Shared.SlideTextCard
            text="以「事件簿」為名，期望透過一個又一個的事件，在將來串連成一個更宏觀的時代紀錄。"
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