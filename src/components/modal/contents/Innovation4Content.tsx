'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation4Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
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
            src="/assets/innovations/innovation-4/innovation-4-6.webp"
            alt="The Real Story 錄音畫面"
            className=""
          />
          <Shared.SlideTextCard
            text="2020年8月推出的Podcast節目《The Real Story》，用聲音帶領聽眾理解世界上正在發生的重要事。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <div className="relative w-full h-full p-16 flex items-center justify-center">
            <iframe
              src="https://open.spotify.com/embed/show/2enAYfKRQSsvxCl4HrB9iG?utm_source=generator&theme=0"
              width="100%"
              height="352"
              allow="encrypted-media"
              title="Spotify Podcast"
              className="rounded-xl max-w-lg"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="無論是調查現場、國際新聞，聲音成為陪伴聽眾的媒介，也串起跨世代、跨地域的理解與共鳴。"
                className=""
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-4/innovation-4-2.webp"
            alt="The Real Story 獲獎畫面"
            className=""
          />
          <Shared.SlideTextCard
            text="節目推出至今累積將近3,000萬次收聽，兩度獲卓越新聞獎，也曾入選 KKBOX Podcast 風雲榜年度最佳節目、Apple Podcast 年度十大節目。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-4/innovation-4-8.webp"
            alt="The Real Story 節目封面"
            className=""
          />
          <Shared.SlideTextCard
            text="讓更多的聲音被聽見、把世界不同角落的聲音帶進人們的心，是《報導者》將持續完成的事。"
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