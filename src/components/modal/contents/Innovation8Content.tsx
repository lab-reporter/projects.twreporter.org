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
            alt="深化讀者互動，是非營利媒體不可或缺的使命。"
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
            src="/assets/innovations/innovation-8/innovation-8-2.webp"
            alt="2020年《報導者》啟動五週年列車前往台灣各地巡迴開講，從高雄傳統市場、台南古老廟宇到離島的金門大學，直接感受、回應讀者的需求與期待。"
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
            src="/assets/innovations/innovation-8/innovation-8-3.webp"
            alt="2022年舉辦北中南贊助者大會，串連台中科博館、台南臺灣文學館、台北當代藝術館，與支持者面對面交流。"
            className=""
          />
          <Shared.SlideTextCard
            text="2022年舉辦北中南贊助者大會，串連台中科博館、台南臺灣文學館、台北當代藝術館，與支持者面對面交流。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-8/innovation-8-4.webp"
            alt="2024年，我們把辦公室打開，舉辦2天共4場的音樂會。透過黃玠、拍謝少年、巴奈、生祥和裝咖人的音樂，和讀者與贊助者交流彼此關心的議題。 "
            className=""
          />
          <Shared.SlideTextCard
            text="2024年，我們把辦公室打開，舉辦2天共4場的音樂會。透過黃玠、拍謝少年、巴奈、生祥和裝咖人的音樂，和讀者與贊助者交流彼此關心的議題。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="「Live and breathe something」是一個英文片語，告訴著我們：每天生活呼吸觸碰到的，或許就是你視為和生命一樣重要的事情。希望《報導者》也能陪著你，好好生活、好好活著。"
            className="object-contain flex-shrink-0"
          />
          <Shared.SlideTextCard
            text="「Live and breathe something」是一個英文片語，告訴著我們：每天生活呼吸觸碰到的，或許就是你視為和生命一樣重要的事情。希望《報導者》也能陪著你，好好生活、好好活著。"
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