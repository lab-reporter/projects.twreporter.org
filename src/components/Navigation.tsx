'use client';

const Navigation = () => {
  return (
    <>
      {/* navigation 外層容器 - 永遠顯示 */}
      <div className="w-full fixed top-4 right-auto left-auto flex justify-center items-center z-[9999] text-black">
        {/* navigation 本體 */}
        <div className="mx-auto w-auto h-auto flex flex-row justify-between items-center rounded-sm">
          {/* LOGO */}
          <img
            className="h-10 w-auto"
            src="/assets/nav_logo--light.svg"
            alt="Logo"
          />
        </div>
      </div>
    </>
  );
};

export default Navigation; 