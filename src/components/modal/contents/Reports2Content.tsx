'use client';

import { useState } from 'react';
import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports2Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="山頭上的掠奪"
        subtitle="揭露全台原住民保留地流失亂象"
        date="2021.08"
      />

      <Shared.ContentWrapper>
        {/* 重點摘要 */}
        <Shared.ProjectSummary
          items={[
            {
              text: "影響力",
              children: [
                { text: "揭露原住民保留地以各種假人頭買賣手法轉給非原住民進行開發，直接影響最高法院民事大法庭裁定假人頭買賣無效。" },
              ]
            },
            {
              text: "報導獲獎紀錄",
              children: [
                { text: "2022 亞洲出版協會卓越新聞獎（SOPA）【卓越環境報導獎—首獎】" },
                { text: "2022 吳舜文新聞獎【新聞深度報導獎】" },
              ]
            }
          ]}
        />

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              根據政府統計，全台26萬公頃「原住民保留地」已有超過1萬公頃流失，但學者估計實際情況更加嚴重，原住民土地正義及文化存續等問題令人憂心。
            </p>
            <p>
              《報導者》記者透過化身採訪等方式深入調查，發現依法只能在原住民之間進行買賣的原保地，已大量透過假人頭等遊走法律邊緣手法，實際移轉給非原住民與財團進行開發。新北烏來、苗栗泰安等知名溫泉區，或新竹尖石、五峰等熱門露營區，甚至日月潭邊的觀光熱點，都有許多原保地上冒出來的大型開發案，主管機關卻任其違規占用；而花東地區近年大量出現的「增劃編」原保地，則有淪為新一波賣地運動的疑慮。
            </p>
            <p>
              專題推出後，直接影響最高法院民事大法庭於2021年9月17日做出重大裁定：「非原住民以借名登記、簽訂買賣契約、設定地上權及所有權轉移的行為，違反禁止規定，依《民法》第71條本文規定，應屬無效。」日後相關訴訟案件將統一見解，亦即宣告原保地假人頭買賣手法全部無效。
            </p>
            <p>
              最高法院大法庭法官鍾任賜指出，《山頭上的掠奪》專題報導發揮了「臨門一腳」，大法庭在評議此案時，每位法官手上都有這項報導做為重要參考。大法庭最後是從《憲法增修條文》以及國際兩公約的高度，強調保障原住民「集體權」與「文化權」的重要性，並根據這項報導認定所有「一條龍」假人頭買賣手法都屬無效，以司法斬斷這些手法，「原住民是原保地真正的主人，而不是人頭。」
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/topics/aboriginal-reserve-dispute">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="何榮幸" />
          <Shared.CreditsItem role="文字" names={["何柏均", "嚴文廷", "林慧貞", "何榮幸"]} />
          <Shared.CreditsItem role="攝影" names={["陳曉威", "鄭宇辰", "余志偉"]} />
          <Shared.CreditsItem role="封面攝影" names="陳曉威" />
          <Shared.CreditsItem role="漫畫多媒體、設計" names="黃禹禎" />
          <Shared.CreditsItem role="資料整理與地圖製作" names={["戴淨妍", "柯皓翔", "何柏均"]} />
          <Shared.CreditsItem role="編輯" names={["張詩芸", "洪琴宣", "陳思樺"]} />
          <Shared.CreditsItem role="特別感謝" names={["政治大學民族系名譽教授林修澈", "政治大學原住民族研究中心主任黃季平"]} />
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