'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports3Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="造假．剝削．血淚漁場"
        subtitle="跨國直擊台灣遠洋漁業真相"
        date="2016.12"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "報導印尼籍漁工 Supriyanto 在台灣遠洋漁船上疑似遭虐待、傷口感染致死，屏東地檢署宣布重啟調查。" },
              { text: "報導刊出3天後，行政院要求漁業署嚴格執法、農委會健全漁工勞動檢查機制，以確保漁工權益。" }
            ]
          },
          {
            text: "報導獲獎紀錄",
            children: [
              { text: "2017 亞洲出版協會卓越新聞獎（SOPA）【卓越人權報導獎—首獎】" },
              { text: "2017 亞洲出版協會卓越新聞獎（SOPA）【卓越調查報導獎—首獎】" },
              { text: "2017 亞洲出版協會卓越新聞獎（SOPA）【卓越資訊圖表獎—首獎】" },
              { text: "2017 卓越新聞獎【調查報導獎】" },
              { text: "2017 人權新聞獎【中文多媒體新聞獎】" },
              { text: "2017 台海新聞攝影大賽【台海經濟新聞類銀獎】" }
            ]
          }
        ]}
      />

      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-3/report-3-1.webp",
            position: {
              top: { base: "10%", sm: "13%", md: "14%", lg: "15%" },
              left: { base: "20%", sm: "15%", md: "13%", lg: "12%" },
              z: { base: 23, sm: 32, md: 38, lg: 45 }
            },
            width: { base: "70vw", sm: "50vw", md: "35vw", lg: "22vw" }
          },
          {
            src: "/assets/reports/report-3/report-3-2.webp",
            position: {
              top: { base: "50%", sm: "52%", md: "54%", lg: "55%" },
              left: { base: "15%", sm: "25%", md: "32%", lg: "35%" },
              z: { base: 30, sm: 42, md: 51, lg: 60 }
            },
            width: { base: "75vw", sm: "55vw", md: "40vw", lg: "28vw" }
          },
          {
            src: "/assets/reports/report-3/report-3-3.webp",
            position: {
              top: { base: "47%", sm: "49%", md: "51%", lg: "52%" },
              left: { base: "10%", sm: "8%", md: "8%", lg: "8%" },
              z: { base: 18, sm: 25, md: 30, lg: 35 }
            },
            width: { base: "60vw", sm: "45vw", md: "30vw", lg: "22vw" },
            visibility: { base: false, sm: true }
          },
          {
            src: "/assets/reports/report-3/report-3-4.webp",
            position: {
              top: { base: "15%", sm: "18%", md: "19%", lg: "20%" },
              left: { base: "25%", sm: "35%", md: "38%", lg: "40%" },
              z: { base: 25, sm: 35, md: 43, lg: 50 }
            },
            width: { base: "65vw", sm: "52vw", md: "38vw", lg: "26vw" }
          },
          {
            src: "/assets/reports/report-3/report-3-5.webp",
            position: {
              top: { base: "40%", sm: "42%", md: "44%", lg: "45%" },
              left: { base: "30%", sm: "55%", md: "62%", lg: "67%" },
              z: { base: 20, sm: 28, md: 34, lg: 40 }
            },
            width: { base: "60vw", sm: "48vw", md: "35vw", lg: "24vw" },
            visibility: { base: false, sm: true }
          }
        ]}
      />

      <Shared.ContentWrapper>

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              在遙遠的海上，台灣漁業闖出了傲人成績：擁有的遠洋漁船數量曾是世界第一，秋刀魚、烏賊和鮪魚等三大漁獲的捕獲量也名列前茅。
            </p>
            <p>
              然而，光鮮亮麗的數字背後，以最低成本追求最大發展的邏輯，早已悄悄侵蝕台灣漁業的根基。除了壓榨與剝削海上漁工，造假也成為「必然」之惡，漁獲報告隱蔽過多數量和保育類才能維護漁權，仲介也假造證件才能把便宜而未經訓練勞力送上漁船。
            </p>
            <p>
              2015年8月印尼漁工Supriyanto在台灣遠洋漁船上疑遭虐待、傷口感染致死，竟遭屏東地檢署兩個月內草率簽結。《報導者》記者前往印尼採訪後，揭露台、印兩地仲介跨國剝削境外聘僱漁工，漁業署對於違法契約竟未掌握；而台灣遠洋漁業充滿造假亂象，漁業署亦未負起管理責任。
            </p>
            <p>
              由於Supriyanto案受到各界矚目，屏東地檢署主任檢察官陳韻如於《血淚漁場》專題報導刊出當天（2016年12月19日）即表示，此案已分案重啟調査。行政院長林全則於同年12月22日行政院會中，要求漁業署嚴格執法、農委會健全漁工勞動檢査機制，以確保漁工權益，落實「經濟社會文化權利國際公約」相關規定。
            </p>
            <p>
              《報導者》從2016年開始追蹤遠洋漁業，2016～2021年分別推出《血淚漁場》一部曲「造假、剝削、血淚漁場」、二部曲「海上人口販運」、三部曲「未竟的遠洋治理」。在各方的監督、政府和民間的共同努力下，台灣在2017年初順利通過「遠洋漁業三法」嚴格監管，並在2019年卸下歐盟祭出的黃牌。
            </p>
            <p>
              2025年，Supriyanto死亡案在抗爭、纏訟10年後，於5月8日經屏東地方法院調解，家屬透過委任律師與船長、輪機長達成和解。
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/topics/far-sea-fishing-investigative-report">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="李雪莉" />
          <Shared.CreditsItem role="記者" names={["李雪莉", "鄭涵文", "蔣宜婷"]} />
          <Shared.CreditsItem role="攝影" names={["林佑恩", "吳逸驊"]} />
          <Shared.CreditsItem role="封面影片" names="盧昱瑞" />
          <Shared.CreditsItem role="影片" names="林佑恩" />
          <Shared.CreditsItem role="資料分析" names="陳貞樺" />
          <Shared.CreditsItem role="設計" names={["吳政達", "黃禹禛"]} />
          <Shared.CreditsItem role="工程" names={["李法賢", "王珣沛"]} />
          <Shared.CreditsItem role="合作媒體" names="印尼調查報導媒體《Tempo Magazine》" />
        </Shared.CreditsMarquee>
      </Shared.ContentWrapper>

      {/* 支持報導者按鈕 */}
      <Shared.ModalDonate onClose={onClose} />

      {/* 導航按鈕 */}
      {/* <Shared.NavigationControls
        onNavigate={onNavigate}
        adjacentProjects={adjacentProjects}
      /> */}
    </Shared.Container>
  );
} 