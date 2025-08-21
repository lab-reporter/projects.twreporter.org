'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ShareLinkProps {
    className?: string;
}

interface SocialPlatform {
    name: string;
    iconSrc: string;
    getShareUrl: (url: string, title: string, description: string) => string;
    color: string;
    bgColor: string;
}

export default function ShareLink({
    className = ''
}: ShareLinkProps) {
    // 固定的分享內容
    const title = '報導者十週年｜深度求真 眾聲同行';
    const description = '為了讓獨立媒體永續經營、持續挖掘真相，我們需要提升小額捐款比例至8成，因此在《報導者》滿10歲之際，我們許下一個生日願望：累積至少10,000位定期定額捐款支持的夥伴。';
    const url = 'https://10th-recap-dev-2d.vercel.app/';

    const [copied, setCopied] = useState(false);

    // 社群平台設定
    const socialPlatforms: SocialPlatform[] = [
        {
            name: 'Facebook',
            iconSrc: '/assets/icon-facebook.svg',
            getShareUrl: (url, title, description) =>
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title + ' - ' + description)}`,
            color: 'text-gray-800',
            bgColor: 'hover:bg-white bg-gray-100'
        },
        {
            name: 'LINE',
            iconSrc: '/assets/icon-line.svg',
            getShareUrl: (url, title, description) =>
                `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}`,
            color: 'text-gray-800',
            bgColor: 'hover:bg-white bg-gray-100'
        },
        {
            name: 'X(Twitter)',
            iconSrc: '/assets/icon-twitter.svg',
            getShareUrl: (url, title, description) =>
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}`,
            color: 'text-gray-800',
            bgColor: 'hover:bg-white bg-gray-100'
        }
    ];

    // 複製連結到剪貼簿
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('複製連結失敗:', error);
            // 降級處理：使用選取文字的方式
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (fallbackError) {
                console.error('降級複製也失敗:', fallbackError);
            }
            document.body.removeChild(textArea);
        }
    };

    // 開啟社群平台分享
    const handleSocialShare = (platform: SocialPlatform) => {
        const platformShareUrl = platform.getShareUrl(url, title, description);
        window.open(platformShareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    };

    return (
        <div className={`relative flex flex-wrap items-center justify-center gap-3 mb-4 ${className}`}>
            {/* 複製連結按鈕 */}
            <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 font-medium ${copied
                    ? 'bg-white text-black border-black'
                    : 'bg-gray-100 hover:bg-white border-gray-200 text-gray-700'
                    }`}
            >
                <Image
                    src="/assets/icon-copy.svg"
                    alt="複製"
                    width={18}
                    height={18}
                    className={copied ? 'text-green-600' : 'text-gray-500'}
                />
                <span className="text-sm">
                    {copied ? '已複製連結' : '複製連結'}
                </span>
            </button>

            {/* 社群平台分享按鈕 */}
            {socialPlatforms.map((platform) => (
                <button
                    key={platform.name}
                    onClick={() => handleSocialShare(platform)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 font-medium ${platform.bgColor} ${platform.color}`}
                    title={`分享到 ${platform.name}`}
                >
                    <Image
                        src={platform.iconSrc}
                        alt={platform.name}
                        width={18}
                        height={18}
                    />
                    <span className="text-sm">{platform.name}</span>
                </button>
            ))}
        </div>
    );
}