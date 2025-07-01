'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation8Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
    if (!projectData) return null;

    return (
        <Shared.Container>
            <Shared.HeroBanner
                mediaSrc="/assets/innovations/innovation-8.webm"
                title="讀者互動"
                subtitle="如何讓艱澀的公共議題更好消化？"
            />

            <Shared.ContentWrapper>
                {/* 重點摘要 */}
                <Shared.ProjectSummary
                    items={[
                        "建立讀者與內容的深度連結",
                        "互動式新聞體驗",
                        "促進公民參與討論"
                    ]}
                />

                {/* 導言 */}
                <Shared.TextContent>
                    <div className="space-y-4">
                        <p>讀者互動是《報導者》重視的核心價值，我們透過各種創新的互動機制，讓讀者不只是被動接收資訊，更能主動參與議題討論。</p>
                        <p>從留言互動到實體活動，我們持續探索如何建立更深度的讀者關係，促進公民社會的對話與參與。</p>
                    </div>
                </Shared.TextContent>

                {/* 閱讀完整專題按鈕 */}
                <Shared.ExternalLink href="#">
                    參與互動專區
                </Shared.ExternalLink>

                {/* 製作團隊Credits */}
                <Shared.CreditsMarquee>
                    <Shared.CreditsItem role="監製" names="李雪莉" />
                    <Shared.CreditsItem role="社群經營" names={["社群團隊"]} />
                    <Shared.CreditsItem role="活動企劃" names="企劃團隊" />
                </Shared.CreditsMarquee>
            </Shared.ContentWrapper>

            {/* 導航按鈕 */}
            <Shared.NavigationControls
                onNavigate={onNavigate}
                onHome={onClose}
                adjacentProjects={adjacentProjects}
            />
        </Shared.Container>
    );
} 