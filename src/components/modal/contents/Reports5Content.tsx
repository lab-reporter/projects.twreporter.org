'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports5Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="石化工廠旁的環境難民"
        subtitle="六輕營運20年"
        date="2018.01"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "揭露台塑集團申報空污數據「系統性造假」，促使監察院調查台塑集團空污數據造假及相關監督機制。" },
              { text: "2019年10月，監察院在公布調查報告指出，環保署發現台塑集團造假後拖延8年遲未修法，對環保署提出糾正。" }
            ]
          },
          {
            text: "報導獲獎紀錄",
            children: [
              { text: "2019 亞洲出版協會卓越新聞獎（SOPA）【卓越調查報導獎—首獎】" },
              { text: "2018 曾虛白新聞獎【台達能源與氣候特別獎】" }
            ]
          }
        ]}
      />

      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-5/report-5-1.webp",
            position: {
              top: { base: "17%", sm: "19%", md: "19%", lg: "20%" },
              left: { base: "20%", sm: "18%", md: "18%", lg: "18%" },
              z: { base: 21, sm: 29, md: 36, lg: 42 }
            },
            width: { base: "70vw", sm: "55vw", md: "38vw", lg: "26vw" }
          },
          {
            src: "/assets/reports/report-5/report-5-2.webp",
            position: {
              top: { base: "40%", sm: "42%", md: "44%", lg: "45%" },
              left: { base: "15%", sm: "12%", md: "11%", lg: "10%" },
              z: { base: 29, sm: 41, md: 50, lg: 58 }
            },
            width: { base: "65vw", sm: "45vw", md: "30vw", lg: "22vw" }
          },
          {
            src: "/assets/reports/report-5/report-5-3.webp",
            position: {
              top: { base: "12%", sm: "14%", md: "14%", lg: "15%" },
              left: { base: "25%", sm: "55%", md: "60%", lg: "63%" },
              z: { base: 18, sm: 25, md: 30, lg: 35 }
            },
            width: { base: "75vw", sm: "60vw", md: "40vw", lg: "28vw" }
          },
          {
            src: "/assets/reports/report-5/report-5-4.webp",
            position: {
              top: { base: "30%", sm: "33%", md: "34%", lg: "35%" },
              left: { base: "22%", sm: "38%", md: "42%", lg: "45%" },
              z: { base: 34, sm: 48, md: 58, lg: 68 }
            },
            width: { base: "65vw", sm: "50vw", md: "35vw", lg: "24vw" }
          },
          {
            src: "/assets/reports/report-5/report-5-5.webp",
            position: {
              top: { base: "50%", sm: "52%", md: "54%", lg: "55%" },
              left: { base: "18%", sm: "25%", md: "28%", lg: "30%" },
              z: { base: 23, sm: 32, md: 39, lg: 45 }
            },
            width: { base: "75vw", sm: "60vw", md: "45vw", lg: "30vw" },
            visibility: { base: false, sm: true }
          }
        ]}
      />

      <Shared.ContentWrapper>

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              從1986年在美援支持下開始有第一座石化廠以來，石化業在台灣的近兩萬個日子帶來龐大經濟利益，但也如一條巨蟲纑綁在煙囪下生活的人民，讓他們淪為環境難民。
            </p>
            <p>
              《報導者》從2015年後勁五輕關廠開始，針對雲林與高雄的石化地帶進行超過3年的追蹤調查，全景式地勾勒石化業交纓的國際政治經濟、黨國體制、產業路線、民主化與環境運動、公共安全，甚至是最新的空污與健康風險關聯之迯的科學戰爭。
            </p>
            <p>
              2018年7月，《報導者》推出
              <Shared.TextContentLink href="https://www.twreporter.org/topics/fpc-sixth-naphtha-cracker-20-years">專題報導</Shared.TextContentLink>
              ，揭露台塑集團申報空汙數據「系統性造假」，促使監察委員於同年10月開始列案調査。調查一年後，監察院在2019年10月公布調査報告指出，環保署早在2010年就發現台塑華亞汽電空汙數據造假，卻遲遲沒有修改管制方法，導致其他類似造假情況難以成案，消極怠慢不作爲，對環保署提出糾正。
            </p>
            <p>
              除了產生污染的工廠被調查外，檢測工廠污染程度的環境檢測業也是此次調查報告的重點之一。監察院除了建議環保署應盡速建立第三方公正認證機制並制定《環境檢測法》專法外，也希望環保署針對協助台塑集團造假的軟體公司的財產利盆範圍內追繳不法利得，達到警示嚇阻效果，以提升環境檢測數據的公信力。
            </p>
          </div>
        </Shared.TextContent>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="何榮幸" />
          <Shared.CreditsItem role="記者" names={["房慧真", "何榮幸", "林雨佑", "蔣宜婷"]} />
          <Shared.CreditsItem role="攝影" names={["余志偉", "吳逸驊", "林佑恩", "許震唐"]} />
          <Shared.CreditsItem role="數位專案管理" names="陳貞樺" />
          <Shared.CreditsItem role="設計" names={["黃禹禛", "林珍娜"]} />
          <Shared.CreditsItem role="工程" names={["李法賢", "余崇任"]} />
        </Shared.CreditsMarquee>
      </Shared.ContentWrapper>

      {/* CTA 區域 */}
      <div className="p-6">
        <Shared.ModalCTA onClose={onClose} />
      </div>
    </Shared.Container>
  );
}