'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation7Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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

        {/* 第二頁：漫畫新可能 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full p-8">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-7/黑工.webp"
              alt="《困在隧道的青春》漫畫圖檔"
              className="object-contain"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="《報導者》持續探索深度敘事的多元形式，2022年首度以漫畫開啟感性與視覺的報導新可能。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第三頁：漫畫重構現場 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full p-8">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-7/森林.webp"
              alt="《森林傷痕》漫畫圖檔"
              className="object-contain"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="透過漫畫的重構，帶領讀者走過主角們親歷的現場。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第四頁：視覺延續生命力 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full p-8">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-7/小宅.webp"
              alt="《鳥籠時代》漫畫圖檔"
              className="object-contain"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="以漫畫形式詮釋深度報導，讓那些費時數月完成的作品，在視覺重構中延續生命力。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第五頁：報導者事件簿 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full p-8">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-7.webm"
              alt="《報導者事件簿》立體書封"
              className="object-contain"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="2022年起攜手蓋亞文化，《報導者事件簿》結合調查報導與圖像敘事，讓讀者對議題產生共感。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第六頁：時代紀錄願景 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full p-8">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-7/無體溫.webp"
              alt="《陪伴｜娃娃》立體書封"
              className="object-contain"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="以「事件簿」為名，期望透過一個又一個的事件，在將來串連成一個更宏觀的時代紀錄。"
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