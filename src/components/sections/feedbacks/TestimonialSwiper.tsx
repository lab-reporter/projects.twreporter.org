import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

// 測試用證言資料
const testimonialData = [
    { text: "工程師每週加班數十小時寫出的程式碼一年後會變成手機，但是三年後八九成就壞了，五年後根本就不重要了。但是報導者的文字，讓人感受到一顆勇敢的集體心臟，在收縮與舒張的循環中，記者如血液般滲入社會的縫隙，又回到心臟之中，延續這一份時代缺乏的勇氣。" },
    { text: "自從開始定期閱讀報導者的文章後，雖然對台灣的現況依然悲觀，卻讓我得以從一個相對客觀、理性的角度去看待問題，憤慨的情緒減少後，終於能冷靜地釐清事件的本質，擁有繼續關心台灣的動力。" },
    { text: "原本我並不是這麼關心社會議題的人，但之前因緣際會之下看到了你們的報導，接著就一直都有在關注你們，很高興台灣有一個這麼棒的媒體，讓我在國外還能夠持續接受到這些繁體中文的資訊。" },
    { text: "由於本人是從事基層且相對邊緣的工作，能明顯感受工作權益被剝奪且不一定受到公眾重視的無力感，每當聽到你們為這社會上的弱勢發聲就讓我有所感動。" },
    { text: "近期參加的報導者事件簿新書分享會，在現場感受編輯群在報導調查遇上困難的感慨，還有散發對報導的熱情，讓我深深體會，你們背負著非常重大的使命，無論什麼都無法阻擋你們。" },
    { text: "希望你們可以繼續製作優質報導，看著許多優質報導停刊真的非常難過，期待你們可以製作下去！" },
    { text: "曾經也想過作無聲的閱聽人，儘可能利用各處資源即可。但隨著長時間的習慣閱讀，一個個緊扣時事又多面向的專題與很期待能與孩子分享的「少年報導者」出刊，希望能盡微薄之力。" },
    { text: "謝謝報導者在中國散布操弄大量不實資訊和假聲量的時代，守候台灣的正確資訊。" },
    { text: "看完錫蘭針對台灣媒體有多糟，長達一個多小時的影片之後，我覺得應該付出實際行動支持並持續關注優質媒體。" },
    { text: "台灣的媒體大多為資本及特定政治立場服務，所幸仍有一群人守著良心，貴報就是其中之一，請繼續報導優質新聞，有貴報存在，讓我相信台灣的新聞界還是有希望的。" }
];

interface TestimonialSwiperProps {
    testimonials?: Array<{ text: string }>;
}

export default function TestimonialSwiper({ testimonials }: TestimonialSwiperProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    // 使用傳入的資料或預設資料
    const testimonialsToUse = testimonials || testimonialData;

    // 漸層樣式定義 - 從 CallToActionSection 的 Box 組件複製
    const gradientStyle = {
        '--gradient-angle': '180deg',
        backgroundImage: `conic-gradient(
            from var(--gradient-angle) at 50% 50%,
            #C3968E 0%,
            #EE666F 25%,
            #98457C 50%,
            #677DA5 75%,
            #CCB5F9 99%,
            #C3968E 100%
        )`,
        animation: 'rotateGradient 36s linear infinite',
    } as React.CSSProperties;

    return (
        <>
            {/* CSS 動畫定義 */}
            <style>
                {`
                @property --gradient-angle {
                    syntax: "<angle>";
                    inherits: true;
                    initial-value: 180deg;
                }
                
                @keyframes rotateGradient {
                    to { --gradient-angle: 540deg; }
                }
                
                .mySwiper {
                    width: 100%;
                    padding: 20px 0;
                }
                
                .mySwiper .swiper-slide {
                    width: 20rem !important;
                    flex-shrink: 0;
                }
                `}
            </style>

            <Swiper
                slidesPerView="auto"
                centeredSlides={true}
                spaceBetween={30}
                grabCursor={true}
                loop={true}
                modules={[Pagination]}
                className="mySwiper w-full"
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {testimonialsToUse.map((testimonial, index) => {
                    // 計算是否為中央卡片（考慮 loop 模式）
                    const isCenterCard = index === activeIndex;

                    return (
                        <>
                            <SwiperSlide key={index}>
                                <div
                                    className="w-[20rem] h-[25rem] border border-gray-500 flex-shrink-0"
                                    style={{
                                        background: isCenterCard ? gradientStyle.backgroundImage : 'black',
                                        animation: isCenterCard ? gradientStyle.animation : 'none',
                                        padding: isCenterCard ? '2px' : '0',
                                        transform: isCenterCard ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    <div
                                        className="w-full h-full p-8 text-white flex items-center justify-center text-sm leading-relaxed"
                                        style={{
                                            backgroundColor: 'black',
                                        }}
                                    >
                                        {testimonial.text}
                                    </div>
                                </div>
                            </SwiperSlide>
                        </>
                    );
                })}
            </Swiper>
        </>
    );
}
