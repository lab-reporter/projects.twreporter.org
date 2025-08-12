'use client'

import Image from 'next/image'

export default function HeroSection() {

    return (
        <>
            <style jsx>{`
                @keyframes wavePulse {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.125);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1.25);
                        opacity: 0;
                    }
                }
                
                .wave-animation {
                    animation: wavePulse 1s linear infinite;
                }
            `}</style>

            <div className="bg-black w-full h-screen flex flex-row justify-center items-center relative ">
                {/* 寶石 */}
                <div className="w-[50%] h-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <video
                        src="/assets/KV/motion4K.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-contain w-full h-full"
                    />
                </div>
                {/* Waves小 */}
                <div className="w-[30%] h-full absolute z-10 top-[55%] left-1/2 wave-animation">
                    <Image
                        src="/assets/KV/KV-Waves.webp"
                        alt="KV聲波"
                        fill
                        sizes="100vw"
                        priority
                        className="w-full h-full object-contain"
                    />
                </div>
                {/* Waves中 */}
                <div className="w-[40%] h-full absolute z-10 top-[60%] left-1/2 wave-animation">
                    <Image
                        src="/assets/KV/KV-Waves.webp"
                        alt="KV聲波"
                        fill
                        sizes="100vw"
                        priority
                        className="w-full h-full object-contain"
                    />
                </div>
                {/* Waves大 */}
                <div className="w-[50%] h-full absolute z-10 top-[65%] left-1/2 wave-animation">
                    <Image
                        src="/assets/KV/KV-Waves.webp"
                        alt="KV聲波"
                        fill
                        sizes="100vw"
                        priority
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </>
    );
}