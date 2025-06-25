'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/stores';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 動態載入 3D 組件
const UnifiedScene = dynamic(() => import('@/components/UnifiedScene'), {
  ssr: false,
  loading: () => null
});

// 註冊 GSAP 插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 定義每個 Section 的高度配置
const SECTION_HEIGHTS = {
  reports: 500,        // Reports 3D 圓柱體場景高度
  innovation: 500,     // Innovation 3D 物件場景高度
  timeline: 500,       // Timeline 時間軸高度
  feedback: 500,       // 贊助者證言高度
  support: 500         // 贊助支持高度
};

const sections = [
  { id: 'reports', name: '影響力報導', height: SECTION_HEIGHTS.reports },
  { id: 'innovation', name: '多元創新', height: SECTION_HEIGHTS.innovation },
  { id: 'timeline', name: '非營利媒體之路', height: SECTION_HEIGHTS.timeline },
  { id: 'feedback', name: '贊助者證言', height: SECTION_HEIGHTS.feedback },
  { id: 'support', name: '贊助支持', height: SECTION_HEIGHTS.support }
];

export default function SectionTriggers() {
  const sectionRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const { setCurrentSection, setSectionProgress, currentSection } = useStore();
  const [currentProject, setCurrentProject] = useState<any>(null);
  
  // 計算總高度
  const totalVH = sections.reduce((sum, s) => sum + s.height, 0);

  // 處理當前項目變化
  const handleCurrentProjectChange = (project: any) => {
    setCurrentProject(project);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let scrollTriggers: ScrollTrigger[] = [];

    const initializeScrollTrigger = () => {
      if (!sectionRef.current) return;

      // 主要滾動控制觸發器 - 基於 Combined3DScene.jsx
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // 計算當前 section
          let accumulatedProgress = 0;
          let currentSectionData = null;
          let sectionProgress = 0;
          
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionWeight = section.height / totalVH;
            
            if (progress >= accumulatedProgress && progress < accumulatedProgress + sectionWeight) {
              currentSectionData = section;
              sectionProgress = (progress - accumulatedProgress) / sectionWeight;
              break;
            }
            
            accumulatedProgress += sectionWeight;
          }
          
          if (!currentSectionData) {
            currentSectionData = sections[sections.length - 1];
            sectionProgress = 1;
          }
          
          if (currentSectionData) {
            setCurrentSection(currentSectionData.id);
            setSectionProgress(sectionProgress);
          }
        },
        id: 'main-scroll-trigger'
      });
      
      scrollTriggers.push(trigger);
    };

    // 延遲初始化確保 DOM 準備完成
    const timeoutId = setTimeout(initializeScrollTrigger, 100);

    return () => {
      clearTimeout(timeoutId);
      scrollTriggers.forEach(trigger => trigger.kill());
      ScrollTrigger.clearScrollMemory();
    };
  }, [setCurrentSection, setSectionProgress, totalVH]);

  return (
    <div
      ref={sectionRef}
      className="relative overflow-visible"
      style={{
        height: `${totalVH}vh`
      }}
      id="main-3d-section"
    >
      {/* Sticky 3D Canvas 容器 - 基於 Combined3DScene.jsx */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 bg-transparent"
          style={{ zIndex: 1 }}
        >
          <Canvas
            camera={{ 
              position: [0, 0, 10], 
              fov: 45,
              near: 0.01,  // 更小的 near 值，讓近距離物件可見
              far: 1000    // 更大的 far 值，讓遠距離物件可見
            }}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
            dpr={[1, 2]}
            style={{ cursor: 'auto' }}
            onPointerMissed={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            <Suspense fallback={null}>
              <UnifiedScene onCurrentProjectChange={handleCurrentProjectChange} />
            </Suspense>
          </Canvas>
        </div>

        {/* Reports Title - 參照原版 Combined3DScene.jsx */}
        {currentSection === 'reports' && currentProject && (
          <div className="absolute w-full px-2 bottom-12 left-1/2 -translate-x-1/2 text-center z-10 text-black">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              {currentProject.title}
            </h2>
            <h3 className="text-xl sm:text-2xl">
              {currentProject.subtitle}
            </h3>
          </div>
        )}
        
        {/* Section 內容疊加 - 已移除，用戶要求不顯示半透明 section 名稱 */}
      </div>
    </div>
  );
}