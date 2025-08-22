'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports12Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="獵童風暴"
        subtitle="揭開未成年性剝削影像的暗黑產業鏈"
        date="2024.06"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "揭開兒少性剝削影像的暗黑產業鏈，影音報導吸引百萬讀者觀看，報導相關證據提供執法單位存查。" }
            ]
          },
          {
            text: "報導獲獎紀錄",
            children: [
              { text: "2024 卓越新聞獎【調查報導獎】" },
              { text: "2024 曾虛白先生新聞獎【公共服務報導獎－文字類】" }
            ]
          }
        ]}
      />

      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-12/report-12-1.webp",
            position: {
              top: { base: "9%", sm: "11%", md: "11%", lg: "12%" },
              left: { base: "20%", sm: "18%", md: "18%", lg: "18%" },
              z: { base: 25, sm: 35, md: 43, lg: 50 }
            },
            width: { base: "70vw", sm: "52vw", md: "37vw", lg: "25vw" }
          },
          {
            src: "/assets/reports/report-12/report-12-2.webp",
            position: {
              top: { base: "10%", sm: "12%", md: "12%", lg: "13%" },
              left: { base: "25%", sm: "50%", md: "55%", lg: "58%" },
              z: { base: 35, sm: 49, md: 60, lg: 70 }
            },
            width: { base: "65vw", sm: "50vw", md: "35vw", lg: "24vw" }
          },
          {
            src: "/assets/reports/report-12/report-12-3.webp",
            position: {
              top: { base: "30%", sm: "32%", md: "34%", lg: "35%" },
              left: { base: "18%", sm: "30%", md: "33%", lg: "35%" },
              z: { base: 20, sm: 28, md: 34, lg: 40 }
            },
            width: { base: "75vw", sm: "58vw", md: "42vw", lg: "28vw" }
          },
          {
            src: "/assets/reports/report-12/report-12-4.webp",
            position: {
              top: { base: "50%", sm: "52%", md: "54%", lg: "55%" },
              left: { base: "15%", sm: "12%", md: "11%", lg: "10%" },
              z: { base: 30, sm: 42, md: 51, lg: 60 }
            },
            width: { base: "70vw", sm: "55vw", md: "38vw", lg: "26vw" }
          },
          {
            src: "/assets/reports/report-12/report-12-5.webp",
            position: {
              top: { base: "55%", sm: "57%", md: "59%", lg: "60%" },
              left: { base: "30%", sm: "55%", md: "59%", lg: "62%" },
              z: { base: 23, sm: 32, md: 39, lg: 45 }
            },
            width: { base: "65vw", sm: "50vw", md: "35vw", lg: "24vw" },
            visibility: { base: false, sm: true }
          }
        ]}
      />

      <Shared.ContentWrapper>

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              2024年上半年，因藝人黃子佐遭查獲持有兒少性影像，使得兒少性剝削議題引起社會全面關注。《報導者》在2024年初啟動一系列相關調查報導，除了與虛擬貨幣交易所 XREX 合作，揭露「創意私房」如何藏身於虛擬貨幣的不法金流，也追蹤到專門交流如何偷拍兒少性影像的「生產者」，性私密影像已成為巨大產業，且與龐大的博弈產業共生：業者設立社群軟體頻道，定期播送未成年性影像作為博弈賭客的「獎賞」，傳播迅速擴大到原本不會接觸的族群身上。
            </p>
            <p>
              除了網路犯罪，記者也獨家掌握20年前販售並性侵未成年女童和少女的「權自立」案後續。記者追蹤超過半年後發現，此案並未因權男死亡而結束，我們獨家揭露他與一位任職美術館的共犯梁恩睿，隱身普通人群，20年來，誘騙、性侵、拍攝、散布兒少性剝削影像的犯罪模式非但沒有絕跡，甚至已流通於「暗網」。
            </p>
            <p>
              <Shared.TextContentLink href="https://www.twreporter.org/topics/child-and-youth-sexual-exploitation">系列專題</Shared.TextContentLink>
              除了文字報導，此系列專題更製作Podcast、影音向網路大眾解釋兒少性剝削犯罪的樣貌。影音報導推出後，在YouTube與Instagram平台引起廣大迴響，共吸引超過160萬人次的觀看；另外，編輯檾也同步把專題裡蜀集到的證據提供給執法單位，幫助檢警偵辦相關案件。
            </p>
          </div>
        </Shared.TextContent>



        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="李雪莉" />
          <Shared.CreditsItem role="文字" names={["孔德廉", "張子午", "洪琴宣"]} />
          <Shared.CreditsItem role="封面設計" names="黃禹禛" />
          <Shared.CreditsItem role="攝影" names={["黃世澤", "鄭宇辰", "馬雨辰", "林彥廷"]} />
          <Shared.CreditsItem role="設計" names="黃禹禛" />
          <Shared.CreditsItem role="編輯" names={["張詩芸", "黃鉘婷"]} />
          <Shared.CreditsItem role="社群企劃" names={["汪彥成", "陳思樺"]} />
        </Shared.CreditsMarquee>
      </Shared.ContentWrapper>

      {/* CTA 區域 */}
      <div className="p-6">
        <Shared.ModalCTA onClose={onClose} />
      </div>

      {/* 導航按鈕 */}
      {/* <Shared.NavigationControls
        onNavigate={onNavigate}
        adjacentProjects={adjacentProjects}
      /> */}
    </Shared.Container>
  );
}