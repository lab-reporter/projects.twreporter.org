'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';
import InnovationBanner from '../shared/InnovationBanner';

// 媒體項目介面
interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'iframe';
  src: string;
  alt?: string;
  containerClassName?: string; // 外層 div 的自訂樣式
  mediaClassName?: string; // video/img/iframe 元素的自訂樣式
  // iframe 專用屬性
  iframeProps?: {
    title?: string;
    allow?: string;
    allowFullscreen?: boolean;
    sandbox?: string;
    width?: string | number;
    height?: string | number;
  };
}

// 文字區塊介面
interface TextBlock {
  id: string;
  text: string;
  mediaId: string; // 對應的媒體 ID
  triggerPosition?: number;
}

// Innovation6 內容配置
const mediaItems: MediaItem[] = [
  {
    id: 'image1',
    type: 'image',
    src: '/assets/innovations/innovation-6/innovation-6-4.webp',
    alt: '少年報導者上線'
  },
  {
    id: 'spotify1',
    type: 'iframe',
    src: 'https://open.spotify.com/embed/episode/4gEGTTy67t8UZQEbx0Yk3m?utm_source=generator',
    alt: '多語讀報播放器'
  },
  {
    id: 'image2',
    type: 'image',
    src: '/assets/innovations/innovation-6/innovation-6-10.webp',
    alt: '全台首本兒少新聞雜誌書'
  },
  {
    id: 'image3',
    type: 'image',
    src: '/assets/innovations/innovation-6/innovation-6-14.webp',
    alt: '小記者採訪總統候選人'
  },
  {
    id: 'image4',
    type: 'image',
    src: '/assets/innovations/innovation-6/innovation-6-6.webp',
    alt: '少年報導者活動照片'
  }

];

const textBlocks: TextBlock[] = [
  {
    id: 'text1',
    text: '為了促進大人與孩子之間對於公共議題的理解與討論，2022年10月《少年報導者》上線了！',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '自2023年5月，與央廣合作10種語言讀報，讓多元族群孩子也能接觸優質新聞。',
    mediaId: 'spotify1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '2023年8月出版全台首本兒少新聞雜誌書，並串聯企業捐書至偏鄉，讓深度新聞成為知識平權的起點。',
    mediaId: 'image2',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '2024台灣總統大選期間，更帶小記者採訪3位總統候選人，創下台灣總統候選人首度接受兒少採訪的紀錄。《少年報導者》把每個孩子當成獨立的大人，透過深度報導與議題教案，讓老師、家長和孩子一起思辨世界動態。',
    mediaId: 'image3',
    triggerPosition: 0.5
  },
  {
    id: 'text5',
    text: '《少年報導者》把每個孩子當成獨立的大人，透過深度報導與議題教案，讓老師、家長和孩子一起思辨世界動態。',
    mediaId: 'image4',
    triggerPosition: 0.5
  }
];

export default function Innovation6Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <InnovationBanner
        videoSrc={projectData.path}
        title={projectData.title}
        subtitle={projectData.subtitle}
      />

      {/* 滾動觸發的媒體與文字系統 */}
      <Shared.ScrollTriggeredMedia
        mediaItems={mediaItems}
        textBlocks={textBlocks}
        scrollContainer={scrollContainer}
      />

      {/* 導航按鈕 */}
      <Shared.NavigationControls
        onNavigate={onNavigate}
        adjacentProjects={adjacentProjects}
      />
    </Shared.Container>
  );
} 