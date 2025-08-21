'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports6Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="國家不願面對的真相"
        subtitle="獨家揭露台鐵體檢報告"
        date="2019.09"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "調查過去10年東部鐵道一連串的錯誤決策與投資，如何埋下2018年普悠瑪事故悲劇引信，促使交通部針對花東運量不足的問題進行檢討改善。" },
              { text: "2019年，獨家取得345頁《台鐵局總體檢報告》全文，揭開台鐵長年積弊；在社會壓力下，交通部於報導刊登8天後將報告全文公開上網，提供全民檢視。" }
            ]
          },
          {
            text: "報導獲獎紀錄",
            children: [
              { text: "2020 亞洲出版協會卓越新聞獎（SOPA）【獨家新聞獎—優勝】" }
            ]
          }
        ]}
      />

      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-6/report-6-1.webp",
            position: {
              top: { base: "22%", sm: "24%", md: "24%", lg: "25%" },
              left: { base: "25%", sm: "22%", md: "21%", lg: "20%" },
              z: { base: 24, sm: 34, md: 41, lg: 48 }
            },
            width: { base: "65vw", sm: "50vw", md: "35vw", lg: "24vw" }
          },
          {
            src: "/assets/reports/report-6/report-6-2.webp",
            position: {
              top: { base: "12%", sm: "14%", md: "14%", lg: "15%" },
              left: { base: "20%", sm: "42%", md: "47%", lg: "50%" },
              z: { base: 31, sm: 43, md: 53, lg: 62 }
            },
            width: { base: "75vw", sm: "58vw", md: "42vw", lg: "29vw" }
          },
          {
            src: "/assets/reports/report-6/report-6-3.webp",
            position: {
              top: { base: "45%", sm: "47%", md: "49%", lg: "50%" },
              left: { base: "10%", sm: "7%", md: "6%", lg: "5%" },
              z: { base: 19, sm: 27, md: 33, lg: 38 }
            },
            width: { base: "60vw", sm: "42vw", md: "30vw", lg: "21vw" },
            visibility: { base: false, sm: true }
          },
          {
            src: "/assets/reports/report-6/report-6-4.webp",
            position: {
              top: { base: "60%", sm: "62%", md: "64%", lg: "65%" },
              left: { base: "25%", sm: "35%", md: "38%", lg: "40%" },
              z: { base: 28, sm: 39, md: 47, lg: 55 }
            },
            width: { base: "60vw", sm: "42vw", md: "28vw", lg: "20vw" }
          },
          {
            src: "/assets/reports/report-6/report-6-5.webp",
            position: {
              top: { base: "45%", sm: "47%", md: "49%", lg: "50%" },
              left: { base: "30%", sm: "58%", md: "62%", lg: "65%" },
              z: { base: 22, sm: 30, md: 37, lg: 43 }
            },
            width: { base: "65vw", sm: "48vw", md: "33vw", lg: "23vw" },
            visibility: { base: false, sm: true }
          }
        ]}
      />

      <Shared.ContentWrapper>

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              2018年10月21日普悠瑪18死翻覆事故3個月後，《報導者》調查歷年列車座位數與經費，推出《傾斜掉的台鐵——太魯閣、普悠瑪誤東部10年》專題，揭發花東部鐵路建設10年、500億投資連環錯，埋下普悠瑪事故悲劇引信。報導引起各方重視，交通部與台鐵也在2019年5月針對花東運量不足的問題進行檢討改善。
            </p>
            <p>
              然而事故發生近一年後，《報導者》發現，普悠瑪事故後成立首個行政院級的「台鐵總體檢小組」隨著選舉結束、內閣改組後悄然解散，連體檢完整報告都被隱匿消失，而花東、宜蘭線的列車仍在新馬站前過彎。
            </p>
            <p>
              《報導者》記者持續追蹤，重回事故現場，走訪多位專家小組成員、普悠瑪事故偵查單位及運安中心，並獨家取得345頁《台鐵局總體檢報告》全文，發現台鐵長期依賴國外設備與技術、看型錄就下單，演變成負債千億、大到改變不了的賠錢巨獸；此外，台鐵長年存在的「誰簽字、誰負責」文化讓升職如同跳火坑，形成人才「反淘汰」。
            </p>
            <p>
              2019年9月4日專題報導出爐後，行政院與交通部承受不小壓力，經過多次溝通，時任交通部長林佳龍選擇在同月12日傍晚公布體檢報告，將全文放在交通部官網供全民下載、檢視。
            </p>
            <p>
              本系列報導獲得的獨家資料與影像紀錄，也獲國家運輸安全調查委員會重視，成為釐清普悠瑪事故運安調查的參考資料。
            </p>
            <p>
              2024年1月1日，原臺灣鐵路管理局轉型為「國營台灣鐵路股份有限公司」，期望藉由公司自治的機制，改善組織體質。
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/topics/taiwan-railway-administration-investigation">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="楊惠君" />
          <Shared.CreditsItem role="記者" names={["嚴文廷", "林雨佑", "楊惠君"]} />
          <Shared.CreditsItem role="封面影像" names="蘇威銘" />
          <Shared.CreditsItem role="攝影" names={["吳逸驊", "曾原信", "蘇威銘", "林雨佑"]} />
          <Shared.CreditsItem role="編輯" names={["張詩芸", "陳思樺", "洪琴宣"]} />
          <Shared.CreditsItem role="設計" names="黃禹禛" />
        </Shared.CreditsMarquee>
      </Shared.ContentWrapper>

      {/* CTA 區域 */}
      <div className="p-6">
        <Shared.ModalCTA onClose={onClose} />
      </div>
    </Shared.Container>
  );
}