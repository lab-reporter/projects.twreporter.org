import { useEffect } from 'react';
import splitTextBottomAnimation from './useSplitTextBottom';
import fadeInAnimation from './useFadeIn';

/**
 * 統一的 GSAP 動畫 Hook，自動應用所有註冊的動畫
 * @returns {void}
 */
const useGsapAnimation = () => {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 找到所有帶有 data-gsap 屬性的元素
        const animatedElements = document.querySelectorAll('[data-gsap]');

        // 清理函數收集器
        const cleanupFunctions = [];

        animatedElements.forEach(element => {
            const animationType = element.getAttribute('data-gsap');

            // 根據類型應用相應的動畫
            switch (animationType) {
                case 'split-text-bottom':
                    cleanupFunctions.push(splitTextBottomAnimation(element));
                    break;
                case 'fade-in':
                    cleanupFunctions.push(fadeInAnimation(element));
                    break;
                // 可以在這裡添加更多類型...
                default:
                // 未知的動畫類型
            }
        });

        // 返回清理函數
        return () => {
            cleanupFunctions.forEach(cleanup => cleanup && cleanup());
        };
    }, []);
};

export default useGsapAnimation;
export { splitTextBottomAnimation as useSplitTextBottom, fadeInAnimation as useFadeIn }; 