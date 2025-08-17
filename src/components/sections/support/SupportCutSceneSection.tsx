"use client";

/*
 * ========================================
 * SupportCutSceneSection - Cut Scene 支援頁面動畫組件
 * ========================================
 * 
 * 🎬 動畫概念：
 * 此組件創造一個類似電影「過場效果」的視覺體驗，透過滾動觸發一系列動畫階段：
 * 
 * 📝 動畫分解（總共 5 個階段）：
 * 
 * 1️⃣ 中央行顯示 (progress: 0.2 ~ 0.3)
 *    - 只有畫面中央的一行文字方塊逐一出現
 *    - 文字方塊內容交替顯示 "Let's Support" 和 "Reporter"
 * 
 * 2️⃣ 全部行顯示 (progress: 0.3 ~ 0.4) 
 *    - 從中央向上下擴散，所有行的文字方塊同時出現
 *    - 形成完整的文字方塊格線矩陣
 * 
 * 3️⃣ 水平移動 (progress: 0.33 ~ 0.8)
 *    - 每一行開始進行水平位移
 *    - 奇數行和偶數行有不同的起始位移，創造波浪式的動態效果
 *    - 使用 easeInOutSine 緩動函數讓移動更自然
 * 
 * 4️⃣ 縮放放大 (progress: 0.35 ~ 1.0)
 *    - 整個格線開始朝觀看者放大（zoom-in 效果）
 *    - 使用 easeInQuint 指數緩動，營造加速放大的視覺衝擊
 *    - 最大放大到 30 倍 + 基礎縮放
 * 
 * 5️⃣ 淡出消失 (progress: 0.8 ~ 0.95)
 *    - 所有文字方塊開始淡出
 *    - 為下一個頁面區塊做視覺過渡
 * 
 * 🎯 技術實作重點：
 * - 使用 400vh 高度創造長滾動區間，讓動畫有足夠時間展開
 * - sticky 定位確保動畫區域始終在視窗中央
 * - 響應式縮放確保在不同螢幕尺寸下都能正確顯示
 * - ScrollTrigger 的 scrub 模式讓動畫完全跟隨滾動進度
 */

import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import gsap from "gsap";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ========================================
 * Box Component - 單一文字方塊元件
 * ========================================
 * 
 * 🔹 功能：渲染單一的圓角邊框文字方塊
 * 
 * 🎨 視覺設計：
 * - 白色邊框 + 白色文字，適合深色背景
 * - 圓角邊框 (rounded-full) 創造現代感
 * - 固定內距 (px-4 py-2) 確保文字有足夠呼吸空間
 * - whitespace-nowrap 防止文字換行
 * 
 * 🎬 動畫控制：
 * - visible: 控制整個方塊的顯示/隱藏（使用 invisible class）
 * - opacity: 精細控制透明度，用於淡入淡出效果
 * 
 * @param text - 要顯示的字串（"Let's Support" 或 "Reporter"）
 * @param visible - 是否可見，false 時套用 invisible class 完全隱藏
 * @param opacity - 透明度值 (0~1)，用於第 5 階段的淡出動畫
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
    {/* 
      🎭 透明度控制：
      - 透過內聯 style 直接控制透明度
      - 這種方式比 CSS class 更適合動態數值變化
      - 在第 5 階段（淡出）時，opacity 會從 1 逐漸變為 0
    */}
    <span style={{ opacity }}>{text}</span>
  </div>
);

/**
 * ========================================
 * Row Component - 文字方塊列元件
 * ========================================
 * 
 * 🔹 功能：管理一整列的文字方塊，控制它們的顯示進度和位移效果
 * 
 * 🎬 動畫機制：
 * 
 * 📊 顯示進度控制：
 * - progress 決定該列要顯示幾個方塊
 * - 例如：progress=0.3, length=10 → 顯示前 3 個方塊（index 0,1,2）
 * - 這創造了「方塊逐一出現」的效果
 * 
 * 🏃‍♂️ 水平移動效果：
 * - offset 控制整列的水平位移
 * - 透過 translateX(-offset * 100%) 實現左右移動
 * - 不同列有不同的 offset，形成波浪式的視覺效果
 * 
 * 🌅 淡出控制：
 * - fadeProgress 統一控制該列所有方塊的透明度
 * - 所有方塊會同時進行淡出動畫
 * 
 * @param length - 該列要包含的方塊總數（預設 15 個）
 * @param progress - 該列的顯示進度 (0~1)，0=全部隱藏，1=全部顯示
 * @param offset - 水平位移係數 (0~1)，用於第 3 階段的移動動畫
 * @param fadeProgress - 淡出進度 (0~1)，用於第 5 階段的淡出動畫
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
        /* 
          🎢 水平移動變換：
          - translateX(-offset * 100%) 將整列向左移動
          - offset 從 0 到某個數值，創造「滑動穿越」的效果
          - 負號確保是向左移動（正值會向右移動）
          - 100% 讓移動距離以列寬度為基準
        */
        transform: `translateX(-${offset * 100}%)`,
      }}
    >
      {new Array(length).fill(true).map((_, index) => {
        /*
         * 🎯 顯示邏輯計算：
         * 
         * 💡 原理：progress 代表「已顯示的比例」
         * - progress = 0.0 → 沒有方塊顯示
         * - progress = 0.5 → 顯示前半段的方塊
         * - progress = 1.0 → 全部方塊顯示
         * 
         * 🧮 數學公式：index / length < progress
         * - index / length 是該方塊在列中的相對位置 (0~1)
         * - 例如：第 3 個方塊在 10 個方塊中的位置是 3/10 = 0.3
         * - 如果 progress = 0.5，則 0.3 < 0.5，所以顯示
         * - 如果 progress = 0.2，則 0.3 > 0.2，所以隱藏
         */
        const visible = index / length < progress;

        return (
          <Box
            key={index}
            /* 
              🎭 文字內容交替：
              - 偶數 index (0,2,4...) 顯示 "Let's Support"
              - 奇數 index (1,3,5...) 顯示 "Reporter"
              - 這樣交替排列創造視覺變化
            */
            text={index % 2 === 0 ? "Let's Support" : "Reporter"}
            visible={visible}
            /* 
              🌅 透明度計算：
              - opacity = 1 - fadeProgress
              - fadeProgress = 0 時，opacity = 1 (完全不透明)
              - fadeProgress = 1 時，opacity = 0 (完全透明)
              - 實現統一的淡出效果
            */
            opacity={1 - fadeProgress}
          />
        );
      })}
    </div>
  );
};

