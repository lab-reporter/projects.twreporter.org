'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports9Content({ projectData, onNavigate, adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="1年26萬公斤的工業笑氣，如何毒害年輕人？"
        subtitle="合法、廉價、24小時到貨"
        date="2020.03"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "深入調查笑氣如何透過非法管道流入年輕人的社群，促成經濟部加速修法納管笑氣，遯止吸食風氣。" },
              { text: "台北市政府、桃園市政府亦針對笑氣制定行政規則與管理草案並加強稽查。" }
            ]
          }
        ]}
      />

      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-9/report-9-1.webp",
            position: {
              top: { base: "9%", sm: "11%", md: "11%", lg: "12%" },
              left: { base: "25%", sm: "22%", md: "23%", lg: "24%" },
              z: { base: 25, sm: 35, md: 43, lg: 50 }
            },
            width: { base: "75vw", sm: "58vw", md: "42vw", lg: "28vw" }
          },
          {
            src: "/assets/reports/report-9/report-9-2.webp",
            position: {
              top: { base: "25%", sm: "26%", md: "27%", lg: "28%" },
              left: { base: "20%", sm: "50%", md: "55%", lg: "58%" },
              z: { base: 35, sm: 49, md: 60, lg: 70 }
            },
            width: { base: "75vw", sm: "55vw", md: "40vw", lg: "27vw" }
          },
          {
            src: "/assets/reports/report-9/report-9-3.webp",
            position: {
              top: { base: "53%", sm: "55%", md: "57%", lg: "58%" },
              left: { base: "22%", sm: "38%", md: "42%", lg: "45%" },
              z: { base: 18, sm: 25, md: 30, lg: 35 }
            },
            width: { base: "65vw", sm: "48vw", md: "33vw", lg: "23vw" },
            visibility: { base: false, sm: true }
          },
          {
            src: "/assets/reports/report-9/report-9-4.webp",
            position: {
              top: { base: "20%", sm: "23%", md: "24%", lg: "25%" },
              left: { base: "15%", sm: "12%", md: "10%", lg: "9%" },
              z: { base: 31, sm: 43, md: 53, lg: 62 }
            },
            width: { base: "65vw", sm: "48vw", md: "33vw", lg: "23vw" }
          }
        ]}
      />

      <Shared.ContentWrapper>

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              俗稱笑氣的一氧化二氮（N2O），在台灣半導體和食品加工等工業製程中，是不可或缺的氣體原料，但短短10多年間卻被包裝成「派對助興」的催化劑。
            </p>
            <p>
              笑氣悄悄流入市面，這無色微甜的便宜氣體，看似不會立即成癮，但《報導者》獨家取得林口長康團隊最新研究報告，證實笑氣對人體造成神經脊髓退化丶自主神經失調，多名青少年已因吸食笑氣而癧癁，5成4個案最終導致的傷害都不可逆。
            </p>
            <p>
              採訪團隊從網路世界一路比對笑氣自製和進口數字，並花費數個月採訪相關政府部門及半導體、食品業者，估計出台灣每一年約有超過26萬公斤的笑氣不知去向，而這足夠讓上萬名年輕人吸食。
            </p>
            <p>
              記者多次與不法販售笑氣的人員接觸、獲取對方信任後，得以瞭解笑氣從源頭非法進貨的方式、如何在網路上兜售以及如何運貨到府等銷售鏈；同時也採訪生產一氧化二氮的廠商，讓合法業者進一步釐清合法使用與非法販售笑氣的來源與可能的流向，並提出政府管理的可行方法。
            </p>
            <p>
              專題刊出後促成經濟部工業局、環保署調整笑氣源頭管理的方式，並且研議相關法規。2020年10月，環保署正式公告將笑氣納入 《毒性及關注化學物質管理法》，網購笑氣、持有笑氣皆可處罰，並將對笑氣添加臭味，遯止吸食風氣；而台北市政府、桃園市政府亦針對笑氣制定行政規則與管理草案並加強稽查。
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/topics/laughing-gas-in-taiwan">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names={["李雪莉", "楊惠君"]} />
          <Shared.CreditsItem role="文字" names={["楊智強", "陳潔"]} />
          <Shared.CreditsItem role="封面攝影" names="蔡耀徵" />
          <Shared.CreditsItem role="攝影" names={["蔡耀徵", "余志偉", "蘇威銘"]} />
          <Shared.CreditsItem role="設計" names="吳政達" />
          <Shared.CreditsItem role="編輯" names={["張詩芸", "洪琴宣", "陳思樺"]} />
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