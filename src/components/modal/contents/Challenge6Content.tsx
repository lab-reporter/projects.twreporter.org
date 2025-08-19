'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Challenge6Content({ projectData, onNavigate, adjacentProjects, onClose }: ContentProps) {
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
            <Shared.ChallengeQuoteAuthor author="《報導者》創辦人兼執行長 何榮幸：" />

            <p>
              從成立初期清一色是深度報導，到幾年後偶而出現即時新聞，再到即時新聞的頻率持續增加，《報導者》歷經了不同階段的衝突、學習與成長。
            </p>

            <Shared.ChallengeSectionHeading text="2016台南維冠大樓倒塌那一夜" />

            <p>
              那天是農曆春節小年夜，台南維冠大樓在家家戶戶準備過年的氛圍中轟然倒塌而死傷慘重，台灣社會高度關注搶救進度與善後究責，《報導者》內部通訊的Slack群組也立即出現熱烈討論。
            </p>

            <p>
              部分年輕記者情緒激動地要求立即前往台南進行報導，處理當下台灣社會最關心的重大突發事件，否則我們將有負「報導者」之名；部分較資深同事則認為應該觀察一段時間再決定是否投入報導，若我們對社會關注議題都進行即時處理，勢必難以再投入人力關注其他冷門卻重要的議題。
            </p>

            <p>
              這兩種意見都有道理，並無是非對錯可言，但必須考量資源配置後凝聚共識。我們最後採取折衷作法，當天晚上立即調派文字、攝影記者前往台南維冠大樓救災現場，但先不進行任何報導，而是在現場採訪觀察數日之後，再努力做出與其他即時新聞有區隔的深度報導。
            </p>

            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-6-1.webp"
              alt="台南維冠大樓倒塌事故現場"
              caption="台南維冠大樓因地震發生倒塌，時任《報導者》攝影記者余志偉於事故之後趕至現場拍下畫面。（攝影／余志偉）"
              width={800}
              height={600}
            />

            <Shared.ChallengeSectionHeading text="2018年普悠瑪號事故隔天的即時深度報導" />

            <p>
              2018年10月21日台鐵普悠瑪自強號在蘇澳新馬車站前出軌發生重大事故，這一次，《報導者》內部已經沒有「是否報導」的拉鋸，只有「如何報導」的討論與規劃。長期主跑交通的資深記者嚴文廷，在事故隔天就推出〈【普悠瑪18死事故】2通簡訊示警，關鍵53分鐘危機處理待調查〉深度報導，既有第一時間獨家取得的台鐵內部簡訊示警內容，也有對於台鐵長期結構性問題的完整分析。
            </p>

            <p>
              這則重大突發事件隔天就出現的即時深度報導，讓不少原本以為「《報導者》的追蹤報導都會很久之後才出現」的讀者感到驚喜。這系列相關報導之後還獲得了卓越新聞獎的即時新聞獎，這也讓不少認為《報導者》與即時新聞獎無緣的朋友跌破眼鏡。
            </p>

            <Shared.ChallengeSectionHeading text="即時新聞的公共服務：從反送中運動到3年疫情" />

            <p>
              2019年6月香港爆發反送中運動之際，社會各界關切港台民主發展與對照，我們開始反思，《報導者》身為非營利媒體，只要行有餘力，應將重大事件的即時報導視為重要公共服務，盡可能在當天提供更加完整的資訊與學者專家解讀，以善盡非營利媒體的社會責任。
            </p>

            <p>
              2020年年初COVID-19疫情爆發，我們繼續秉持公共服務精神，每天盡可能完整呈現疫情指揮中心等各方發言與專家觀點，在社會人心惶惶的氛圍中努力提供冷靜與理性的資訊。
            </p>

            <p>
              在前後長達3年的防疫期間，許多讀者公開留言感謝《報導者》每天晚上提供的完整資訊。在資訊爆炸混亂且真假難辨的當下，讀者很難有足夠時間蒐集資訊與進行事實查核，也很容易被各種政治與社群操作手法帶風向，《報導者》提供的公共服務已成為讀者們可以信賴的即時訊息。
            </p>

            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-6-2.webp"
              alt="防疫期間的送行者"
              caption="2021年防疫第三級警戒期間，攝影記者楊子磊拍攝送行者為確診死者送行過程。"
              width={800}
              height={600}
            />

            <Shared.ChallengeSectionHeading text="量力而為，關切重大社會事件" />

            <p>
              經過磨合與摸索，我們已凝聚形成「量力而為」的內部最大共識。
            </p>

            <p>
              如果只是想搶點閱率，我們根本不需要費力推出每則動輒2、3000字的即時新聞完整資訊，我們推出即時新聞的最重要目的，是落實非營利媒體的公共服務及期待多元拓展影響力。
            </p>

            <p>
              至於投入即時新聞會不會影響同事們的勞動權益？我們努力調節工作與輪班時間避免過勞，並早已建構優於勞基法的「團體協約」各項保障，讓同事們可以在沒有後顧之憂的環境下全力以赴，並且成為《報導者》努力兼顧長期深度報導與重大事件即時新聞的重要後盾。
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