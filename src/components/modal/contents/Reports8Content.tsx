'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports8Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="看不見的線上博弈帝國"
        subtitle="中國金主、菲國總部、台灣代工"
        date="2019.07"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "跨國調查台灣線上博弈產業，揭露跨國營運的公司利用各種方法將賭金「洗白」，引起檢警單位偵辦起訴非法線上博弈公司。" }
            ]
          },
          {
            text: "報導獲獎紀錄",
            children: [
              { text: "2020 亞洲出版協會卓越新聞獎（SOPA）【卓越經濟報導獎 首獎】" }
            ]
          }
        ]}
      />

      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-8/report-8-1.webp",
            position: {
              top: { base: "19%", sm: "21%", md: "21%", lg: "22%" },
              left: { base: "20%", sm: "15%", md: "13%", lg: "12%" },
              z: { base: 30, sm: 42, md: 51, lg: 60 }
            },
            width: { base: "70vw", sm: "52vw", md: "37vw", lg: "25vw" }
          },
          {
            src: "/assets/reports/report-8/report-8-2.webp",
            position: {
              top: { base: "45%", sm: "47%", md: "49%", lg: "50%" },
              left: { base: "30%", sm: "62%", md: "67%", lg: "70%" },
              z: { base: 21, sm: 29, md: 36, lg: 42 }
            },
            width: { base: "60vw", sm: "42vw", md: "28vw", lg: "21vw" },
            visibility: { base: false, sm: true }
          },
          {
            src: "/assets/reports/report-8/report-8-3.webp",
            position: {
              top: { base: "12%", sm: "14%", md: "14%", lg: "15%" },
              left: { base: "20%", sm: "40%", md: "45%", lg: "48%" },
              z: { base: 28, sm: 39, md: 47, lg: 55 }
            },
            width: { base: "75vw", sm: "58vw", md: "42vw", lg: "28vw" }
          },
          {
            src: "/assets/reports/report-8/report-8-4.webp",
            position: {
              top: { base: "50%", sm: "52%", md: "54%", lg: "55%" },
              left: { base: "18%", sm: "22%", md: "24%", lg: "25%" },
              z: { base: 19, sm: 27, md: 33, lg: 38 }
            },
            width: { base: "75vw", sm: "58vw", md: "42vw", lg: "27vw" }
          }
        ]}
      />

      <Shared.ContentWrapper>

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              台灣已成為亞洲的線上博弈代工之島。
            </p>
            <p>
              《報導者》調查發現，即便政府尚未允許線上博弈產業，但2016～2019年間，中國、香港、新加坡等資本前仆後繼來台，以遊戲設計、文字客服等名義設立公司，拿出高於市價2～5成的薪資，向30歲以下年輕人招手；在台灣低薪環境下，已有3萬名年輕工作者投入這個爭議和充滿投機的行業。
            </p>
            <p>
              記者前往菲律賓採訪台灣的博弈工作者，揭露跨國營運的線上博弈公司，如何在菲律賓取得合法牌照落地經營，又同步聘雇近3萬名台灣年輕工程師與客服人員提供服務，最後從中國數億賭客身上賺取賭金，建構成一個龐大的線上博弈帝國。當時的調查揭露這些公司不僅提供技術服務，更親自招攬賭客、營運賭博網站，甚至檯面下利用各種方法將賭金「洗白」，遠遠超越合法營運的界限。
            </p>
            <p>
              採訪團隊也進入國內線上博弈產業龍頭「奕智博數位娛樂」的總部，當時代理執行長信誓旦旦地拿出「博弈代工經營許可」、聲稱自己不碰金流、合法，但從記者調查拍攝到的視訊賭博用賭桌與員工電腦螢幕以簡體字顯示下注者的個資，觀察到許多不對勁，並在報導中點出此產業遊走於法律灰色地帶。
            </p>
            <p>
              <Shared.TextContentLink href="https://www.twreporter.org/topics/online-gambling-industry-in-taiwan">專題報導</Shared.TextContentLink>
              刊出後引發檢警單位關注，奕智博公司被查獲大規模洗錢，根據警方調查，光是奕智博公司一週的洗錢金額就超過新台幣50億元；以年度來推估，數字更是高達2,600億元，是台灣一年沒收毒品犯罪所得的10倍以上。
            </p>
            <p>
              2023年，奕智博洗錢案三審定讞，涉案的立法院職員與奕智博代理執行長均遭判刑，奕智博負責人莊鴻飛仍在境外潛逃中。
            </p>
          </div>
        </Shared.TextContent>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="李雪莉" />
          <Shared.CreditsItem role="記者" names={["孔德廉", "李雪莉"]} />
          <Shared.CreditsItem role="攝影" names="蘇威銘" />
          <Shared.CreditsItem role="影片" names="蘇威銘" />
          <Shared.CreditsItem role="編輯" names={["張詩芸", "陳思樺", "洪琴宣"]} />
          <Shared.CreditsItem role="設計" names={["黃禹禛", "吳政達"]} />
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