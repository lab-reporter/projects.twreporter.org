'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';
import InnovationBanner from '../shared/InnovationBanner';

// 媒體項目介面
interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
}

// 文字區塊介面
interface TextBlock {
  id: string;
  text: string;
  mediaId: string; // 對應的媒體 ID
  triggerPosition?: number;
}

// Innovation4 內容配置
const mediaItems: MediaItem[] = [
  {
    id: 'video1',
    type: 'video',
    src: '/assets/innovations/innovation-1.webm',
    alt: '急診人生遊戲影片'
  },
  {
    id: 'image1',
    type: 'image',
    src: '/assets/innovations/innovation-1-1.png',
    alt: '急診室實地採訪畫面'
  },
  {
    id: 'image2',
    type: 'image',
    src: '/assets/innovations/innovation-1-2.jpg',
    alt: '遊戲介面設計'
  },
  {
    id: 'video2',
    type: 'video',
    src: '/assets/innovations/innovation-1-3.webm',
    alt: '沉浸式敘事實驗'
  }
];

const textBlocks: TextBlock[] = [
  {
    id: 'text1',
    text: '2020年8月推出的Podcast節目《The Real Story》，用聲音帶領聽眾理解世界上正在發生的重要事。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '無論是調查現場、國際新聞，聲音成為陪伴聽眾的媒介，也串起跨世代、跨地域的理解與共鳴。',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '香港、馬來西亞、美國、歐洲、中國等海外地區，都有《The Real Story》的聽眾。',
    mediaId: 'image2',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '節目推出至今累積將近3,000萬次收聽，兩度獲卓越新聞獎，也曾入選 KKBOX Podcast 風雲榜年度最佳節目、Apple Podcast 年度十大節目。讓更多的聲音被聽見、把世界不同角落的聲音帶進人們的心，是《報導者》將持續完成的事。',
    mediaId: 'video2',
    triggerPosition: 0.5
  }
];

export default function Innovation4Content({ projectData, onClose, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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