'use client';

import Image from 'next/image';
import { Button, SpotlightCard } from '@/components/shared';

export default function EventPreview() {
    return (
        <section id="section-event" className="py-24 relative w-full min-h-screen text-white flex flex-col items-center justify-center">

            <h3 className="text-center mb-8">
                走進現場 <br />
                與報導者相會
            </h3>
            <div className="max-w-[80rem] mx-auto px-8 flex flex-col lg:flex-row  gap-8 items-start justify-center text-center">
                {/* 展覽卡片 */}
                <SpotlightCard
                    className="flex flex-col items-center justify-center bg-white text-black"
                    spotlightColor="rgba(239, 68, 68, 0.3)"
                >
                    <div className="relative w-full">
                        <Image
                            src="/assets/event_exhibition.jpg"
                            alt="報導者十週年特展"
                            width={400}
                            height={300}
                            className="object-cover"
                            loading="lazy"
                            quality={85}
                        />
                    </div>
                    <div className="p-4 pb-8">
                        <p className="mb-2 text-red-90">Exhibition</p>
                        <h5>報導者十週年特展</h5>
                        <p className=" mt-2">
                            2025.12.04(四)–07(日) 11:00-19:00 <br />
                            華山1914文化創意產業園區中4A館
                        </p>
                        <p className="leading-relaxed text-sm text-gray-700">
                            台北市中正區八德路一段1號
                        </p>
                        <p className="mt-4 text-sm text-black">
                            #免費參觀
                        </p>
                    </div>
                </SpotlightCard>

                {/* 晚會卡片 */}
                <SpotlightCard
                    href="https://twreporter.kktix.cc/events/whosreporter-taipei"
                    target="_blank"
                    className="flex flex-col items-center justify-center bg-white text-black"
                    spotlightColor="rgba(239, 68, 68, 0.3)"
                >
                    <div className="relative w-full">
                        <Image
                            src="/assets/event_party.jpg"
                            alt="報導者十週年晚會"
                            width={400}
                            height={300}
                            className="object-cover"
                            loading="lazy"
                            quality={85}
                        />
                    </div>
                    <div className="p-4 pb-8">
                        <p className="mb-2 text-red-90">Party</p>
                        <h5>報導者十週年晚會</h5>
                        <p className="leading-relaxed mt-2">
                            2025.12.06(六) 19:00-21:30 <br />
                            Legacy Taipei 音樂展演空間
                        </p>
                        <p className="leading-relaxed text-sm text-gray-700">
                            台北市中正區八德路一段1號
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                        >
                            9月24日 開放搶票
                        </Button>
                    </div>
                </SpotlightCard>
            </div>
        </section>
    );
}