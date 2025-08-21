#!/usr/bin/env node

/**
 * 自動建立縮圖工具
 * 根據現有圖片自動生成 320x240 的縮圖版本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 檢查是否安裝了 ImageMagick 或其他圖片處理工具
function checkImageProcessingTools() {
    const tools = [
        { name: 'ImageMagick', command: 'magick', test: 'magick -version' },
        { name: 'ImageMagick (convert)', command: 'convert', test: 'convert -version' },
        { name: 'Sharp CLI', command: 'sharp', test: 'sharp --version' },
        { name: 'FFmpeg', command: 'ffmpeg', test: 'ffmpeg -version' }
    ];

    const available = [];

    tools.forEach(tool => {
        try {
            execSync(tool.test, { stdio: 'ignore' });
            available.push(tool);
        } catch (error) {
            // 工具不可用
        }
    });

    return available;
}

// 讀取專案資料
function loadProjectsData() {
    const projectsPath = path.join(__dirname, '../src/app/data/projects.json');
    return JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
}

// 建立縮圖的指令生成器
function generateThumbnailCommands() {
    const projects = loadProjectsData();
    const commands = [];

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

        // 生成目標路徑
        const sourceFile = path.join(__dirname, '../public', sourcePath);
        const pathWithoutExt = sourcePath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
        const thumbPath = `${pathWithoutExt}-thumb.webp`;
        const thumbFile = path.join(__dirname, '../public', thumbPath);

        // 檢查來源檔案是否存在
        if (!fs.existsSync(sourceFile)) {
            console.warn(`⚠️  來源檔案不存在: ${sourcePath}`);
            return;
        }

        // 檢查目標檔案是否已存在
        if (fs.existsSync(thumbFile)) {
            console.log(`⏭️  縮圖已存在，跳過: ${thumbPath}`);
            return;
        }

        commands.push({
            projectId: project.id,
            section: section,
            sourcePath: sourcePath,
            sourceFile: sourceFile,
            thumbPath: thumbPath,
            thumbFile: thumbFile
        });
    });

    return commands;
}

// 使用 ImageMagick 建立縮圖
function createThumbnailWithImageMagick(cmd, tool) {
    const command = tool.command === 'magick'
        ? `magick "${cmd.sourceFile}" -resize 320x240^ -gravity center -extent 320x240 -quality 85 "${cmd.thumbFile}"`
        : `convert "${cmd.sourceFile}" -resize 320x240^ -gravity center -extent 320x240 -quality 85 "${cmd.thumbFile}"`;

    try {
        execSync(command, { stdio: 'pipe' });
        return true;
    } catch (error) {
        console.error(`❌ 處理失敗 ${cmd.projectId}:`, error.message);
        return false;
    }
}

// 批次建立縮圖
function createThumbnails() {
    console.log('🔍 檢查可用的圖片處理工具...\n');

    const availableTools = checkImageProcessingTools();

    if (availableTools.length === 0) {
        console.log('❌ 未找到可用的圖片處理工具！');
        console.log('\n請安裝以下工具之一：');
        console.log('1. ImageMagick: https://imagemagick.org/script/download.php');
        console.log('   macOS: brew install imagemagick');
        console.log('   Ubuntu: sudo apt-get install imagemagick');
        console.log('   Windows: 下載並安裝 ImageMagick');
        console.log('\n2. Sharp CLI: npm install -g sharp-cli');
        console.log('\n安裝後重新執行此腳本。');
        return;
    }

    const tool = availableTools[0];
    console.log(`✅ 使用工具: ${tool.name}\n`);

    const commands = generateThumbnailCommands();

    if (commands.length === 0) {
        console.log('🎉 所有縮圖都已存在或無需處理！');
        return;
    }

    console.log(`📊 統計資訊:`);
    console.log(`   需要處理的圖片: ${commands.length} 張`);
    console.log(`   目標尺寸: 320x240`);
    console.log(`   輸出格式: WebP\n`);

    console.log('🚀 開始建立縮圖...\n');

    let successCount = 0;
    let failCount = 0;

    commands.forEach((cmd, index) => {
        const progress = `[${index + 1}/${commands.length}]`;
        console.log(`${progress} 處理 ${cmd.projectId} (${cmd.section})`);
        console.log(`   來源: ${cmd.sourcePath}`);
        console.log(`   目標: ${cmd.thumbPath}`);

        // 確保目標目錄存在
        const thumbDir = path.dirname(cmd.thumbFile);
        if (!fs.existsSync(thumbDir)) {
            fs.mkdirSync(thumbDir, { recursive: true });
        }

        const success = createThumbnailWithImageMagick(cmd, tool);

        if (success) {
            console.log(`   ✅ 成功\n`);
            successCount++;
        } else {
            console.log(`   ❌ 失敗\n`);
            failCount++;
        }
    });

    console.log('📈 處理完成！');
    console.log(`   成功: ${successCount} 張`);
    console.log(`   失敗: ${failCount} 張`);
    console.log(`   總計: ${commands.length} 張\n`);

    if (successCount > 0) {
        console.log('🎯 下一步：');
        console.log('1. 重新啟動開發伺服器來測試效果');
        console.log('2. 打開 ModalSidepanel 查看載入速度改善');
        console.log('3. 開發模式下會看到綠色「最佳化」標籤');
    }
}

// 驗證現有縮圖
function validateExistingThumbnails() {
    console.log('🔍 驗證現有縮圖...\n');

    const projects = loadProjectsData();
    const results = {
        hasThumb: [],
        needsThumb: [],
        hasAlternative: []
    };

    projects.forEach(project => {
        const section = project.section[0];
        const isInnovation = section === 'innovation';

        // 決定來源圖片
        let sourcePath = project.path;
        if (isInnovation && project.imageSRC) {
            sourcePath = project.imageSRC;
        }

        if (!/\.(webp|jpg|jpeg|png)$/i.test(sourcePath)) {
            return;
        }

        const pathWithoutExt = sourcePath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
        const thumbPath = `${pathWithoutExt}-thumb.webp`;
        const thumbFile = path.join(__dirname, '../public', thumbPath);

        if (fs.existsSync(thumbFile)) {
            results.hasThumb.push(project.id);
        } else {
            // 檢查是否有替代方案
            if (section === 'reports') {
                const reportId = project.id.replace('reports-', '');
                const smPath = path.join(__dirname, `../public/assets/reports/reports-${reportId}-sm.webp`);
                if (fs.existsSync(smPath)) {
                    results.hasAlternative.push(project.id);
                } else {
                    results.needsThumb.push(project.id);
                }
            } else if (isInnovation && project.imageSRC) {
                results.hasAlternative.push(project.id);
            } else {
                results.needsThumb.push(project.id);
            }
        }
    });

    console.log(`📊 縮圖狀態統計:`);
    console.log(`   已有專用縮圖: ${results.hasThumb.length} 項`);
    console.log(`   有替代方案: ${results.hasAlternative.length} 項`);
    console.log(`   需要建立: ${results.needsThumb.length} 項\n`);

    if (results.needsThumb.length > 0) {
        console.log('🎯 需要建立縮圖的項目:');
        results.needsThumb.forEach(id => console.log(`   - ${id}`));
        console.log('\n執行 npm run create-thumbs 來建立縮圖\n');
    } else {
        console.log('🎉 所有項目都有適當的縮圖或替代方案！\n');
    }

    return results;
}

// 主程式
function main() {
    const args = process.argv.slice(2);

    if (args.includes('--validate') || args.includes('-v')) {
        validateExistingThumbnails();
    } else if (args.includes('--help') || args.includes('-h')) {
        console.log('🖼️  縮圖建立工具\n');
        console.log('用法:');
        console.log('  node scripts/create-thumbnails.js        # 建立縮圖');
        console.log('  node scripts/create-thumbnails.js -v     # 驗證現有縮圖');
        console.log('  node scripts/create-thumbnails.js -h     # 顯示幫助\n');
        console.log('功能:');
        console.log('  - 自動建立 320x240 WebP 縮圖');
        console.log('  - 支援 ImageMagick 和 Sharp CLI');
        console.log('  - 跳過已存在的縮圖');
        console.log('  - 提供詳細的處理報告');
    } else {
        createThumbnails();
    }
}

// 如果直接執行此腳本
if (require.main === module) {
    main();
}

module.exports = {
    createThumbnails,
    validateExistingThumbnails,
    generateThumbnailCommands
};
