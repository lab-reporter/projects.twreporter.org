'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation3Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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

        {/* 第二頁：開放核心精神 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-3/innovation-3-5.webm"
              alt="報導者開放實驗室螢幕錄影畫面"
              className="object-cover"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="「開放」是《報導者》的重要核心精神。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第三頁：開放實驗室 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-3/innovation-3-5.webm"
              alt="報導者開放實驗室螢幕錄影畫面"
              className="object-cover"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="從創立之初就開創的「報導者開放實驗室」，記載團隊關於深度報導與數位敘事的方法論。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第四頁：新聞敘事元件 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-3/innovation-3-1.jpeg"
              alt="新聞敘事元件庫討論"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="為提升數位敘事報導的製作效率，工程師自2020年起打造可重複使用的新聞敘事元件，取代過往一次性開發模式。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第五頁：元件通用性 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-3/innovation-3-3.webm"
              alt="左右互搏"
              className="object-cover"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="元件設計強調通用性，不需程式背景、任何人都能透過內容編輯介面直接應用。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第六頁：開放使用與成果 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-3/innovation-3-6.webm"
              alt="沉浸式敘事實驗"
              className="object-cover"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="延續開放精神，數位敘事元件庫同步開放外界使用。"
              />
            </div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="目前元件庫已收錄7款工具，濃縮《報導者》10年來的數位敘事經驗，為新聞報導開創更多視覺與互動的可能。"
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