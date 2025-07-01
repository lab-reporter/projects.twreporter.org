'use client';

import { ContentProps } from '../types';
import * as Shared from '../shared';

export default function Reports11Content({ projectData, onClose, onNavigate, adjacentProjects }: ContentProps) {
  if (!projectData) return null;

  return (
    <Shared.Container>
      <Shared.HeroBanner
        mediaSrc="/assets/reports-11.png"
        title="出口禁令下的紅線交易"
        subtitle="揭開MIT工具機流入俄羅斯軍工業隱蹤"
        date="2024.01"
      />

      <Shared.ContentWrapper>
        {/* 重點摘要 */}
        <Shared.ProjectSummary
          items={[
            {
              text: "影響力",
              children: [
                { text: "跨國追查 MIT 工具機違反禁令流入俄羅斯軍工業，引起《經濟學人》、《華盛頓郵報》等國外媒體跟進報導。" },
                { text: "經濟部將報導中披露的違規廠商列為黑名單，並進一步加強出口管制措施，針對高轉運風險國家的出口進行更嚴格審查。" }
              ]
            }
          ]}
        />

        {/* 導言 */}
        <Shared.TextContent>
          <div className="space-y-4">
            <p>
              2022年2月底俄羅斯入侵烏克蘭後，除了美國之外，德國、日本等工具機生產國也紛紛加強工具機出口俄羅斯的管制，以防機器進入俄羅斯軍工產業協助製造武器。當時未同步跟進的台灣，便成為俄羅斯高階工具機的主要來源。
            </p>
            <p>
              2023年1月，經濟部終於宣布擴大對俄羅斯與白俄羅斯的工具機出口管制，然而，此一政策的頌布也導致許多台灣中小企業頓時失去重要的市場，於是一條繞道出口俄羅斯的工具機路線隱然浮現。
            </p>
            <p>
              《報導者》與俄羅斯流亡記者聯手合作，在2024年1月揭露台灣高階工具機在全球地緣政治博弈中的關鍵角色。報導指出，這些透過第三國（例如：土耳其）轉運至俄羅斯的工具機，有部分機器已進入被美方列入黑名單的軍工業廠商。
            </p>
            <p>
              報導刊出後，立即引起社會及國際媒體的關注，《經濟學人》、《華盛頓郵報》也跟進。經濟部在2月2日回應，針對涉及俄羅斯武器製造商透過第三國輸入台灣工具機的狀況，經濟部已將報導中的俄商 I Machine 列入實體名單，禁止出口；同時，經濟部進一步加強出口管制措施，包含提高違規罰則至100萬元、要求業者申報最終使用人，以及針對高轉運風險國家的出口進行更嚴格審查。此外，經濟部也承諾，未來將針對工具機業者加強教育訓練，要求業者在出口前做好盡責調查。
            </p>
          </div>
        </Shared.TextContent>

        {/* 閱讀完整專題按鈕 */}
        <Shared.ExternalLink href="https://www.twreporter.org/a/machine-tools-taiwan-russia-sanctions-turkey">
          閱讀完整專題
        </Shared.ExternalLink>

        {/* 製作團隊Credits */}
        <Shared.CreditsMarquee>
          <Shared.CreditsItem role="監製" names="方德琳" />
          <Shared.CreditsItem role="文字" names={["李易安", "Andrey Zayakin"]} />
          <Shared.CreditsItem role="攝影" names="陳曉威" />
          <Shared.CreditsItem role="封面設計" names="吳政達" />
          <Shared.CreditsItem role="設計" names="江世民" />
          <Shared.CreditsItem role="編輯" names="張詩芸" />
          <Shared.CreditsItem role="社群企劃" names={["陳思樺", "何昱泳", "莊孟翰"]} />
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