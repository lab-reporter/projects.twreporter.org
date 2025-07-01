'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation5Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
    if (!projectData) return null;

    return (
        <Shared.Container>
            <Shared.HeroBanner
                mediaSrc="/assets/innovations/innovation-5.webm"
                title="影音"
                subtitle="如何讓艱澀的公共議題更好消化？"
            />

            <Shared.ContentWrapper>
                {/* 重點摘要 */}
                <Shared.ProjectSummary
                    items={[
                        "透過影音內容創新說故事方式",
                        "讓複雜的公共議題更易理解",
                        "結合視覺與聲音的敘事力量"
                    ]}
                />

                {/* 導言 */}
                <Shared.TextContent>
                    <div className="space-y-4">
                        <p>影音是《報導者》重要的創新領域，透過動態影像和聲音的結合，我們能夠以更直觀、更有感染力的方式呈現新聞內容。</p>
                        <p>從紀錄片到互動式影音，我們持續探索如何運用新的技術和創意，讓艱澀的公共議題變得更加親近和易懂。</p>
                    </div>
                </Shared.TextContent>

                {/* 閱讀完整專題按鈕 */}
                <Shared.ExternalLink href="#">
                    瀏覽影音作品
                </Shared.ExternalLink>

                {/* 製作團隊Credits */}
                <Shared.CreditsMarquee>
                    <Shared.CreditsItem role="監製" names="李雪莉" />
                    <Shared.CreditsItem role="影音製作" names={["影音團隊"]} />
                    <Shared.CreditsItem role="剪輯" names="剪輯師" />
                    <Shared.CreditsItem role="音效" names="音效師" />
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