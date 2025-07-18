'use client';

import Image from 'next/image';

interface ReportsStickyPhotoProps {
    imgSrcs: string[];
    alts?: string[];
}

// 使用 CSS 變數配合 Tailwind 預設類別，避免重複計算
const rotationClasses = [
    '[transform:rotate(-10deg)]',
    '[transform:rotate(-8deg)]',
    '[transform:rotate(-6deg)]',
    '[transform:rotate(-4deg)]',
    '[transform:rotate(-2deg)]',
    '[transform:rotate(0deg)]',
    '[transform:rotate(2deg)]',
    '[transform:rotate(4deg)]',
    '[transform:rotate(6deg)]',
    '[transform:rotate(8deg)]',
    '[transform:rotate(10deg)]',
];

// 使用偽隨機選擇，基於索引產生穩定的旋轉
function getRotationClass(index: number): string {
    // 使用簡單的偽隨機算法，確保相同索引總是得到相同結果
    const hash = (index * 2654435761) % 2147483647;
    const classIndex = hash % rotationClasses.length;
    return rotationClasses[classIndex];
}

export default function ReportsStickyPhoto({ imgSrcs, alts }: ReportsStickyPhotoProps) {
    return (
        <div className="w-full relative">
            {imgSrcs.map((imgSrc, index) => (
                <div key={index} className="w-full h-screen sticky top-0 flex justify-center items-center">
                    <Image 
                        src={imgSrc} 
                        alt={alts?.[index] || `reports-photo-${index + 1}`} 
                        width={2000} 
                        height={1333} 
                        className={`w-full h-auto ${getRotationClass(index)}`}
                    />
                </div>
            ))}
        </div>
    )
}