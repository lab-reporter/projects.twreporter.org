'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Challenge10Content({ projectData, onNavigate, adjacentProjects }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      {/* 固定背景 */}
      <Shared.ChallengeFixedBackground 
        src="/assets/challenges/challenge-bg.svg" 
        alt="挑戰背景圖" 
      />

      <Shared.ContentWrapper>
        <Shared.TextContent>
          {/* 文章標題 */}
          <Shared.ChallengeArticleTitle title={projectData.title} />
          
          <div className="space-y-4">
            <p className="text-xl leading-relaxed">
              從2015年9月1日創辦《報導者》至今，我最常被問到的問題是：非營利媒體這條路如此艱辛，是什麼原因支撐你走到現在？
            </p>
            
            <p className="text-xl leading-relaxed">
              剛開始我的回答都是：理想、熱情、使命感，這的確是我的內在信念與驅力。但直到2022年《報導者》與台中科博館合辦贊助者大會發生的一個小故事，我才更加明白，支撐我和同事們走過這8年的最重要動力來自何方。
            </p>
            
            <p className="text-xl leading-relaxed">
              舉辦贊助者大會，是為了表達對於捐款者的感謝，也希望透過「開放編輯室」的方式與支持者實質互動。但沒想到，許多捐款者上台分享心情時強調，他們更想感謝《報導者》的努力。
            </p>
            
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-10/challenge-10-1.jpg"
              alt="台中科博館贊助者大會"
              caption="2022年1月，《報導者》於台中科博館舉辦中部場贊助者大會"
              width={800}
              height={600}
            />
            
            <p className="text-xl leading-relaxed">
              這場活動結束後，有一位看起來非常害羞的年輕人跑來舞台旁邊跟我說，她是中國醫藥大學領清寒獎學金的大五學生，她不懂新聞，但知道《報導者》每一篇深度報導都花了很多時間跟人力，雖然她的能力很有限，但她希望《報導者》能夠活下去，因此每次領到獎學金時都會捐一部份給《報導者》，希望能夠支持我們做出更多讓社會變得更好的報導。
            </p>
            
            <p className="text-xl leading-relaxed">
              那一刻，我這個50多歲中年大叔的眼淚差點不爭氣掉了下來。這些年我和同事們在惡劣大環境中奮鬥不懈的辛苦，也彷彿得到了最大的慰撫。
            </p>
            
            <Shared.ChallengeSectionHeading title="長期觀察《報導者》的捐款心路歷程" />
            
            <p className="text-xl leading-relaxed">
              2024年11月底，行銷部同事向我回報一項令人驚喜的消息：某家科技公司的年度員工捐款活動，有超過400位員工捐款支持《報導者》，這些都是員工們積少成多、聚沙成塔的支持心意，在寒冷的天氣中格外溫暖。
            </p>
            
            <p className="text-xl leading-relaxed">
              我之所以驚訝，是因為《報導者》在過去兩三年才陸續開始接觸不同跨國公司的員工捐活動，還沒有預期能夠獲得跨國公司員工們的踴躍贊助。
            </p>
            
            <p className="text-xl leading-relaxed">
              許多跨國公司為了實踐企業社會責任（Corporate Social Responsibility, 簡稱CSR）而鼓勵員工支持公益團體，每年都會定期舉辦員工捐活動，由員工自掏腰包捐款，公司也會提供一樣額度的相對捐款，也就是讓員工的公益捐款達到加乘放大效果。
            </p>
            
            <p className="text-xl leading-relaxed">
              在這種公益捐款風氣下，我和營運長雪莉、行銷部同事盈臻、姵菁開始前往跨國公司員工捐活動進行演講分享，《報導者》也在去年下半年獲得某家投信公司的員工捐款支持，讓我們踏出企業員工捐的重要一步，沒想到之後能夠繼續獲得這家科技公司員工的共襄盛舉。
            </p>
            
            <p className="text-xl leading-relaxed">
              原來，一位原本就已定期定額支持《報導者》的某科技公司員工Lilian，在其中扮演了推波助瀾的重要角色。我們邀請Lilian到《報導者》辦公室表達感謝，才知道這個捐款過程有多麼不容易。
            </p>
            
            <p className="text-xl leading-relaxed">
              Lilian說她跟很多科技業員工一樣，原本不看任何新聞，全心專注於工作。幾年前無意間接觸到《報導者》時，儘管她認為《報導者》深入探討的各項議題很重要，但因為這些議題都很沉重，看完後覺得很無力，很多議題也都很遙遠，因此她並沒有持續關注《報導者》的內容。
            </p>
            
            <p className="text-xl leading-relaxed">
              再過幾年，她注意到《報導者》推出了Podcast節目《The Real Story》，她開始持續收聽，也逐漸覺得這些重要的社會議題並不遙遠，其實就在你我身邊。
            </p>
            
            <p className="text-xl leading-relaxed">
              在長期聆聽《報導者》Podcast節目的過程中，Lilian慢慢了解各項議題的幕後採訪故事，並且透過《報導者》在高雄「大港開唱」活動中短講的現場收音等活潑軟性內容，對於《報導者》產生更多認同感。到了去年4月《報導者》Podcast節目舉辦「緬甸街走讀」活動，她更報名參加，近距離觀察《報導者》工作人員與讀者、店家的互動，以及其他聽友們的多元面貌。
            </p>
            
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-10/challenge-10-2.jpg"
              alt="Lilian參與緬甸街走讀活動"
              caption="Lilian 參與《報導者》與「鳴個喇叭！緬甸街」合作的走讀活動，由在台緬人於中和華新街發起，讓更多人了解緬甸現況。"
              width={800}
              height={600}
            />
            
            <p className="text-xl leading-relaxed">
              經過長達數年的觀察與接觸，Lilian在去年8月開始每月定期定額捐款2,000元給《報導者》等公益組織，並向其他同事介紹他認同的公益團體。
            </p>
            
            <p className="text-xl leading-relaxed">
              Lilian和我們分享：「透過《報導者》，讓我有機會接觸到正在各個角落真實上演的真實故事，也讓我看到各個事件背後，好多人盡力地做自己能做的，讓這個世界變得更好，我也希望透過贊助《報導者》，讓更多人能夠透過真實故事得到鼓舞。」
            </p>
            
            <p className="text-xl leading-relaxed">
              這一段漫長路途，既是Lilian對於《報導者》從完全陌生到高度信任的過程，更是Lilian從完全不看新聞到開始關心社會議題、進一步採取行動，最後決定成為非營利媒體固定捐款者的珍貴心路歷程。
            </p>
            
            <p className="text-xl leading-relaxed">
              至於《報導者》獲得的支持，則更歸功於所有同事的長期努力。如果不是同事在平常就有注意到《報導者》各項報導、Podcast節目、影音節目以及《少年報導者》的表現，即使《報導者》納入捐款名單，恐怕也無法獲得這麼多員工的支持。「所以你們最應該感謝的是《報導者》團隊每一個人。」Lilian以此作為此次參訪《報導者》的最後註腳。
            </p>
            
            <Shared.ChallengeSectionHeading title="每一筆捐款都有同樣的重量" />
            
            <p className="text-xl leading-relaxed">
              對我來說，這就是「捐款的重量」。無論捐款多少，也無論用什麼樣的方式表達支持，過去10年來每一筆捐款都具有同樣的重量。後來我跟同事們分享這些小故事時強調，每一筆捐款都是沈重的負託，我們必須更加努力做好每一項報導，也必須與時俱進讓報導發揮更大影響力，才能承擔起每一筆捐款的重量。
            </p>
            
            <p className="text-xl leading-relaxed">
              一直以來，報導者基金會接受大眾贊助的情況，往往受到具有時效性的報導議題牽動，在不同時期高低起伏甚大，但《報導者》投入深度調查報導及各項多媒體內容的人力、時間成本卻是有增無減。對於非營利組織的長遠發展而言，這顯然是有待努力改善的當務之急。
            </p>
            
            <p className="text-xl leading-relaxed">
              《報導者》10週年，我們希望能夠讓每月定期定額捐款繼續成長及趨向穩定。小額捐款的擴大規模與長期支持，絕對是非營利媒體健全體質的最重要基石，《報導者》也才能持續邁向「壯大非營利媒體，深耕社會影響力」的願景目標。
            </p>
            
            <p className="text-xl leading-relaxed">
              我們深信，在這個假新聞與不實資訊充斥的年代，支持獨立媒體到新聞現場帶回事實真相，這件事從未如此重要。我們會繼續努力找回媒體應有的公共性，繼續兢兢業業、全力以赴，以承擔過去、現在及未來每一筆「捐款的重量」。
            </p>
          </div>
        </Shared.TextContent>
      </Shared.ContentWrapper>

      {/* 導航按鈕 */}
      <Shared.NavigationControls
        onNavigate={onNavigate}
        adjacentProjects={adjacentProjects}
      />
    </Shared.Container>
  );
}