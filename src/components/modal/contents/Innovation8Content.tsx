'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation8Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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

        {/* 第二頁：深化讀者互動使命 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-8/innovation-8-1.webp"
              alt="《報導者》五週年列車"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="深化讀者互動，是非營利媒體不可或缺的使命。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第三頁：五週年列車巡迴 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-8/innovation-8-1.webp"
              alt="《報導者》五週年列車"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="2020年《報導者》啟動五週年列車前往台灣各地巡迴開講，從高雄傳統市場、台南古老廟宇到離島的金門大學，直接感受、回應讀者的需求與期待。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第四頁：贊助者大會 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-8/innovation-8-14.webp"
              alt="2022年舉辦北中南贊助者大會"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="2022年舉辦北中南贊助者大會，串聯台中科博館、台南臺灣文學館、台北當代藝術館，與支持者面對面交流。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第五頁：辦公室音樂會 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-8/innovation-8-7.webp"
              alt="Live & Breathe 辦公室音樂會"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="2024年，更把辦公室打開，舉辦2天共50倍的音樂會。透過黃玠、拍謝少年、巴奈、生祥和裝咖人的音樂，和讀者與贊助者交流彼此關心的議題。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第六頁：音樂交流 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-8/innovation-8-8.webp"
              alt="Live & Breathe 辦公室音樂會"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="透過黃玠、拍謝少年、巴奈、生祥和裝咖人的音樂，和讀者與贊助者交流彼此關心的議題。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第七頁：突破界線願景 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-8/innovation-8-9.webp"
              alt="Live & Breathe 辦公室音樂會"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="《報導者》將持續突破媒體與讀者的界線，讓好新聞在公共場域中產生共感。"
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