'use client'

import React from 'react'
import { SectionHeadings } from '@/components/shared'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'

const ChallengesSection = () => {
    // 註冊 section 狀態追蹤
    useScrollTrigger({
        sectionId: 'section-challenges',
        sectionName: 'challenges'
    })

    return (
        <section id="section-challenges" className="relative h-screen">
            <div>
                <SectionHeadings
                    titleEn="Breakthrough"
                    titleZh="非營利媒體・突圍"
                >
                    <p>
                        非營利媒體的10年路，背後是數不清的辯證、碰壁，和重新出發。<br />
                        既有新聞創業與媒體營運甘苦談，也有不同路徑的艱難選擇。<br />
                        一起走進新聞室的幕後，看這條獨立媒體之路的心路歷程。
                    </p>
                </SectionHeadings>
            </div>
        </section>
    )
}

export default ChallengesSection