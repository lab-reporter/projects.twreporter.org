"use client";

import React from 'react';
// 從 index.js 中引入所有需要的組件
import * as Shared from './shared';

const DefaultContent = ({ projectData, onClose }) => {
    if (!projectData) return null;

    return (
        <Shared.Container>
            <Shared.ReportBanner
                imgSrc="/assets/report-1綁債．黑工．留學陷阱.jpg"
                title="綁債．黑工．留學陷阱"
                subtitle="失控的高教技職國際招生"
            />

            <Shared.Content>
                {/* 重點摘要 */}
                <Shared.ReportSummary
                    items={[
                        "揭露中州科大違法招募16位烏干達外籍生來台淪為學工，促使教育部勒令該校停止招生，該校正式走入歷史；檢調起訴學校高層、人力仲介以及公務員。",
                        "2024年，彰化地方法院一審重判中州科大時任副校長、苗栗縣政府勞青處前副處長。",
                        {
                            text: "報導獲獎紀錄",
                            children: [
                                "2023 亞洲出版協會卓越新聞獎（SOPA）【卓越人權報導獎—首獎】",
                                "2023 亞洲出版協會卓越新聞獎（SOPA）【卓越調查報導獎—優勝】",
                                "2023 人權新聞獎【華文調查報導 首獎】",
                                "2023 SND最佳新聞設計創意競賽【插圖類—優選】",
                                "2022 曾虛白新聞獎【公共服務報導獎 文字類】"
                            ]
                        }
                    ]}

                />

                <Shared.StackCards />

                {/* 導言 */}
                <Shared.Description>
                    <div className="text-white space-y-4">
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
                </Shared.Description>
            </Shared.Content>

            {/* 製作團隊Credits */}
            <Shared.ReportCredits>
                <Shared.ReportCreditsItem role="監製" names="李雪莉" />
                <Shared.ReportCreditsItem role="文字" names={["楊智強", "何柏均", "嚴文廷", "李雪莉"]} />
                <Shared.ReportCreditsItem role="攝影" names="楊子磊" />
                <Shared.ReportCreditsItem role="漫畫" names="柳廣成" />
                <Shared.ReportCreditsItem role="設計" names="黃禹禎" />
                <Shared.ReportCreditsItem role="專案管理" names="洪琴宣" />
                <Shared.ReportCreditsItem role="編輯" names={["張詩芸", "陳思樺"]} />
            </Shared.ReportCredits>
        </Shared.Container>
    );
};

export default DefaultContent; 