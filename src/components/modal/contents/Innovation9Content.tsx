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
        {/* 第一頁：Banner */}
        <Shared.InnovationSlide>
          <Shared.InnovationBanner
            videoSrc={projectData.path}
            title={projectData.title}
            subtitle={projectData.subtitle}
          />
        </Shared.InnovationSlide>

        {/* 第二頁：攝影專欄與影像識讀 */}
        <Shared.InnovationSlide className="relative p-8">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-9/innovation-9-11.webm"
            alt="《報導者》攝影專欄"
          />
          <Shared.SlideTextCard
            text="《報導者》以攝影專欄推動影像識讀，產製並徵集圖輯、評論、導讀與訪談，打造影像知識網絡。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第三頁：深度影像工作坊 */}
        <Shared.InnovationSlide className="relative">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-10.webp"
            alt="深度影像工作坊"
          />
          <Shared.SlideTextCard
            text="連續8年舉辦「深度影像工作坊」，培力新聞攝影新世代，扶植X位年輕人才轉任正職或特約攝影記者。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第四頁：攝影集與展覽 */}
        <Shared.InnovationSlide className="relative">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/攝影集.webp"
            alt="新聞攝影集"
          />
          <Shared.SlideTextCard
            text="出版新聞攝影集並舉辦展覽，拓展影像公共參與的想像與可能。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第五頁：共好機制 */}
        <Shared.InnovationSlide className="relative">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-4.webp"
            alt="攝影展"
          />
          <Shared.SlideTextCard
            text="透過合理分潤與影像共享機制，與攝影者建立共好關係，讓影像資產延續價值。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第六頁：視覺書寫記憶 */}
        <Shared.InnovationSlide className="relative">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-1.webp"
            alt="攝影集錦"
          />
          <Shared.SlideTextCard
            text="《報導者》累積大量影像作品、資料與論述，用視覺書寫關於這片土地的記憶。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 最後一頁：導航控制 */}
        <Shared.InnovationSlide>
          <div className="flex flex-col items-center justify-center h-full bg-white">
            {/* 支持報導者按鈕 */}
            <Shared.ModalDonate onClose={onClose} />

            {/* 導航按鈕 */}
            {/* <Shared.NavigationControls
              onNavigate={onNavigate}
              adjacentProjects={adjacentProjects}
            /> */}
          </div>
        </Shared.InnovationSlide>
      </Shared.InnovationSlidesContainer>
    </div>
  );
} 