'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports4Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="廢墟裡的少年"
        subtitle="兩萬名被遺忘的高風險家庭孩子們"
        date="2017.11"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "深入呈現全台各地高風險家庭少年的故事，專題主要受訪者「土豆」的短片獲百萬人次觀看。" },
              { text: "專題故事由曾任《報導者》攝影記者的導演林佑恩延伸拍攝成紀錄短片《度日》，於2021年獲得金馬獎最佳紀錄短片。" },
              { text: "導演蔡銀娟將報導情節改編成電影兒少安置與犯罪議題《失樂園》，2025年上映。" }
            ]
          },
          {
            text: "報導獲獎紀錄",
            children: [
              { text: "2018 卓越新聞獎【深度報導獎】" },
              { text: "2018 曾虛白新聞獎【公共服務報導獎】" },
              { text: "2018 台海新聞攝影大賽【台海人物新聞類金獎】" }
            ]
          }
        ]}
      />

      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-4/report-4-1.webp",
            position: {
              top: { base: "5%", sm: "7%", md: "8%", lg: "8%" },
              left: { base: "25%", sm: "24%", md: "23%", lg: "23%" },
              z: { base: 28, sm: 39, md: 47, lg: 55 }
            },
            width: { base: "70vw", sm: "52vw", md: "38vw", lg: "25vw" }
          },
          {
            src: "/assets/reports/report-4/report-4-2.webp",
            position: {
              top: { base: "35%", sm: "37%", md: "39%", lg: "40%" },
              left: { base: "20%", sm: "40%", md: "47%", lg: "50%" },
              z: { base: 20, sm: 28, md: 34, lg: 40 }
            },
            width: { base: "60vw", sm: "48vw", md: "33vw", lg: "23vw" }
          },
          {
            src: "/assets/reports/report-4/report-4-3.webp",
            position: {
              top: { base: "20%", sm: "23%", md: "24%", lg: "25%" },
              left: { base: "15%", sm: "10%", md: "9%", lg: "8%" },
              z: { base: 33, sm: 46, md: 56, lg: 65 }
            },
            width: { base: "65vw", sm: "48vw", md: "33vw", lg: "23vw" }
          },
          {
            src: "/assets/reports/report-4/report-4-4.webp",
            position: {
              top: { base: "53%", sm: "55%", md: "57%", lg: "58%" },
              left: { base: "25%", sm: "28%", md: "29%", lg: "30%" },
              z: { base: 18, sm: 25, md: 30, lg: 35 }
            },
            width: { base: "60vw", sm: "50vw", md: "35vw", lg: "24vw" },
            visibility: { base: false, sm: true }
          },
          {
            src: "/assets/reports/report-4/report-4-5.webp",
            position: {
              top: { base: "13%", sm: "15%", md: "15%", lg: "16%" },
              left: { base: "30%", sm: "55%", md: "60%", lg: "63%" },
              z: { base: 25, sm: 35, md: 43, lg: 50 }
            },
            width: { base: "75vw", sm: "60vw", md: "40vw", lg: "28vw" }
          }
        ]}
      />

      <Shared.ContentWrapper>

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              在台灣，有兩萬多名12～18歲的少年少女處在「高風險家庭」中。這些家庭的主要照顧者因藥酒癎、貧病、入獄服刑或長期失業，而讓孩子們被迫走入殘破的人生。
            </p>
            <p>
              《報導者》記者群在全國深入採訪了上百名在高風險家庭中長大的少年，看見有孩子被安置在兒少機構，卻在不意間成為其他院生性掠奪的對象；有人為了幫家裡多攜一點錢，遠走異鄉，成為詐騙集團的一分子；專題的主要受訪者「土豆」，未滿十八歲就要背著噴農藥的桶子謀生計，在呸漫的毒性氣體中爭一口氣。
            </p>
            <p>
              <Shared.TextContentLink href="https://www.twreporter.org/topics/high-risk-youth-left-in-relic">系列專題</Shared.TextContentLink>
              刊登後引發極大迴響，不少讀者寫信與電話詢問提供這群少年少女工作機會與教育經費的可能，特別對於「土豆」的處境感到不捨。
            </p>
            <p>
              《報導者》 與立法委員劉建國丶李麗芬共同舉行「廢墟裡的少年──看見他們，幫助增能」公聽會 。全台近15個青少年NPO與會，陳述他們在全台各地看見的「土豆們」的故事，會中專家建請勞動部成立少年就業輔導單位、並修改《勞工保險條例》，讓微型企業也強制納保，從保障就業安全開始，逐步強化這些少年的社會保護網。
            </p>
            <p>
              報導的迴響也透過影視作品持續發酵，曾任本專題攝影記者的導演林佑恩將「土豆」的故事延伸拍攝成紀錄短片《度日》，並於2021年獲得金馬獎最佳紀錄短片；2025年發行、由蔡銀娟導演執導的兒少安置與犯罪議題電影《失樂園》，也是根據《廢墟裡的少年》專題報導改編而成。
            </p>
          </div>
        </Shared.TextContent>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="李雪莉" />
          <Shared.CreditsItem role="記者" names={["李雪莉", "簡永達", "楊智強", "張瑙文"]} />
          <Shared.CreditsItem role="攝影" names={["余志偉", "林佑恩"]} />
          <Shared.CreditsItem role="影片" names={["余志偉", "林佑恩"]} />
          <Shared.CreditsItem role="資料整合" names="陳貞樺" />
          <Shared.CreditsItem role="設計" names={["黃禹禛", "林珍娜"]} />
          <Shared.CreditsItem role="工程" names={["李法賢", "余崇任", "曾涵郁"]} />
          <Shared.CreditsItem role="合作媒體" names="今周刊" />
        </Shared.CreditsMarquee>
      </Shared.ContentWrapper>

      {/* CTA 區域 */}
      <div className="p-6">
        <Shared.ModalCTA onClose={onClose} />
      </div>
    </Shared.Container>
  );
} 