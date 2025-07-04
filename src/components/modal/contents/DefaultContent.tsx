'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function DefaultContent({ projectData }: ContentProps) {
  return (
    <Shared.Container>

      <Shared.MediaDisplay projectData={projectData} />

      <div className="space-y-4">
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed">
            這是一篇深度報導的詳細內容。報導者致力於透過深度調查和專業報導，
            揭露重要的社會議題，推動正向的社會改變。
          </p>

          <p className="text-gray-700 leading-relaxed">
            我們的記者團隊深入現場，進行長期追蹤和調查，
            為讀者帶來最真實、最深度的新聞內容。
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">報導重點</h3>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>• 深度調查與事實查證</li>
            <li>• 多方觀點平衡報導</li>
            <li>• 社會影響力評估</li>
            <li>• 後續追蹤機制</li>
          </ul>
        </div>

        <Shared.ActionButtons projectData={projectData} />
      </div>
    </Shared.Container>
  );
}