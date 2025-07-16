'use client';

export default function EventSection() {
    return (
        <section className="w-full min-h-screen text-white flex flex-col items-center justify-center">

            <h3 className="text-center mb-16">
                走進現場 <br />
                與報導者相會
            </h3>

            <div className="max-w-[60rem] mx-auto px-8 flex gap-8 items-center justify-center text-center">
                <div>
                    <img src="/assets/event_exhibition.jpg" alt="報導者十週年特展" />
                    <div className="mt-4">
                        <p>Exhibition</p>
                        <h4>報導者十週年特展</h4>
                        <h6>
                            2025.12.04(THU.)–07(SUN.) <br />
                            11:00 - 19:00 <br />
                            華山1914文創園區 中4A館
                        </h6>
                        <button>
                            免費參觀
                        </button>
                    </div>
                </div>
                <div>
                    <img src="/assets/event_party.jpg" alt="報導者十週年特展" />
                    <div className="mt-4">
                        <p>Party</p>
                        <h4>報導者十週年晚會</h4>
                        <h6>
                            2025.12.06(SAT) <br />
                            19:00 - 21:30    <br />
                            華山1914文創園區 中4A館
                        </h6>
                        <button>
                            免費參觀
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}