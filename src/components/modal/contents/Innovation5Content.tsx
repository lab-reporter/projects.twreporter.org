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
        {/* 第一頁：Banner */}
        <Shared.InnovationSlide>
          <Shared.InnovationBanner
            videoSrc={projectData.path}
            title={projectData.title}
            subtitle={projectData.subtitle}
          />
        </Shared.InnovationSlide>

        {/* 第二頁：影音報導趨勢 */}
        <Shared.InnovationSlide className="relative p-8">
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
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第三頁：首支影片成果 */}
        <Shared.InnovationSlide className="relative p-8">
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
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第四頁：多元主題呈現 */}
        <Shared.InnovationSlide className="relative p-8">
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
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第五頁：排名成果 */}
        <Shared.InnovationSlide className="relative p-16 bg-black">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-5/innovation-5-10.webm"
            alt="報導者影音報導"
            className="object-contain"
          />
          <Shared.SlideTextCard
            text="根據《2024下半年媒體影響力報告》統計，《報導者》影音在2024年的平均觀看次數在台灣絲路媒體中排名第一。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 第六頁：深度報導橋梁 */}
        <Shared.InnovationSlide className="relative p-16 bg-black">
          <Shared.SlideMedia
            type="video"
            src="/assets/innovations/innovation-5/innovation-5-10.webm"
            alt="報導者影音報導"
            className="object-contain"
          />
          <Shared.SlideTextCard
            text="影片不只傳遞新聞，更成為橋梁，召喚觀眾培養理解複雜議題的能力，重新靠近深度報導。"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl"
          />
        </Shared.InnovationSlide>

        {/* 最後一頁：導航控制 */}
        <Shared.InnovationSlide>
          <div className="flex flex-col items-center justify-center h-full bg-white">
            {/* 支持報導者按鈕 */}
            <Shared.ModalDonate onClose={onClose} />

            {/* 導航按鈕 */}
            {/* <Shared.NavigationControls
              onNavigate={onNavigate}
              adjacentProjects={adjacentProjects}
            /> */}
          </div>
        </Shared.InnovationSlide>
      </Shared.InnovationSlidesContainer>
    </div>
  );
} 