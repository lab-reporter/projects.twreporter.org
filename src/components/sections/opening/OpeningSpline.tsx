'use client';

import { useEffect } from 'react';
import Spline from '@splinetool/react-spline/next';

export default function OpeningSpline() {
    useEffect(() => {
        // 強制顯示所有 canvas 元素
        const timer = setTimeout(() => {
            const canvases = document.querySelectorAll('canvas');
            canvases.forEach(canvas => {
                canvas.style.display = 'block !important';
                canvas.style.visibility = 'visible !important';
                canvas.style.opacity = '1 !important';
            });
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 w-full h-screen bg-white overflow-hidden"
            style={{ zIndex: 99999 }}
        >
            <style jsx global>{`
                canvas {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }
            `}</style>
            <div className="w-full h-full">
                <Spline
                    scene="https://prod.spline.design/r238ZLkUTwD7XGEN/scene.splinecode"
                />
            </div>
        </div>
    );
}
