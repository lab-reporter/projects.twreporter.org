'use client';

import Image from 'next/image';

export default function EventSection() {
    return (
        <section id="section-event" className="w-full min-h-screen text-white flex flex-col items-center justify-center">

            <h3 className="text-center mb-8">
                走進現場 <br />
                與報導者相會
            </h3>

            <div className="max-w-[60rem] mx-auto px-8 flex gap-8 items-center justify-center text-center">
                <div>
                    <div className="relative w-full aspect-[4/3]">
                        <Image
                            src="/assets/event_exhibition.jpg"
                            alt="報導者十週年特展"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover rounded-lg"
                            quality={85}
                        />
                    </div>
                    <div className="mt-4">
                        <p className="mb-2 text-red-70">Exhibition</p>
                        <h4>報導者十週年特展</h4>
                        <p className="text-lg leading-relaxed mt-2">
                            2025.12.04(THU.)–07(SUN.) <br />
                            11:00-19:00 <br />
                            華山1914文化創意產業園區中4A館
                        </p>
                        <button className="px-2 py-2 bg-gray-700 mt-4 leading-non ">
                            免費參觀
                        </button>
                    </div>
                </div>
                <div>
                    <div className="relative w-full aspect-[4/3]">
                        <Image
                            src="/assets/event_party.jpg"
                            alt="報導者十週年晚會"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover rounded-lg"
                            quality={85}
                        />
                    </div>
                    <div className="mt-4">
                        <p className="mb-2 text-red-70">Party</p>
                        <h4>報導者十週年晚會</h4>
                        <p className="text-lg leading-relaxed mt-2">
                            2025.12.06(SAT) <br />
                            19:00-21:30    <br />
                            Legacy Taipei 音樂展演空間
                        </p>
                        <button
                            className="px-2 py-2 bg-gray-900 text-gray-600 mt-4 cursor-not-allowed leading-non ">
                            10月X日 開放搶票
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}