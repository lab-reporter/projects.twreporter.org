'use client';

import Image from 'next/image';

export default function EventPreview() {
    return (
        <section id="section-event" className="relative w-full min-h-screen text-white flex flex-col items-center justify-center">

            <h3 className="text-center mb-8">
                走進現場 <br />
                與報導者相會
            </h3>

            <div className="max-w-[80rem] mx-auto px-8 flex gap-8 items-center justify-center text-center">
                <div className="flex flex-col items-center justify-center bg-white text-black">
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
                    <div className="p-4">
                        <p className="mb-2 text-red-90">Exhibition</p>
                        <h5>報導者十週年特展</h5>
                        <p className="leading-relaxed mt-2">
                            2025.12.04(四)–07(日) 11:00-19:00 <br />
                            華山1914文化創意產業園區中4A館
                        </p>
                        <button
                            className="mt-4 bg-gray-100 text-sm px-4 py-2 text-black cursor-pointer hover:bg-red-50 hover:text-white transition-all duration-300">
                            免費參觀
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white text-black">
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
                    <div className="p-4">
                        <p className="mb-2 text-red-90">Party</p>
                        <h5>報導者十週年晚會</h5>
                        <p className="leading-relaxed mt-2">
                            2025.12.06(六) 19:00-21:30 <br />
                            Legacy Taipei 音樂展演空間
                        </p>
                        <button
                            className="mt-4 bg-gray-100 text-sm px-4 py-2 text-black cursor-pointer hover:bg-red-50 hover:text-white transition-all duration-300">
                            10月X日 開放搶票
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}