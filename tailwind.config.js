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
  plugins: [],
}