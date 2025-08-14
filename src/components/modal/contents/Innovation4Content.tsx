'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation4Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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

        {/* 第二頁：Podcast節目介紹 */}
        <Shared.InnovationSlide className="relative p-8">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-4/innovation-4-6.webp"
            alt="The Real Story 錄音畫面"
          />
          <Shared.SlideTextCard
            text="2020年8月推出的Podcast節目《The Real Story》，用聲音帶領聽眾理解世界上正在發生的重要事。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第三頁：Spotify嵌入與聲音媒介 */}
        <Shared.InnovationSlide>
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
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第四頁：獲獎紀錄 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-4/innovation-4-2.webp"
              alt="The Real Story 獲獎畫面"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="節目推出至今累積將近3,000萬次收聽，兩度獲卓越新聞獎，也曾入選 KKBOX Podcast 風雲榜年度最佳節目、Apple Podcast 年度十大節目。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第五頁：使命與願景 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-4/innovation-4-8.webp"
              alt="The Real Story 節目封面"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="讓更多的聲音被聽見、把世界不同角落的聲音帶進人們的心，是《報導者》將持續完成的事。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 最後一頁：導航控制 */}
        <Shared.InnovationSlide>
          <div className="flex items-center justify-center h-full bg-white">
            <Shared.NavigationControls
              onNavigate={onNavigate}
              adjacentProjects={adjacentProjects}
            />
          </div>
        </Shared.InnovationSlide>
      </Shared.InnovationSlidesContainer>
    </div>
  );
}