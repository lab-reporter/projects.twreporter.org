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

// Innovation9 內容配置
const mediaItems: MediaItem[] = [
  {
    id: 'video1',
    type: 'video',
    src: '/assets/innovations/innovation-9/innovation-9-11.webm',
    alt: '《報導者》攝影專欄'
  },
  {
    id: 'image1',
    type: 'image',
    src: '/assets/innovations/innovation-9/innovation-9-10.webp',
    alt: '深度影像工作坊'
  },
  {
    id: 'image2',
    type: 'image',
    src: '/assets/innovations/innovation-9/攝影集.webp',
    alt: '新聞攝影集'
  },
  {
    id: 'image3',
    type: 'image',
    src: '/assets/innovations/innovation-9/innovation-9-4.webp',
    alt: '攝影展'
  },
  {
    id: 'image4',
    type: 'image',
    src: '/assets/innovations/innovation-9/innovation-9-1.webp',
    alt: '攝影集錦'
  }
];

const textBlocks: TextBlock[] = [
  {
    id: 'text1',
    text: '《報導者》以攝影專欄推動影像識讀，產製並徵集圖輯、評論、導讀與訪談，打造影像知識網絡。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '連續8年舉辦「深度影像工作坊」，培力新聞攝影新世代，扶植X位年輕人才轉任正職或特約攝影記者。',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '出版新聞攝影集並舉辦展覽，拓展影像公共參與的想像與可能。',
    mediaId: 'image2',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '透過合理分潤與影像共享機制，與攝影者建立共好關係，讓影像資產延續價值。《報導者》累積大量影像作品、資料與論述，用視覺書寫關於這片土地的記憶。',
    mediaId: 'image3',
    triggerPosition: 0.5
  },
  {
    id: 'text5',
    text: '《報導者》累積大量影像作品、資料與論述，用視覺書寫關於這片土地的記憶。',
    mediaId: 'image4',
    triggerPosition: 0.5
  }
];

export default function Innovation9Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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