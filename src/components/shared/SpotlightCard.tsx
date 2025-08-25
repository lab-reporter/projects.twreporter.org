import React, { useRef, useState } from "react";

interface Position {
    x: number;
    y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
    className?: string;
    spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
    href?: string;
    target?: string;
    onClick?: () => void;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.25)",
    href,
    target,
    onClick
}) => {
    const divRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<HTMLAnchorElement>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState<number>(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const currentElement = href ? anchorRef.current : divRef.current;
        if (!currentElement || isFocused) return;

        const rect = currentElement.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(0.6);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(0.6);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const spotlightOverlay = (
        <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
            style={{
                opacity,
                background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
            }}
        />
    );

    // 共用的事件處理器和樣式（不包含 ref）
    const commonEventProps = {
        onMouseMove: handleMouseMove,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        className: `relative overflow-hidden transition-transform duration-300 ${className}`,
        onClick: handleClick
    };

    // 如果有 href，則渲染為 a 標籤
    if (href) {
        return (
            <a href={href} target={target} ref={anchorRef} {...commonEventProps}>
                {spotlightOverlay}
                {children}
            </a>
        );
    }

    // 否則渲染為 div
    return (
        <div ref={divRef} {...commonEventProps}>
            {spotlightOverlay}
            {children}
        </div>
    );
};

export default SpotlightCard;
