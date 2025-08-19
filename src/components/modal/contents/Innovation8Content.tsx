'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation8Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
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
            src="/assets/innovations/innovation-8/innovation-8-1.webp"
            alt="《報導者》五週年列車"
            className=""
          />
          <Shared.SlideTextCard
            text="深化讀者互動，是非營利媒體不可或缺的使命。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-8/innovation-8-1.webp"
            alt="《報導者》五週年列車"
            className=""
          />
          <Shared.SlideTextCard
            text="2020年《報導者》啟動五週年列車前往台灣各地巡迴開講，從高雄傳統市場、台南古老廟宇到離島的金門大學，直接感受、回應讀者的需求與期待。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-8/innovation-8-14.webp"
            alt="2022年舉辦北中南贊助者大會"
            className=""
          />
          <Shared.SlideTextCard
            text="2022年舉辦北中南贊助者大會，串聯台中科博館、台南臺灣文學館、台北當代藝術館，與支持者面對面交流。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-8/innovation-8-7.webp"
            alt="Live & Breathe 辦公室音樂會"
            className=""
          />
          <Shared.SlideTextCard
            text="2024年，更把辦公室打開，舉辦2天共50倍的音樂會。透過黃玠、拍謝少年、巴奈、生祥和裝咖人的音樂，和讀者與贊助者交流彼此關心的議題。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-8/innovation-8-8.webp"
            alt="Live & Breathe 辦公室音樂會"
            className=""
          />
          <Shared.SlideTextCard
            text="透過黃玠、拍謝少年、巴奈、生祥和裝咖人的音樂，和讀者與贊助者交流彼此關心的議題。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-8/innovation-8-9.webp"
            alt="Live & Breathe 辦公室音樂會"
            className=""
          />
          <Shared.SlideTextCard
            text="《報導者》將持續突破媒體與讀者的界線，讓好新聞在公共場域中產生共感。"
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