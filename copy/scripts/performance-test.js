#!/usr/bin/env node

/**
 * 自動化網站性能測試腳本
 * 使用 Lighthouse 和 Web Vitals 進行測試
 */

const { execSync } = require('child_process');
const fs = require('fs');

// 你的 Vercel 網站 URL
const SITE_URL = process.argv[2] || 'https://your-site.vercel.app';

console.log('🚀 開始性能測試...');
console.log(`📍 測試網址: ${SITE_URL}`);

// 測試項目
const tests = [
    {
        name: '桌面版 Lighthouse',
        command: `npx lighthouse ${SITE_URL} --preset=desktop --output=json --output-path=./lighthouse-desktop.json --quiet`
    },
    {
        name: '手機版 Lighthouse',
        command: `npx lighthouse ${SITE_URL} --preset=mobile --output=json --output-path=./lighthouse-mobile.json --quiet`
    }
];

// 執行測試
tests.forEach((test, index) => {
    console.log(`\n${index + 1}. 執行 ${test.name}...`);

    try {
        execSync(test.command, { stdio: 'inherit' });
        console.log(`✅ ${test.name} 完成`);
    } catch (error) {
        console.log(`❌ ${test.name} 失敗:`, error.message);
    }
});

// 分析結果
console.log('\n📊 分析結果...');

try {
    // 讀取桌面版結果
    if (fs.existsSync('./lighthouse-desktop.json')) {
        const desktopData = JSON.parse(fs.readFileSync('./lighthouse-desktop.json', 'utf8'));
        const desktopScores = desktopData.lhr.categories;

        console.log('\n🖥️  桌面版分數:');
        console.log(`   性能: ${Math.round(desktopScores.performance.score * 100)}/100`);
        console.log(`   可訪問性: ${Math.round(desktopScores.accessibility.score * 100)}/100`);
        console.log(`   最佳實踐: ${Math.round(desktopScores['best-practices'].score * 100)}/100`);
        console.log(`   SEO: ${Math.round(desktopScores.seo.score * 100)}/100`);

        // 關鍵指標
        const metrics = desktopData.lhr.audits;
        console.log('\n📈 關鍵指標 (桌面版):');
        console.log(`   首次內容繪製 (FCP): ${metrics['first-contentful-paint'].displayValue}`);
        console.log(`   最大內容繪製 (LCP): ${metrics['largest-contentful-paint'].displayValue}`);
        console.log(`   累積版面配置偏移 (CLS): ${metrics['cumulative-layout-shift'].displayValue}`);
        console.log(`   首次輸入延遲 (FID): ${metrics['max-potential-fid'].displayValue}`);
    }

    // 讀取手機版結果
    if (fs.existsSync('./lighthouse-mobile.json')) {
        const mobileData = JSON.parse(fs.readFileSync('./lighthouse-mobile.json', 'utf8'));
        const mobileScores = mobileData.lhr.categories;

        console.log('\n📱 手機版分數:');
        console.log(`   性能: ${Math.round(mobileScores.performance.score * 100)}/100`);
        console.log(`   可訪問性: ${Math.round(mobileScores.accessibility.score * 100)}/100`);
        console.log(`   最佳實踐: ${Math.round(mobileScores['best-practices'].score * 100)}/100`);
        console.log(`   SEO: ${Math.round(mobileScores.seo.score * 100)}/100`);
    }

} catch (error) {
    console.log('❌ 分析結果時發生錯誤:', error.message);
}

console.log('\n🎉 性能測試完成！');
console.log('\n💡 建議使用的線上工具:');
console.log('   • Google PageSpeed Insights: https://pagespeed.web.dev/');
console.log('   • GTmetrix: https://gtmetrix.com/');
console.log('   • WebPageTest: https://www.webpagetest.org/');
console.log('   • Pingdom: https://tools.pingdom.com/'); 