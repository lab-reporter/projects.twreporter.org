"use client";

import { useEffect, useState } from 'react';

// 產生隨機方塊參數
function getRandomBlockData(id, now) {
  const minWidth = 12, maxWidth = 60;
  const width = Math.random() * (maxWidth - minWidth) + minWidth;
  const height = (width * 4) / 3;

  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotX: Math.random() < 0.5 ? -(Math.random() * 30 + 30) : (Math.random() * 30 + 30),
    rotY: Math.random() < 0.5 ? -(Math.random() * 30 + 30) : (Math.random() * 30 + 30),
    rotZ: Math.random() < 0.5 ? -(Math.random() * 30 + 30) : (Math.random() * 30 + 30),
    width,
    height,
    state: "appear", // "appear" | "stable" | "disappear"
    updateAt: now,    // 狀態更新時間
  };
}

export default function BackgroundBlocks({ className }) {
  const blockCount = 100;
  const duration = 10000; // 10秒穩定
  const appearDuration = 200; // 0.2秒
  const disappearDuration = 200; // 0.2秒

  // 所有方塊資料
  const [blocks, setBlocks] = useState(() => {
    const now = Date.now();
    return Array.from({ length: blockCount }, (_, i) =>
      getRandomBlockData(i, now)
    );
  });

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      setBlocks(prev => {
        const now = Date.now();
        const newBlocks = [...prev];

        // 把即將消失的狀態切換回 stable（動畫結束後）
        newBlocks.forEach(block => {
          if (block.state === "disappear" && now - block.updateAt > disappearDuration) {
            Object.assign(block, getRandomBlockData(block.id, now));
            block.state = "appear";
            block.updateAt = now;
          }
          if (block.state === "appear" && now - block.updateAt > appearDuration) {
            block.state = "stable";
            block.updateAt = now;
          }
        });

        // 讓下一個進入消失
        const nextIdx = idx % blockCount;
        if (newBlocks[nextIdx].state === "stable" && now - newBlocks[nextIdx].updateAt > duration) {
          newBlocks[nextIdx].state = "disappear";
          newBlocks[nextIdx].updateAt = now;
          idx++;
        }
        return newBlocks;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className || ''}`}
      style={{ perspective: '1000px' }}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          className={`absolute
            ${block.state === 'appear' ? 'block-appear' : ''}
            ${block.state === 'disappear' ? 'block-disappear' : ''}
          `}
          style={{
            left: `${block.x}%`,
            top: `${block.y}%`,
            width: `${block.width}px`,
            height: `${block.height}px`,
            background: 'linear-gradient(to bottom, #CCCCCC, #AAAAAA)',
            transform: `translate(-50%, -50%) rotateX(${block.rotX}deg) rotateY(${block.rotY}deg) rotateZ(${block.rotZ}deg)`,
            opacity: block.state === 'stable' ? 1 : undefined,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}