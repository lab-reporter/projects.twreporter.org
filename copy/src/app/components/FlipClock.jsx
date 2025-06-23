"use client";

import { useState, useEffect, useRef } from 'react';

export default function FlipClock({ onComplete }) {
    const [displayDate, setDisplayDate] = useState('2015.09.01');
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const hasCompletedRef = useRef(false);

    // 開始和結束日期
    const startDate = new Date(2015, 8, 1); // 2015年9月1日（月份從0開始）
    const endDate = new Date(); // 當前日期
    const holdDuration = 1000; // 開頭和結尾各停留1秒
    const animationDuration = 5000; // 中間動畫5秒
    const totalDuration = holdDuration + animationDuration + holdDuration; // 總共7秒

    // ease-in-out 緩動函數
    const easeInOut = (t) => {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };

    // 格式化日期為 yyyy.mm.dd
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // 計算兩個日期之間的插值
    const interpolateDate = (startDate, endDate, progress) => {
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();
        const currentTime = startTime + (endTime - startTime) * progress;
        return new Date(currentTime);
    };

    useEffect(() => {
        startTimeRef.current = Date.now();

        const animateDate = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const totalProgress = Math.min(elapsed / totalDuration, 1);

            let animationProgress = 0;
            let currentDate;

            if (elapsed < holdDuration) {
                // 前1秒：停留在開始日期
                animationProgress = 0;
            } else if (elapsed < holdDuration + animationDuration) {
                // 中間5秒：ease-in-out 動畫
                const animationElapsed = elapsed - holdDuration;
                const rawProgress = animationElapsed / animationDuration;
                animationProgress = easeInOut(rawProgress);
            } else {
                // 後1秒：停留在結束日期
                animationProgress = 1;
            }

            // 計算當前應該顯示的日期
            currentDate = interpolateDate(startDate, endDate, animationProgress);
            const formattedDate = formatDate(currentDate);

            setDisplayDate(formattedDate);

            if (totalProgress < 1) {
                // 繼續動畫
                animationRef.current = requestAnimationFrame(animateDate);
            } else {
                // 動畫完成，觸發回調
                if (!hasCompletedRef.current && onComplete) {
                    hasCompletedRef.current = true;
                    onComplete();
                }
            }
        };

        // 開始動畫
        animationRef.current = requestAnimationFrame(animateDate);

        // 清理函數
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [onComplete]);

    return (
        <div className="flip-clock flex items-center justify-center">
            <h2 className="text-white text-6xl font-roboto-slab font-light tracking-wider">
                {displayDate}
            </h2>
        </div>
    );
} 