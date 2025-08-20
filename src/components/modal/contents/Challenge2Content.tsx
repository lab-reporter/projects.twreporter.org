'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Challenge2Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
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
              organization="報導者"
              title="創辦人兼執行長"
              author="何榮幸"
            />

            <p>
              2015年創辦《報導者》時，很多朋友非常關心：《報導者》的理想很好，但要如何活下去？
            </p>

            <p>
              不少朋友相信「內容為王」，認為只要努力產製優質報導，就能獲得社會支持。但感到憂心的朋友卻直指要害：《報導者》的「獲利模式」是什麼？他們善意提醒與示警：依據經驗法則，如果沒有可行與穩定的獲利模式，90%以上的新創事業都活不過3年。
            </p>

            {/* 章節小標題 */}
            <Shared.ChallengeSectionHeading
              text="在外界不看好下進行一場實驗"
            />

            <p>
              當時不知道哪裡來的自信與勇氣，我很篤定回答：「希望《報導者》能像美國非營利調查報導網站《ProPublica》一樣，只靠大眾捐款就能活下去。」
            </p>

            {/* 圖片 */}
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-2-1.webp"
              alt="非營利調查報導網站《ProPublica》。"
              caption="非營利調查報導網站《ProPublica》。"
              width={800}
              height={600}
            />

            <p>
              但真正的實情是：我一點都沒有把握能靠捐款活下去。更殘酷的事實是，彼時台灣所有的調查數據，都不支持「媒體可以靠捐款活下去」這件事。
            </p>

            <p>
              在此之前，不少調查指出，在亞洲各國中，台灣人最不願意花錢買付費APP。許多台灣人只想用免費APP，而在願意付費的台灣人當中，最多人願意購買的是財經類（尤其是投資理財）APP，最少人願意購買的是新聞類APP。
            </p>

            <p>
              也就是說，許多台灣人信奉「新聞是免費的」原則，並不認為需要「使用者付費」，這是台灣商業媒體在數位轉型過程中普遍面臨的困境。
            </p>

            <p>
              而在非營利媒體層面，許多有關公益捐款流向的媒體報導顯示，台灣人相當樂善好施，每年的公益捐款數字頗為驚人。但是，台灣人的公益捐款大多流向宗教團體與社福團體，願意捐款給非營利媒體的比例，甚至低到根本無法獨立成為捐款統計項目。
            </p>

            <p>
              早在2007年成立的《ProPublica》，只依靠美國社會捐款就足以存活至今，不但全心全力投入調查報導，而且還拿了好幾座普立茲新聞獎。但《ProPublica》是奠立於美國民眾相信使用者付費，公益捐款也願意流向非營利媒體的社會文化基礎上，台灣有可能複製《ProPublica》成功經驗嗎？
            </p>

            <p>
              儘管各項調查與經驗法則都不樂觀，我卻依然想要進行一場實驗。我常自嘲B型、雙魚座的樂觀性格是打死不退，但真正的原因是：我對台灣公民社會有信心，相信這些調查數字與經驗法則總有改變的一天。
            </p>

            {/* 章節小標題 */}
            <Shared.ChallengeSectionHeading
              text="從4到8,000的艱辛旅程"
            />

            <p>
              結果，《報導者》上線的第一年證明，當時所有悲觀的調查數字都是對的。
            </p>

            <p>
              儘管《報導者》推出的各項報導及「急診人生」新聞遊戲獲得不少好評，但叫好並沒有叫座。第一個月過去之後，最能檢驗小額捐款的「定期定額」捐款人數僅有4個人，單筆捐款者也只有20多人（部份還是我的親朋好友）。
            </p>

            <p>
              以一個20人規模的非營利媒體及新創事業而言，捐款人數如此薄弱的起步，實在是不可承受之重，我肩上揹負的壓力也可想而知。
            </p>

            <p>
              非常幸運的是，《報導者》在成立之初就有貴人相助。童子賢先生的個人大筆捐款，讓我們得以撐過第一年最艱辛的草創時期。
            </p>

            {/* 第二張圖片 */}
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-2-2.webp"
              alt="2015年9月1日，報導者成立記者會當天，童子賢先生上台致詞。"
              caption="2015年9月1日，報導者成立記者會當天，童子賢先生上台致詞。"
              width={800}
              height={600}
            />

            <p>
              因為有童子賢先生的大筆捐款支持，我們才能以一篇篇深度報導爭取讀者的長期信任，並且逐漸打開知名度與累積影響力。整整一年之後，在全體同事的努力下，《報導者》每月定期定額捐款人數終於來到249人。到了此刻，「內容為王」的效應才開始浮現。
            </p>

            <p>
              10年之後，《報導者》每月定期定額捐款人終於來到8,000人，每年小額捐款所占比例也已超過大筆捐款。
            </p>

            <p>
              從第一個月定期定額捐款的4個人到現在的8,000人，我的心中充滿感激。10年之後，我終於可以向當初所有悲觀的調查數字反問一句：誰說台灣人的捐款習慣不會改變？
            </p>

            <p>
              坦白說，深度報導與調查報導常常耗時數月，加上攝影、設計師、工程師等團隊協作，必須投入龐大的時間成本與人事成本。2022年，《報導者》前後兩度各派出三位記者遠赴歐洲戰地採訪俄羅斯入侵烏克蘭戰爭，這種以台灣視野進行的國際採訪費用更是驚人。而我們為了增加報導影響力所製作的Podcast節目，以及努力向下扎根推出的《少年報導者》新網站，也都需要穩定的捐款贊助才能勇往直前。
            </p>

            <p>
              因此，《報導者》想要持續前進，仍需要更多與更穩定的捐款結構支撐，我們才能產製更多優質內容，並讓每一筆捐款得以發揮更大的影響力。這場實驗仍在進行中，而且還有很長一段路要走。
            </p>

            <p>
              深深感謝過去10年來每一位捐款者，是你們改變了台灣民眾的捐款慣性，是你們讓非營利媒體走出一條新路，是你們印證了我對台灣公民社會的信心。
            </p>

            <p>
              你們已經用行動證明，每一位捐款者都是《報導者》最重要的「獲利模式」。
            </p>
          </div>
        </Shared.TextContent>
      </Shared.ContentWrapper>

      {/* 分享功能 */}
      <div className="px-6 py-4">
        <Shared.ShareLink />
      </div>

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