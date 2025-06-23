'use client'

import React from 'react';

const IndicatorScroll = ({ children }) => {
    return (
        <div
            className={`mt-8 flex flex-col items-center transition-all duration-1000 ease-in-out`}
        >
            {children}
            <img src="/assets/arrow-down.svg" alt="arrow-down" className="w-5 h-5 animate-arrowDown" />
        </div>
    )
}

export default IndicatorScroll;