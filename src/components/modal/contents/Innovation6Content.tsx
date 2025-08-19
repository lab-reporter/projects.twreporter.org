'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation6Content({ projectData, onNavigate, adjacentProjects, scrollContainer, onClose }: ContentProps) {
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
            src="/assets/innovations/innovation-6/innovation-6-1.webp"
            alt="獨立思辨的能力需要向下紮根，2022年兒少品牌《少年報導者》成立，希望促進大人與孩子之間對於公共議題的理解與討論。"
            className=""
          />
          <Shared.SlideTextCard
            text="獨立思辨的能力需要向下紮根，2022年兒少品牌《少年報導者》成立，希望促進大人與孩子之間對於公共議題的理解與討論。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-6/innovation-6-2.webp"
            alt="為了讓多元族群孩子也能接觸優質新聞，2023年與央廣合作，推出華語、台灣台語、台灣客語、英語、日語、印尼語、泰語、越南語、菲律賓與、粵語等10種語言讀報。"
            className=""
          />
          <Shared.SlideTextCard
            text="為了讓多元族群孩子也能接觸優質新聞，2023年與央廣合作，推出華語、台灣台語、台灣客語、英語、日語、印尼語、泰語、越南語、菲律賓與、粵語等10種語言讀報。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-6/innovation-6-3.webp"
            alt="2023年8月，《少年報導者》出版全台首本兒少新聞雜誌書，並串連企業捐書至偏鄉，讓深度新聞成為知識平權的起點。"
            className=""
          />
          <Shared.SlideTextCard
            text="2023年8月，《少年報導者》出版全台首本兒少新聞雜誌書，並串連企業捐書至偏鄉，讓深度新聞成為知識平權的起點。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <div className="w-full h-full flex md:flex-row flex-col">
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-6/innovation-6-4-1.webp"
              alt="2024台灣總統大選期間，更帶小記者採訪3位總統候選人，創下台灣總統候選人首度接受兒少採訪的先例，令政治領導者正視兒少意見。"
              className=""
            />
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-6/innovation-6-4-2.webp"
              alt="2024台灣總統大選期間，更帶小記者採訪3位總統候選人，創下台灣總統候選人首度接受兒少採訪的先例，令政治領導者正視兒少意見。"
              className=""
            />
            <Shared.SlideMedia
              type="image"
              src="/assets/innovations/innovation-6/innovation-6-4-3.webp"
              alt="2024台灣總統大選期間，更帶小記者採訪3位總統候選人，創下台灣總統候選人首度接受兒少採訪的先例，令政治領導者正視兒少意見。"
              className=""
            />
          </div>
          <Shared.SlideTextCard
            text="2024台灣總統大選期間，更帶小記者採訪3位總統候選人，創下台灣總統候選人首度接受兒少採訪的先例，令政治領導者正視兒少意見。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="">
          <Shared.SlideMedia
            type="image"
            src="/assets/innovations/innovation-6/innovation-6-5.webp"
            alt="除了圖文報導，《少年報導者》費時8個月製作台灣首位未成年兒少自立就醫的紀錄片《人生的縫隙》，在醫界與教育界引起廣大迴響，並獲得卓越新聞獎肯定。"
            className=""
          />
          <Shared.SlideTextCard
            text="除了圖文報導，《少年報導者》費時8個月製作台灣首位未成年兒少自立就醫的紀錄片《人生的縫隙》，在醫界與教育界引起廣大迴響，並獲得卓越新聞獎肯定。"
            className=""
          />
        </Shared.InnovationSlide>

        <Shared.InnovationSlide className="flex flex-col items-center">
          <Shared.SlideMedia
            type="video"
            src={projectData.path}
            alt="《少年報導者》把每個孩子當成獨立的大人，透過深度報導與議題教案，讓老師、家長和孩子一起思辨世界動態，歡迎分享給你身邊的大小朋友！"
            className="object-contain flex-shrink-0"
          />
          <Shared.SlideTextCard
            text="《少年報導者》把每個孩子當成獨立的大人，透過深度報導與議題教案，讓老師、家長和孩子一起思辨世界動態，歡迎分享給你身邊的大小朋友！"
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