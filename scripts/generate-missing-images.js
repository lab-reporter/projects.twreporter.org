#!/usr/bin/env node

/**
 * 生成缺失圖片清單腳本
 * 分析專案資料，提供需要建立的圖片尺寸建議
 */

const fs = require('fs');
const path = require('path');

// 讀取專案資料
function loadProjectsData() {
    const projectsPath = path.join(__dirname, '../src/app/data/projects.json');
    return JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
}

// 檢查檔案是否存在
function fileExists(filePath) {
    const fullPath = path.join(__dirname, '../public', filePath);
    return fs.existsSync(fullPath);
}

// 生成建議的圖片路徑
function generateSuggestedImagePaths(project) {
    const section = project.section[0];
    const isInnovation = section === 'innovation';

    // 決定基礎路徑
    let basePath = project.path;
    if (isInnovation && project.imageSRC) {
        basePath = project.imageSRC;
    }

    // 移除副檔名
    const pathWithoutExt = basePath.replace(/\.(webp|jpg|jpeg|png|mp4|webm)$/i, '');

    // 生成建議的尺寸變體
    const suggestedPaths = {
        thumbnail: `${pathWithoutExt}-thumb.webp`,
        small: `${pathWithoutExt}-sm.webp`,
        medium: `${pathWithoutExt}-md.webp`,
        large: `${pathWithoutExt}-lg.webp`
    };

    return suggestedPaths;
}

// 分析缺失的圖片
function analyzeMissingImages() {
    const projects = loadProjectsData();
    const results = [];

    projects.forEach(project => {
        const section = project.section[0];
        const suggestedPaths = generateSuggestedImagePaths(project);

        const analysis = {
            projectId: project.id,
            section: section,
            currentPath: project.path,
            imageSRC: project.imageSRC || null,
            videoSRC: project.videoSRC || null,
            existing: [],
            missing: [],
            priority: section === 'innovation' ? 'high' : 'medium'
        };

        // 檢查每個建議的尺寸是否存在
        Object.entries(suggestedPaths).forEach(([size, suggestedPath]) => {
            if (fileExists(suggestedPath)) {
                analysis.existing.push({ size, path: suggestedPath });
            } else {
                // 檢查現有的替代路徑
                let hasAlternative = false;

                if (section === 'reports' && size === 'small') {
                    // Reports 項目檢查是否有 -sm 版本
                    const reportId = project.id.replace('reports-', '');
                    const smPath = `/assets/reports/reports-${reportId}-sm.webp`;
                    if (fileExists(smPath)) {
                        analysis.existing.push({ size, path: smPath, isAlternative: true });
                        hasAlternative = true;
                    }
                }

                if (!hasAlternative) {
                    analysis.missing.push({
                        size,
                        suggestedPath,
                        recommendedDimensions: getSuggestedDimensions(size),
                        estimatedSavings: getEstimatedSavings(size)
                    });
                }
            }
        });

        results.push(analysis);
    });

    return results;
}

// 取得建議的圖片尺寸
function getSuggestedDimensions(size) {
    const dimensions = {
        thumbnail: '320x240',
        small: '500x375',
        medium: '800x600',
        large: '1200x900'
    };
    return dimensions[size] || 'auto';
}

// 估算檔案大小節省
function getEstimatedSavings(size) {
    const savings = {
        thumbnail: '60-80%',
        small: '40-60%',
        medium: '20-40%',
        large: '10-20%'
    };
    return savings[size] || '未知';
}

