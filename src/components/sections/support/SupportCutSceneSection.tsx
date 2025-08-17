"use client";

/*
 * 主要功能：在使用者捲動頁面時，透過 GSAP ScrollTrigger
 * 動態控制一組文字方塊 (Let's Support / Reporter) 排列成的格線動畫效果。
 */

import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import gsap from "gsap";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Box
 * 單一文字方塊
 *
 * @param text - 要顯示的字串
 * @param visible - 是否可見 (用來決定是否加上 invisible 隱藏)
 * @param opacity - 透明度 (在 fadeOut 階段使用)
 */
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
    {/* 透過內聯 style 控制透明度，以便於淡出 */}
    <span style={{ opacity }}>{text}</span>
  </div>
);

/**
 * Row
 * 單一列，根據 progress 顯示多個 Box
 *
 * @param length - 列中 Box 的數量
 * @param progress - 目前該列顯示進度 (0~1)
 * @param offset - 水平位移百分比 (製造水平捲動感)
 * @param fadeProgress - 淡出進度 (0~1)
 */
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
        /* translateX 產生水平移動效果 */
        transform: `translateX(-${offset * 100}%)`,
      }}
    >
      {new Array(length).fill(true).map((_, index) => {
        /*
         * 判斷當前 Box 是否要顯示：
         * example: progress=0.3, length=10 => index 0~2 可見
         */
        const visible = index / length < progress;

        return (
          <Box
            key={index}
            text={index % 2 === 0 ? "Let's Support" : "Reporter"}
            visible={visible}
            opacity={1 - fadeProgress}
          />
        );
      })}
    </div>
  );
};

/**
 * getCurrentProgress
 * 將 ScrollTrigger 所回傳的 progress (0~1)
 * 依照不同階段切成多個 0~1 的子進度，方便動畫控制
 */
const getCurrentProgress = (overallProgress: number) => {
  const clamp = (num: number) => Math.max(Math.min(num, 1), 0);
  const progress = (start: number, end: number) =>
    clamp((overallProgress - start) / (end - start));

  return {
    centerRow: progress(0.2, 0.3),
    allRow: progress(0.3, 0.4),
    move: progress(0.33, 0.8),
    zoom: progress(0.35, 1),
    fade: progress(0.8, 0.95),
  };
};

/**
 * 指數漸進 Easing
 * 讓 zoom 動畫更平滑自然
 */
function easeInQuint(x: number): number {
  return x * x * x * x * x;
}

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

/**
 * Grid
 * 主動畫元件，依據 progress 動態產生多列 Row
 *
 * @param length - Row 列數
 * @param progress - 整體捲動進度 (0~1)
 */
const Grid = ({
  length = 17,
  progress,
}: {
  length?: number;
  progress: number;
}) => {
  const currentProgress = getCurrentProgress(progress);

  /* 取得視窗尺寸以計算自適應縮放 */
  const size = useWindowSize();
  const width = size.width ?? 0;
  const height = size.height ?? 0;

  /* Grid 原始寬高 */
  const GRID_WIDTH = 1251;
  const GRID_HEIGHT = 741;

  /* fitScale: 為了填滿螢幕，取寬高比例較大的 */
  const fitScale = Math.max(width / GRID_WIDTH, height / GRID_HEIGHT);

  /* zoomScale: 根據 progress 透過 easeInQuint 放大 */
  const zoomScale = easeInQuint(currentProgress.zoom) * 30 + 1;

  return (
    <div
      className="flex flex-col items-start overflow-hidden flex-none pointer-events-none select-none"
      style={{
        width: `${GRID_WIDTH}px`,
        /* 以中心為縮放原點以獲得 zoom-in 效果 */
        transformOrigin: "center center",
        transform: `scale(${fitScale * zoomScale})`,
      }}
    >
      {new Array(length).fill(true).map((_, index) => {
        const centerIndex = Math.floor(length / 2); // 中央 Row index
        const diffToCenter = Math.abs(centerIndex - index); // 與中心的距離
        const maxDiff = centerIndex;

        /* 交錯 Row 起始位移，形成波浪感 */
        const startMoveOffset = index % 2 === 0 ? 0 : 0.03;

        /* 計算 Row 位移 (0.404 為手動調整，確保最後 zoom-in 到正確位置) */
        const rowOffset =
          startMoveOffset +
          ((maxDiff - diffToCenter) / maxDiff) *
          easeInOutSine(currentProgress.move) *
          0.404;

        /* 逐行顯示中央以外的 Row */
        const rowProgress =
          currentProgress.allRow * centerIndex >= diffToCenter ? 1 : 0;

        /* 中央 Row 的進度單獨控制 */
        const centerRowProgress = currentProgress.centerRow;

        /* 最後 zoom-in box 的淡出控制 */
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

/**
 * SupportCutSceneSection
 * - 區塊高度 400vh，並透過 margin-top 把起始畫面往上拉 100vh
 * - 內部 <div> 使用 sticky 置中
 * - 透過 ScrollTrigger 將捲動進度綁定到 Grid 元件
 */
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

    /* 建立 ScrollTrigger，將捲動進度映射到 setProgress */
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 2, // 讓動畫跟隨捲動 (2 = 平滑度)
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  /* 畫面結構：父層超長區段，子層 sticky 置中 */
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
