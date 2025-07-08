'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Challenge3Content({ projectData, onNavigate, adjacentProjects }: ContentProps) {
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
            <Shared.ChallengeQuoteAuthor author="《報導者》營運長 李雪莉：" />
            
            <p className="text-xl leading-relaxed">
              2016年的某天，我還記得是去尼泊爾參加全球深度報導網（Global Investigative Journalism Network，GIJN）的年度大會（Global Investigative Journalism Conference，GIJC）後不久，我在台北街頭等紅綠燈時，巧遇同樣去了尼泊爾的一位媒體前輩，在短短等待綠燈通行的幾十秒，她對我說：「妳應該是那場會議收穫最多的人吧！」
            </p>
            
            <p className="text-xl leading-relaxed">
              這個對話我至今還記得。的確，當年我報名了GIJN的年度大會，除了是對這個調查組織好奇，也想了解全球的調查記者們分別在做些什麼，更想為甫成立不到一年的《報導者》尋求突破的合作機會。那場尼泊爾大會後，我們的收穫確實豐富，除了催生了《血淚漁場》跨國媒體的調查合作，也為《報導者》走入國際媒體社群鋪了道路。
            </p>
            
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-3/challenge-3-1.jpg"
              alt="《報導者》參加GIJC年度大會"
              caption="自2016年起，《報導者》常年受邀參加GIJC年度大會，與各國記者交流。"
              width={800}
              height={600}
            />
            
            <Shared.ChallengeSectionHeading title="碰撞中促成的國際合作" />
            
            <p className="text-xl leading-relaxed">
              2016年在GIJC尼泊爾的大會上，我像個新生一樣，在4天的會議裡沉浸於各國記者和編輯們在過去一年做出最佳的調查報導案例裡，每場會議投遞了大量的資訊，每天以6個時段安排，每個時段至少有6場到8場的活動同步進行，每一場有4位的講者同台，那是一個與會者必須快速聆聽、吸收、重整資訊的過程。
            </p>
            
            <p className="text-xl leading-relaxed">
              當時我入行已17年，經常感覺調查報導是一份沒什麼人願意投入的孤單工作，但在這個大池子裡看到這麼多膚色不同但氣味相投的「同類」，以揭發弊案或深入挖掘攸關公共利益議題為志業時，我還記得當時的振奮感。
            </p>
            
            <p className="text-xl leading-relaxed">
              我依然記得印尼調查媒體《Tempo Magazine》的主編Philipus Parera分享他們做遠洋漁場故事，《美聯社》（Associated Press）的Martha Mendoza分享她們當年拿下普立茲獎，關於東南亞漁工被虐被關進牢寵的故事，我感動之餘，也想到自己和同事們正在著手印尼漁工和海上觀察員的調查，覺得應該可以把標準拉高，於是，我主動地上前跟Martha打招呼交流意見，也拉著Philipus坐下來談了10分鐘，我快速把故事的梗概讓他知道，Philipus有著印尼人的溫暖友善，我們兩人相約在各自回國後保持聯繫。當然完成調查的過程非常複雜，除了兩國記者分別去了對方國家採集證據、進行田野和採訪，也牽涉語言的轉譯和兩個編輯檯來回的判斷和討論等，後續花了3個月的時間，最後在2016年底，分別推出《血淚漁場》、《Slavery at Sea》的調查報導。
            </p>
            
            <p className="text-xl leading-relaxed">
              那次的報導發揮即刻的影響，也給了我們很多的信心，讓我們持續開拓《報導者》與國際專業新聞社群的連結。
            </p>
            
            <p className="text-xl leading-relaxed">
              加入GIJN後，每一年我都受邀到大會上分享調查經驗。2017年在南非約翰尼斯堡、2018年在韓國首爾、2019年在德國漢堡，以及疫情後的線上會議，今年則是在瑞典哥登堡。將《報導者》的作品介紹到國際平台上，是興奮也是緊張的，尤其好幾次同台的講者都是普立茲獎得主，更有一次是與2021年諾貝爾和平獎得主的菲律賓媒體《Rappler》創辦人Maria Ressa同台。
            </p>
            
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-3/challenge-3-2.jpg"
              alt="李雪莉代表《報導者》上台分享"
              caption="2023於瑞典舉辦的GIJC，李雪莉代表《報導者》上台分享，分享主題為Investigating Asia，全程以英語演說。"
              width={800}
              height={600}
            />
            
            <p className="text-xl leading-relaxed">
              總之，每回上場後回到台灣，只感覺還有太多事要努力，在調查記者這一行，謙虛之外，持續進步才是硬道理。
            </p>
            
            <p className="text-xl leading-relaxed">
              在英語世界的足跡讓不少外國媒體認識了《報導者》團隊，我們的故事從文字到Podcast也都被轉譯為英文，不少商業媒體包括《Nikkei Asia》也注意到我們。這增加了我們的能見度以及跨國合作的機會，從《Buzzfeed》、《OCCRP》、《R.Age》、《ERC》等，我們的同事有機會跟著各國記者一起練功，也協助同事拉高格局與跨域的視角看複雜的議題，避免搶快又無法深入的「降落傘式新聞」（Parachute Journalism）。
            </p>
            
            <Shared.ChallengeSectionHeading title="捲動與世界的連結" />
            
            <p className="text-xl leading-relaxed">
              回望這些年，我想起那位資深前輩對我說的那句話：「妳應該是那場會議收穫最多的人吧！」我的確收穫很多，但這收穫並不是成為「個人」的私藏，反而是希望能捲動台灣與國際專業社群的連結。特別是亞洲和太平洋是世界人口最多的區域，但這個區域有89%的人生活在獨裁、極權的政體下，自由報導愈顯困難，台灣角色更為重要。每次返往GIJN，我和同事們也會努力在「報導者開放實驗室」Medium上寫下自己的觀察，分享給台灣與外國的同業，就是希望不只是我們自己的成長，而是專業社群一起茁壯。
            </p>
            
            <p className="text-xl leading-relaxed">
              與GIJN的相遇很美好。非營利媒體之路不是孤獨的選擇，好多媒體也是從荒煙蔓草中走出各自的一條小徑。
            </p>
            
            <p className="text-xl leading-relaxed">
              無論我們來自哪裡、在哪工作，調查記者永遠會共享同樣的基因——專注公共的利益，當人民的記者。
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