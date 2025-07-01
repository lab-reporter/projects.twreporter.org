'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation10Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
    if (!projectData) return null;

    return (
        <Shared.Container>
            <Shared.HeroBanner
                mediaSrc="/assets/innovations/innovation-10.webm"
                title="報導者觀測站"
                subtitle="如何讓艱澀的公共議題更好消化？"
            />

            <Shared.ContentWrapper>
                {/* 重點摘要 */}
                <Shared.ProjectSummary
                    items={[
                        "監測媒體生態與資訊環境",
                        "提供媒體素養教育",
                        "促進新聞業界交流"
                    ]}
                />

                {/* 導言 */}
                <Shared.TextContent>
                    <div className="space-y-4">
                        <p>報導者觀測站是《報導者》關注媒體生態與資訊環境的重要平台，透過持續的觀察與分析，我們致力於提升整體媒體品質。</p>
                        <p>從假訊息監測到媒體素養推廣，觀測站扮演著守護資訊品質的重要角色，為建設更健康的媒體環境而努力。</p>
                    </div>
                </Shared.TextContent>

                {/* 閱讀完整專題按鈕 */}
                <Shared.ExternalLink href="#">
                    瀏覽觀測站
                </Shared.ExternalLink>

                {/* 製作團隊Credits */}
                <Shared.CreditsMarquee>
                    <Shared.CreditsItem role="監製" names="李雪莉" />
                    <Shared.CreditsItem role="研究員" names={["研究團隊"]} />
                    <Shared.CreditsItem role="數據分析" names="分析師" />
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