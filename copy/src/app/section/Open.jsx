'use client'

import React from 'react'
import TransitionToReports from '../components/TransitionToReports'

const BOX_POOL = 200        // 提高為 200 格讓分布更隨機
const BOX_COUNT = 100
const APPEAR_DURATION = 0.1 // 淡入秒數
const VISIBLE_DURATION = 24 // 全顯秒數
const DISAPPEAR_DURATION = 0.1 // 淡出秒數
const INITIAL_COUNT = 50
const INTERVAL_MS = 100

export default function Open() {
    const [isClient, setIsClient] = React.useState(false);

    // 確保只在客戶端執行
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    // 產生均勻散佈的隨機座標池，強制長度為 BOX_POOL - 只在客戶端執行
    const [boxPool, setBoxPool] = React.useState([]);

    React.useEffect(() => {
        if (!isClient) return;

        const arr = []
        const gridSize = Math.ceil(Math.sqrt(BOX_POOL))
        let idx = 0
        // 均勻分布生成
        for (let i = 0; i < gridSize && idx < BOX_POOL; i++) {
            for (let j = 0; j < gridSize && idx < BOX_POOL; j++) {
                const x = (i + Math.random()) * (100 / gridSize)
                const y = (j + Math.random()) * (100 / gridSize)
                arr.push({ id: idx, x, y })
                idx++
            }
        }
        // 如格子填不滿 BOX_POOL, 再補齊到指定長度
        while (arr.length < BOX_POOL) {
            arr.push({
                id: arr.length,
                x: Math.random() * 100,
                y: Math.random() * 100,
            })
        }
        // 打亂
        for (let i = arr.length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1))
                ;[arr[i], arr[r]] = [arr[r], arr[i]]
        }
        setBoxPool(arr);
    }, [isClient]);

    // 初始化時就有50顆，防呆 boxPool 取值 - 只在客戶端執行
    const [queue, setQueue] = React.useState([]);

    React.useEffect(() => {
        if (!isClient || boxPool.length === 0) return;

        const now = performance.now() / 1000
        let q = []
        for (let i = 0; i < INITIAL_COUNT; i++) {
            let box = boxPool[i % boxPool.length]
            if (!box) {
                box = {
                    id: 10000 + i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                }
            }
            q.push({
                ...box,
                key: `${box.id}-init-${i}`,
                startTime: now - (INITIAL_COUNT - i - 1) * (INTERVAL_MS / 1000),
            })
        }
        // 避免 queue 成員為 undefined
        setQueue(q.filter(b => b && b.id !== undefined && b.x !== undefined && b.y !== undefined));
    }, [isClient, boxPool]);

    const poolIndex = React.useRef(INITIAL_COUNT)
    const [now, setNow] = React.useState(0);

    // 每 0.1 秒 push 一個新方塊進 queue，優化效能/防呆/移除多餘補齊 - 只在客戶端執行
    React.useEffect(() => {
        if (!isClient || boxPool.length === 0) return;

        const interval = setInterval(() => {
            setQueue(prev => {
                let next = prev.slice()
                const poolLen = boxPool.length
                // 徹底防呆 boxPool index 取值
                let box = boxPool[poolIndex.current % poolLen]
                if (!box) {
                    box = {
                        id: 100000 + poolIndex.current,
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                    }
                }
                poolIndex.current++
                if (next.length < BOX_COUNT) {
                    // 100顆以下只 push，不 shift
                    next.push({
                        ...box,
                        key: `${box.id}-${Date.now()}`,
                        startTime: performance.now() / 1000,
                    })
                } else {
                    // 超過100顆才 shift
                    next = next.slice(1)
                    next.push({
                        ...box,
                        key: `${box.id}-${Date.now()}`,
                        startTime: performance.now() / 1000,
                    })
                }
                // 避免 queue 成員中有任何 undefined
                return next.filter(b => b && b.id !== undefined && b.x !== undefined && b.y !== undefined)
            })
        }, INTERVAL_MS)
        return () => clearInterval(interval)
    }, [isClient, boxPool])

    // 用 requestAnimationFrame 更新全域時間 - 只在客戶端執行
    React.useEffect(() => {
        if (!isClient) return;

        let raf
        const update = () => {
            setNow(performance.now() / 1000)
            raf = requestAnimationFrame(update)
        }
        raf = requestAnimationFrame(update)
        return () => cancelAnimationFrame(raf)
    }, [isClient])

    // 如果不是客戶端，返回空的佔位符
    if (!isClient) {
        return (
            <div className='open-section w-full h-full relative bg-black'>
                {/* 新聞太多、黑色方塊 - SSR 佔位符 */}
                <div className='w-full h-[200vh] relative'>
                    <div className='w-full h-screen sticky top-0 flex items-center justify-center'>
                        <h1 className='relative z-100 text-white text-center text-[32px] leading-[1.5] font-bold mx-auto py-10 max-w-[640px]'>
                            在台灣 每分每秒都有無數則新聞誕生<br />
                            即使如此<br />
                            還是有太多重要的議題淹沒在眾聲喧嘩中
                        </h1>
                    </div>
                </div>

                {/* 報導者成立 */}
                <div className='w-full h-[200vh] relative'>
                    <div className='w-full h-screen sticky top-0 flex flex-col items-center justify-center'>
                        <h1 className='relative text-white text-center text-[32px] leading-[1.5] font-bold mx-auto py-10 max-w-[640px]'>
                            2015.09<br />
                            在艱困的媒體環境<br />
                            報導者以非營利組織的模式<br />
                            投入公共領域的調查與深度報導<br />
                            試圖推動一場媒體小革命
                        </h1>
                        <div className='w-[600px] h-[400px] overflow-hidden'>
                            <img className='w-full h-full object-cover' src="/assets/img2.png" alt="" />
                        </div>
                    </div>
                </div>

                {/* 轉場到 Reports */}
                <TransitionToReports />
            </div>
        );
    }

    return (
        <div className='open-section w-full h-full relative z-50'>
            {/* 新聞太多、黑色方塊 */}
            <div className='w-full h-[200vh] relative bg-black'>
                <div className='w-full h-screen sticky top-0 flex items-center justify-center'>
                    {queue.map(box => {
                        if (!box) return null
                        const t = now - box.startTime
                        let opacity = 0
                        if (t < 0) opacity = 0
                        else if (t < APPEAR_DURATION) {
                            opacity = t / APPEAR_DURATION
                        } else if (t < APPEAR_DURATION + VISIBLE_DURATION) {
                            opacity = 1
                        } else if (t < APPEAR_DURATION + VISIBLE_DURATION + DISAPPEAR_DURATION) {
                            opacity = 1 - (t - APPEAR_DURATION - VISIBLE_DURATION) / DISAPPEAR_DURATION
                        } else {
                            opacity = 0
                        }
                        const style = {
                            left: `${box.x}%`,
                            top: `${box.y}%`,
                            opacity,
                            transition: 'opacity 0.1s linear',
                            pointerEvents: 'none',
                        }
                        return (
                            <div key={box.key} className='absolute' style={style}>
                                <div className='w-[25vw] h-auto aspect-video bg-[#151515] bg-opacity-50 backdrop-blur-sm border border-1 border-gray-900'></div>
                            </div>
                        )
                    })}
                    <h1 className='relative z-100 text-white text-center text-[32px] leading-[1.5] font-bold mx-auto py-10 max-w-[640px]'>
                        在台灣 每分每秒都有無數則新聞誕生<br />
                        即使如此<br />
                        還是有太多重要的議題淹沒在眾聲喧嘩中
                    </h1>
                </div>
            </div>

            {/* 報導者成立 */}
            <div className='w-full h-[200vh] relative bg-black'>
                <div className='w-full h-screen sticky top-0 flex flex-col items-center justify-center'>
                    <h1 className='relative text-white text-center text-[32px] leading-[1.5] font-bold mx-auto py-10 max-w-[640px]'>
                        2015.09<br />
                        在艱困的媒體環境<br />
                        報導者以非營利組織的模式<br />
                        投入公共領域的調查與深度報導<br />
                        試圖推動一場媒體小革命
                    </h1>
                    {/* <div className='w-[600px] h-[400px] overflow-hidden'>
                        <img className='w-full h-full object-cover' src="/assets/img2.png" alt="" />
                    </div> */}
                </div>
            </div>

            {/* 轉場到 Reports */}
            <TransitionToReports />
        </div>
    )
}
