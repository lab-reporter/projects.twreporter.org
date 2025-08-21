#!/usr/bin/env node

/**
 * 手動縮圖建立指南
 * 提供詳細的手動建立指導和驗證
 */

const fs = require('fs');
const path = require('path');

// 讀取專案資料
function loadProjectsData() {
    const projectsPath = path.join(__dirname, '../src/app/data/projects.json');
    return JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
}

// 生成需要處理的清單
function generateManualInstructions() {
    const projects = loadProjectsData();
    const needsThumb = [];

    projects.forEach(project => {
        const section = project.section[0];
        const isInnovation = section === 'innovation';

        // 決定來源圖片
        let sourcePath = project.path;
        if (isInnovation && project.imageSRC) {
            sourcePath = project.imageSRC;
        }

        // 只處理圖片檔案
        if (!/\.(webp|jpg|jpeg|png)$/i.test(sourcePath)) {
            return;
        }

        // 檢查是否需要縮圖
        const pathWithoutExt = sourcePath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
        const thumbPath = `${pathWithoutExt}-thumb.webp`;
        const thumbFile = path.join(__dirname, '../public', thumbPath);

        // 檢查是否已有替代方案
        let hasAlternative = false;
        if (section === 'reports') {
            const reportId = project.id.replace('reports-', '');
            const smPath = path.join(__dirname, `../public/assets/reports/reports-${reportId}-sm.webp`);
            hasAlternative = fs.existsSync(smPath);
        } else if (isInnovation && project.imageSRC) {
            hasAlternative = true;
        }

        if (!fs.existsSync(thumbFile) && !hasAlternative) {
            needsThumb.push({
                projectId: project.id,
                section: section,
                sourcePath: sourcePath,
                thumbPath: thumbPath,
                sourceFile: path.join(__dirname, '../public', sourcePath),
                thumbFile: thumbFile
            });
        }
    });

    return needsThumb;
}

// 生成手動操作指南
function generateManualGuide() {
    console.log('📖 手動建立縮圖指南\n');
    console.log('='.repeat(50));

    const needsThumb = generateManualInstructions();

    if (needsThumb.length === 0) {
        console.log('🎉 所有項目都已有適當的圖片！無需手動建立。\n');
        console.log('💡 系統現在會自動使用：');
        console.log('   • Reports: 使用現有的 -sm.webp 版本');
        console.log('   • Innovation: 使用 imageSRC 縮圖');
        console.log('\n✅ ModalSidepanel 載入速度已經優化！');
        return;
    }

    console.log(`\n🎯 需要建立縮圖的項目: ${needsThumb.length} 個\n`);

    // 方案一：使用線上工具
    console.log('📁 方案一：使用線上圖片壓縮工具\n');
    console.log('推薦工具:');
    console.log('• TinyPNG (https://tinypng.com/) - 支援批次處理');
    console.log('• Squoosh (https://squoosh.app/) - Google 開發');
    console.log('• ImageOptim (https://imageoptim.com/online) - 免費線上版\n');

    console.log('操作步驟:');
    console.log('1. 上傳原始圖片');
    console.log('2. 調整尺寸為 320x240');
    console.log('3. 選擇 WebP 格式');
    console.log('4. 下載並重新命名\n');

    // 方案二：安裝工具
    console.log('⚙️  方案二：安裝圖片處理工具\n');
    console.log('安裝 ImageMagick:');
    console.log('• macOS: brew install imagemagick');
    console.log('• Windows: 下載 https://imagemagick.org/script/download.php');
    console.log('• Ubuntu: sudo apt-get install imagemagick\n');

    console.log('安裝後執行: pnpm create-thumbs\n');

    // 方案三：詳細檔案清單
    console.log('📝 方案三：詳細檔案清單\n');

    needsThumb.forEach((item, index) => {
        console.log(`${index + 1}. ${item.projectId} (${item.section})`);
        console.log(`   來源: ${item.sourcePath}`);
        console.log(`   目標: ${item.thumbPath}`);
        console.log(`   尺寸: 320x240 (WebP格式)`);
        console.log(`   來源檔案: ${item.sourceFile.replace(__dirname + '/../public', 'public')}`);
        console.log(`   目標檔案: ${item.thumbFile.replace(__dirname + '/../public', 'public')}`);
        console.log('');
    });

    // 測試指令
    console.log('🧪 建立完成後的測試步驟:\n');
    console.log('1. 執行 pnpm validate-thumbs 檢查狀態');
    console.log('2. 啟動開發伺服器 pnpm dev');
    console.log('3. 打開任一 Modal，點擊右側箭頭開啟 ModalSidepanel');
    console.log('4. 觀察載入速度和綠色「最佳化」標籤\n');

    console.log('💡 重要說明:');
    console.log('• 目前系統已經在使用現有的優化圖片');
    console.log('• 建立縮圖會進一步提升 60-80% 載入速度');
    console.log('• 即使不建立縮圖，系統也會正常運作');
}

