'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Challenge5Content({ projectData, onNavigate, adjacentProjects, onClose }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      {/* 固定背景 */}
      <Shared.ChallengeFixedBackground />

      <Shared.ContentWrapper>
        <Shared.TextContent>
          {/* 文章標題 */}
          <Shared.ChallengeArticleTitle title={projectData.title} />

          <div className="space-y-4">
            {/* 引言作者 */}
            <Shared.ChallengeQuoteAuthor
              organization="《報導者》"
              title="創辦人兼執行長"
              author="何榮幸"
            />

            <p>
              每一分、每一秒都可能發生重大新聞，因此新聞媒體的特性──也是宿命──是24小時隨時待命，不論刮風下雨、天搖地動、動亂戰爭，也不論是即時新聞抑或追蹤調查，都必須報導國內外重要新聞以善盡職責。
            </p>

            {/* 圖片與說明 */}
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-5-1.webp"
              alt="新聞工作者必須在第一線採訪，常常面臨各項身心壓力，圖為2021年4月台鐵太魯閣號事故現場。"
              caption="新聞工作者必須在第一線採訪，常常面臨各項身心壓力，圖為2021年4月台鐵太魯閣號事故現場。（攝影／何柏均）"
              width={800}
              height={600}
            />

            {/* 章節小標題 */}
            <Shared.ChallengeSectionHeading
              text="24小時待命的高壓行業"
            />

            <p>
              新聞工作者也隨時面臨各式各樣的壓力，例如新聞流程中的採訪突破、盡力求證、同業競爭、截稿時限、品質要求等，每一項壓力都是如影隨形，有些特殊壓力甚至可能形成創傷後壓力症候群；而各項挑戰權勢者與既得利益者的報導，常面臨諸多法律風險與人身安全威脅，這些也都需要建構安全環境以提供保障。
            </p>

            <p>
              《報導者》成立之後，從董事會的討論，到同事之間彼此關懷，在在意識到建構員工身心健康環境的重要性，因此研擬推動了相關措施。
            </p>

            <p>
              首先，我們建立了制度性的心理支持系統。在參照國外媒體作法後，我們與專業心理諮商機構正式簽約，舉凡員工有心理諮商需求，皆由報導者文化基金會全額支付第一期諮商費用（通常一期諮商次數為6次），若需要進入第二期諮商，則由基金會、員工各自負擔一半費用。
            </p>

            <p>
              坦白說，這項制度也是不斷磨合的結果。剛開始我們為了落實員工心理支持系統，原本基金會是不限諮商次數的全額負擔費用，但在實施一段時間之後發現，有些員工需要很長時間的諮商才能漸進走出心理困境，在非營利媒體資源有限的情況下，改為基金會在一定次數內全額負擔、其後與員工共同負擔的方式更加合理。
            </p>

            <p>
              在此同時，我們也長期補助員工旅遊、定期健檢，並積極推動各項社團活動及鼓勵員工休假。以社團活動而言，近年最活躍的是攀岩社，不少同事已養成固定攀岩的習慣；最多人參加的是慢跑活動，還有同事熱衷於國內外各項馬拉松比賽。我自己很喜歡跟同事們打桌球、羽球，到棒壘球練習場盡情揮棒，以及鼓勵同事們多做重訓，或是邊追劇邊運動讓自己一舉兩得。
            </p>

            {/* 第二張圖片 */}
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-5-2.webp"
              alt="《報導者》近年興起社團參與風氣，同事在下班後會相約慢跑活動。"
              caption="《報導者》近年興起社團參與風氣，同事在下班後會相約慢跑活動。（攝影／邱紹雯）"
              width={800}
              height={600}
            />

            {/* 章節小標題 */}
            <Shared.ChallengeSectionHeading
              text="從建立「心理支持系統」到制度性鼓勵休假"
            />

            <p>
              至於鼓勵員工休假，我們的作法是在《團體協約》中加入下列條文：「凡年資5年以上未滿10年者，除法規原訂特休天數外，報導者基金會另給予5日的年資假；年資10年以上者，另給10日年資假。」也就是說，除了平常鼓勵員工多休假，我們也期待資深員工休更多假，讓非營利媒體也能夠創造有利於員工身心健康的環境。
            </p>

            <p>
              過去10年來，我們從最基本的常設法律顧問、增加團體保險額度，到強化國外採訪裝備、安全防護意識與各項國際保險，乃至於簽訂健全勞動環境的「團體協約」，都是為了讓新聞工作者沒有後顧之憂而全力以赴。
            </p>

            <p>
              如今全球進入AI時代，新聞界也再度受到強烈衝擊，但再厲害的AI也無法取代在新聞現場長期蹲點的第一手觀察，再強大的AI也無法只憑海量資料分析就能呈現複雜事件的真相，調查報導的核心本質，依舊有重要部分必須由「人」來推動與完成，新聞工作者也必須更加重視身心健康以迎向新時代的挑戰。
            </p>
          </div>
        </Shared.TextContent>
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