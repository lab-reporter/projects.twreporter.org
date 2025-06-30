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
      fontFamily: {
        'noto-serif-tc': ['var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
        'noto-sans-tc': ['var(--font-noto-sans-tc)', 'Noto Sans TC', 'sans-serif'],
        'roboto-slab': ['var(--font-roboto-slab)', 'Roboto Slab', 'serif'],
        'alverata': ['alverata', 'var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
        'alverata-mixed': ['alverata', 'var(--font-noto-serif-tc)', 'Noto Serif TC', 'serif'],
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
      }
      addUtilities(newUtilities);
    }
  ],
}