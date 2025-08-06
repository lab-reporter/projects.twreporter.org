'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation2Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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

        {/* 第二頁：數位敘事創新 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-2/innovation-2-1.mp4"
              alt="海上人口販運風暴"
              className="object-cover"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard 
                text="《報導者》長期致力於創新的數位敘事方式。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第三頁：國際獎項肯定 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-2/innovation-2-2.mp4"
              alt="六輕營運20年"
              className="object-cover"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-3xl">
              <Shared.SlideTextCard 
                text="在成立初期，就以「海上人口販運風暴」的互動網頁和「六輕營運20年」的解釋性動畫獲得重要國際獎項 SND 最佳新聞設計創意競賽肯定。"
                className="shadow-2xl"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第四頁：多元敘事方法 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-2/innovation-2-3.webm"
              alt="遊走兩岸海域的暴利生意"
              className="object-cover"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard 
                text="除了平面動態，也經常運用3D敘事、資料視覺化、沉浸式互動等方法說故事。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第五頁：即時新聞創新 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-2/innovation-2-4.webm"
              alt="分解「沉浸式詐騙」手法"
            />
            <div className="absolute top-16 left-1/2 -translate-x-1/2 max-w-3xl">
              <Shared.SlideTextCard 
                text="2022年俄烏戰爭爆發之際，使用華文媒體少見的 Live Blog 形式更新戰事最新動態，並前往歐洲製作 360 影片，把現場的畫面帶回給台灣讀者。"
              />
            </div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard 
                text="這些多媒體作品擴展了敘事邊界與讀者參與方式，也讓新聞的影響力延伸得更遠。"
                className="bg-opacity-95"
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