"use client";

/*
 * SupportCutSceneSection - Cut Scene 動畫組件
 * 
 * 動畫流程：
 * 1. 中央行顯示 (0.2~0.3) - 中央行方塊逐一出現
 * 2. 全部行顯示 (0.3~0.4) - 從中央向上下擴散顯示所有行
 * 3. 水平移動 (0.33~0.8) - 各行進行水平位移，形成波浪效果
 * 4. 縮放放大 (0.35~1.0) - 整個格線放大 30 倍
 * 5. 淡出消失 (0.8~0.95) - 所有方塊淡出
 */

import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import gsap from "gsap";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 單一文字方塊組件
// visible: 控制顯示/隱藏，opacity: 控制透明度（淡出動畫用）
const Box = ({
  text,
  visible,
  opacity = 1,
}: {
  text: string;
  visible: boolean;
  opacity?: number;
}) => (
  <div
    className={`border rounded-full border-white text-white px-4 py-2 whitespace-nowrap -mr-px ${!visible && "invisible"
      }`}
  >
    {/* 透過 style 控制透明度，支援動態數值變化 */}
    <span style={{ opacity }}>{text}</span>
  </div>
);

// 文字方塊列組件
// progress: 控制顯示進度 (0~1)，offset: 水平位移係數，fadeProgress: 淡出進度
const Row = ({
  length = 0,
  progress,
  offset,
  fadeProgress = 0,
}: {
  length?: number;
  progress: number;
  offset: number;
  fadeProgress: number;
}) => {
  return (
    <div
      className="flex -mb-px"
      style={{
        // translateX 實現水平移動，負值向左移動
        transform: `translateX(-${offset * 100}%)`,
      }}
    >
      {new Array(length).fill(true).map((_, index) => {
        // 顯示邏輯：index / length < progress
        // 例如 progress=0.5 時，顯示前半段的方塊
        const visible = index / length < progress;

        return (
          <Box
            key={index}
            // 文字內容交替：偶數索引 "Let's Support"，奇數索引 "Reporter"
            text={index % 2 === 0 ? "Reporter" : "Reporter"}
            visible={visible}
            // 透明度：1 - fadeProgress，實現淡出效果
            opacity={1 - fadeProgress}
          />
        );
      })}
    </div>
  );
};

// 將整體滾動進度 (0~1) 分割成 5 個動畫階段
const getCurrentProgress = (overallProgress: number) => {
  // 限制數值在 0~1 範圍內
  const clamp = (num: number) => Math.max(Math.min(num, 1), 0);

  // 將特定區間 (start~end) 映射到 0~1
  const progress = (start: number, end: number) =>
    clamp((overallProgress - start) / (end - start));

  return {
    centerRow: progress(0.2, 0.3),   // 中央行顯示
    allRow: progress(0.3, 0.4),      // 全部行顯示
    move: progress(0.33, 0.8),       // 水平移動
    zoom: progress(0.35, 1),         // 縮放放大
    fade: progress(0.8, 0.95),       // 淡出消失
  };
};

// 五次方緩入函數：開始慢，然後急劇加速，用於 zoom 動畫
function easeInQuint(x: number): number {
  return x * x * x * x * x;
}

// 正弦波緩入緩出函數：開始和結束較慢，中間較快，用於 move 動畫
function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

// 主要網格組件：根據滾動進度動態生成多列 Row
const Grid = ({
  length = 17,
  progress,
}: {
  length?: number;
  progress: number;
}) => {
  const currentProgress = getCurrentProgress(progress);

  // 取得視窗尺寸計算響應式縮放
  const size = useWindowSize();
  const width = size.width ?? 0;
  const height = size.height ?? 0;

  // Grid 原始尺寸
  const GRID_WIDTH = 1251;
  const GRID_HEIGHT = 741;

  // 基礎縮放：確保 Grid 填滿螢幕
  const fitScale = Math.max(width / GRID_WIDTH, height / GRID_HEIGHT);

  // 動畫縮放：透過 easeInQuint 實現放大效果，最大 30 倍
  const zoomScale = easeInQuint(currentProgress.zoom) * 30 + 1;

  return (
    <div
      className="flex flex-col items-start overflow-hidden flex-none pointer-events-none select-none"
      style={{
        width: `${GRID_WIDTH}px`,
        // 以中心為縮放原點，實現 zoom-in 效果
        transformOrigin: "center center",
        transform: `scale(${fitScale * zoomScale})`,
      }}
    >
      {new Array(length).fill(true).map((_, index) => {
        const centerIndex = Math.floor(length / 2); // 中央行索引
        const diffToCenter = Math.abs(centerIndex - index); // 與中央的距離
        const maxDiff = centerIndex;

        // 奇偶行交錯位移，創造波浪效果
        const startMoveOffset = index % 2 === 0 ? 0 : 0.03;

        // 計算每行的水平位移量
        const rowOffset =
          startMoveOffset +
          ((maxDiff - diffToCenter) / maxDiff) *
          easeInOutSine(currentProgress.move) *
          0.404;

        // 非中央行的顯示進度：當 allRow 進度 * 中央索引 >= 距離時顯示
        const rowProgress =
          currentProgress.allRow * centerIndex >= diffToCenter ? 1 : 0;

        // 中央行使用獨立的進度控制
        const centerRowProgress = currentProgress.centerRow;

        // 淡出進度控制
        const fadeProgress = currentProgress.fade;

        return (
          <Row
            key={index}
            length={15}
            progress={index === centerIndex ? centerRowProgress : rowProgress}
            offset={rowOffset}
            fadeProgress={fadeProgress}
          />
        );
      })}
    </div>
  );
};

// Cut Scene 主組件：400vh 高度 + sticky 定位 + ScrollTrigger 控制
export default function SupportCutSceneSection() {
  useScrollTrigger({
    sectionId: "section-support-cut-scene",
    sectionName: "support-cut-scene",
  });

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // 建立 ScrollTrigger，將滾動進度 (0~1) 傳給 React state
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 2, // 平滑度設定
      onUpdate: (self) => {
        setProgress(self.progress); // 更新 React state
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // 結構：父層 400vh 高度，子層 sticky 定位在螢幕中央
  return (
    <div
      className="w-full h-[400vh] mt-[-100vh] relative"
      ref={sectionRef}
    >
      <div className="w-full h-screen flex items-center justify-center sticky top-0 left-0 overflow-hidden">
        <Grid progress={progress} />
      </div>
    </div>
  );
}
