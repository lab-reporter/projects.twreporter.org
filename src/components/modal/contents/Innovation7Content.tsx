'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation7Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
    if (!projectData) return null;

    return (
        <Shared.Container>
            <Shared.HeroBanner
                mediaSrc="/assets/innovations/innovation-7.webm"
                title="報導漫畫"
                subtitle="如何讓艱澀的公共議題更好消化？"
            />

            <Shared.ContentWrapper>
                {/* 重點摘要 */}
                <Shared.ProjectSummary
                    items={[
                        "用漫畫形式說新聞故事",
                        "視覺化複雜資訊",
                        "創新的敘事媒介"
                    ]}
                />

                {/* 導言 */}
                <Shared.TextContent>
                    <div className="space-y-4">
                        <p>報導漫畫是《報導者》創新嘗試的重要一環，透過漫畫的視覺語言，我們能夠以更生動、更易懂的方式呈現複雜的新聞內容。</p>
                        <p>這種創新的表達方式不僅能吸引更多讀者關注公共議題，也為新聞報導開拓了全新的可能性。</p>
                    </div>
                </Shared.TextContent>

                {/* 閱讀完整專題按鈕 */}
                <Shared.ExternalLink href="#">
                    閱讀報導漫畫
                </Shared.ExternalLink>

                {/* 製作團隊Credits */}
                <Shared.CreditsMarquee>
                    <Shared.CreditsItem role="監製" names="李雪莉" />
                    <Shared.CreditsItem role="漫畫" names={["漫畫家"]} />
                    <Shared.CreditsItem role="編劇" names="編劇團隊" />
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