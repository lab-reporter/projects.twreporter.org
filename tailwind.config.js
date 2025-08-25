/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        red: {
          10: 'var(--color-red-10)',
          30: 'var(--color-red-30)',
          50: 'var(--color-red-50)',
          70: 'var(--color-red-70)',
          90: 'var(--color-red-90)',
        },
        green: {
          10: 'var(--color-green-10)',
          30: 'var(--color-green-30)',
          50: 'var(--color-green-50)',
          70: 'var(--color-green-70)',
          90: 'var(--color-green-90)',
        },
        blue: {
          10: 'var(--color-blue-10)',
          30: 'var(--color-blue-30)',
          50: 'var(--color-blue-50)',
          70: 'var(--color-blue-70)',
          90: 'var(--color-blue-90)',
        },
        gold: {
          10: 'var(--color-gold-10)',
          30: 'var(--color-gold-30)',
          50: 'var(--color-gold-50)',
          70: 'var(--color-gold-70)',
          90: 'var(--color-gold-90)',
        },
        gray: {
          white: 'var(--color-gray-white)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
          black: 'var(--color-gray-black)',
        },
      },
      fontSize: {
        // 自定義字級系統 - 響應式 H1-H6
        'h1-desktop': ['6rem', { lineHeight: '1' }], // 72px
        'h1-tablet': ['5rem', { lineHeight: '1' }],  // 56px
        'h1-mobile': ['4rem', { lineHeight: '1' }],  // 40px

        'h2-desktop': ['3rem', { lineHeight: '1.25' }], // 56px
        'h2-tablet': ['2.75rem', { lineHeight: '1.25' }], // 44px
        'h2-mobile': ['2rem', { lineHeight: '1.25' }],    // 32px

        'h3-desktop': ['2.5rem', { lineHeight: '1.25' }], // 40px
        'h3-tablet': ['2rem', { lineHeight: '1.25' }],    // 32px
        'h3-mobile': ['1.75rem', { lineHeight: '1.25' }], // 28px

        'h4-desktop': ['2rem', { lineHeight: '1.3' }],    // 32px
        'h4-tablet': ['1.75rem', { lineHeight: '1.3' }],  // 28px
        'h4-mobile': ['1.5rem', { lineHeight: '1.3' }],   // 24px

        'h5-desktop': ['1.5rem', { lineHeight: '1.4' }],  // 24px
        'h5-tablet': ['1.375rem', { lineHeight: '1.4' }], // 22px
        'h5-mobile': ['1.25rem', { lineHeight: '1.4' }],  // 20px

        'h6-desktop': ['1.25rem', { lineHeight: '1.4' }], // 20px
        'h6-tablet': ['1.125rem', { lineHeight: '1.4' }], // 18px
        'h6-mobile': ['1rem', { lineHeight: '1.4' }],     // 16px

        // 內文字級
        'body-lg': ['1.125rem', { lineHeight: '2' }],   // 18px
        'body-base': ['1rem', { lineHeight: '2' }],     // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.8' }],   // 14px
        'caption': ['0.75rem', { lineHeight: '1.8' }],    // 12px
      },
      fontFamily: {
        'noto-serif-tc': ['var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
        'noto-sans-tc': ['var(--font-noto-sans-tc)', 'Noto Sans TC', 'sans-serif'],
        'roboto-slab': ['var(--font-roboto-slab)', 'Roboto Slab', 'serif'],
        'alverata': ['alverata', 'var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
        'alverata-mixed': ['alverata', 'var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
        'azeret-mono': ['var(--font-azeret-mono)', 'Azeret Mono', 'monospace'],
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-slow': 'marquee-slow 45s linear infinite',
        'marquee-fast': 'marquee-fast 15s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-slow': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-fast': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
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
        '.font-alverata': {
          'font-family': 'alverata, serif',
        },
        '.font-alverata-mixed': {
          'font-family': 'alverata, serif',
        },
        /* 中英文混排字型組合 */
        '.font-body-mixed': {
          'font-family': 'var(--font-roboto-slab), "Roboto Slab", var(--font-noto-serif-tc), "Noto Serif TC", serif',
        },
        '.font-heading-mixed': {
          'font-family': 'alverata, var(--font-noto-serif-tc), "Noto Serif TC", serif',
        },
        '.font-sans-mixed': {
          'font-family': 'var(--font-roboto-slab), "Roboto Slab", var(--font-noto-sans-tc), "Noto Sans TC", sans-serif',
        },
        '.font-serif-mixed': {
          'font-family': 'alverata, var(--font-noto-serif-tc), "Noto Serif TC", serif',
        },
        '.font-azeret-mono': {
          'font-family': 'var(--font-azeret-mono), "Azeret Mono", monospace',
        },
      }
      addUtilities(newUtilities);
    }
  ],
}