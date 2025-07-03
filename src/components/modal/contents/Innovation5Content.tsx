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

// Innovation5 內容配置
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
    text: '面對難以迴避的短影音趨勢，《報導者》在2024年推出影音報導，滿足多樣的讀者需求。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '首支影片以「兒少性剝削」為主題，上線即吸引將近30萬人次的觀看。',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '陸續推出的幾支影片主題，包含美國大選、海底電纜、國民法官現場速寫等，都成功吸引大眾關注。',
    mediaId: 'image2',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '根據《2024下半年媒體影響力報告》統計，《報導者》影音在2024年的平均觀看次數在台灣絲路媒體中排名第一。影片不只傳遞新聞，更成為橋梁，召喚觀眾培養理解複雜議題的能力，重新靠近深度報導。',
    mediaId: 'video2',
    triggerPosition: 0.5
  }
];

export default function Innovation5Content({ projectData, onClose, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
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