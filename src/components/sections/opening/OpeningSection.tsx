'use client';

import { useScrollTrigger } from '@/hooks/useScrollTrigger';

// 開場動畫區塊組件
export default function OpeningSection() {
  // 使用滾動觸發器來監控當前頁面位置
  useScrollTrigger({
    // 對應的 HTML 元素 ID
    sectionId: 'section-opening',
    // 頁面名稱識別
    sectionName: 'opening'
  });

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
        className="w-full h-full absolute inset-0 m-auto"
        style={{
          // 保持 3D 變換效果
          transformStyle: 'preserve-3d',
          // 設定透視距離
          perspective: '300px',
          // 設定透視中心點
          perspectiveOrigin: 'center center',
        }}
      >
        {/* 左側面：3D 立方體的左面 */}
        <div
          className="w-full h-full absolute"
          style={{
            // Y 軸旋轉 90 度
            transform: 'rotateY(90deg)',
            // 以左邊為旋轉軸心
            transformOrigin: 'left',
          }}
        >
          {/* 預留圖片位置（已註解） */}
          {/* <img src="/assets/img2.png" className="absolute top-[10%] right-[0%] w-[40%] h-auto" alt="" /> */}
        </div>

        {/* 右側面：3D 立方體的右面 */}
        <div
          className="w-full h-full absolute"
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
            transformOrigin: 'top',
          }}
        ></div>

        {/* 底面：3D 立方體的下面 */}
        <div
          className="w-full h-full absolute"
          style={{
            // X 軸旋轉 90 度
            transform: 'rotateX(90deg)',
            // 以底部為旋轉軸心
            transformOrigin: 'bottom',
          }}
        ></div>

        {/* 背面：3D 立方體的後面 */}
        <div
          className="w-full h-full absolute flex items-center justify-center"
          style={{
            // Z 軸向後移動
            transform: 'translateZ(-800px)',
          }}
        >
        </div>
      </div>
    </section>
  );
}