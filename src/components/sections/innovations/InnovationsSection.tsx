'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useStore } from '@/stores';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import SectionHeadings from '@/components/shared/SectionHeadings';
import { CurrentItemDisplay } from '@/components/shared';
import projectsData from '@/app/data/projects.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface InnovationItem {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

// 簡化的物件狀態定義
interface ItemState {
  depth: number;    // Z 軸深度 (vw)
  opacity: number;  // 透明度
  blur: number;     // 模糊程度 (px)
  scale: number;    // 縮放比例
}

// 4 種動畫狀態配置
const ANIMATION_STATES = {
  hidden: { depth: -400, opacity: 0, blur: 0, scale: 1 },
  background: { depth: -200, opacity: 0.6, blur: 8, scale: 1 },
  active: { depth: 0, opacity: 1, blur: 0, scale: 1 },
  foreground: { depth: 200, opacity: 0, blur: 8, scale: 1 }
};

// 計算平滑過渡的狀態值
const calculateSmoothState = (currentDepth: number): ItemState => {
  // 在不同狀態之間做線性插值
  if (currentDepth < -300) {
    // hidden 狀態
    return ANIMATION_STATES.hidden;
  } else if (currentDepth < -25) {
    // background 過渡區域 (-300vw 到 -25vw)：從模糊到清晰
    const progress = (currentDepth + 300) / 275; // 0-1 (調整範圍為275vw)
    return {
      depth: currentDepth,
      opacity: 0.6 + (progress * 0.4), // 0.6 -> 1 (逐漸清晰)
      blur: 8 - (progress * 8), // 8 -> 0 (逐漸清晰)
      scale: 1
    };
  } else if (currentDepth < 25) {
    // active 狀態區域 (-25vw 到 25vw)：保持完全清晰
    return {
      depth: currentDepth,
      opacity: 1, // 完全不透明
      blur: 0, // 完全清晰
      scale: 1
    };
  } else if (currentDepth < 50) {
    // foreground 過渡區域 (25vw 到 50vw)：從清晰到模糊淡出
    const progress = (currentDepth - 25) / 25; // 0-1 (範圍為25vw)
    return {
      depth: currentDepth,
      opacity: 1 - (progress * 1), // 1 -> 0 (逐漸淡出)
      blur: 0 + (progress * 8), // 0 -> 8 (逐漸模糊)
      scale: 1
    };
  } else {
    // 完全隱藏 (50vw 以後)
    return {
      depth: currentDepth,
      opacity: 0,
      blur: 8,
      scale: 1
    };
  }
};