// 生成報告
function generateReport(analysis) {
    const report = {
        summary: {
            totalProjects: analysis.length,
            projectsWithMissingImages: analysis.filter(p => p.missing.length > 0).length,
            totalMissingImages: analysis.reduce((sum, p) => sum + p.missing.length, 0),
            highPriorityProjects: analysis.filter(p => p.priority === 'high' && p.missing.length > 0).length
        },
        recommendations: {
            immediate: [],
            secondary: [],
            optional: []
        },
        details: analysis
    };

    // 分類建議
    analysis.forEach(project => {
        if (project.missing.length === 0) return;

        const recommendation = {
            projectId: project.id,
            section: project.section,
            missingCount: project.missing.length,
            estimatedSavings: project.missing.some(m => m.size === 'thumbnail') ? '高' : '中等',
            actions: project.missing.map(m => `建立 ${m.size} (${m.recommendedDimensions}): ${m.suggestedPath}`)
        };

        if (project.priority === 'high') {
            report.recommendations.immediate.push(recommendation);
        } else if (project.missing.some(m => ['thumbnail', 'small'].includes(m.size))) {
            report.recommendations.secondary.push(recommendation);
        } else {
            report.recommendations.optional.push(recommendation);
        }
    });

    return report;
}

// 輸出 ModalSidepanel 專用建議
function generateSidepanelOptimizationReport(analysis) {
    console.log('\n🚀 ModalSidepanel 圖片載入優化建議\n');
    console.log('='.repeat(50));

    const sidepanelRelevant = analysis.filter(p =>
        p.missing.some(m => ['thumbnail', 'small'].includes(m.size))
    );

    if (sidepanelRelevant.length === 0) {
        console.log('✅ 所有項目已有適當的縮圖，ModalSidepanel 載入已優化！');
        return;
    }

    console.log(`\n📊 分析結果：`);
    console.log(`   總項目數: ${analysis.length}`);
    console.log(`   需要縮圖優化: ${sidepanelRelevant.length} 項`);
    console.log(`   預期載入速度提升: 60-80%\n`);

    console.log('🎯 立即建議（ModalSidepanel 載入優化）：\n');

    sidepanelRelevant.forEach((project, index) => {
        console.log(`${index + 1}. ${project.projectId} (${project.section})`);

        const thumbnailMissing = project.missing.find(m => m.size === 'thumbnail');
        const smallMissing = project.missing.find(m => m.size === 'small');

        if (thumbnailMissing) {
            console.log(`   📸 建立縮圖: ${thumbnailMissing.suggestedPath}`);
            console.log(`   📐 建議尺寸: ${thumbnailMissing.recommendedDimensions} (WebP格式)`);
            console.log(`   💾 預期節省: ${thumbnailMissing.estimatedSavings} 檔案大小`);
        }

        if (smallMissing && !thumbnailMissing) {
            console.log(`   📸 建立小圖: ${smallMissing.suggestedPath}`);
            console.log(`   📐 建議尺寸: ${smallMissing.recommendedDimensions} (WebP格式)`);
            console.log(`   💾 預期節省: ${smallMissing.estimatedSavings} 檔案大小`);
        }

        console.log('');
    });

    console.log('💡 實作建議：');
    console.log('   1. 優先處理 Innovation 項目（已有影片縮圖基礎）');
    console.log('   2. 使用 WebP 格式以獲得最佳壓縮比');
    console.log('   3. 縮圖尺寸 320x240 最適合 ModalSidepanel');
    console.log('   4. 可考慮使用圖片壓縮工具自動生成');
}

// 主程式
function main() {
    console.log('🔍 分析專案圖片結構...\n');

    try {
        const analysis = analyzeMissingImages();
        const report = generateReport(analysis);

        // 輸出 ModalSidepanel 專用建議
        generateSidepanelOptimizationReport(analysis);

        // 輸出完整報告到檔案
        const outputPath = path.join(__dirname, '../image-optimization-report.json');
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

        console.log(`\n📄 完整報告已儲存至: ${outputPath}`);
        console.log('\n✨ 執行完成！');

    } catch (error) {
        console.error('❌ 執行時發生錯誤:', error.message);
        process.exit(1);
    }
}

// 如果直接執行此腳本
if (require.main === module) {
    main();
}

module.exports = {
    analyzeMissingImages,
    generateReport,
    generateSidepanelOptimizationReport
};
