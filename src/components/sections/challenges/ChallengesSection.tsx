'use client'

import React from 'react'
import { SectionHeadings } from '@/components/shared'
import ChallengeParallax from '@/components/sections/challenges/ChallengeParallax'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'

const ChallengesSection = () => {
    // 註冊 section 狀態追蹤
    useScrollTrigger({
        sectionId: 'section-challenges',
        sectionName: 'challenges'
    })

    return (
        <section id="section-challenges">
            <div className="relative h-[140vh]">
                <div className="w-full h-screen sticky top-0 overflow-hidden">
                    <SectionHeadings
                        titleEn="Breakthrough"
                        titleZh="非營利媒體・突圍"
                        className="section-headings"
                    >
                        <p>
                            非營利媒體的10年路，背後是數不清的辯證、碰壁，和重新出發。<br />
                            既有新聞創業與媒體營運甘苦談，也有不同路徑的艱難選擇。<br />
                            一起走進新聞室的幕後，看這條獨立媒體之路的心路歷程。
                        </p>
                        <div className="flex items-center justify-center mt-4 gap-2 mx-auto">
                            <div className="w-16 h-[1px] bg-gray-600"></div>
                            <h6 className="text-base text-gray-600 inline-block rounded-sm">
                                點擊照片瞭解更多
                            </h6>
                            <div className="w-16 h-[1px] bg-gray-600"></div>
                        </div>
                    </SectionHeadings>
                    <ChallengeParallax />
                </div>
            </div>
            <div className="h-[25vh]"></div>
        </section>
    )
}

export default ChallengesSection