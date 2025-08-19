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
            type="video"
            src="/assets/innovations/innovation-3/innovation-3-5.webm"
            alt="報導者開放實驗室螢幕錄影畫面"
            className=""
          />
          <Shared.SlideTextCard
            text="「開放」是《報導者》的重要核心精神。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-3/innovation-3-5.webm"
            alt="報導者開放實驗室螢幕錄影畫面"
            className=""
          />
          <Shared.SlideTextCard
            text="從創立之初就開創的「報導者開放實驗室」，記載團隊關於深度報導與數位敘事的方法論。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-3/innovation-3-1.jpeg"
            alt="新聞敘事元件庫討論"
            className=""
          />
          <Shared.SlideTextCard
            text="為提升數位敘事報導的製作效率，工程師自2020年起打造可重複使用的新聞敘事元件，取代過往一次性開發模式。"
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

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-3/innovation-3-6.webm"
            alt="沉浸式敘事實驗"
            className=""
          />
          <Shared.SlideTextCard
            text="延續開放精神，數位敘事元件庫同步開放外界使用。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-3/innovation-3-6.webm"
            alt="沉浸式敘事實驗"
            className=""
          />
          <Shared.SlideTextCard
            text="目前元件庫已收錄7款工具，濃縮《報導者》10年來的數位敘事經驗，為新聞報導開創更多視覺與互動的可能。"
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