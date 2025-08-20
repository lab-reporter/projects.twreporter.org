'use client';

import { useState } from 'react';
import { ContentProps } from '../types';
import * as Shared from '../shared';
import { Button } from '@/components/shared';

export default function Innovation6Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, scrollContainer, onClose }: ContentProps) {
  // 語言選項配置與對應的 iframe src
  const languages = [
    {
      code: 'zh',
      name: '中文',
      src: 'https://open.spotify.com/embed/episode/2TJfa7VqMndR6qOERQxQOu?utm_source=generator&theme=0'
    },
    {
      code: 'en',
      name: '英文',
      src: 'https://open.spotify.com/embed/episode/4Fz6AcLN9o0yQABdUVKTLt?utm_source=generator&theme=0'
    },
    {
      code: 'ja',
      name: '日語',
      src: 'https://open.spotify.com/embed/episode/0n3lts8mjURDbYDzVN71g1?si=hXo7yoMOTA2YrJB3b3xKQw?utm_source=generator&theme=0'
    },
    {
      code: 'id',
      name: '印尼語',
      src: 'https://open.spotify.com/embed/episode/37C0ZiUG9kOhjb9r7NtR8S?si=_XS5jW8cREWE557d_SIlMQ?utm_source=generator&theme=0'
    },
    {
      code: 'th',
      name: '泰語',
      src: 'https://open.spotify.com/embed/episode/4V9PNndP12onp0DupLURNM?si=p1du3a2kRky5_zetwnDKxg?utm_source=generator&theme=0'
    },
    {
      code: 'vi',
      name: '越語',
      src: 'https://open.spotify.com/embed/episode/5nVMezxC8g0eDIx0AfN6Sc?si=sdZOYOx6ROiy1F2FQyPpYg?utm_source=generator&theme=0'
    },
    {
      code: 'tl',
      name: '菲律賓語',
      src: 'https://open.spotify.com/embed/episode/39dn2gcZz6ETC4mXLNqyIy?si=DxlHxH9VTqOCNC1EsJSnKw?utm_source=generator&theme=0'
    },
    {
      code: 'ms',
      name: '台語',
      src: 'https://open.spotify.com/embed/episode/76hYieIH9GZ2SMrLRQ22M6?si=2P3uNRUgTSKGPtelhcTVgA?utm_source=generator&theme=0'
    },
    {
      code: 'hak',
      name: '客語',
      src: 'https://open.spotify.com/embed/episode/7qIMCtZQtOUC8inR9rjMng?si=brRZsUrVSgORWBxHW9Ovtg?utm_source=generator&theme=0'
    },
    {
      code: 'yue',
      name: '粵語',
      src: 'https://open.spotify.com/embed/episode/2Y6UvgOCV2dZwF1X05pCCq?si=MpBxi1MhTtuTMhpItoyKUw?utm_source=generator&theme=0'
    }
  ];

  // 狀態變數：當前選擇的語言（預設為中文）
  const [selectedLanguage, setSelectedLanguage] = useState('zh');

  if (!projectData) return null;

  // 計算值：根據選擇的語言取得對應的 iframe src
  const currentIframeSrc = languages.find(lang => lang.code === selectedLanguage)?.src || languages[0].src;

  // 事件處理函數：處理語言切換
  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

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

        <Shared.InnovationSlide className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[60rem] py-12 mx-auto h-auto flex flex-col">
            {/* 語言切換按鈕區域 */}
            <div className="flex flex-wrap justify-center gap-2 mb-2 px-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "primary" : "outline"}
                  size="sm"
                  shape="rounded"
                  onClick={() => handleLanguageChange(lang.code)}
                  className="text-sm w-[19%]"
                >
                  {lang.name}
                </Button>
              ))}
            </div>
            {/* iframe 媒體區域 */}
            <div className="flex-1 flex items-center justify-center">
              <Shared.SlideMedia
                type="iframe"
                src={currentIframeSrc}
                alt="為了讓多元族群孩子也能接觸優質新聞，2023年與央廣合作，推出華語、台灣台語、台灣客語、英語、日語、印尼語、泰語、越南語、菲律賓與、粵語等10種語言讀報。"
                className="py-12 mx-auto h-[30rem]"
              />
            </div>
          </div>
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
          <div className="absolute bottom-16 left-0 right-0">
            <Shared.ShareLink className="justify-center" />
          </div>
          <div className="absolute bottom-4 left-0 right-0">
            <Shared.ModalDonate onClose={onClose} />
          </div>
        </Shared.InnovationSlide>
      </Shared.InnovationSlidesContainer>
    </div>
  );
} 