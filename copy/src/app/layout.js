import './globals.css'
import { Noto_Serif_TC, Noto_Sans_TC, Roboto_Slab } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next';

// 初始化 Noto Serif TC 字型
const notoSerifTC = Noto_Serif_TC({
  weight: ['200', '300', '400', '500', '600', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif-tc',
})

// 初始化 Noto Sans TC 字型
const notoSansTC = Noto_Sans_TC({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-tc',
})

// 初始化 Roboto Slab 字型
const robotoSlab = Roboto_Slab({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-slab',
})

export const metadata = {
  title: '《報導者》十週年｜深度求真 眾聲同行',
  description: '《報導者》十週年特別企劃',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW" className={`scroll-auto ${notoSerifTC.variable} ${notoSansTC.variable} ${robotoSlab.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/how0sqj.css" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if (history.scrollRestoration) {
              history.scrollRestoration = 'manual';
            }

            // 創建一個黑色遮罩層
            window.addEventListener('DOMContentLoaded', function() {
              const mask = document.createElement('div');
              mask.style.position = 'fixed';
              mask.style.top = '0';
              mask.style.left = '0';
              mask.style.width = '100%';
              mask.style.height = '100%';
              mask.style.backgroundColor = 'black';
              mask.style.zIndex = '10000';
              mask.style.transition = 'opacity 0.5s';
              mask.style.opacity = '1';
              document.body.appendChild(mask);
              
              // 延遲捲動，讓黑色遮罩先顯示
              setTimeout(function() {
                window.scrollTo(0, 0);
                
                // 捲動完成後淡出遮罩層
                setTimeout(function() {
                  mask.style.opacity = '0';
                  // 遮罩完全透明後移除元素
                  setTimeout(function() {
                    document.body.removeChild(mask);
                  }, 500);
                }, 100);
              }, 50);
            });

            // 確保重新整理或離開頁面時也會重置捲動位置
            window.onbeforeunload = function() {
              // 不直接捲動，讓下次載入頁面時的腳本來處理
            };
          `
        }} />
      </head>
      <body className="font-noto-serif-tc overflow-x-hidden scrollbar-hide">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
