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

// 定義每個 Section 的高度配置 (基於 Combined3DScene.jsx)
const SECTION_HEIGHTS = {
  reports: 300,        // Reports 3D圓柱體場景：300vh (測試用，原本是 800vh)
  innovation: 100,     // Innovation 3D物件場景：100vh
  timeline: 100,       // Timeline 時間軸：100vh
  feedback: 100,       // 贊助者證言：100vh
  support: 100         // 贊助支持：100vh
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

      console.log('🚀 設置 GSAP ScrollTrigger');

      // 主要滾動控制觸發器 - 基於 Combined3DScene.jsx
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress;
          console.log(`📍 GSAP ScrollTrigger - progress: ${progress.toFixed(3)}`);
          
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
            
            console.log(`🎯 當前 Section: ${currentSectionData.id}, progress: ${sectionProgress.toFixed(3)}`);
          }
        },
        id: 'main-scroll-trigger'
      });
      
      scrollTriggers.push(trigger);
    };

    // 延遲初始化確保 DOM 準備就緒
    const timeoutId = setTimeout(initializeScrollTrigger, 100);

    return () => {
      clearTimeout(timeoutId);
      console.log('🧹 清理 ScrollTrigger');
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
            camera={{ position: [0, 0, 10], fov: 45 }}
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
        {false && sections.map((section, index) => (
          <div
            key={section.id}
            className="absolute inset-0 flex items-center justify-center text-white/20 text-6xl font-bold pointer-events-none"
            style={{
              opacity: 0.1,
              zIndex: 2
            }}
          >
            <div className="text-center">
              <div>{section.name}</div>
              <div className="text-2xl mt-4 opacity-50">{section.height}vh</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 除錯資訊顯示 */}
      <div className="fixed bottom-4 left-4 z-50 text-black text-sm bg-white/70 p-4 rounded backdrop-blur-sm border border-gray-300">
        <h3 className="font-bold mb-2">🔧 GSAP ScrollTrigger</h3>
        <p>總高度: {totalVH}vh</p>
        <p>Reports: {SECTION_HEIGHTS.reports}vh</p>
        <p>使用 GSAP 滾動控制</p>
      </div>
    </div>
  );
}