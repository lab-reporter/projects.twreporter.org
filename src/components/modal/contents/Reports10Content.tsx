'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports10Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="中國虎視下的島鏈"
        subtitle="沖繩如何成為台海危機的熱點？"
        date="2023.10"
      />

      <Shared.ContentWrapper>
        {/* 重點摘要 */}
        <Shared.ProjectSummary
          items={[
            {
              text: "影響力",
              children: [
                { text: "圖解中共解放軍進逼第一島鏈的軍事動態，授權《華盛頓郵報》引用報導數據並刊載圖表。" }
              ]
            },
            {
              text: "報導獲獎紀錄",
              children: [
                { text: "2024 亞洲出版協會卓越新聞獎（SOPA）【卓越數據圖像獎—首獎】" },
                { text: "2024 The Sigma Awards 數據新聞獎 Top 10" },
                { text: "2024 卓越新聞獎【新聞敘事創新獎】" },
                { text: "2024 曾虛白先生新聞獎【公共服務報導獎－數位創新類】" }
              ]
            }
          ]}
        />

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              2022年8月以來，中國因時任美國眾議院議長裴洛西（Nancy Pelosi）訪台而發動劇台飛彈軍演等一連串國際事件，讓台海局勢成為了全球關注的焦點。中共解放軍進逼第一島鏈，常態跨越台灣海峽並在周邊國家的海域進行軍演，從南邊的南海、巴士海峽，到台灣東北邊的宮古海峽，讓菲律賓、日本等第一島鏈上的各國升高防備。
            </p>
            <p>
              其中，只占日本國土總面積0.6%的沖繩，因美方圍堵中國的戰略佈局，設有7成的駐日美軍軍事設施、基地與兵力。面對這場台灣人亦需了解的區域政經軍事變化，《報導者》採訪團隊親自飛往沖繩，除了前進美日重兵所在的沖繩島、高調部署愛國者飛彈的石垣島，更踏上距離台灣僅110公里、被視作日台關鍵第一線的與那國島採訪跨世代沖繩人在第一線對於戰爭的看法。
            </p>
            <p>
              此外，製作團隊也在系列報導整理2022～2023年中國解放軍對台灣的軍事騷擾路線圖，更結合日本防衛省2022年8月以來的共軍進逼動態資料，用多媒體圖解呈現解放軍兵臨城下的威壓，以及美國與日本在第一島鏈上的戰略回應。
            </p>
            <p>
              此系列報導刊登後即引起多方專業人士迴響，也吸引國際媒體關注。《華盛頓郵報》（Washington Post）主動邀請《報導者》合作，將專題報導中，針對中國戰機與戰艦侵襲台灣海峽周邊的軌跡分析轉譯成英文版，並在2023年11月13日《華郵》的報導中引用《報導者》沖繩專題內製作的圖表與相關內容，與其廣大的外國讀者分享。
            </p>
            <p>
              2024年10月，《報導者》與春山出版合作發行《島鏈有事：如果明日就是臺海戰爭，國際第一線怎麼危機應變？沖繩、日本、臺灣為何命運相連？》，另外收錄小熊英二、吳叡人、國場幸之助、許仁碩等多位專家訪談，多角度呈現台灣、日本、沖繩之間對「台灣有事」的觀點歧異，並試圖尋找對話的可能。
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/topics/first-island-chain-under-chinese-threat">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names={["張鎮宏", "李雪莉"]} />
          <Shared.CreditsItem role="文字" names={["張鎮宏", "許詩愷", "李易安"]} />
          <Shared.CreditsItem role="封面攝影" names="楊子磊" />
          <Shared.CreditsItem role="攝影" names={["楊子磊", "黃世澤"]} />
          <Shared.CreditsItem role="多媒體企劃" names="洪琴宣" />
          <Shared.CreditsItem role="數據分析" names={["柯皓翔", "簡毅慧"]} />
          <Shared.CreditsItem role="設計" names="江世民" />
          <Shared.CreditsItem role="編輯" names={["張詩芸", "汪彥成", "陳思樺", "黃鉸婷"]} />
          <Shared.CreditsItem role="社群企劃" names={["陳思樺", "汪彥成"]} />
          <Shared.CreditsItem role="翻譯" names={["黃胤毃", "海明威涼子"]} />
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