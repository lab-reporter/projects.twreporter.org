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

// Innovation8 內容配置
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
    text: '深化讀者互動，是非營利媒體不可或缺的使命。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '2020年《報導者》啟動五週年列車前往台灣各地巡迴開講，從高雄傳統市場、台南古老廟宇到離島的金門大學，直接感受、回應讀者的需求與期待。',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '2022年舉辦北中南贊助者大會，串聯台中科博館、台南臺灣文學館、台北當代藝術館，與支持者面對面交流。',
    mediaId: 'image2',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '2024年，更把辦公室打開，舉辦2天共50倍的音樂會。透過黃玠、拍謝少年、巴奈、生祥和裝咖人的音樂，和讀者與贊助者交流彼此關心的議題。《報導者》將持續突破媒體與讀者的界線，讓好新聞在公共場域中產生共感。',
    mediaId: 'video2',
    triggerPosition: 0.5
  }
];

export default function Innovation8Content({ projectData, onClose, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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