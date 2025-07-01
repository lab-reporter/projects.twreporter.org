'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation6Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
    if (!projectData) return null;

    return (
        <Shared.Container>
            <Shared.HeroBanner
                mediaSrc="/assets/innovations/innovation-6.webm"
                title="少年報導者"
                subtitle="如何讓艱澀的公共議題更好消化？"
            />

            <Shared.ContentWrapper>
                {/* 重點摘要 */}
                <Shared.ProjectSummary
                    items={[
                        "專為青少年設計的新聞平台",
                        "培養青少年媒體素養",
                        "連結校園與社會議題"
                    ]}
                />

                {/* 導言 */}
                <Shared.TextContent>
                    <div className="space-y-4">
                        <p>少年報導者是《報導者》為青少年族群特別打造的新聞平台，致力於以青少年能理解的語言和方式，介紹重要的社會議題。</p>
                        <p>我們相信培養青少年的媒體素養和社會參與意識，是建設更美好社會的重要基石。</p>
                    </div>
                </Shared.TextContent>

                {/* 閱讀完整專題按鈕 */}
                <Shared.ExternalLink href="#">
                    瀏覽少年報導者
                </Shared.ExternalLink>

                {/* 製作團隊Credits */}
                <Shared.CreditsMarquee>
                    <Shared.CreditsItem role="監製" names="李雪莉" />
                    <Shared.CreditsItem role="編輯" names={["編輯團隊"]} />
                    <Shared.CreditsItem role="設計" names="設計師" />
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