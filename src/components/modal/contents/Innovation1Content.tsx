'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation1Content({ projectData, onNavigate, adjacentProjects, scrollContainer }: ContentProps) {
  if (!projectData) return null;

  // 定義投影片內容
  const slides = [
    // 第一頁：Banner
    <Shared.InnovationBanner
      key="banner"
      videoSrc={projectData.path}
      title={projectData.title}
      subtitle={projectData.subtitle}
    />,
    
    // 第二頁：遊戲影片與說明
    <Shared.MediaTextSlide
      key="slide1"
      media={{
        type: 'video',
        src: '/assets/innovations/innovation-1/innovation-1-5.webm',
        alt: '急診人生遊戲影片',
        className: 'p-16'
      }}
      text={{
        content: '2015年八仙塵爆凸顯台灣急診雍塞情況，《急診人生》新聞遊戲以真實醫療情境為基礎，邀讀者化身鍵盤醫師，在緊湊操作中體驗急診現場的崩壞與無奈。',
        position: 'bottom',
        className: 'max-w-2xl'
      }}
    />,
    
    // 第三頁：採訪畫面
    <Shared.MediaTextSlide
      key="slide2"
      media={{
        type: 'image',
        src: '/assets/innovations/innovation-1/innovation-1-6.jpg',
        alt: '急診室實地採訪畫面'
      }}
      text={{
        content: '團隊走進急診室實地採訪，將醫師真實處境轉化為遊戲機制，呈現制度與人力的多重壓力。',
        position: 'center',
        className: 'max-w-lg'
      }}
    />,
    
    // 第四頁：遊戲介面
    <Shared.MediaTextSlide
      key="slide3"
      media={{
        type: 'image',
        src: '/assets/innovations/innovation-1/innovation-1-5.jpg',
        alt: '遊戲介面設計'
      }}
      text={{
        content: '操作簡單、風格懷舊，由記者、設計師與工程師協作，重溫童年經營遊戲的手感。',
        position: 'bottom',
        className: 'max-w-xl'
      }}
    />,
    
    // 第五頁：創新意義
    <Shared.MediaTextSlide
      key="slide4"
      media={{
        type: 'image',
        src: '/assets/innovations/innovation-1/innovation-1-3.png',
        alt: '遊戲介面設計'
      }}
      text={{
        content: '從文字到遊戲，是《報導者》邁向沉浸式敘事的實驗，也是新聞接觸更多公眾的全新方式。',
        position: 'center',
        className: 'max-w-lg'
      }}
    />,
    
    // 最後一頁：導航控制
    <div key="navigation" className="flex items-center justify-center h-full">
      <Shared.NavigationControls
        onNavigate={onNavigate}
        adjacentProjects={adjacentProjects}
      />
    </div>
  ];

  return (
    <div data-slide-container="true">
      <Shared.SlideContainer
        scrollContainer={scrollContainer}
        enableModalClose={true}
      >
        {slides}
      </Shared.SlideContainer>
    </div>
  );
}