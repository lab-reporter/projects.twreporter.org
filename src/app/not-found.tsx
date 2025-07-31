'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-8">頁面不存在</p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                >
                    返回首頁
                </Link>
            </div>
        </div>
    );
}