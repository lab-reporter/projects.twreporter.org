'use client'

import Image from "next/image";

export default function KeyVisual() {
    return (
        <div className="bg-black w-full h-screen flex flex-row justify-center items-center relative ">
            {/* 寶石 */}
            <div className="w-full h-[75%] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <video
                    src="/assets/KV/motion4K.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-contain w-full h-full"
                />
            </div>
            {/* Logo */}
            <div className="w-[30%] h-24 absolute bottom-16 left-16 z-10">
                <Image
                    src="/assets/KV/KV-Logotype.svg"
                    alt="報導者 Logo"
                    fill
                    sizes="30vw"
                    priority
                    className="object-contain object-left"
                />
            </div>
            {/* 標語 */}
            <div className="w-[30%] h-24 absolute bottom-16 right-16 z-10">
                <Image
                    src="/assets/KV/KV-Slogan.svg"
                    alt="報導者標語"
                    fill
                    sizes="30vw"
                    priority
                    className="object-contain object-right"
                />
            </div>
        </div>
    )
}
