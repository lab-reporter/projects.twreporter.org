'use client';

import { useEffect, useRef, useState } from 'react';

interface CursorConfig {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

// 預設的 cursor 配置
const cursorConfigs: Record<string, CursorConfig> = {
  explore: {
    text: "EXPLORE",
    className:
      "translate-x-1/2 translate-y-1/2 bg-white border border-black text-sm font-medium shadow-lg w-[82px] h-10 flex items-center justify-center",
  },
  view: {
    text: "VIEW",
    className: "translate-x-1/2 translate-y-1/2 bg-black text-white p-2 text-sm font-medium shadow-lg w-[82px] h-10 flex items-center justify-center",
  },
  read: {
    text: "READ MORE",
    className:
      "translate-x-1/2 translate-y-1/2 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded shadow-lg w-[120px] h-10 flex items-center justify-center",
  },
  play: {
    text: "PLAY",
    className:
      "translate-x-1/2 translate-y-1/2 bg-red-500 text-white p-2 text-sm font-medium rounded-full shadow-lg w-[82px] h-10 flex items-center justify-center",
  },
  prev: {
    text: "PREV",
    className:
      "translate-x-1/2 translate-y-1/2 bg-white border border-black text-sm font-medium shadow-lg w-[82px] h-10 flex items-center justify-center",
  },
  next: {
    text: "NEXT",
    className:
      "translate-x-1/2 translate-y-1/2 bg-white border border-black text-sm font-medium shadow-lg w-[82px] h-10 flex items-center justify-center",
  },
  grab: {
    text: "GRAB",
    className:
      "translate-x-1/2 translate-y-1/2 bg-white border border-black text-sm font-medium shadow-lg w-[82px] h-10 flex items-center justify-center",
  },
};

const defaultCursor: CursorConfig = {
  text: "",
  className: "bg-transparent text-transparent text-[1px] w-0 h-0",
  // className:
  // "bg-transparent text-transparent text-[1px] w-6 h-6 rounded-[12px] backdrop-invert",
};

const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>(null);
  const previousTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Make sure the effect runs only once
};

// Linear interpolation helper
const lerp = (start: number, end: number, amount: number) => {
  return start + (end - start) * amount;
};

export default function CustomCursor() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const labelRef = useRef<HTMLDivElement>(null);
  const [currentCursor, setCurrentCursor] = useState<CursorConfig | null>(null);

  // shared detection logic
  const detectCursorAt = (x: number, y: number): CursorConfig => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    // 1) check for named cursors
    for (const [key, cfg] of Object.entries(cursorConfigs)) {
      if (el?.closest(`[data-custom-cursor="${key}"]`)) {
        return cfg;
      }
    }
    // 2) check for arbitrary data-cursor-text
    const custom = el?.closest("[data-cursor-text]") as HTMLElement | null;
    if (custom) {
      const text = custom.getAttribute("data-cursor-text")!;
      const cls =
        custom.getAttribute("data-cursor-class") ||
        "bg-white border border-black p-2 text-sm font-medium shadow-lg";
      return { text, className: cls };
    }
    // 3) fallback
    return defaultCursor;
  };

  // animate the dot
  useAnimationFrame(() => {
    const t = 0.2;
    currentPosition.current.x = lerp(
      currentPosition.current.x,
      mousePosition.current.x,
      t
    );
    currentPosition.current.y = lerp(
      currentPosition.current.y,
      mousePosition.current.y,
      t
    );
    if (labelRef.current) {
      labelRef.current.style.transform = `
        translate3d(${currentPosition.current.x}px,
                     ${currentPosition.current.y}px, 0)
        translate3d(-50%, -50%, 0)
      `;
    }
  });

  // update on mousemove
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      setCurrentCursor(detectCursorAt(e.clientX, e.clientY));
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { x, y } = mousePosition.current;
      setCurrentCursor(detectCursorAt(x, y));
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  if (!currentCursor) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[10001]"
      ref={labelRef}
    >
      <div
        className={currentCursor.className}
        style={{
          ...currentCursor.style,
          transition: "all 0.3s cubic-bezier(0.8, -0.4, 0.5, 1)",
        }}
      >
        {currentCursor.text}
      </div>
    </div>
  );
}