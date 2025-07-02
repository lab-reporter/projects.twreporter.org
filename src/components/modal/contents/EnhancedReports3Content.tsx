'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function EnhancedReports3Content({ projectData, onClose }: ContentProps) {
  // 製作團隊資料
  const credits = [
    { role: '文字', name: '李雪莉' },
    { role: '攝影', name: '余志偉' },
    { role: '設計', name: '黃禹禛' },
    { role: '工程', name: '王聖雯' },
    { role: '編輯', name: '劉致昕' },
  ];

  // 統計數據
  const stats = [
    { label: '調查期間', value: '12個月', color: 'blue' as const },
    { label: '跨國調查', value: '5國家', color: 'green' as const },
    { label: '受訪漁工', value: '30+', color: 'yellow' as const },
    { label: '獲得獎項', value: '國際獎', color: 'red' as const },
  ];

  return (
    <Shared.Container>
      {/* Hero Banner */}
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title={projectData.title}
        subtitle={projectData.subtitle}
        date="2019.12.01"
      />

      {/* 內容區域 */}
      <Shared.ContentWrapper>
        {/* 項目摘要 */}
        <Shared.ProjectSummary
          title="調查核心發現"
          highlights={[
            "揭露台灣遠洋漁業的系統性勞權侵害問題",
            "追蹤漁獲從海上到餐桌的完整供應鏈",
            "促成國際漁業勞工保護協議的建立",
            "推動政府修訂相關法規和監管機制"
          ]}
          stats={stats}
        />

        {/* 主要內容 */}
        <Shared.TextContent variant="prose" fontSize="lg">
          <p>
            <strong>血淚漁場</strong>調查團隊歷時一年，跨越太平洋，
            深入漁船、漁港、加工廠，追蹤台灣遠洋漁業的真實面貌。
            從印尼漁工的家鄉，到太平洋上的漁船，再到歐美的超市貨架。
          </p>

          <p>
            調查發現，台灣遠洋漁業涉及系統性的勞權侵害、非法漁撈，
            以及漁獲來源造假等問題，影響全球海洋資源的永續發展。
          </p>

          <h3>調查方法與過程</h3>
          <p>
            記者團隊採用多重驗證的調查方法，包括實地訪談、
            文件分析、數據比對等，確保報導的準確性和客觀性。
          </p>
        </Shared.TextContent>

        {/* 影片播放器示例 */}
        {projectData.path && projectData.path.includes('.mp4') && (
          <div className="my-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">深度影片報導</h3>
            <Shared.VideoPlayer
              src={projectData.path}
              title={`${projectData.title} - 深度影片`}
              autoPlay={false}
              loop={true}
              muted={true}
            />
          </div>
        )}

        {/* 外部連結 */}
        <Shared.ExternalLink
          href="https://www.twreporter.org/topics/far-sea-fishing-investigative-report"
          variant="primary"
          size="lg"
        >
          閱讀完整調查報導
        </Shared.ExternalLink>

        {/* 製作團隊 */}
        <Shared.CreditsMarquee title="製作團隊">
          {credits.map((credit, index) => (
            <Shared.CreditsItem
              key={index}
              role={credit.role}
              name={credit.name}
              showDivider={index < credits.length - 1}
            />
          ))}
        </Shared.CreditsMarquee>
      </Shared.ContentWrapper>
    </Shared.Container>
  );
}