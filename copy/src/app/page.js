"use client";

import { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation'
import SectionNavigation from './components/SectionNavigation'
import Footer from './components/Footer'

// 引入section文件夹中的组件
import Path from './section/Path'
import Support from './section/Support';
import Feedback from './section/Feedback';
import CallToAction from './section/CallToAction';
import Preloader from './section/Preloader';
import Combined3DScene from './section/Combined3DScene';
import { UiProvider, useUiContext } from './context/UiContext'
import SidePanel from './components/SidePanel';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Open from './section/Open';
import gsap from 'gsap';

// 主頁面內容組件
function HomeContent() {
  const { isSidePanelOpen, setIsSidePanelOpen } = useUiContext();
  const [selectedProject, setSelectedProject] = useState(null);
  // 新增sidePanelContent狀態管理
  const [sidePanelContent, setSidePanelContent] = useState({
    ContentComponent: null,
    contentProps: {}
  });

  // 當頁面重新載入時，立即重置滾動位置並確保背景色正確
  useEffect(() => {
    // 禁用瀏覽器的滾動位置恢復
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }

    // 立即重置滾動位置到頁面頂部
    window.scrollTo(0, 0);

    // 延遲執行滾動重置，確保頁面完全加載
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  // 處理關閉側邊欄
  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);

    // 延遲刷新 GSAP ScrollTrigger，確保狀態正確
    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 300);
  };

  // 頁面重載時重置滾動位置
  const resetScrollPosition = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navigation />
      <SectionNavigation />

      <main>
        {/* 預載動畫 */}
        <Preloader />

        <Open />

        {/* Combined 3D Scene - 整合 Reports 和 Innovation */}
        <section id="combined-3d-section">
          <Combined3DScene
            setSelectedProject={setSelectedProject}
            setSidePanelContent={setSidePanelContent}
          />
        </section>

        <Path
          setSelectedProject={setSelectedProject}
          setSidePanelContent={setSidePanelContent}
        />


        <div className="call-to-action" id="call-to-action">
          <div className='w-full h-[50vh] bg-gradient-to-t from-black to-transparent'></div>
          <CallToAction>
            <section className="feedback-section" id="feedback-section">
              <Feedback
                setSelectedProject={setSelectedProject}
                setSidePanelContent={setSidePanelContent}
              />
            </section>
            <section className="support-section" id="support-section">
              <Support />
            </section>

            {/* 頁腳 */}
            <Footer />
          </CallToAction>
        </div>
      </main>

      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={handleCloseSidePanel}
        projectData={selectedProject}
        ContentComponent={sidePanelContent.ContentComponent}
        contentProps={sidePanelContent.contentProps}
        setSelectedProject={setSelectedProject}
        setSidePanelContent={setSidePanelContent}
      />
    </>
  );
}

// 對外暴露的主頁面組件，包含 UiProvider
export default function Home() {
  // 頁面掛載時設置滾動恢復模式
  useEffect(() => {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }

    // 讓所有 ScrollTrigger 重新計算位置，但保持背景色狀態
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500); // 增加延遲時間，確保頁面已經重置
    }

    // 監聽 resize 事件，但避免頻繁的 refresh
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 250); // 延遲250ms執行，避免resize時頻繁觸發
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <UiProvider>
      <HomeContent />
    </UiProvider>
  );
}
