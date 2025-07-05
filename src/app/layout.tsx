import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC, Noto_Sans_TC, Roboto_Slab } from 'next/font/google'
import "./globals.css";
import CustomCursor from "@/components/shared/CustomCursor";
import { SpeedInsights } from '@vercel/speed-insights/next';

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
  title: "《報導者》十週年｜深度求真 眾聲同行",
  description: "《報導者》十週年特別企劃",
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
        {children}
        <CustomCursor />
        <SpeedInsights debug={process.env.NODE_ENV === 'development'} />
      </body>
    </html>
  );
}
