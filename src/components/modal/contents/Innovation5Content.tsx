'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation5Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, scrollContainer, onClose }: ContentProps) {
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
            src="/assets/innovations/innovation-5/innovation-5-1.webp"
            alt="面對難以迴避的短影音趨勢，《報導者》自2024年7月開始推出影音報導，滿足多樣的讀者需求。"
            className=""
          />
          <Shared.SlideTextCard
            text="面對難以迴避的短影音趨勢，《報導者》自2024年7月開始推出影音報導，滿足多樣的讀者需求。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-5/innovation-5-2.webp"
            alt="影音小組開了無數次會討論敘事風格、動畫形式、影片時間長短等，藉此釐清我們的能力與觀眾的習慣變化。"
            className=""
          />
          <Shared.SlideTextCard
            text="影音小組開了無數次會討論敘事風格、動畫形式、影片時間長短等，藉此釐清我們的能力與觀眾的習慣變化。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-5/innovation-5-10.webm"
            alt="在演算法的帶動之下，陸續推出的兒少性剝削、居住正義、海底電纜、國民法官現場速寫等影音報導，都讓公共議題觸及到廣大的觀眾群。"
            className=""
          />
          <Shared.SlideTextCard
            text="在演算法的帶動之下，陸續推出的兒少性剝削、居住正義、海底電纜、國民法官現場速寫等影音報導，都讓公共議題觸及到廣大的觀眾群。"
            className=""
          />
        </Shared.InnovationSlide>


        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-5/innovation-5-4.webp"
            alt="根據《2024下半年媒體影響力報告》統計，《報導者》影音在2024年的平均觀看次數在台灣網路媒體中排名第一。"
            className=""
          />
          <Shared.SlideTextCard
            text="根據《2024下半年媒體影響力報告》統計，《報導者》影音在2024年的平均觀看次數在台灣網路媒體中排名第一。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="影音新聞是理解複雜議題的橋梁，召喚觀眾重新靠近深度報導。如果你還沒看過《報導者》影音新聞，歡迎到 YouTube 頻道按讚、訂閱、開啟小鈴噹！"
            className="object-contain flex-shrink-0"
          />
          <Shared.SlideTextCard
            text="影音新聞是理解複雜議題的橋梁，召喚觀眾重新靠近深度報導。如果你還沒看過《報導者》影音新聞，歡迎到 YouTube 頻道按讚、訂閱、開啟小鈴噹！"
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