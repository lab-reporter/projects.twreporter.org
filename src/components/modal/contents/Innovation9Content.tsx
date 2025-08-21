'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation9Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, scrollContainer, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <div data-slide-container="true">
      <Shared.InnovationSlidesContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        <Shared.InnovationSlide className="flex items-center justify-center">
          {/* <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-1.webp"
            alt="我們活在影像充斥的時代，但人們對影像的注意力卻逐漸稀缺。為了拉近讀者與影像的距離，《報導者》開設攝影專欄，持續發布在地影像故事、新聞圖輯、影像評論等。"
            className=""
          /> */}
          <Shared.SlideIframe
            src="https://www.twreporter.org/photography"
          />
          <Shared.SlideTextCard
            text="我們活在影像充斥的時代，但人們對影像的注意力卻逐漸稀缺。為了拉近讀者與影像的距離，《報導者》開設攝影專欄，持續發布在地影像故事、新聞圖輯、影像評論等。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-2.webp"
            alt="自2017年起，我們連續8年舉辦「深度影像工作坊」，試圖為這個世代有志於攝影工作的人才，建立一個影像知識網絡。"
            className=""
          />
          <Shared.SlideTextCard
            text="自2017年起，我們連續8年舉辦「深度影像工作坊」，試圖為這個世代有志於攝影工作的人才，建立一個影像知識網絡。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-3.webp"
            alt="透過攝影前輩經驗傳承，從旁協助學員完成自己的影像拍攝計畫，並對外公開發表、在《報導者》攝影專欄刊登。"
            className=""
          />
          <Shared.SlideTextCard
            text="透過攝影前輩經驗傳承，從旁協助學員完成自己的影像拍攝計畫，並對外公開發表、在《報導者》攝影專欄刊登。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-9/innovation-9-4.webp"
            alt="我們支持合理分潤、影像版權共享，當影像在《報導者》14天獨家刊登結束後，即與攝影者共享這份影像資產。"
            className=""
          />
          <Shared.SlideTextCard
            text="我們支持合理分潤、影像版權共享，當影像在《報導者》14天獨家刊登結束後，即與攝影者共享這份影像資產。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="10年來，《報導者》在黑暗中維繫一絲微光，希望透過鏡頭，我們能記錄更多社會角落的印記。"
            className="object-contain"
          />
          <Shared.SlideTextCard
            text="10年來，《報導者》在黑暗中維繫一絲微光，希望透過鏡頭，我們能記錄更多社會角落的印記。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center justify-center">
          <Shared.ModalCTA onClose={onClose} />
        </Shared.InnovationSlide>
      </Shared.InnovationSlidesContainer>
    </div>
  );
} 