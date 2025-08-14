'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation1Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >

        {/* 第二頁：遊戲影片與說明 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full p-8">
            <Shared.SlideMedia
              type="video"
              src="/assets/innovations/innovation-1/innovation-1-5.webm"
              alt="急診人生遊戲影片"
              className="rounded-lg"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="2015年八仙塵爆凸顯台灣急診雍塞情況，《急診人生》新聞遊戲以真實醫療情境為基礎，邀讀者化身鍵盤醫師，在緊湊操作中體驗急診現場的崩壞與無奈。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第三頁：採訪畫面 */}
        <Shared.InnovationSlide className="relative">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-1/innovation-1-6.jpg"
            alt="急診室實地採訪畫面"
          />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
            <Shared.SlideTextCard
              text="團隊走進急診室實地採訪，將醫師真實處境轉化為遊戲機制，呈現制度與人力的多重壓力。"
            />
          </div>
        </Shared.InnovationSlide>

        {/* 第四頁：遊戲介面 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-1/innovation-1-5.jpg"
              alt="遊戲介面設計"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="操作簡單、風格懷舊，由記者、設計師與工程師協作，重溫童年經營遊戲的手感。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第五頁：創新意義 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-1/innovation-1-3.png"
              alt="遊戲介面設計"
              className="opacity-90"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="從文字到遊戲，是《報導者》邁向沉浸式敘事的實驗，也是新聞接觸更多公眾的全新方式。"
                className="shadow-2xl"
              />
            </div>
          </div>
        </Shared.InnovationSlide>
        {/* 第一頁：Banner */}
        <Shared.InnovationSlide>
          <Shared.InnovationBanner
            videoSrc={projectData.path}
            title={projectData.title}
            subtitle={projectData.subtitle}
          />
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