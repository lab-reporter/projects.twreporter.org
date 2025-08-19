'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation4Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, scrollContainer, onClose }: ContentProps) {
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
            src="/assets/innovations/innovation-4/innovation-4-1.webp"
            alt="2020年8月，在1,500多位讀者的敲碗下，《報導者》推出 Podcast 節目《The Real Story》，用聲音帶領聽眾走入調查報導幕後和新聞現場。The Real Story "
            className=""
          />
          <Shared.SlideTextCard
            text="2020年8月，在1,500多位讀者的敲碗下，《報導者》推出 Podcast 節目《The Real Story》，用聲音帶領聽眾走入調查報導幕後和新聞現場。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">

          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-4/innovation-4-2.webp"
            alt="透過 Podcast，《報導者》走入更多人的生活，也把聲音傳到了香港、馬來西亞、中國、日本、歐美等海外地區。"
            className=""
          />
          <Shared.SlideTextCard
            text="透過 Podcast，《報導者》走入更多人的生活，也把聲音傳到了香港、馬來西亞、中國、日本、歐美等海外地區。"
            className=""
          />

        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-4/innovation-4-3.webp"
            alt="節目推出至今已累積將近3,000萬次收聽，兩度獲卓越新聞獎，也曾入選 KKBOX Podcast 風雲榜年度最佳節目、Apple Podcast 年度十大節目。"
            className=""
          />
          <Shared.SlideTextCard
            text="節目推出至今已累積將近3,000萬次收聽，兩度獲卓越新聞獎，也曾入選 KKBOX Podcast 風雲榜年度最佳節目、Apple Podcast 年度十大節目。"
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