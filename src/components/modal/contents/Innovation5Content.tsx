'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation5Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        <Shared.InnovationSlide className="">
          <iframe
            src="https://www.youtube.com/embed/DnOl_qPGPTM?si=ue9TYSyHWjkP5UjT&t=153"
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="報導者影音報導"
            className="rounded-lg"
          />
          <Shared.SlideTextCard
            text="面對難以迴避的短影音趨勢，《報導者》在2024年推出影音報導，滿足多樣的讀者需求。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <iframe
            src="https://www.youtube.com/embed/DnOl_qPGPTM?si=ue9TYSyHWjkP5UjT&t=153"
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="報導者影音報導"
            className="rounded-lg"
          />
          <Shared.SlideTextCard
            text="首支影片以「兒少性剝削」為主題，上線即吸引將近30萬人次的觀看。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <iframe
            src="https://www.youtube.com/embed/DnOl_qPGPTM?si=ue9TYSyHWjkP5UjT&t=153"
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="報導者影音報導"
            className="rounded-lg"
          />
          <Shared.SlideTextCard
            text="陸續推出的幾支影片主題，包含美國大選、海底電纜、國民法官現場速寫等，都成功吸引大眾關注。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-5/innovation-5-10.webm"
            alt="報導者影音報導"
            className=""
          />
          <Shared.SlideTextCard
            text="根據《2024下半年媒體影響力報告》統計，《報導者》影音在2024年的平均觀看次數在台灣絲路媒體中排名第一。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-5/innovation-5-10.webm"
            alt="報導者影音報導"
            className=""
          />
          <Shared.SlideTextCard
            text="影片不只傳遞新聞，更成為橋梁，召喚觀眾培養理解複雜議題的能力，重新靠近深度報導。"
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