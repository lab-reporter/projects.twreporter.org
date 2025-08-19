'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Challenge1Content({ projectData, onNavigate: _onNavigate, adjacentProjects: _adjacentProjects, onClose }: ContentProps) {
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
              10年前，在我前方蔓延的網路媒體叢林有兩條路：一條是百花齊放、各領風騷的商業媒體大道，另一條是人跡稀少、前途不明的非營利媒體羊腸小徑。因緣際會之下，我選擇了民間公共媒體這條地圖上難以辨識的小路，但也從此看見了非常不同的沿路風景，在當代媒體諸多挑戰中繼續摸索前行。
            </p>
            <p>
              回望2015年，前一年震動全台的318太陽花學運剛落幕不久，台灣正在國際社會及兩岸關係中尋找下一階段定位。而在傳統媒體走過25年、年紀直逼50歲之際，我的生命歷程也來到了偶然與必然共同浮現的轉折時刻。
            </p>

            <p>
              在全球商業媒體走向數位轉型的關鍵時刻，我卻對是否繼續留在商業媒體產生很大疑問。
            </p>

            <p>
              我最想做的事情是以媒體為基地進行深度調查報導，但商業媒體仍須以獲利為核心、以點閱率為依歸，我沒有把握能夠在商業媒體中落實理想及找到平衡點，也沒有把握領導商業媒體中所有同事朝著深度調查報導方向共同前進。當這項問號愈來愈大，我心中的另一項吶喊卻愈來愈清楚。
            </p>
            {/* 章節小標題 */}
            <Shared.ChallengeSectionHeading
              text="非營利媒體之路，需要更多支持以重建媒體公共性"
            />
            <p>
              台灣媒體環境近年快速崩壞，無論原因來自於媒體老闆的干預、政治力的操控、置入行銷的泛濫、點擊率為王的新聞操作、內容農場與假新聞當道，其結構性的問題都指向「媒體公共性淪喪」，而這也是全球媒體環境共同面臨的困境。想要重新找回媒體的公共性，一方面需要政府依法捐助經費的公廣集團建立公信力，另一方面也需要獨立自主的民間公共媒體努力走出一條新路。
            </p>
            <p>
              《報導者》就是在「找回媒體公共性」的媒體改革理念與脈絡中應運而生。我們想要進行一場媒體實驗，證明一個由公益基金會成立的非營利媒體，能夠靠著一篇篇深度報導與調查報導，以及各種與時俱進的創新數位敘事，在這個時代彰顯媒體應該具有的公共精神，並且只依靠台灣社會的捐款支持活下去。
            </p>
            {/* 圖片與說明 */}
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-1-1.webp"
              alt="2015年9月1日當天《報導者》成立記者會現場。"
              caption="2015年9月1日當天《報導者》成立記者會現場。"
              width={800}
              height={600}
            />
            <p>
              對我而言，這場大膽驚險的媒體實驗，也圓了年少時想要創辦獨立媒體的夢想。儘管這條路比我想像中還要辛苦百倍，但我和同事們已經奮鬥走過8年，無論未來的挑戰如何艱辛，我們依舊會盡最大努力來重建媒體的公共性，繼續為健全台灣媒體生態與深化台灣民主發展貢獻心力。
            </p>

            <div className="bg-gray-50 p-6 rounded-lg space-y-2 italic">
              <p className="text-center">Somewhere ages and ages hence:</p>
              <p className="text-center">在多年、多年以後的某地某個時刻，</p>
              <p className="text-center">Two roads diverged in a wood, and I—</p>
              <p className="text-center">敘說我曾行經樹林中兩路分岔，而我——</p>
              <p className="text-center">I took the one less traveled by,</p>
              <p className="text-center">我踏上了乏人問津的那條，</p>
              <p className="text-center">And that has made all the difference.</p>
              <p className="text-center">而這造就截然不同的人生。</p>
            </div>

            <p>
              美國著名詩人佛洛斯特（Robert Frost）在其名詩〈The Road Not Taken〉中述說的心情，正是過去10年我和《報導者》同事們的最佳寫照。黃樹林裡岔開兩條路，而我們選擇了較少人跡的一條，使得一切多麼地不同。
            </p>

            {/* 第二張圖片 */}
            <Shared.ChallengeImageWithCaption
              src="/assets/challenges/challenge-1-2.webp"
              alt="2016年「報導者走出去」系列講座，我們首度「開箱編輯室」與讀者面對面互動，圖為松菸閱樂書店場次。"
              caption="2016年「報導者走出去」系列講座，我們首度「開箱編輯室」與讀者面對面互動，圖為松菸閱樂書店場次。"
              width={800}
              height={600}
            />
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