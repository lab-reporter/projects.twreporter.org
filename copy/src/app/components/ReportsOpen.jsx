"use client";

import React from 'react';
import SectionOpenTitle from './SectionOpenTitle';

const ReportsOpen = () => {
    return (
        <div className='relative w-full h-screen'>
            <div className="content-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] mx-auto h-auto py-20 flex flex-col items-center justify-center gap-4">
                <SectionOpenTitle
                    englishTitle={"Reports"}
                    chinestTitle={"看見重要報導的影響力"}
                    text={"這些重要報導具體改變了政策、法令與司法判決，也改變了受訪者的處境與命運，因為有你的支持，這些改變才會發生。"}
                />
            </div>
        </div >
    );
};

export default ReportsOpen;