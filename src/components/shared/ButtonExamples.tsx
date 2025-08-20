'use client';

import Button from './Button';
import { ChevronLeftIcon, ChevronRightIcon } from './NavigationIcons';

/**
 * 按鈕使用範例組件
 * 展示統一按鈕系統的各種用法
 */
export default function ButtonExamples() {
    return (
        <div className="p-8 space-y-8">
            <h2 className="text-2xl font-bold">統一按鈕系統範例</h2>

            {/* 基本按鈕變體 */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">基本按鈕變體</h3>
                <div className="flex gap-4 flex-wrap">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="support">Support</Button>
                    <Button variant="noClick">No Click</Button>
                </div>
            </div>

            {/* 導航按鈕 */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">導航按鈕</h3>
                <div className="flex gap-4 items-center">
                    <Button
                        variant="navigation"
                        size="sm"
                        leftIcon={<ChevronLeftIcon size={12} />}
                        aria-label="上一頁"
                    />
                    <Button
                        variant="navigation"
                        size="md"
                        leftIcon={<ChevronLeftIcon size={16} />}
                        aria-label="上一頁"
                    />
                    <Button
                        variant="navigation"
                        size="lg"
                        leftIcon={<ChevronLeftIcon size={20} />}
                        aria-label="上一頁"
                    />
                    <span className="mx-4">←→</span>
                    <Button
                        variant="navigation"
                        size="sm"
                        leftIcon={<ChevronRightIcon size={12} />}
                        aria-label="下一頁"
                    />
                    <Button
                        variant="navigation"
                        size="md"
                        leftIcon={<ChevronRightIcon size={16} />}
                        aria-label="下一頁"
                    />
                    <Button
                        variant="navigation"
                        size="lg"
                        leftIcon={<ChevronRightIcon size={20} />}
                        aria-label="下一頁"
                    />
                </div>
            </div>

            {/* 關閉按鈕 */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">關閉按鈕</h3>
                <div className="flex gap-4 items-center">
                    <Button variant="close" size="sm" aria-label="關閉" />
                    <Button variant="close" size="md" aria-label="關閉" />
                    <Button variant="close" size="lg" aria-label="關閉" />
                </div>
            </div>

            {/* 按鈕狀態 */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">按鈕狀態</h3>
                <div className="flex gap-4">
                    <Button variant="primary">正常</Button>
                    <Button variant="primary" disabled>禁用</Button>
                    <Button variant="primary" loading>載入中</Button>
                </div>
            </div>
        </div>
    );
}
