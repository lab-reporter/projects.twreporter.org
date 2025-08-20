'use client';

import { useState } from 'react';
import { Copy, Check, Facebook, MessageCircle } from 'lucide-react';

interface ShareLinkProps {
    title?: string;
    description?: string;
    url?: string;
    className?: string;
}

interface SocialPlatform {
    name: string;
    icon: React.ReactNode;
    getShareUrl: (url: string, title: string, description: string) => string;
    color: string;
    bgColor: string;
}

export default function ShareLink({
    title = '報導者十週年回顧',
    description = '深度調查報導，為台灣社會帶來改變的力量',
    url,
    className = ''
}: ShareLinkProps) {
    const [copied, setCopied] = useState(false);

    // 取得當前頁面 URL，如果沒有提供的話
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    // 社群平台設定
    const socialPlatforms: SocialPlatform[] = [
        {
            name: 'Facebook',
            icon: <Facebook size={18} />,
            getShareUrl: (url, title, description) =>
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title + ' - ' + description)}`,
            color: 'text-white',
            bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
        },
        {
            name: 'LINE',
            icon: <MessageCircle size={18} />,
            getShareUrl: (url, title, description) =>
                `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}`,
            color: 'text-green-600',
            bgColor: 'bg-green-50 hover:bg-green-100 border-green-200'
        },
        {
            name: 'Twitter',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            getShareUrl: (url, title, description) =>
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}`,
            color: 'text-gray-800',
            bgColor: 'bg-gray-50 hover:bg-gray-100 border-gray-200'
        }
    ];

    // 複製連結到剪貼簿
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('複製連結失敗:', error);
            // 降級處理：使用選取文字的方式
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
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
        const platformShareUrl = platform.getShareUrl(shareUrl, title, description);
        window.open(platformShareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    };

    return (
        <div className={`mx-auto flex justify-center flex-wrap gap-3 ${className}`}>
            {/* 複製連結按鈕 */}
            <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 font-medium ${copied
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                    }`}
            >
                {copied ? (
                    <Check size={18} className="text-green-600" />
                ) : (
                    <Copy size={18} className="text-gray-500" />
                )}
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
                    {platform.icon}
                    <span className="text-sm">{platform.name}</span>
                </button>
            ))}
        </div>
    );
}