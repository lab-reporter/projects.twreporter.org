'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports7Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="搶救兒童高死亡率"
        subtitle="每天我們失去5個孩子"
        date="2018.04"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "揭露兒童高死亡率及偏鄉早療困境，報導發布數月後，行政院將兒童高死亡率及早療議題列為專章重點強化。" },
              { text: "2018年，公益團購網因報導而發動「長頸鹿保溫箱」募款計畫，共募得超過500萬元，成功捐助6家醫院。" }
            ]
          }
        ]}
      />

      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-7/report-7-1.webp",
            position: {
              top: { base: "15%", sm: "17%", md: "17%", lg: "18%" },
              left: { base: "15%", sm: "10%", md: "9%", lg: "8%" },
              z: { base: 26, sm: 36, md: 44, lg: 52 }
            },
            width: { base: "70vw", sm: "55vw", md: "38vw", lg: "26vw" }
          },
          {
            src: "/assets/reports/report-7/report-7-2.webp",
            position: {
              top: { base: "30%", sm: "32%", md: "34%", lg: "35%" },
              left: { base: "25%", sm: "60%", md: "65%", lg: "68%" },
              z: { base: 33, sm: 46, md: 56, lg: 65 }
            },
            width: { base: "65vw", sm: "45vw", md: "30vw", lg: "22vw" },
            visibility: { base: false, sm: true }
          },
          {
            src: "/assets/reports/report-7/report-7-3.webp",
            position: {
              top: { base: "45%", sm: "47%", md: "49%", lg: "50%" },
              left: { base: "20%", sm: "20%", md: "21%", lg: "22%" },
              z: { base: 20, sm: 28, md: 34, lg: 40 }
            },
            width: { base: "60vw", sm: "45vw", md: "30vw", lg: "22vw" }
          },
          {
            src: "/assets/reports/report-7/report-7-4.webp",
            position: {
              top: { base: "9%", sm: "11%", md: "11%", lg: "12%" },
              left: { base: "22%", sm: "35%", md: "39%", lg: "42%" },
              z: { base: 29, sm: 41, md: 50, lg: 58 }
            },
            width: { base: "70vw", sm: "52vw", md: "37vw", lg: "25vw" }
          },
          {
            src: "/assets/reports/report-7/report-7-5.webp",
            position: {
              top: { base: "47%", sm: "49%", md: "51%", lg: "52%" },
              left: { base: "18%", sm: "40%", md: "44%", lg: "47%" },
              z: { base: 23, sm: 32, md: 39, lg: 45 }
            },
            width: { base: "75vw", sm: "58vw", md: "42vw", lg: "28vw" },
            visibility: { base: false, sm: true }
          }
        ]}
      />

      <Shared.ContentWrapper>

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              台灣19歲以下兒童死亡率，20多年來降幅落後世界平均值、是已開發國家的後段班。
            </p>
            <p>
              《報導者》採訪團隊從都會走進偏鄉，看見兒童急重症科醫師老化凋零、在後繼無人中「爆肝」；提供24小時兒童急診的醫院持續消退，家長半夜抱病兒可能求助無門；守護巴掌天使的新生兒科醫師無償外接轉診病兒、風險得自扛；站在兒虐最前線的兒少保護醫療工作者，往往只能義務「做功德」；擔負重症醫療最後線及創新技術、世代健康研究任務的四大兒童醫院，都因經費不足而「玩假的」。
            </p>
            <p>
              2018年4月，《報導者》推出第一波兒童醫療專題《每天我們失去5個孩子——搶救兒童高死亡率》，6月再刊登《流浪的早療兒——誰是慢天使的麥田捕手？》專題報導，探討兒童高死亡率及偏鄉早療困境。
            </p>
            <p>
              同年8月，行政院公布「我國少子女化對策計畫」白皮書，將兒童高死亡率及早療議題列為專章重點強化，回應報導提出的相關呼籲。
            </p>
            <p>
              民間方面，公益團購網「You Give, I Give」因報導而發動「長頸鹿保溫箱（可直接在加護病房裡變身成手術台的多功能保溫箱）」募資計畫，共募得超過500萬元，成功捐助台東馬偕、花蓮慈濟、彰化基督教醫院、台大醫院、台中中山醫院、雲林若瑟醫院等6家醫院。
            </p>
            <p>
              此外，系列報導揭露台灣兒童醫療沒有轉診體系，東部醫師把普悠瑪當救護車，也帶動台大兒童醫院建立「行動ICU」兒童轉院外接團隊，期盼有助於緩解兒童早療窘境。
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/topics/child-mortality-rate">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="楊惠君" />
          <Shared.CreditsItem role="記者" names={["楊惠君", "張子午", "陳麗婷", "張雅雯"]} />
          <Shared.CreditsItem role="攝影" names={["林佑恩", "曾原信", "吳逸驊", "余志偉", "林韶安"]} />
          <Shared.CreditsItem role="影片" names={["林佑恩", "陳麗婷", "吳逸驊"]} />
          <Shared.CreditsItem role="編輯" names={["張詩芸", "賴子歆", "陳思樺"]} />
          <Shared.CreditsItem role="資料整合" names={["陳貞樺", "蔣宜婷"]} />
          <Shared.CreditsItem role="設計" names={["黃禹禛", "林珍娜"]} />
          <Shared.CreditsItem role="行銷" names="王儀君" />
          <Shared.CreditsItem role="合作媒體" names="今周刊" />
          <Shared.CreditsItem role="特別感謝" names={["台灣兒科醫學會", "台灣兒童急診醫學會", "台灣新生兒科醫學會", "成大健康資料加值應用研究中心"]} />
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