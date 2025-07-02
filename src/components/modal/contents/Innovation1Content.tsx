'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';
import ScrollTriggeredMedia from '../components/ScrollTriggeredMedia';

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

// Innovation1 內容配置
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
    text: '2015年八仙塵爆凸顯台灣急診雍塞情況，《急診人生》新聞遊戲以真實醫療情境為基礎，邀讀者化身鍵盤醫師，在緊湊操作中體驗急診現場的崩壞與無奈。',
    mediaId: 'video1',
    triggerPosition: 0.5
  },
  {
    id: 'text2',
    text: '團隊走進急診室實地採訪，將醫師真實處境轉化為遊戲機制，呈現制度與人力的多重壓力。',
    mediaId: 'image1',
    triggerPosition: 0.5
  },
  {
    id: 'text3',
    text: '操作簡單、風格懷舊，由記者、設計師與工程師協作，重溫童年經營遊戲的手感。',
    mediaId: 'image2',
    triggerPosition: 0.5
  },
  {
    id: 'text4',
    text: '從文字到遊戲，是《報導者》邁向沉浸式敘事的實驗，也是新聞接觸更多公眾的全新方式。',
    mediaId: 'video2',
    triggerPosition: 0.5
  }
];

export default function Innovation1Content({ projectData, onClose, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      {/* 滾動觸發的媒體與文字系統 */}
      <ScrollTriggeredMedia
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