'use client';

export default function FontDemo() {
    return (
        <div className="p-8 space-y-8 bg-white">
            <h1 className="text-3xl font-bold mb-8">字型展示 Font Demo - Mixed Typography</h1>

            {/* 全域設定測試 */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-red-50">全域設定 Global Settings</h2>
                <div className="space-y-3">
                    <p className="text-lg">預設 Body 字型：The Reporter《報導者》十週年｜Deep Reporting深度求真 Diverse Voices眾聲同行</p>
                    <h3 className="text-xl">H3 標題字型：The Reporter《報導者》10th Anniversary 十週年特別企劃</h3>
                    <h4 className="text-lg">H4 標題字型：Breaking News 突發新聞 | Investigation 調查報導</h4>
                </div>
            </div>

            {/* Tailwind 混排 utilities */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-green-50">Tailwind 混排 Utilities</h2>
                <div className="space-y-3">
                    <p className="text-lg font-body-mixed">font-body-mixed: The Reporter《報導者》十週年｜Deep Reporting深度求真</p>
                    <p className="text-lg font-heading-mixed">font-heading-mixed: The Reporter《報導者》十週年｜Deep Reporting深度求真</p>
                    <p className="text-lg font-sans-mixed">font-sans-mixed: The Reporter《報導者》十週年｜Deep Reporting深度求真</p>
                    <p className="text-lg font-serif-mixed">font-serif-mixed: The Reporter《報導者》十週年｜Deep Reporting深度求真</p>
                </div>
            </div>

            {/* 純英文字型 */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-50">純英文字型 English Only</h2>
                <div className="space-y-3">
                    <p className="text-lg font-roboto-slab">Roboto Slab: The Reporter 10th Anniversary - Deep Reporting, Diverse Voices</p>
                    <p className="text-lg font-alverata">Alverata: The Reporter 10th Anniversary - Deep Reporting, Diverse Voices</p>
                </div>
            </div>

            {/* 純中文字型 */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gold-50">純中文字型 Chinese Only</h2>
                <div className="space-y-3">
                    <p className="text-lg font-noto-serif-tc">思源宋體：《報導者》十週年｜深度求真 眾聲同行</p>
                    <p className="text-lg font-noto-sans-tc">思源黑體：《報導者》十週年｜深度求真 眾聲同行</p>
                </div>
            </div>

            {/* 實際使用範例 */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-700">實際使用範例 Real World Example</h2>
                <article className="space-y-4 max-w-3xl">
                    <h1 className="text-3xl font-bold">Breaking: Taiwan's Democracy 台灣民主的重要時刻</h1>
                    <h2 className="text-2xl font-semibold">Investigation Report 調查報導：Truth Behind the Headlines 頭條背後的真相</h2>
                    <p className="text-base leading-relaxed">
                        The Reporter《報導者》has been committed to investigative journalism 調查新聞 for a decade 十年來.
                        Our mission 我們的使命 is to provide in-depth analysis 深度分析 and diverse perspectives 多元觀點
                        on critical issues 重要議題 affecting Taiwan 影響台灣 and the region 地區.
                    </p>
                    <p className="text-base leading-relaxed">
                        Through rigorous fact-checking 嚴格查證 and comprehensive reporting 全面報導,
                        we strive to bridge the gap 努力縮小差距 between complex realities 複雜現實
                        and public understanding 公眾理解.
                    </p>
                </article>
            </div>
        </div>
    );
} 