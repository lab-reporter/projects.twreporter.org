'use client';

import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';

// 按鈕變體類型
type ButtonVariant =
    | 'primary'      // 主要按鈕：藍色背景，白色文字
    | 'secondary'    // 次要按鈕：灰色邊框，灰色文字  
    | 'outline'      // 外框按鈕：透明背景，有邊框
    | 'ghost'        // 透明按鈕：無背景，無邊框
    | 'support';     // 支援按鈕：白色背景，黑色文字（支援頁面專用，禁用狀態透過 disabled prop 控制）

// 按鈕尺寸類型
type ButtonSize = 'sm' | 'md' | 'lg';

// 按鈕形狀類型  
type ButtonShape = 'rectangle' | 'rounded' | 'circle';

// 按鈕屬性介面
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
    /** 按鈕外觀變體 */
    variant?: ButtonVariant;
    /** 按鈕尺寸 */
    size?: ButtonSize;
    /** 按鈕形狀 */
    shape?: ButtonShape;
    /** 是否顯示載入狀態 */
    loading?: boolean;
    /** 左側圖示 */
    leftIcon?: ReactNode;
    /** 右側圖示 */
    rightIcon?: ReactNode;
    /** 子元素 */
    children?: ReactNode;
    /** 自訂樣式類別 */
    className?: string;
}

/**
 * 統一的按鈕元件
 * 
 * 提供一致的按鈕樣式和行為，支援多種變體、尺寸和狀態
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    ...props
}, ref) => {

    // 尺寸樣式配置
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2 text-md',
        lg: 'px-8 py-3 text-lg'
    };

    // 形狀樣式配置
    const shapeClasses = {
        rectangle: '',
        rounded: 'rounded-lg',
        circle: 'rounded-full'
    };

    // 變體樣式配置
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
        secondary: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
        outline: 'border border-current bg-transparent hover:bg-current hover:text-white',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
        support: disabled
            ? 'border border-white opacity-50 text-white/80 bg-transparent'  // 禁用狀態：透明背景，白色邊框
            : 'bg-white text-black hover:bg-gray-100 border-transparent'     // 啟用狀態：白色背景，黑色文字
    };

    // 基礎樣式
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

    // 禁用狀態樣式
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

    // 載入狀態樣式
    const loadingClasses = loading ? 'opacity-75 cursor-wait' : '';

    // 組合最終的 className
    const finalClassName = [
        baseClasses,
        sizeClasses[size],
        shapeClasses[shape],
        variantClasses[variant],
        disabledClasses,
        loadingClasses,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            ref={ref}
            className={finalClassName}
            disabled={disabled || loading}
            {...props}
        >
            {/* 載入指示器 */}
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}

            {/* 左側圖示 */}
            {leftIcon && !loading && (
                <span className={children ? 'mr-2' : ''}>{leftIcon}</span>
            )}

            {/* 按鈕內容 */}
            {children}

            {/* 右側圖示 */}
            {rightIcon && !loading && (
                <span className={children ? 'ml-2' : ''}>{rightIcon}</span>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