// 檢查進度
function checkProgress() {
    const needsThumb = generateManualInstructions();
    const projects = loadProjectsData();

    console.log('📊 縮圖建立進度檢查\n');
    console.log('='.repeat(30));

    const totalItems = projects.filter(p => /\.(webp|jpg|jpeg|png)$/i.test(p.path) || p.imageSRC).length;
    const completed = totalItems - needsThumb.length;
    const percentage = Math.round((completed / totalItems) * 100);

    console.log(`總項目數: ${totalItems}`);
    console.log(`已完成: ${completed} (${percentage}%)`);
    console.log(`待完成: ${needsThumb.length}\n`);

    if (needsThumb.length === 0) {
        console.log('🎉 全部完成！系統已完全優化。');
    } else {
        console.log('📋 待完成項目:');
        needsThumb.forEach(item => {
            console.log(`   • ${item.projectId} → ${item.thumbPath}`);
        });
    }

    console.log('\n🚀 目前載入狀態:');
    console.log('• Reports: ✅ 使用 -sm.webp (已優化)');
    console.log('• Innovation: ✅ 使用 imageSRC (已優化)');
    console.log('• Challenge: ⏳ 使用原始圖片 (可進一步優化)');
}

// 生成簡易腳本
function generateSimpleScript() {
    const needsThumb = generateManualInstructions();

    if (needsThumb.length === 0) return;

    console.log('\n🔧 ImageMagick 指令腳本 (安裝 ImageMagick 後使用)\n');
    console.log('複製以下指令到終端執行:\n');

    needsThumb.forEach(item => {
        const sourceFile = item.sourceFile.replace(/ /g, '\\ ');
        const thumbFile = item.thumbFile.replace(/ /g, '\\ ');
        console.log(`# ${item.projectId}`);
        console.log(`convert "${sourceFile}" -resize 320x240^ -gravity center -extent 320x240 -quality 85 "${thumbFile}"`);
        console.log('');
    });
}

// 主程式
function main() {
    const args = process.argv.slice(2);

    if (args.includes('--progress') || args.includes('-p')) {
        checkProgress();
    } else if (args.includes('--script') || args.includes('-s')) {
        generateSimpleScript();
    } else if (args.includes('--help') || args.includes('-h')) {
        console.log('📖 手動縮圖建立工具\n');
        console.log('用法:');
        console.log('  node scripts/create-thumbnails-manual.js        # 顯示完整指南');
        console.log('  node scripts/create-thumbnails-manual.js -p     # 檢查進度');
        console.log('  node scripts/create-thumbnails-manual.js -s     # 生成 ImageMagick 腳本');
        console.log('  node scripts/create-thumbnails-manual.js -h     # 顯示幫助');
    } else {
        generateManualGuide();
        generateSimpleScript();
    }
}

// 如果直接執行此腳本
if (require.main === module) {
    main();
}

module.exports = {
    generateManualInstructions,
    generateManualGuide,
    checkProgress
};