/**
 * ========================================
 * getCurrentProgress - 動畫階段進度計算器
 * ========================================
 * 
 * 🎯 功能：將 ScrollTrigger 的整體進度 (0~1) 切分成 5 個動畫階段
 * 
 * 📊 進度映射邏輯：
 * 
 * 🎭 數學原理：
 * - 輸入：overallProgress (0~1) - ScrollTrigger 提供的整體滾動進度
 * - 輸出：5 個獨立的階段進度，每個都是 (0~1)
 * 
 * 🔢 公式：(overallProgress - start) / (end - start)
 * - 當 overallProgress 在 start~end 區間內時，返回 0~1
 * - 當 overallProgress < start 時，clamp 確保返回 0
 * - 當 overallProgress > end 時，clamp 確保返回 1
 * 
 * 🎬 動畫階段分配：
 * 
 * 1️⃣ centerRow (0.2 ~ 0.3)：中央行方塊出現
 *    - 在整體進度 20%~30% 期間執行
 *    - 持續時間：10% 的滾動距離
 * 
 * 2️⃣ allRow (0.3 ~ 0.4)：所有行方塊出現  
 *    - 在整體進度 30%~40% 期間執行
 *    - 持續時間：10% 的滾動距離
 * 
 * 3️⃣ move (0.33 ~ 0.8)：水平移動動畫
 *    - 在整體進度 33%~80% 期間執行  
 *    - 持續時間：47% 的滾動距離（最長階段）
 * 
 * 4️⃣ zoom (0.35 ~ 1.0)：縮放放大動畫
 *    - 在整體進度 35%~100% 期間執行
 *    - 持續時間：65% 的滾動距離
 * 
 * 5️⃣ fade (0.8 ~ 0.95)：淡出動畫
 *    - 在整體進度 80%~95% 期間執行
 *    - 持續時間：15% 的滾動距離
 * 
 * 💡 重疊設計：
 * - move 和 zoom 階段有重疊，創造複合動畫效果
 * - 這讓視覺效果更豐富、更連貫
 */
const getCurrentProgress = (overallProgress: number) => {
  // 🛡️ 數值限制函數：確保結果在 0~1 範圍內
  const clamp = (num: number) => Math.max(Math.min(num, 1), 0);

  // 🧮 進度區間映射函數：將特定區間映射到 0~1
  const progress = (start: number, end: number) =>
    clamp((overallProgress - start) / (end - start));

  return {
    centerRow: progress(0.2, 0.3),   // 中央行顯示階段
    allRow: progress(0.3, 0.4),      // 全部行顯示階段  
    move: progress(0.33, 0.8),       // 水平移動階段
    zoom: progress(0.35, 1),         // 縮放放大階段
    fade: progress(0.8, 0.95),       // 淡出消失階段
  };
};

/**
 * ========================================
 * Easing Functions - 緩動函數
 * ========================================
 * 
 * 🎭 功能：為動畫提供不同的緩動效果，讓動畫更自然流暢
 */

/**
 * 🚀 easeInQuint - 五次方緩入函數
 * 
 * 📈 動畫特性：
 * - 開始很慢，然後急劇加速
 * - 適合「爆發式」的效果，如 zoom-in 動畫
 * - 數學公式：f(x) = x^5
 * 
 * 🎯 使用場景：
 * - zoom 動畫：創造「突然加速放大」的視覺衝擊
 * - 讓觀看者感受到強烈的「衝向螢幕」效果
 * 
 * @param x - 輸入進度 (0~1)
 * @returns 緩動後的進度 (0~1)
 */
function easeInQuint(x: number): number {
  return x * x * x * x * x;
}

/**
 * 🌊 easeInOutSine - 正弦波緩入緩出函數
 * 
 * 📈 動畫特性：
 * - 開始和結束都較慢，中間較快
 * - 非常平滑自然的過渡效果
 * - 數學公式：f(x) = -(cos(πx) - 1) / 2
 * 
 * 🎯 使用場景：
 * - move 動畫：讓水平移動更自然流暢
 * - 避免突兀的開始或結束，提供舒適的觀感
 * 
 * @param x - 輸入進度 (0~1)  
 * @returns 緩動後的進度 (0~1)
 */
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
