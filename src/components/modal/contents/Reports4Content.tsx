'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports4Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="廢墟裡的少年"
        subtitle="兩萬名被遺忘的高風險家庭孩子們"
        date="2017.11"
      />

      <Shared.ContentWrapper>
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
              系列專題刊登後引發極大迴響，不少讀者寫信與電話詢問提供這群少年少女工作機會與教育經費的可能，特別對於「土豆」的處境感到不捨。
            </p>
            <p>
              《報導者》 與立法委員劉建國丶李麗芬共同舉行「廢墟裡的少年──看見他們，幫助增能」公聽會 。全台近15個青少年NPO與會，陳述他們在全台各地看見的「土豆們」的故事，會中專家建請勞動部成立少年就業輔導單位、並修改《勞工保險條例》，讓微型企業也強制納保，從保障就業安全開始，逐步強化這些少年的社會保護網。
            </p>
            <p>
              報導的迴響也透過影視作品持續發酵，曾任本專題攝影記者的導演林佑恩將「土豆」的故事延伸拍攝成紀錄短片《度日》，並於2021年獲得金馬獎最佳紀錄短片；2025年發行、由蔡銀娟導演執導的兒少安置與犯罪議題電影《失樂園》，也是根據《廢墟裡的少年》專題報導改編而成。
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/topics/youth-at-risk">
          閱讀完整專題
        </Shared.ExternalLink>

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

      {/* 導航按鈕 */}
      <Shared.NavigationControls
        onNavigate={onNavigate}
        adjacentProjects={adjacentProjects}
      />
    </Shared.Container>
  );
} 