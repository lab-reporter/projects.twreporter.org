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

        <Shared.InnovationSlide className="relative">
          <Shared.SlideMedia
            type="iframe"
            src="https://www.listennotes.com/podcasts/the-real-storyby-報導者-報導者-soundon-製作團隊-FIh41mSR5qs/embed/"
            alt="讓社會各個角落、多元價值的聲音被聽見、開啟對話，是《報導者》持續努力的目標。"
            className="w-[60%] px-12 mx-auto h-full pt-12"
          />
          <Shared.SlideTextCard
            text="讓社會各個角落、多元價值的聲音被聽見、開啟對話，是《報導者》持續努力的目標。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="《報導者》Podcast 節目已累積將近3,000萬次收聽，兩度獲卓越新聞獎。"
            className="object-contain w-full h-full"
          />
          <Shared.SlideTextCard
            text="《報導者》Podcast 節目已累積將近3,000萬次收聽，兩度獲卓越新聞獎。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center justify-center">
          <Shared.ModalCTA onClose={onClose} />
        </Shared.InnovationSlide>

      </Shared.InnovationSlidesContainer>
    </div>
  );
}