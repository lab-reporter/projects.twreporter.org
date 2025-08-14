'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation6Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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

        {/* 第二頁：少年報導者上線 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-6/innovation-6-4.webp"
              alt="少年報導者上線"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="為了促進大人與孩子之間對於公共議題的理解與討論，2022年10月《少年報導者》上線了！"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第三頁：多語讀報合作 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full p-16 flex items-center justify-center">
            <iframe
              src="https://open.spotify.com/embed/episode/4gEGTTy67t8UZQEbx0Yk3m?utm_source=generator"
              width="100%"
              height="352"
              allow="encrypted-media"
              title="多語讀報播放器"
              className="rounded-xl max-w-lg"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="自2023年5月，與央廣合作10種語言讀報，讓多元族群孩子也能接觸優質新聞。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第四頁：兒少新聞雜誌書 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-6/innovation-6-10.webp"
              alt="全台首本兒少新聞雜誌書"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="2023年8月出版全台首本兒少新聞雜誌書，並串聯企業捐書至偏鄉，讓深度新聞成為知識平權的起點。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第五頁：小記者採訪創舉 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-6/innovation-6-14.webp"
              alt="小記者採訪總統候選人"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="2024台灣總統大選期間，更帶小記者採訪3位總統候選人，創下台灣總統候選人首度接受兒少採訪的紀錄。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 第六頁：教育理念 */}
        <Shared.InnovationSlide>
          <div className="relative w-full h-full">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-6/innovation-6-6.webp"
              alt="少年報導者活動照片"
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl">
              <Shared.SlideTextCard
                text="《少年報導者》把每個孩子當成獨立的大人，透過深度報導與議題教案，讓老師、家長和孩子一起思辨世界動態。"
              />
            </div>
          </div>
        </Shared.InnovationSlide>

        {/* 最後一頁：導航控制 */}
        <Shared.InnovationSlide>
          <div className="flex items-center justify-center h-full bg-white">
            <Shared.NavigationControls
              onNavigate={onNavigate}
              adjacentProjects={adjacentProjects}
            />
          </div>
        </Shared.InnovationSlide>
      </Shared.InnovationSlidesContainer>
    </div>
  );
} 