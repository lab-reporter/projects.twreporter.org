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

// Innovation3 內容配置
const mediaItems: MediaItem[] = [
  {
    id: 'video1',
    type: 'video',
    src: '/assets/innovations/innovation-3/innovation-3-5.webm',
    alt: '報導者開放實驗室螢幕錄影畫面',
    mediaClassName: 'object-cover'
  },
  {
    id: 'image1',
    type: 'image',
    src: '/assets/innovations/innovation-3/innovation-3-1.jpeg',
    alt: '新聞敘事元件庫討論'
  },
  {
    id: 'video2',
    type: 'video',
    src: '/assets/innovations/innovation-3/innovation-3-3.webm',
    alt: '左右互搏',
    mediaClassName: 'object-cover'
  },
  {
    id: 'video3',
    type: 'video',
    src: '/assets/innovations/innovation-3/innovation-3-6.webm',
    alt: '沉浸式敘事實驗',
    mediaClassName: 'object-cover'
  }
];

const textBlocks: TextBlock[] = [
  {
    id: 'text1',
    text: '「開放」是《報導者》的重要核心精神。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '從創立之初就開創的「報導者開放實驗室」，記載團隊關於深度報導與數位敘事的方法論。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '為提升數位敘事報導的製作效率，工程師自2020年起打造可重複使用的新聞敘事元件，取代過往一次性開發模式。',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '元件設計強調通用性，不需程式背景、任何人都能透過內容編輯介面直接應用。',
    mediaId: 'video2',
    triggerPosition: 0.5
  },
  {
    id: 'text5',
    text: '延續開放精神，數位敘事元件庫同步開放外界使用。',
    mediaId: 'video3',
    triggerPosition: 0.5
  },
  {
    id: 'text6',
    text: '目前元件庫已收錄7款工具，濃縮《報導者》10年來的數位敘事經驗，為新聞報導開創更多視覺與互動的可能。',
    mediaId: 'video3',
    triggerPosition: 0.5
  }
];

export default function Innovation3Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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