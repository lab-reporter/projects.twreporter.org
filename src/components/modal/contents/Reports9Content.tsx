'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports9Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.HeroBanner
        mediaSrc="/assets/reports-9.jpg"
        title="1年26萬公斤的工業笑氣，如何毒害年輕人？"
        subtitle="合法、廉價、24小時到貨"
        date="2020.03"
      />

      <Shared.ContentWrapper>
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

      {/* 導航按鈕 */}
      <Shared.NavigationControls
        onNavigate={onNavigate}
        adjacentProjects={adjacentProjects}
      />
    </Shared.Container>
  );
}