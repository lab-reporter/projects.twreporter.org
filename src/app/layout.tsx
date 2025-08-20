import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC, Noto_Sans_TC, Roboto_Slab } from 'next/font/google'
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export const metadata: Metadata = {
  metadataBase: new URL('https://10th-recap-dev-2d.vercel.app/'),
  title: "報導者十週年｜深度求真 眾聲同行",
  description: "為了讓獨立媒體永續經營、持續挖掘真相，我們需要提升小額捐款比例至8成，因此在《報導者》滿10歲之際，我們許下一個生日願望：累積至少10,000位定期定額捐款支持的夥伴。",
  keywords: ["報導者", "十週年", "深度報導", "調查新聞", "獨立媒體", "台灣新聞", "新聞媒體"],
  authors: [{ name: "報導者 The Reporter" }],
  creator: "報導者 The Reporter",
  publisher: "報導者 The Reporter",
  icons: {
    icon: '/assets/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://10th-recap-dev-2d.vercel.app/',
    siteName: '報導者 The Reporter',
    title: '報導者十週年｜深度求真 眾聲同行',
    description: '為了讓獨立媒體永續經營、持續挖掘真相，我們需要提升小額捐款比例至8成，因此在《報導者》滿10歲之際，我們許下一個生日願望：累積至少10,000位定期定額捐款支持的夥伴。',
    images: [
      {
        url: '/assets/OG-Image.jpg',
        width: 1200,
        height: 630,
        alt: '報導者十週年｜深度求真 眾聲同行',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@twreporter',
    creator: '@twreporter',
    title: '報導者十週年｜深度求真 眾聲同行',
    description: '為了讓獨立媒體永續經營、持續挖掘真相，我們需要提升小額捐款比例至8成，因此在《報導者》滿10歲之際，我們許下一個生日願望：累積至少10,000位定期定額捐款支持的夥伴。',
    images: ['/assets/OG-Image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // 如果有的話請替換
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`
        ${geistSans.variable} 
        ${geistMono.variable} 
        ${notoSerifTC.variable} 
        ${notoSansTC.variable} 
        ${robotoSlab.variable}
      `}
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/how0sqj.css" />
      </head>
      <body
        className={`${geistSans.className} antialiased font-noto-serif-tc overflow-x-hidden scrollbar-hide`}
      >
        {/* Google Tag Manager - Script */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PRMXBBN');
          `}
        </Script>

        {/* Google Tag Manager - noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PRMXBBN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
        <SpeedInsights debug={process.env.NODE_ENV === 'development'} />
      </body>
    </html>
  );
}