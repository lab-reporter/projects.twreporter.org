'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Innovation9Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
    if (!projectData) return null;

    return (
        <Shared.Container>
            <Shared.HeroBanner
                mediaSrc="/assets/innovations/innovation-9.webm"
                title="報導者在地影像紮根計畫"
                subtitle="如何讓艱澀的公共議題更好消化？"
            />

            <Shared.ContentWrapper>
                {/* 重點摘要 */}
                <Shared.ProjectSummary
                    items={[
                        "深耕在地攝影人才",
                        "記錄台灣各地真實故事",
                        "建立影像紀錄網絡"
                    ]}
                />

                {/* 導言 */}
                <Shared.TextContent>
                    <div className="space-y-4">
                        <p>在地影像紮根計畫是《報導者》為了深化地方報導而發起的重要計畫，透過培養在地攝影師，我們能夠更深入地記錄台灣各地的真實故事。</p>
                        <p>這個計畫不僅提升了報導的深度與廣度，也為台灣的影像紀錄留下珍貴的歷史見證。</p>
                    </div>
                </Shared.TextContent>

                {/* 閱讀完整專題按鈕 */}
                <Shared.ExternalLink href="#">
                    瀏覽影像作品
                </Shared.ExternalLink>

                {/* 製作團隊Credits */}
                <Shared.CreditsMarquee>
                    <Shared.CreditsItem role="監製" names="李雪莉" />
                    <Shared.CreditsItem role="攝影指導" names={["攝影團隊"]} />
                    <Shared.CreditsItem role="計畫統籌" names="企劃團隊" />
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