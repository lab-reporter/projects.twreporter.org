import React, { useMemo, useState, useEffect } from 'react';

const StackCards = ({ images = [], className = '' }) => {
  // 預設使用 img11-15 的圖片
  const defaultImages = [
    'https://www.twreporter.org/images/20220107012709-2e8db2b00016dbda5cfadd0d322af3bd-desktop.jpg',
    'https://www.twreporter.org/images/20220106143940-3cee150ea39553ab9db2fc5a1abcbb83-desktop.jpg',
    'https://www.twreporter.org/images/20220106150014-7001bb404d69335d811cb1b1ab6a7a78-desktop.jpg',
    'https://www.twreporter.org/images/20220225145705-f8bd10d43af83d0082c3964cbfd48ced-desktop.jpg',
    'https://www.twreporter.org/images/20220225145811-1ccd917fb37f80eb6e093a1ba66cb20c-desktop.jpg'
  ];

  const imageList = images.length > 0 ? images : defaultImages;
  const [isClient, setIsClient] = useState(false);

  // 確保只在客戶端執行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 使用固定的種子來生成一致的隨機值
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 為每張圖片生成隨機的 rotate 和 translateY 值
  const randomTransforms = useMemo(() => {
    if (!isClient) {
      // 伺服器端渲染時返回預設值
      return imageList.map(() => ({
        rotate: 0,
        translateY: 0
      }));
    }

    return imageList.map((_, index) => ({
      rotate: seededRandom(index * 123.456) * 20 - 10, // -10 到 10 度
      translateY: seededRandom(index * 789.012) * 10 - 5 // -5vh 到 5vh
    }));
  }, [imageList.length, isClient]);

  return (
    <div className={`w-full min-h-screen relative ${className}`}>
      <div className="relative w-full h-full">
        {imageList.map((imageUrl, index) => (
          <div
            key={index}
            className="sticky top-0 w-full h-screen flex justify-center items-center md:h-screen sm:h-[80vh]"
            style={{
              zIndex: index,
            }}
          >
            <div
              className="w-[100%] max-w-4xl max-h-[80vh] bg-white shadow-2xl overflow-hidden relative transition-transform duration-300 ease-out hover:rotate-0 border-8 border-white"
              style={{
                transform: `rotate(${randomTransforms[index]?.rotate || 0}deg) translateY(${randomTransforms[index]?.translateY || 0}vh)`,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={imageUrl}
                alt={`堆疊卡片 ${index + 1}`}
                className="w-full h-full object-contain block"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackCards; 