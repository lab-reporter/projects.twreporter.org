'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation2Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-2/innovation-2-1.mp4"
            alt="《報導者》除了在現場挖掘議題，也試著結合文字、影像、設計，把新聞做得有趣。"
            className=""
          />
          <Shared.SlideTextCard
            text="《報導者》除了在現場挖掘議題，也試著結合文字、影像、設計，把新聞做得有趣。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center justify-center">
          <Shared.SlideIframe
            src="https://www.twreporter.org/i/slave-fishermen-human-trafficking-gcs"
          />
          <Shared.SlideTextCard
            text="你所看到的每一個畫面，都是記者、編輯、設計師、工程師經過無數次辯證、修改後的呈現。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-2/innovation-2-3.webm"
            alt="無論是交友詐騙、中國業者盜取台灣海砂、犯罪集團濫倒廢棄物⋯⋯我們大量運用沉浸式互動、3D敘事等方式，讓讀者了解這些複雜的議題。"
            className=""
          />
          <Shared.SlideTextCard
            text="無論是交友詐騙、中國業者盜取台灣海砂、犯罪集團濫倒廢棄物⋯⋯我們大量運用沉浸式互動、3D敘事等方式，讓讀者了解這些複雜的議題。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-2/innovation-2-4.webm"
            alt="2022年，《報導者》兩度前往烏克蘭採訪，除了推出文字報導，我們也製作360度影片，讓台灣讀者看見戰事前線的樣貌。"
            className=""
          />
          <Shared.SlideTextCard
            text="2022年，《報導者》兩度前往烏克蘭採訪，除了推出文字報導，我們也製作360度影片，讓台灣讀者看見戰事前線的樣貌。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="多媒體擴展了敘事邊界與讀者參與方式，你對哪一則多媒體新聞印象最深呢？"
            className="object-contain flex-shrink-0"
          />
          <Shared.SlideTextCard
            text="多媒體擴展了敘事邊界與讀者參與方式，你對哪一則多媒體新聞印象最深呢？"
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