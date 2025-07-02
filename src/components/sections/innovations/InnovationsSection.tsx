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

export default function InnovationsSection() {
  const { openModal } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);

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

  useScrollTrigger({
    sectionId: 'section-innovations',
    sectionName: 'innovations'
  });

  // 處理項目點擊
  const handleItemClick = (item: InnovationItem) => {
    openModal(item.id, item);
  };

  // 初始化 GSAP ScrollTrigger
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // 設置所有項目的初始狀態 - 從遠處開始
    innovationItems.forEach((item, index) => {
      const element = document.getElementById(`innovation-item-${item.id}`);
      if (element) {
        // 計算每個項目的深度層次
        const depthLayer = (index % 3) + 1; // 1-3 層深度
        const horizontalSpread = (index % 5 - 2) * 200; // 水平分散
        const verticalSpread = (Math.floor(index / 5) % 3 - 1) * 150; // 垂直分散

        gsap.set(element, {
          x: horizontalSpread,
          y: verticalSpread,
          z: -2000 * depthLayer, // 從很遠的地方開始
          scale: 0.1, // 很小的初始縮放
          opacity: 0.3,
          rotationX: 0,
          rotationY: 0,
          transformOrigin: 'center center'
        });
      }
    });

    // 創建滾動觸發器 - 改為更平滑的連續動畫
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2, // 更平滑的 scrub
      onUpdate: (self) => {
        const progress = self.progress;

        // 更新所有項目的位置 - 連續動畫而不是離散切換
        innovationItems.forEach((item, index) => {
          const element = document.getElementById(`innovation-item-${item.id}`);
          if (!element) return;

          // 計算每個項目的動畫進度（錯開時間）
          const itemDelay = index * 0.1; // 每個項目延遲 0.1
          const itemProgress = Math.max(0, Math.min(1, (progress - itemDelay) * 1.2));

          // 深度層次
          const depthLayer = (index % 3) + 1;
          const horizontalSpread = (index % 5 - 2) * 200;
          const verticalSpread = (Math.floor(index / 5) % 3 - 1) * 150;

          // 計算最終位置（由遠而近）
          const finalZ = itemProgress < 0.5 ?
            -2000 * depthLayer + (itemProgress * 2 * 1800 * depthLayer) : // 前半段：從遠處接近
            -200 + ((itemProgress - 0.5) * 2 * 300); // 後半段：接近並略微前進

          const finalScale = itemProgress < 0.5 ?
            0.1 + (itemProgress * 2 * 0.4) : // 前半段：從很小放大到中等
            0.5 + ((itemProgress - 0.5) * 2 * 0.5); // 後半段：從中等放大到正常

          const finalOpacity = Math.min(1, itemProgress * 3);

          // 計算當前焦點項目
          const focusRange = 0.2; // 焦點範圍
          const itemCenter = itemDelay + 0.5; // 每個項目的中心點
          const distanceFromFocus = Math.abs(progress - itemCenter);
          const isFocused = distanceFromFocus < focusRange;

          // 焦點效果
          const focusScale = isFocused ? 1.2 : 1;
          const focusOpacity = isFocused ? 1 : 0.7;

          gsap.set(element, {
            x: horizontalSpread * (1 - itemProgress * 0.7), // 逐漸聚集到中心
            y: verticalSpread * (1 - itemProgress * 0.7),
            z: finalZ,
            scale: finalScale * focusScale,
            opacity: finalOpacity * focusOpacity,
            overwrite: false
          });

          // 更新當前焦點項目索引
          if (isFocused && itemProgress > 0.3) {
            setCurrentItemIndex(index);
          }
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [innovationItems]);

  const currentItem = currentItemIndex >= 0 ? innovationItems[currentItemIndex] : null;

  return (
    <div ref={sectionRef} id="section-innovations" className="relative w-full h-[1000vh]">
      {/* SectionHeadings */}
      <div className="w-full h-[200vh] relative">
        <div className="w-full h-screen sticky top-0 flex items-center justify-center">
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
      </div>

      {/* 3D 容器 */}
      <div className="w-full h-screen sticky top-0">
        <div
          ref={containerRef}
          className="w-full h-full relative overflow-hidden"
          style={{
            perspective: '3000px', // 增加透視距離
            perspectiveOrigin: 'center center'
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
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  width: '600px', // 稍微小一點
                  height: '600px',
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
  );
}