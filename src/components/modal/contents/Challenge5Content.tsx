'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Challenge5Content({ projectData, onNavigate, adjacentProjects }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      {/* 固定背景 */}
      <Shared.ChallengeFixedBackground />

      <Shared.ContentWrapper>
        <Shared.TextContent>
          {/* 文章標題 */}
          <Shared.ChallengeArticleTitle title={projectData.title} />
          
          <div className="space-y-4">
            <p className="text-gray-600">
              此章節內容正在準備中，敬請期待...
            </p>
          </div>
        </Shared.TextContent>
      </Shared.ContentWrapper>

      {/* 導航按鈕 */}
      <Shared.NavigationControls
        onNavigate={onNavigate}
        adjacentProjects={adjacentProjects}
      />
    </Shared.Container>
  );
}