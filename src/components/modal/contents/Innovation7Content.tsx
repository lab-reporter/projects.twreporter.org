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

// Innovation7 內容配置
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
    text: '《報導者》持續探索深度敘事的多元形式，2022年首度以漫畫開啟感性與視覺的報導新可能。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '透過漫畫的重構，帶領讀者走過主角們親歷的現場。',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '以漫畫形式詮釋深度報導，讓那些費時數月完成的作品，在視覺重構中延續生命力。',
    mediaId: 'image2',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '2022年起攜手蓋亞文化，《報導者事件簿》結合調查報導與圖像敘事，讓讀者對議題產生共感。以「事件簿」為名，期望透過一個又一個的事件，在將來串連成一個更宏觀的時代紀錄。',
    mediaId: 'video2',
    triggerPosition: 0.5
  }
];

export default function Innovation7Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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