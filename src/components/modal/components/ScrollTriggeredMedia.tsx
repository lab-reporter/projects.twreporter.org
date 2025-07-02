'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

interface ScrollTriggeredMediaProps {
  mediaItems: MediaItem[];
  textBlocks: TextBlock[];
  scrollContainer?: HTMLElement | null;
}

export default function ScrollTriggeredMedia({ mediaItems, textBlocks, scrollContainer }: ScrollTriggeredMediaProps) {
  // 狀態變數：當前顯示的媒體 ID（初始化為第一個文字區塊對應的媒體）
  const [currentMediaId, setCurrentMediaId] = useState(() => {
    return textBlocks[0]?.mediaId || mediaItems[0]?.id || '';
  });
  // DOM 元素參考：媒體容器
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  // DOM 元素參考：影片元素物件（以 ID 為 key）
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  // DOM 元素參考：文字觸發器陣列
  const textTriggersRef = useRef<HTMLDivElement[]>([]);
  
  // Debug 狀態
  const [debugInfo, setDebugInfo] = useState({
    currentTextInView: '',
    currentMedia: '',
    scrollPosition: 0,
    containerHeight: 0,
    triggerStates: [] as any[]
  });

  // Debug: 滾動監聽器
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let actualScrollContainer = scrollContainer;
    if (!actualScrollContainer) {
      actualScrollContainer = document.querySelector('.sidepanel-content')?.parentElement as HTMLElement;
    }

    if (!actualScrollContainer) return;

    let debugInterval: NodeJS.Timeout;

    const updateDebugInfo = () => {
      const containerRect = actualScrollContainer!.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;
      
      // 找到當前在中央的文字區塊
      let currentTextInView = '';
      const triggerStates = textBlocks.map((block, index) => {
        const textElement = textTriggersRef.current[index];
        if (!textElement) return { blockId: block.id, inView: false, distance: 999 };
        
        const textRect = textElement.getBoundingClientRect();
        const textCenter = textRect.top + textRect.height / 2;
        const distance = Math.abs(textCenter - containerCenter);
        const inView = distance < containerRect.height / 2;
        
        if (inView && distance < 100) { // 最接近中央的文字
          currentTextInView = block.id;
        }
        
        return {
          blockId: block.id,
          mediaId: block.mediaId,
          inView,
          distance: Math.round(distance),
          textCenter: Math.round(textCenter),
          containerCenter: Math.round(containerCenter)
        };
      });

      const currentMedia = mediaItems.find(item => item.id === currentMediaId);
      
      const newDebugInfo = {
        currentTextInView,
        currentMedia: currentMedia ? `${currentMedia.id} (${currentMedia.type})` : 'none',
        scrollPosition: Math.round(actualScrollContainer!.scrollTop),
        containerHeight: Math.round(containerRect.height),
        triggerStates
      };

      setDebugInfo(newDebugInfo);

      // Console 輸出調試資訊
      console.log('=== ScrollTriggered Media Debug ===');
      console.log(`當前顯示媒體: ${newDebugInfo.currentMedia}`);
      console.log(`最近中央文字: ${newDebugInfo.currentTextInView}`);
      console.log(`滾動位置: ${newDebugInfo.scrollPosition}px / 容器高度: ${newDebugInfo.containerHeight}px`);
      console.table(newDebugInfo.triggerStates.map(state => ({
        '文字ID': state.blockId,
        '對應媒體': state.mediaId,
        '在視窗內': state.inView ? '✓' : '✗',
        '距離中心': `${state.distance}px`,
        '文字中心位置': `${state.textCenter}px`,
        '容器中心位置': `${state.containerCenter}px`
      })));
      console.log('=====================================');
    };

    // 每200ms更新一次debug資訊
    debugInterval = setInterval(updateDebugInfo, 200);
    
    return () => {
      if (debugInterval) clearInterval(debugInterval);
    };
  }, [textBlocks, mediaItems, currentMediaId, scrollContainer]);

  // 副作用：設定 ScrollTrigger 動畫
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 尋找滾動容器：如果沒有傳入，則查找最近的可滾動父元素
    let actualScrollContainer = scrollContainer;
    if (!actualScrollContainer) {
      // 查找 Modal 的滾動容器
      actualScrollContainer = document.querySelector('.sidepanel-content')?.parentElement as HTMLElement;
      if (!actualScrollContainer) {
        actualScrollContainer = window as any;
      }
    }

    // 註冊 ScrollTrigger 外掛程式
    gsap.registerPlugin(ScrollTrigger);

    // 延遲設定觸發器，確保 DOM 元素已正確渲染
    const setupTriggers = () => {

      // 建立每個文字區塊的滾動觸發器
      const triggers = textBlocks.map((block, index) => {
        const textElement = textTriggersRef.current[index];
        if (!textElement) {
          return null;
        }

        return ScrollTrigger.create({
          // 觸發元素：對應的文字區塊
          trigger: textElement,
          // 指定滾動容器：使用 Modal 內部的滾動容器而非視窗
          scroller: actualScrollContainer,
          // 開始觸發點：文字區塊中心點到達容器中心
          start: 'center center',
          // 結束觸發點：文字區塊中心點離開容器中心向上
          end: 'center center-=1',
          // 進入時執行：切換到對應媒體
          onEnter: () => {
            setCurrentMediaId(block.mediaId);
          },
          // 向上滾動重新進入時執行：切換到對應媒體
          onEnterBack: () => {
            setCurrentMediaId(block.mediaId);
          },
          // 動畫識別 ID
          id: `media-trigger-${block.id}`,
          // 開發時顯示標記
          // 防止初始觸發
          refreshPriority: 1
        });
      });

      return triggers;
    };

    // 延遲執行以確保 DOM 完全渲染
    const timeoutId = setTimeout(() => {
      // 確保初始狀態正確（顯示第一個媒體）
      setCurrentMediaId(textBlocks[0]?.mediaId || mediaItems[0]?.id || '');

      const triggers = setupTriggers();

      // 刷新 ScrollTrigger 以正確計算位置
      ScrollTrigger.refresh();

      // 清理函數：移除所有觸發器
      return () => {
        triggers.forEach(trigger => trigger?.kill());
      };
    }, 200);

    // 立即清理函數
    return () => {
      clearTimeout(timeoutId);
    };
  }, [textBlocks, scrollContainer]);

  // 副作用：處理影片播放控制
  useEffect(() => {

    // 暫停所有影片
    Object.values(videoRefs.current).forEach(video => {
      if (video) video.pause();
    });

    // 找到當前媒體項目
    const currentMedia = mediaItems.find(item => item.id === currentMediaId);
    if (currentMedia?.type === 'video') {
      const currentVideo = videoRefs.current[currentMediaId];
      if (currentVideo) {
        currentVideo.play().catch(() => {});
      }
    }
  }, [currentMediaId, mediaItems]);

  // 渲染媒體元素
  const renderMedia = (media: MediaItem) => {
    const isActive = media.id === currentMediaId;
    const baseStyles = "w-full h-full absolute top-0 left-0 transition-opacity duration-500";
    const visibilityStyles = isActive ? "opacity-100 z-10" : "opacity-0 z-0";

    if (media.type === 'video') {
      return (
        <div key={media.id} className={`${baseStyles} ${visibilityStyles}`}>
          <video
            ref={el => {
              if (el) videoRefs.current[media.id] = el;
            }}
            src={media.src}
            muted
            loop
            className="w-full h-full object-cover"
            style={{ display: isActive ? 'block' : 'none' }}
          />
        </div>
      );
    } else {
      return (
        <div key={media.id} className={`${baseStyles} ${visibilityStyles}`}>
          <img
            src={media.src}
            alt={media.alt || ''}
            className="w-full h-full object-cover"
            loading={isActive ? 'eager' : 'lazy'}
          />
        </div>
      );
    }
  };

  return (
    <>
      {/* Debug 表格 */}
      <div className="fixed top-4 left-4 z-50 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-[600px] overflow-hidden">
        <h3 className="text-yellow-400 font-bold mb-2">ScrollTriggered Media Debug</h3>
        <div className="mb-2">
          <span className="text-green-400">當前顯示媒體：</span> {debugInfo.currentMedia}
        </div>
        <div className="mb-2">
          <span className="text-blue-400">最近中央文字：</span> {debugInfo.currentTextInView}
        </div>
        <div className="mb-2">
          <span className="text-purple-400">滾動位置：</span> {debugInfo.scrollPosition}px / 容器高度：{debugInfo.containerHeight}px
        </div>
        
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-1">文字ID</th>
              <th className="text-left p-1">對應媒體</th>
              <th className="text-left p-1">在視窗內</th>
              <th className="text-left p-1">距離中心</th>
              <th className="text-left p-1">文字中心位置</th>
            </tr>
          </thead>
          <tbody>
            {debugInfo.triggerStates.map((state, index) => (
              <tr key={index} className={`border-b border-gray-700 ${state.inView ? 'bg-green-900' : ''} ${debugInfo.currentTextInView === state.blockId ? 'bg-yellow-900' : ''}`}>
                <td className="p-1">{state.blockId}</td>
                <td className="p-1">{state.mediaId}</td>
                <td className="p-1">{state.inView ? '✓' : '✗'}</td>
                <td className="p-1">{state.distance}px</td>
                <td className="p-1">{state.textCenter}px</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 媒體顯示區域：固定在背景 */}
      <div ref={mediaContainerRef} className="fixed w-full h-[92vh] overflow-hidden z-0">
        {mediaItems.map(media => renderMedia(media))}
      </div>

      {/* 文字觸發區域：滾動內容 */}
      <div className="w-full relative z-10">
        {textBlocks.map((block, index) => (
          <div
            key={block.id}
            ref={el => {
              if (el) textTriggersRef.current[index] = el;
            }}
            className="w-full h-screen flex justify-center items-center"
          >
            <div className="px-4 py-2 max-w-[20rem] bg-white bg-opacity-70 backdrop-blur-lg border border-black rounded-lg">
              {block.text}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}