export default function InnovationsSection() {
  const { openModal } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  // 滑鼠位置狀態
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // 預先快取元素引用以優化效能
  const elementRefsCache = useRef<Map<string, HTMLElement>>(new Map());

  // Debug 功能控制開關（預設關閉）
  const DEBUG_ENABLED = false;

  // Debug 狀態追蹤
  const [debugInfo, setDebugInfo] = useState<{
    scrollProgress: number;
    items: Array<{
      index: number;
      id: string;
      x: number;
      y: number;
      z: number;
      state: string;
      opacity: number;
      scale: number;
      blur: number;
    }>;
  }>({ scrollProgress: 0, items: [] });

  // 從 projects.json 篩選出 innovation 項目並排序
  const innovationItems = useMemo(() => {
    return projectsData
      .filter((p: any) => p.section && (p.section.includes('innovation') || p.section === 'innovation'))
      .sort((a: any, b: any) => {
        const numA = parseInt(a.id.split('-')[1]);
        const numB = parseInt(b.id.split('-')[1]);
        return numA - numB;
      }) as InnovationItem[];
  }, []);

  // 處理滑鼠移動事件
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 計算滑鼠位置的百分比 (0-100)
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      // 將範圍限制在 40%-60%
      const mappedX = 40 + (x / 100) * 20;
      const mappedY = 40 + (y / 100) * 20;

      setMousePosition({ x: mappedX, y: mappedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useScrollTrigger({
    sectionId: 'section-innovations',
    sectionName: 'innovations'
  });

  // 處理項目點擊
  const handleItemClick = (item: InnovationItem) => {
    openModal(item.id, item);
  };

  // 簡化的動畫邏輯：根據深度判斷狀態
  const getStateByDepth = (depth: number): ItemState => {
    if (depth < -300) return ANIMATION_STATES.hidden;
    if (depth < -50) return ANIMATION_STATES.background;
    if (depth < 50) return ANIMATION_STATES.active;
    return ANIMATION_STATES.foreground;
  };

  // 計算物件的水平和垂直錯位效果
  // 這個函數會根據物件的索引為每個 Innovation 項目分配不同的位置
  // 目的是創造視覺上的層次感和錯落效果，避免所有物件重疊
  const getOffsetPosition = (index: number) => {
    // 水平錯位：使用餘數迴圈創造多種水平位置
    const offsetX = (index % 5 - 2) * 24;
    // 垂直錯位：使用整除和餘數創造多層垂直位置
    const offsetY = (Math.floor(index / 5) % 3 - 1) * 18;
    return { x: offsetX, y: offsetY };
  };

  // 初始化 GSAP ScrollTrigger
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // 預先快取所有元素引用
    elementRefsCache.current.clear();
    innovationItems.forEach((item) => {
      const element = document.getElementById(`innovation-item-${item.id}`);
      if (element) {
        elementRefsCache.current.set(item.id, element);
      }
    });

    // 設置所有項目的初始狀態 - 線性深度排列
    innovationItems.forEach((item, index) => {
      const element = elementRefsCache.current.get(item.id);
      if (element) {
        // 正確的初始深度：第1個在-50vw，第2個在-150vw，第3個在-250vw，第4個在-350vw
        // 第5個開始進入hidden狀態(-450vw以下)
        const initialDepth = -50 - (index * 100);
        const initialState = getStateByDepth(initialDepth);

        // 計算錯位位置
        const offset = getOffsetPosition(index);

        gsap.set(element, {
          x: `${offset.x}vw`, // 水平錯位 (vw)
          y: `${offset.y}vh`, // 垂直錯位 (vh)
          z: `${initialDepth}vw`,
          scale: initialState.scale,
          opacity: initialState.opacity,
          filter: `blur(${initialState.blur}px)`,
          rotationX: 0,
          rotationY: 0,
          transformOrigin: 'center center'
        });
      }
    });

    // 創建滾動觸發器 - 簡化的線性動畫
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
      onUpdate: (self) => {
        const progress = self.progress;

        // 計算總移動距離：讓第10個物件從-950vw移動到50vw (共1000vw)
        const totalDistance = 1000;
        const currentOffset = progress * totalDistance;

        let activeIndex = -1;
        const debugItems: any[] = [];

        // 更新所有項目的位置 - 統一的線性移動
        innovationItems.forEach((item, index) => {
          const element = elementRefsCache.current.get(item.id);
          if (!element) return;

          // 計算當前深度：從正確的初始位置開始移動
          const currentDepth = (-50 - index * 100) + currentOffset;

          // 使用平滑過渡的狀態計算
          const state = calculateSmoothState(currentDepth);

          // 判斷是否為活躍項目 (-25vw 到 25vw)
          if (currentDepth >= -25 && currentDepth <= 25) {
            activeIndex = index;
          }

          // 取得物件的基本錯位位置
          const offset = getOffsetPosition(index);

          // 計算錯位漸變因子：從 background 狀態到 active 狀態過程中逐漸歸零
          // 當物件從 -300vw 移動到 -25vw 時，錯位從 100% 降到 0%
          let offsetFactor = 1; // 預設保持完整錯位
          if (currentDepth >= -300 && currentDepth <= -25) {
            // background 到 active 的過渡階段：錯位逐漸減少
            const transitionProgress = (currentDepth + 300) / 275; // 0-1
            offsetFactor = 1 - transitionProgress; // 從 1 減少到 0
          } else if (currentDepth > -25) {
            // active 狀態及之後：保持無錯位
            offsetFactor = 0;
          }

          // 計算物件的最終位置，在接近 active 狀態時錯位歸零
          const finalX = `${offset.x * offsetFactor}vw`;
          const finalY = `${offset.y * offsetFactor}vh`;

          // 應用狀態到元素（加入 transition 效果）
          gsap.to(element, {
            x: finalX, // 接近時錯位減少
            y: finalY,
            z: `${currentDepth}vw`,
            opacity: state.opacity,
            filter: `blur(${state.blur}px)`,
            scale: state.scale,
            duration: 0.3, // 平滑過渡時間
            ease: "power2.out",
            overwrite: 'auto'
          });

          // 當 opacity 接近 0 時，設為不可見以優化效能
          if (state.opacity < 0.05) {
            gsap.set(element, {
              visibility: 'hidden',
              pointerEvents: 'none'
            });
          } else {
            gsap.set(element, {
              visibility: 'visible',
              pointerEvents: 'auto'
            });
          }

          // 只在 Debug 模式開啟時才收集資訊
          if (DEBUG_ENABLED) {
            let stateName = 'hidden';
            if (currentDepth >= -300 && currentDepth < -25) stateName = 'background';
            else if (currentDepth >= -25 && currentDepth < 25) stateName = 'active';
            else if (currentDepth >= 25 && currentDepth < 50) stateName = 'foreground';
            else if (currentDepth >= 50) stateName = 'invisible';

            debugItems.push({
              index,
              id: item.id,
              x: Math.round(offset.x * offsetFactor * 100) / 100,
              y: Math.round(offset.y * offsetFactor * 100) / 100,
              z: Math.round(currentDepth * 100) / 100,
              state: stateName,
              opacity: Math.round(state.opacity * 100) / 100,
              scale: Math.round(state.scale * 100) / 100,
              blur: state.blur
            });
          }
        });

        // 更新當前活躍項目索引
        if (activeIndex >= 0) {
          setCurrentItemIndex(activeIndex);
        }

        // 只在 Debug 模式開啟時才更新除錯資訊
        if (DEBUG_ENABLED) {
          setDebugInfo({
            scrollProgress: Math.round(progress * 1000) / 1000,
            items: debugItems
          });
        }
      },
    });

    return () => {
      scrollTrigger.kill();
      elementRefsCache.current.clear();
    };
  }, [innovationItems]);

  // 設定定時器在 Debug 模式開啟時輸出除錯資訊到控制台
  useEffect(() => {
    if (!DEBUG_ENABLED) return;

    const interval = setInterval(() => {
      if (debugInfo.items.length > 0) {
        console.table(debugInfo.items.map(item => ({
          Index: item.index,
          ID: item.id,
          X: `${item.x}vw`,
          Y: `${item.y}vh`,
          Z: `${item.z}vw`,
          State: item.state,
          Opacity: item.opacity,
          Scale: item.scale,
          Blur: `${item.blur}px`
        })));
        console.log(`Scroll Progress: ${debugInfo.scrollProgress}`);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [debugInfo, DEBUG_ENABLED]);

  const currentItem = currentItemIndex >= 0 ? innovationItems[currentItemIndex] : null;

  return (
    <>
      {/* SectionHeadings */}
      <div className="w-full h-screen relative flex items-center justify-center">
        <SectionHeadings
          titleEn="INNOVATION"
          titleZh="開放新聞室・創新"
        >
          <p>
            《報導者》與時俱進，不斷創新說故事方式、突破敘事框架、翻新內容形式，讓文字、聲音、影像在開放協作中碰撞出新的可能。<br />
            點點物件，看10年來的新嘗試，你參與了多少呢？
          </p>
        </SectionHeadings>
      </div>
      <div ref={sectionRef} id="section-innovations" className="relative w-full h-[1000vh]">
        {/* 3D 容器 */}
        <div className="w-full h-screen sticky top-0">
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden"
            style={{
              perspective: '1000px', // 降低透視距離以配合 vw 單位
              perspectiveOrigin: `${mousePosition.x}% ${mousePosition.y}%`
            }}
          >
            {/* 3D 場景容器 */}
            <div
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d'
              }}
            >
              {innovationItems.map((item, index) => (
                <div
                  key={item.id}
                  id={`innovation-item-${item.id}`}
                  className="absolute top-1/2 left-1/2 cursor-pointer will-change-transform"
                  style={{
                    // transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                    width: '500px', // 調整尺寸以配合新的動畫
                    height: '500px',
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleItemClick(item)}
                  data-custom-cursor="view"
                >
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <video
                      src={item.path}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ pointerEvents: 'none' }}
                    />
                    {/* 項目資訊覆蓋層 */}
                    <div className="absolute inset-0 hover:border hover:border-red-70 transition-all duration-300 flex items-end">
                      <div className="p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <p className="text-sm opacity-80">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Debug GUI - 左上角 */}
            {DEBUG_ENABLED && process.env.NODE_ENV === 'development' && (
              <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-h-96 overflow-y-auto z-50">
                <div className="mb-3 text-green-400 font-bold">
                  3D Debug Info - Scroll: {debugInfo.scrollProgress}
                </div>
                <div className="space-y-1">
                  {debugInfo.items.map((item) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-4 gap-2 py-1 px-2 rounded ${item.state === 'active' ? 'bg-green-600/30' :
                        item.state === 'background' ? 'bg-yellow-600/30' :
                          item.state === 'foreground' ? 'bg-blue-600/30' :
                            item.state === 'invisible' ? 'bg-red-600/30' :
                              'bg-gray-600/30'
                        }`}
                    >
                      <span className="text-white">{item.index + 1}</span>
                      <span className={`font-bold ${item.state === 'active' ? 'text-green-400' :
                        item.state === 'background' ? 'text-yellow-400' :
                          item.state === 'foreground' ? 'text-blue-400' :
                            item.state === 'invisible' ? 'text-red-400' :
                              'text-gray-400'
                        }`}>{item.state.toUpperCase()}</span>
                      <span className="text-cyan-300">Z:{item.z}</span>
                      <span className="text-pink-300">O:{item.opacity}</span>
                      <span className="col-span-2 text-gray-300 text-xs">
                        X:{item.x}vw Y:{item.y}vh
                      </span>
                      <span className="text-orange-300">S:{item.scale}</span>
                      <span className="text-purple-300">B:{item.blur}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 當前項目資訊顯示 */}
            <div className="absolute bottom-16 w-full">
              <CurrentItemDisplay
                title={currentItem?.title}
                subtitle={currentItem?.subtitle}
              />
            </div>
          </div>
        </div>
      </div>
    </>

  );
}