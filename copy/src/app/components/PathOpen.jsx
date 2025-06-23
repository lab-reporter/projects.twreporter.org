"use client";

import React from 'react';
import SectionOpenTitle from './SectionOpenTitle';

const PathOpen = () => {
    return (
        <>
            <div className="mb-10 mt-20 w-screen flex-1 mx-auto flex flex-col items-center justify-center gap-4">
                <SectionOpenTitle
                    englishTitle={"Path"}
                    chinestTitle={"非營利媒體的12個挑戰"}
                    text={"10年的累積、突破與創新，背後是數不清的辯證、碰壁，和重新出發。非營利媒體逐漸壯大的10年，有編輯檯的倫理拉鋸，也有團隊在風口浪尖中共同做出的判斷。邀請你一起走進新聞室的幕後，看見報導者的心路歷程。"}
                />
            </div>
        </>
    );
};

export default PathOpen; 