'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation3Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
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
            src="/assets/innovations/innovation-3/innovation-3-1.webp"
            alt="多媒體新聞製作需要花費大量人力與時間，為了提升製作效率，《報導者》工程師自2020年起打造可重複使用的新聞敘事元件，取代過往一次性開發模式。"
            className=""
          />
          <Shared.SlideTextCard
            text="多媒體新聞製作需要花費大量人力與時間，為了提升製作效率，《報導者》工程師自2020年起打造可重複使用的新聞敘事元件，取代過往一次性開發模式。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center justify-center">
          <Shared.SlideIframe
            src="https://lab-storytelling.twreporter.org/landing"
          />

          <Shared.SlideTextCard
            text="2024年我們將所有元件集合成「數位敘事元件庫」，因應非營利媒體「取之於社會、用之於社會」的開放精神，元件庫同步開放外界使用。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-3/innovation-3-1.jpeg"
            alt="元件設計強調通用性，不需程式背景、任何人都能用這些小工具建置出有趣的互動式網頁。"
            className=""
          />
          <Shared.SlideTextCard
            text="元件設計強調通用性，不需程式背景、任何人都能用這些小工具建置出有趣的互動式網頁。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-3/innovation-3-3.webm"
            alt="左右互搏"
            className=""
          />
          <Shared.SlideTextCard
            text="元件設計強調通用性，不需程式背景、任何人都能透過內容編輯介面直接應用。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="元件庫已收錄7款小工具，濃縮《報導者》10年的數位敘事經驗，希望這些工具能成為你的數位內容創作好幫手。"
            className="object-contain flex-shrink-0"
          />
          <Shared.SlideTextCard
            text="元件庫已收錄7款小工具，濃縮《報導者》10年的數位敘事經驗，希望這些工具能成為你的數位內容創作好幫手。"
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