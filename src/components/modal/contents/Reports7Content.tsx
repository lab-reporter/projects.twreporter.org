'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports7Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.HeroBanner
        mediaSrc="/assets/placeholder.svg"
        title="專題標題"
        subtitle="專題副標題"
      />

      <Shared.ContentWrapper>
        {/* 重點摘要 */}
        <Shared.ProjectSummary
          items={[
            "專題重點摘要內容...",
            "影響與成果...",
            {
              text: "報導獲獎紀錄",
              children: [
                { text: "獲獎記錄1" },
                { text: "獲獎記錄2" }
              ]
            }
          ]}
        />

        {/* 導言 */}
        <Shared.TextContent>
          <div className="text-white space-y-4">
            <p>專題內容段落...</p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="#">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="李雪莉" />
          <Shared.CreditsItem role="文字" names={["記者姓名"]} />
          <Shared.CreditsItem role="攝影" names="攝影師姓名" />
          <Shared.CreditsItem role="設計" names="設計師姓名" />
          <Shared.CreditsItem role="編輯" names={["編輯姓名"]} />
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