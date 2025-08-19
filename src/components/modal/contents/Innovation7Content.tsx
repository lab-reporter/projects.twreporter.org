'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation7Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, scrollContainer, onClose }: ContentProps) {
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
            src="/assets/innovations/innovation-7/innovation-7-1.webp"
            alt="近10年，台灣原創漫畫的出版量逐漸擴大，面對分眾的時代，《報導者》也不斷思考如何創造讓讀者更有感的敘事。"
            className=""
          />
          <Shared.SlideTextCard
            text="近10年，台灣原創漫畫的出版量逐漸擴大，面對分眾的時代，《報導者》也不斷思考如何創造讓讀者更有感的敘事。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex items-center justify-center">
          {/* <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-7/innovation-7-2.webp"
            alt="2022年的《綁債・黑工・留學陷阱》專題，我們首度以漫畫開啟新的敘事可能，透過報導漫畫（Graphic Journalism）的重構，帶領讀者走過報導人物親歷的現場。"
            className=""
          /> */}
          <Shared.SlideIframe
            src="https://www.twreporter.org/a/uganda-students-in-taiwan-become-cheap-labors-comic"
          />
          <Shared.SlideTextCard
            text="2022年的《綁債・黑工・留學陷阱》專題，我們首度以漫畫開啟新的敘事可能，透過報導漫畫（Graphic Journalism）的重構，帶領讀者走過報導人物親歷的現場。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-7/innovation-7-3.webp"
            alt="以漫畫形式詮釋深度報導，讓那些費時數月完成的作品，在漫畫家的筆下延續生命力。"
            className=""
          />
          <Shared.SlideTextCard
            text="以漫畫形式詮釋深度報導，讓那些費時數月完成的作品，在漫畫家的筆下延續生命力。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-7/innovation-7-4.webp"
            alt="2022年起我們攜手蓋亞文化，發行報導漫畫系列出版品《報導者事件簿》，結合調查報導與圖像敘事，讓讀者對議題產生共感。"
            className=""
          />
          <Shared.SlideTextCard
            text="2022年起我們攜手蓋亞文化，發行報導漫畫系列出版品《報導者事件簿》，結合調查報導與圖像敘事，讓讀者對議題產生共感。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="以「事件簿」為名，期望透過一個又一個的事件，在將來串連成一個更宏觀的紀錄。歡迎收藏，一起見證這個時代的切片。"
            className="object-contain flex-shrink-0"
          />
          <Shared.SlideTextCard
            text="以「事件簿」為名，期望透過一個又一個的事件，在將來串連成一個更宏觀的紀錄。歡迎收藏，一起見證這個時代的切片。"
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