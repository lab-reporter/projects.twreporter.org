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
            alt="海上人口販運風暴"
            className=""
          />
          <Shared.SlideTextCard
            text="《報導者》長期致力於創新的數位敘事方式。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-2/innovation-2-2.mp4"
            alt="六輕營運20年"
            className=""
          />
          <Shared.SlideTextCard
            text="在成立初期，就以「海上人口販運風暴」的互動網頁和「六輕營運20年」的解釋性動畫獲得重要國際獎項 SND 最佳新聞設計創意競賽肯定。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-2/innovation-2-3.webm"
            alt="遊走兩岸海域的暴利生意"
            className=""
          />
          <Shared.SlideTextCard
            text="除了平面動態，也經常運用3D敘事、資料視覺化、沉浸式互動等方法說故事。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-2/innovation-2-4.webm"
            alt="分解「沉浸式詐騙」手法"
            className=""
          />
          <Shared.SlideTextCard
            text="2022年俄烏戰爭爆發之際，使用華文媒體少見的 Live Blog 形式更新戰事最新動態，並前往歐洲製作 360 影片，把現場的畫面帶回給台灣讀者。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-2/innovation-2-4.webm"
            alt="分解「沉浸式詐騙」手法"
            className=""
          />
          <Shared.SlideTextCard
            text="這些多媒體作品擴展了敘事邊界與讀者參與方式，也讓新聞的影響力延伸得更遠。"
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