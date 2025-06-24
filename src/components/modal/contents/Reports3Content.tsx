'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports3Content({ projectData, onClose }: ContentProps) {
  return (
    <Shared.Container>
      <Shared.ReportBanner projectData={projectData} />
      
      <Shared.MediaDisplay projectData={projectData} />
      
      <div className="space-y-6">
        {/* 報導摘要 */}
        <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
          <h3 className="font-semibold text-red-900 mb-2">調查核心</h3>
          <p className="text-red-800 leading-relaxed">
            跨國追蹤台灣遠洋漁業的真相，揭露海上勞工的血淚故事，
            以及漁業產業鏈背後的剝削與造假問題。
          </p>
        </div>
        
        {/* 主要內容 */}
        <div className="prose prose-gray max-w-none space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong>血淚漁場</strong>調查團隊歷時一年，跨越太平洋，
            深入漁船、漁港、加工廠，追蹤台灣遠洋漁業的真實面貌。
            從印尼漁工的家鄉，到太平洋上的漁船，再到歐美的超市貨架。
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            調查發現，台灣遠洋漁業涉及系統性的勞權侵害、非法漁撈，
            以及漁獲來源造假等問題，影響全球海洋資源的永續發展。
          </p>
        </div>
        
        {/* 調查歷程 */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">🌊 調查足跡</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>印尼 - 漁工招募與培訓現場</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>台灣 - 遠洋漁業公司與港口</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>太平洋 - 漁船作業實況</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>歐美 - 漁獲銷售通路</span>
            </div>
          </div>
        </div>
        
        {/* 影響力統計 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-800">12個月</div>
            <div className="text-xs text-blue-600">調查期間</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-800">5國家</div>
            <div className="text-xs text-green-600">跨國調查</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-yellow-800">30+</div>
            <div className="text-xs text-yellow-600">受訪漁工</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-red-800">國際獎項</div>
            <div className="text-xs text-red-600">獲得肯定</div>
          </div>
        </div>
        
        {/* 後續影響 */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">📈 政策影響</h4>
          <ul className="text-green-800 space-y-1 text-sm">
            <li>• 促成漁業署修訂相關法規</li>
            <li>• 推動國際漁業勞工保護協議</li>
            <li>• 建立漁獲來源追蹤機制</li>
            <li>• 提升消費者海鮮選購意識</li>
          </ul>
        </div>
        
        <Shared.ActionButtons projectData={projectData} />
      </div>
    </Shared.Container>
  );
}