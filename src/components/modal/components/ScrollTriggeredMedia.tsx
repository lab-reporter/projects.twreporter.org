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



  // 副作用：設定 ScrollTrigger 動畫
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 註冊 ScrollTrigger 外掛程式
    gsap.registerPlugin(ScrollTrigger);

    // 延遲設定觸發器，確保 DOM 元素已正確渲染
    const setupTriggers = () => {
      // 尋找滾動容器：優先使用傳入的容器，否則查找 Modal 的滾動容器
      let actualScrollContainer = scrollContainer;
      if (!actualScrollContainer) {
        // 查找 Modal 的滾動容器
        actualScrollContainer = document.querySelector('.sidepanel-content')?.parentElement as HTMLElement;
      }

      // 建立每個文字區塊的滾動觸發器
      const triggers = textBlocks.map((block, index) => {
        const textElement = textTriggersRef.current[index];
        if (!textElement) {
          return null;
        }

        return ScrollTrigger.create({
          // 觸發元素：對應的文字區塊
          trigger: textElement,
          // 指定滾動容器：使用找到的容器，如果找不到則使用默認（window）
          scroller: actualScrollContainer || undefined,
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
          // 防止初始觸發
          refreshPriority: 1
        });
      });

      return triggers.filter(trigger => trigger !== null);
    };

    // 延遲執行以確保 DOM 完全渲染
    const timeoutId = setTimeout(() => {
      // 確保初始狀態正確（顯示第一個媒體）
      const initialMediaId = textBlocks[0]?.mediaId || mediaItems[0]?.id || '';
      setCurrentMediaId(initialMediaId);

      const triggers = setupTriggers();

      // 延遲刷新以確保佈局完成
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // 清理函數：移除所有觸發器
      return () => {
        triggers.forEach(trigger => trigger?.kill());
      };
    }, 500); // 增加延遲時間確保 Modal 完全載入

    // 立即清理函數
    return () => {
      clearTimeout(timeoutId);
    };
  }, [textBlocks, scrollContainer, mediaItems]);

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
        currentVideo.play().catch(() => { });
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