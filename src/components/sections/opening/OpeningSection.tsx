'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// 照片數據結構
type PhotoData = {
  id: string;
  src: string;
  top: string;
  right: string;
  width: string;
};

// 照片數據陣列
const photosData: PhotoData[] = [
  { id: 'img1', src: '/assets/img1.png', top: '0%', right: '50%', width: '15%' },
  { id: 'img2', src: '/assets/img2.png', top: '10%', right: '0%', width: '40%' },
  { id: 'img3', src: '/assets/img3.png', top: '30%', right: '70%', width: '20%' },
  { id: 'img4', src: '/assets/img4.png', top: '60%', right: '80%', width: '25%' },
  { id: 'img5', src: '/assets/img5.png', top: '64%', right: '37%', width: '28%' },
  { id: 'img6', src: '/assets/img6.png', top: '0%', right: '80%', width: '20%' }
];

// 開場動畫區塊組件
export default function OpeningSection() {
  // 使用滾動觸發器來監控當前頁面位置
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-opening',
    // 頁面名稱識別
    sectionName: 'opening'
  });

  // 3D 容器引用
  const containerRef = useRef<HTMLDivElement>(null);
  // 照片引用陣列
  const photosRef = useRef<(HTMLImageElement | null)[]>([]);
  // 滑鼠位置狀態
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

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

  // GSAP 動畫初始化
  useEffect(() => {
    if (photosRef.current.length > 0) {
      // 設定照片初始位置（在畫面外）
      gsap.set(photosRef.current, {
        right: '150%'
      });

      // 延遲後開始動畫
      gsap.delayedCall(0.5, () => {
        // 為每張照片設定動畫到目標位置
        photosRef.current.forEach((photo, index) => {
          if (photo) {
            gsap.to(photo, {
              right: photosData[index].right,
              duration: 1,
              delay: index * 0.1,
              ease: 'power3.out'
            });
          }
        });
      });
    }
  }, []);

  return (
    // 主要開場區塊：黏性定位的全螢幕區域
    <section
      // 頁面錨點 ID
      id="section-opening"
      className="sticky top-0 w-full h-screen overflow-hidden relative z-0"
      style={{
        // 設定網格背景圖案
        backgroundImage: 'url(/assets/bg_grid.svg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* 3D 容器：設定透視效果 */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 m-auto"
        style={{
          // 保持 3D 變換效果
          transformStyle: 'preserve-3d',
          // 設定透視距離
          perspective: '500px',
          // 根據滑鼠位置動態設定透視中心點
          perspectiveOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
        }}
      >
        {/* 左側面：3D 立方體的左面 */}
        <div
          className="w-full h-full absolute border-t-2 border-b-2 border-gray-200"
          style={{
            // Y 軸旋轉 90 度
            transform: 'rotateY(90deg)',
            // 以左邊為旋轉軸心
            transformOrigin: 'left',
          }}
        >
          {/* 動態生成照片元件 */}
          {photosData.map((photo, index) => (
            <img
              key={photo.id}
              ref={(el) => {
                photosRef.current[index] = el;
              }}
              src={photo.src}
              className="absolute h-auto shadow-lg"
              style={{
                top: photo.top,
                right: photo.right,
                width: photo.width,
              }}
              alt=""
            />
          ))}
        </div>

        {/* 右側面：3D 立方體的右面 */}
        <div
          className="w-full h-full absolute border-t-2 border-b-2 border-gray-200"
          style={{
            // Y 軸旋轉 -90 度
            transform: 'rotateY(-90deg)',
            // 以右邊為旋轉軸心
            transformOrigin: 'right',
          }}
        ></div>

        {/* 頂面：3D 立方體的上面 */}
        <div
          className="w-full h-full absolute"
          style={{
            // X 軸旋轉 -90 度
            transform: 'rotateX(-90deg)',
            // 以頂部為旋轉軸心
            transformOrigin: 'top center',
          }}
        ></div>

        {/* 底面：3D 立方體的下面 */}
        <div
          className="w-full h-full absolute"
          style={{
            // X 軸旋轉 90 度
            transform: 'rotateX(90deg)',
            // 以底部為旋轉軸心
            transformOrigin: 'bottom center',
          }}
        ></div>

        {/* 背面：3D 立方體的中央 */}
        <div
          className="w-full h-full absolute flex items-center justify-center border-2 border-gray-200"
          style={{
            // Z 軸向後移動
            transform: 'translateZ(-1400px)',
          }}
        >
        </div>
      </div>
    </section>
  );
}