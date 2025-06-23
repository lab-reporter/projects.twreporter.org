/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        // 排除 archive 資料夾
        "!./src/app/archive/**",
    ],
    theme: {
        extend: {
            // 客製化色票 - 根據設計系統圖表
            colors: {
                // 紅色系列
                'red-10': '#F4C6C6',
                'red-30': '#F76977',
                'red-50': '#F80B28',
                'red-70': '#C40D23',
                'red-90': '#9B051E',

                // 綠色系列  
                'green-10': '#C4F2DC',
                'green-30': '#99CCC9',
                'green-50': '#6EE5B5',
                'green-70': '#3C927A',
                'green-90': '#0E3532',

                // 藍色系列
                'blue-10': '#ABDEF4',
                'blue-30': '#6D9BE0',
                'blue-50': '#2F58CC',
                'blue-70': '#143071',
                'blue-90': '#052142',

                // 金色系列
                'gold-10': '#F0D5BE',
                'gold-30': '#E3BE98',
                'gold-50': '#EDC39D',
                'gold-70': '#9E7A4E',
                'gold-90': '#493018',

                // 灰階系列 (覆蓋預設灰階)
                'white': '#FFFFFF',
                'gray-100': '#F1F1F1',
                'gray-200': '#E2E2E2',
                'gray-300': '#D8D8D8',
                'gray-400': '#CDCDCD',
                'gray-500': '#9C9C9C',
                'gray-600': '#808080',
                'gray-700': '#4A4A4A',
                'gray-800': '#404040',
                'gray-900': '#262626',
                'black': '#000000',
            },
            // 可以在這添加自定義的顏色、字型等
            fontFamily: {
                'noto-serif-tc': ['var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
                'noto-sans-tc': ['var(--font-noto-sans-tc)', 'Noto Sans TC', 'sans-serif'],
                'roboto-slab': ['var(--font-roboto-slab)', 'Roboto Slab', 'serif'],
                'alverata': ['alverata', 'var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
                'alverata-mixed': ['alverata', 'var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                arrowDown: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                // 翻牌動畫 - 上半部翻轉
                'flip-top': {
                    '0%': { transform: 'rotateX(0deg)' },
                    '50%, 100%': { transform: 'rotateX(-90deg)' },
                },
                // 翻牌動畫 - 下半部翻轉
                'flip-bottom': {
                    '0%, 50%': { transform: 'rotateX(90deg)' },
                    '100%': { transform: 'rotateX(0deg)' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-out',
                arrowDown: 'arrowDown 2s infinite',
                marquee: 'marquee 20s linear infinite',
                'flip-top': 'flip-top 0.6s linear',
                'flip-bottom': 'flip-bottom 0.6s linear',
                'flip-top-fast': 'flip-top 0.2s linear',
                'flip-bottom-fast': 'flip-bottom 0.2s linear',
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.scrollbar-hide': {
                    /* Firefox */
                    'scrollbar-width': 'none',
                    /* IE and Edge */
                    '-ms-overflow-style': 'none',
                },
                '.scrollbar-hide::-webkit-scrollbar': {
                    /* Chrome, Safari and Opera */
                    display: 'none',
                },
                '.transform-style-preserve-3d': {
                    'transform-style': 'preserve-3d',
                },
                '.font-noto-sans-force': {
                    'font-family': 'var(--font-noto-sans-tc), "Noto Sans TC", sans-serif !important',
                },
                '.font-noto-serif-force': {
                    'font-family': 'var(--font-noto-serif-tc), "Noto Serif TC", serif !important',
                },
                '.font-roboto-slab-force': {
                    'font-family': 'var(--font-roboto-slab), "Roboto Slab", serif !important',
                },
                '.hover\\:pause:hover': {
                    'animation-play-state': 'paused',
                },
                // 簡單的 alverata 字型類別
                '.font-alverata': {
                    'font-family': 'alverata, serif',
                },
                // alverata mixed 字型類別
                '.font-alverata-mixed': {
                    'font-family': 'alverata, serif',
                },

            }
            addUtilities(newUtilities);
        }
    ],
    corePlugins: {
        preflight: true,
    },
} 