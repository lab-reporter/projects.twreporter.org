'use client';

import Image from 'next/image';

// 主導航組件
const Navigation = () => {
  return (
    <>
      {/* 導航外層容器：永遠顯示在最上層 */}
      <div
        id="main-navigation"
        className="w-full fixed flex justify-center items-center z-[99] text-black"
      >
        {/* 導航內容容器 */}
        <div className="mx-auto w-auto h-auto flex flex-row justify-between items-center rounded-sm">
          {/* 網站標誌 */}
          <Image
            src="/assets/nav_logo--light.svg"
            alt="Logo"
            width={160}
            height={40}
            priority={true}
            className="h-10 w-auto"
          />
        </div>
      </div>
    </>
  );
};

export default Navigation;