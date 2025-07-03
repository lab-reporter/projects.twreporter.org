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

// Innovation9 內容配置
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
    mediaId: 'video2',
    triggerPosition: 0.5
  }
];

export default function Innovation9Content({ projectData, onClose, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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