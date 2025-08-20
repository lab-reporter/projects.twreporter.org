'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports1Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.ReportBanner
        mediaSrc={projectData.path}
        title="綁債．黑工．留學陷阱"
        subtitle="失控的高教技職國際招生"
        date="2022.01"
      />

      {/* 重點摘要 */}
      <Shared.ProjectSummary
        items={[
          {
            text: "影響力",
            children: [
              { text: "揭露中州科大違法招募16位烏干達外籍生來台淪為學工，促使教育部勒令該校停止招生，該校正式走入歷史；檢調起訴學校高層、人力仲介以及公務員。" },
              { text: "2024年，彰化地方法院一審重判中州科大時任副校長、苗栗縣政府勞青處前副處長。" }
            ]
          },
          {
            text: "報導獲獎紀錄",
            children: [
              { text: "2023 亞洲出版協會卓越新聞獎（SOPA）【卓越人權報導獎—首獎】" },
              { text: "2023 亞洲出版協會卓越新聞獎（SOPA）【卓越調查報導獎—優勝】" },
              { text: "2023 人權新聞獎【華文調查報導 首獎】" },
              { text: "2023 SND最佳新聞設計創意競賽【插圖類—優選】" },
              { text: "2022 曾虛白新聞獎【公共服務報導獎 文字類】" }
            ]
          }
        ]}
      />


      <Shared.ReportsParallaxPhoto
        photos={[
          {
            src: "/assets/reports/report-1/report-1-1.webp",
            position: {
              top: { base: "5%", sm: "8%", md: "10%", lg: "10%" },
              left: { base: "5%", sm: "10%", md: "12%", lg: "15%" },
              z: { base: 20, sm: 30, md: 35, lg: 40 }
            },
            width: { base: "70vw", sm: "55vw", md: "40vw", lg: "30vw", xl: "25vw" }
          },
          {
            src: "/assets/reports/report-1/report-1-2.webp",
            position: {
              top: { base: "25%", sm: "20%", md: "18%", lg: "15%" },
              left: { base: "20%", sm: "35%", md: "45%", lg: "50%" },
              z: { base: 15, sm: 20, md: 25, lg: 30 }
            },
            width: { base: "65vw", sm: "50vw", md: "38vw", lg: "32vw", xl: "29vw" },
            visibility: { base: false, sm: true }
          },
          {
            src: "/assets/reports/report-1/report-1-3.webp",
            position: {
              top: { base: "45%", sm: "45%", md: "45%", lg: "45%" },
              left: { base: "15%", sm: "25%", md: "30%", lg: "35%" },
              z: { base: 40, sm: 60, md: 75, lg: 90 }
            },
            width: { base: "60vw", sm: "45vw", md: "32vw", lg: "26vw", xl: "22vw" }
          },
          {
            src: "/assets/reports/report-1/report-1-4.webp",
            position: {
              top: { base: "65%", sm: "62%", md: "60%", lg: "60%" },
              left: { base: "5%", sm: "8%", md: "10%", lg: "10%" },
              z: { base: 25, sm: 35, md: 42, lg: 50 }
            },
            width: { base: "60vw", sm: "45vw", md: "32vw", lg: "26vw", xl: "22vw" },
            visibility: { base: false, sm: true }
          },
          {
            src: "/assets/reports/report-1/report-1-5.webp",
            position: {
              top: { base: "85%", sm: "70%", md: "60%", lg: "55%" },
              left: { base: "30%", sm: "50%", md: "60%", lg: "65%" },
              z: { base: 30, sm: 45, md: 55, lg: 65 }
            },
            width: { base: "65vw", sm: "50vw", md: "35vw", lg: "28vw", xl: "24vw" },
            visibility: { base: false, md: true }
          }
        ]} />

      <Shared.ContentWrapper>
        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              16位烏干達學生2019年在彰化中州科技大學的強力招募下，千里迢迢赴台讀書，但學校卻未兌現當初的獎學金、英語授課等承諾，甚至讓學生淪為黑工，陷入債務的漩渦等惡性循環中。
            </p>
            <p>
              《報導者》記者歷時10個月的追蹤，跟著這群外籍生走進教室、進到CNC車床工廠、隱形眼鏡廠、腳踏車零件廠、食品加工廠裡，目睹一個個仰慕台灣、於是背債來台讀書的年輕生命，在教室裡被迫上著聽不懂的中文課，7成時間得在工廠打工甚至打黑工，陷入債務的漩渦與循環。
            </p>
            <p>
              此報導的刊登引起政府、民間各界關注。立法委員范雲與多個民間團體在報導發布隔天召開記者會，要求教育部全面調查；隔月，教育部依《私立學校法》規定，決議中州科大自111學年度起停止全部班級招生；2023年7月，該校已正式停辦。
            </p>
            <p>
              檢調方面，歷經超過半年的蒐證，彰化地檢署於2022年10月以違反《人口販運防制法》、《刑法》、《貪污治罪條例》、《個人資料保護法》等罪行，對中州科大時任副校長柴鈁武、苗栗縣政府公務員涂榮輝等共10人提起公訴。這是台灣外籍生遭到剝削案件中，首次以人口販運罪起訴，從學界、人力仲介、台商到公務員等，涉案人員範圍廣大。2024年6月，彰化地方法院一審宣判，柴鈁武等人重判5年6個月到2年不等的有期徒刑；涂榮輝犯圖利罪，重判7年有期徒刑，併科240萬元罰金，褫奪公權5年。
            </p>
            <p>
              負責承辦的檢察官蔡奇曉受訪時指出，柴鈁武將是第一個被依照人口販運判刑的時任副校長，其他有罪的部分刑度都很重，對於這樣的犯罪型態有嚇阻的效力。蔡奇曉描述辦案經過，當時看到《報導者》調查報導後，非常驚訝媒體在沒有調查權下可以完整爬梳整個脈絡，而且其中一張薪資單很清楚的證明超時工作，已經違反《就業服務法》規定，因此成功申請到搜索票，這是整個過程中很關鍵的一步。
            </p>
            <p>
              16位烏干達學生中，有2位放棄在台灣完成學業、返回母國，其餘14位已被安排轉至其他學校；如今，他們終於可以當一位正常的國際留學生，體驗台灣的生活。
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/a/2023-09-11-chinese-foreign-students-in-taiwan-abuse-case">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="李雪莉" />
          <Shared.CreditsItem role="文字" names={["楊智強", "何柏均", "嚴文廷", "李雪莉"]} />
          <Shared.CreditsItem role="攝影" names="楊子磊" />
          <Shared.CreditsItem role="漫畫" names="柳廣成" />
          <Shared.CreditsItem role="設計" names="黃禹禎" />
          <Shared.CreditsItem role="專案管理" names="洪琴宣" />
          <Shared.CreditsItem role="編輯" names={["張詩芸", "陳思樺"]} />
        </Shared.CreditsMarquee>
      </Shared.ContentWrapper>

      {/* 分享功能 */}
      <div className="px-6 py-4">
        <Shared.ShareLink
          title="綁債．黑工．留學陷阱 - 失控的高教技職國際招生"
          description="《報導者》深度調查烏干達學生在台遭遇的教育剝削問題，促使政府關注並採取行動，成功讓違法學校停辦並起訴相關人員。"
          url="https://10th-recap-dev-2d.vercel.app/"
        />
      </div>

      {/* 支持報導者按鈕 */}
      <Shared.ModalDonate onClose={onClose} />

    </Shared.Container>
  );
}