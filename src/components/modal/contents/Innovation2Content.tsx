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

// Innovation2 內容配置
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
    text: '《報導者》長期致力於創新的數位敘事方式。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '在成立初期，就以「海上人口販運風暴」的互動網頁和「六輕營運20年」的解釋性動畫獲得重要國際獎項 SND 最佳新聞設計創意競賽肯定。',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '除了平面動態，也經常運用3D敘事、資料視覺化、沉浸式互動等方法說故事。',
    mediaId: 'image2',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '2022年俄烏戰爭爆發之際，使用華文媒體少見的 Live Blog 形式更新戰事最新動態，並前往歐洲製作 360 影片，把現場的畫面帶回給台灣讀者。',
    mediaId: 'video2',
    triggerPosition: 0.5
  },
  {
    id: 'text5',
    text: '這些多媒體作品擴展了敘事邊界與讀者參與方式，也讓新聞的影響力延伸得更遠。',
    mediaId: 'video1',
    triggerPosition: 0.5
  }
];

export default function Innovation2Content({ projectData, onClose, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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