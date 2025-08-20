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
    { text: "原本我並不是這麼關心社會議題的人，但之前因緣際會之下看到了你們的報導，接著就一直都有在關注你們，很高興台灣有一個這麼棒的媒體，讓我在國外還能夠持續接受到這些繁體中文的資訊，尤其是針對台灣的各項議題，能夠有人這麼有條理並傾注心血為他們持續發聲，讓我也能夠跳出同溫層了解不同的台灣。謝謝你們一直以來讓台灣成為更好的台灣。" },
    { text: "我是一位高中生，希望我的一點點捐款可以幫助到你們。我認識你們是因為我的公民老師，她希望我們多看獨立媒體的報導，但她因為身體原因要離開我們學校了，我希望這份定期捐款可以讓我和老師的緣分維繫下去，並為台灣的媒體轉型盡一份力，謝謝你們。" },
    { text: "有點慚愧，默默收聽你們的Podcast好幾年，今天才終於成為小額捐款的一份子，金額尚不大，希望能幫上忙。你們做的事情很棒，希望棉薄之力可以支持你們繼續堅持下去，有些議題難免敏感，請你們每個夥伴為大家產出有意義且具有獨立性的報導同時，也務必以個人安全為最優先，辛苦你們了！" },
    { text: "由於本人是從事基層且相對邊緣的工作，能明顯感受工作權益被剝奪且不一定受到公眾重視的無力感，每當聽到你們為這社會上的弱勢發聲就讓我有所感動。很感謝有你們持續為這社會上的弱勢發聲及揭露世界上的不公讓其有被看見且獲得改善的機會。" },
    { text: "曾經也想過作無聲的閱聽人，儘可能利用各處資源即可。但隨著長時間的習慣閱讀，一個個緊扣時事又多面向的專題與很期待能與孩子分享的「少年報導者」出刊，希望能盡微薄之力，讓這樣的想望繼續延續。" },
    { text: "工程師每週加班數十小時寫出的程式碼一年後會變成手機，但是三年後八九成就壞了，五年後根本就不重要了。但是報導者的文字，讓人感受到一顆勇敢的集體心臟，在收縮與舒張的循環中，記者如血液般滲入社會的縫隙，又回到心臟之中，延續這一份時代缺乏的勇氣。" },
    { text: "台灣的媒體大多為資本及特定政治立場服務，所幸仍有一群人守著良心，貴報就是其中之一，請繼續報導優質新聞，有貴報存在，讓我相信台灣的新聞界還是有希望的。" },
    { text: "这么深度的报道居然是免费的，能看出非营利独立媒体的不易。很羡慕台湾社会有独立媒体和自由民主的社会环境。" },
    { text: "我是名心理師，我關心我們的媒體識讀，我關心我們的家園，每次讀著你們的報導，心中都有滿滿的感動。雖然我能提供的不多，但這是我第一次贊助媒體，希望我未來能持續支持你們。" },
    { text: "報導者在我讀國中的時候成立，從高中開始，我很常閱讀報導者的新聞、文章或影片，敘述方式不煽情，書寫脈絡很清晰，選題多元我覺得是現今多數媒體沒有的特質，能夠在報導者看到不同議題的探討，我覺得很滿足。現在出社會開始工作，我希望可以為優質媒體付出一份心力，希望報導者可以長長久久！" }
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
        animation: 'rotateGradient 5s linear infinite',
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
