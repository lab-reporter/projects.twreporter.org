#!/usr/bin/env node

/**
 * 快速網站性能測試腳本
 * 使用 curl 測試基本載入時間和回應
 */

const { execSync } = require('child_process');

// 你的 Vercel 網站 URL
const SITE_URL = process.argv[2] || 'https://reporter-10th-recap.vercel.app/';

console.log('🚀 快速性能測試開始...');
console.log(`📍 測試網址: ${SITE_URL}`);

// 測試項目
const tests = [
    {
        name: '基本連線測試',
        command: `curl -s -o /dev/null -w "HTTP狀態: %{http_code}\\n載入時間: %{time_total}s\\n檔案大小: %{size_download} bytes\\n傳輸速度: %{speed_download} bytes/s\\n" "${SITE_URL}"`
    },
    {
        name: '多次載入測試 (5次)',
        command: `for i in {1..5}; do echo "第 $i 次:"; curl -s -o /dev/null -w "%{time_total}s\\n" "${SITE_URL}"; done`
    },
    {
        name: 'DNS 解析測試',
        command: `curl -s -o /dev/null -w "DNS解析: %{time_namelookup}s\\n連線建立: %{time_connect}s\\n開始傳輸: %{time_starttransfer}s\\n總時間: %{time_total}s\\n" "${SITE_URL}"`
    }
];

// 執行測試
tests.forEach((test, index) => {
    console.log(`\n${index + 1}. ${test.name}:`);
    console.log('─'.repeat(40));

    try {
        const result = execSync(test.command, { encoding: 'utf8' });
        console.log(result);
    } catch (error) {
        console.log(`❌ 測試失敗: ${error.message}`);
    }
});

// 提供線上工具連結
console.log('\n🌐 建議使用的線上測試工具:');
console.log('─'.repeat(50));
console.log(`📊 Google PageSpeed Insights:`);
console.log(`   https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`);
console.log(`\n📈 GTmetrix:`);
console.log(`   https://gtmetrix.com/?url=${encodeURIComponent(SITE_URL)}`);
console.log(`\n🔍 WebPageTest:`);
console.log(`   https://www.webpagetest.org/?url=${encodeURIComponent(SITE_URL)}`);
console.log(`\n⚡ Pingdom:`);
console.log(`   https://tools.pingdom.com/?url=${encodeURIComponent(SITE_URL)}`);

console.log('\n✨ 測試完成！');
console.log('💡 提示：線上工具會提供更詳細的分析報告'); 