import React from 'react';

const ReportSummary = ({
    items,
    children,
    itemClass = "mb-4 last:mb-0 last:border-b-0 last:pb-0 leading-relaxed font-noto-sans-tc border-b border-gray-300 pb-4",
    childListClass = "ml-6 mt-2 list-disc",
    childItemClass = "mb-1 last:mb-0 leading-relaxed font-noto-sans-tc text-base"
}) => {

    // 渲染單個項目的函數
    const renderItem = (item, index, isChild = false) => {
        // 選擇要使用的樣式類別
        const currentItemClass = isChild ? childItemClass : itemClass;

        // 如果是字串，直接渲染
        if (typeof item === 'string') {
            return (
                <li key={index} className={currentItemClass}>
                    {item}
                </li>
            );
        }

        // 如果是物件，檢查是否有子項目
        if (typeof item === 'object' && item.text) {
            return (
                <li key={index} className={currentItemClass}>
                    {item.text}
                    {/* 如果有子項目，創建嵌套的 ul */}
                    {item.children && item.children.length > 0 && (
                        <ul className={childListClass}>
                            {item.children.map((childItem, childIndex) =>
                                renderItem(childItem, childIndex, true)
                            )}
                        </ul>
                    )}
                </li>
            );
        }

        return null;
    };

    return (
        <div className="p-4 px-8 mb-8 bg-gray-100 rounded-lg">
            <ul className="my-4 no-list-style text-lg font-noto-sans-tc">
                {items ? (
                    items.map((item, index) => renderItem(item, index, false))
                ) : (
                    children
                )}
            </ul>
        </div>
    );
};

export default ReportSummary; 