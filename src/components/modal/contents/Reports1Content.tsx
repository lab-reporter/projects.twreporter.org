'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports1Content({ projectData, onClose }: ContentProps) {
  return (
    <Shared.Container>
      <Shared.ReportBanner projectData={projectData} />
      
      <Shared.MediaDisplay projectData={projectData} />
      
      <div className="space-y-6">
        {/* 報導摘要 */}
        <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-900 mb-2">調查發現</h3>
          <p className="text-blue-800 leading-relaxed">
            透過深度調查，本報導揭露了留學產業鏈中的多重陷阱，
            包括債務綁定、非法勞動條件，以及教育品質問題。
          </p>
        </div>
        
        {/* 主要內容 */}
        <div className="prose prose-gray max-w-none space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong>綁債黑工留學陷阱</strong>調查發現，許多海外留學生面臨著
            系統性的剝削問題。從高額仲介費用開始，到抵達目的地後的
            勞動條件限制，形成了一個完整的剝削鏈條。
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            記者深入多個國家進行實地調查，訪問了數十位受害學生，
            並取得相關機構的內部文件，揭露了這個問題的嚴重程度。
          </p>
        </div>
        
        {/* 數據統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-800">50+</div>
            <div className="text-sm text-gray-600">受訪學生</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-800">8</div>
            <div className="text-sm text-gray-600">調查國家</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-800">6個月</div>
            <div className="text-sm text-gray-600">調查期間</div>
          </div>
        </div>
        
        {/* 相關連結 */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">🔍 深度閱讀</h4>
          <ul className="text-yellow-800 space-y-1 text-sm">
            <li>• <a href="#" className="hover:underline">完整調查報告</a></li>
            <li>• <a href="#" className="hover:underline">受害者證言集</a></li>
            <li>• <a href="#" className="hover:underline">政策建議書</a></li>
          </ul>
        </div>
        
        <Shared.ActionButtons projectData={projectData} />
      </div>
    </Shared.Container>
  );
}