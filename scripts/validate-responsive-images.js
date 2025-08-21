#!/usr/bin/env node

/**
 * 驗證響應式圖片系統
 * 檢查新建立的多尺寸圖片檔案和系統配置
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

// 獲取檔案大小
function getFileSize(filePath) {
    try {
        const fullPath = path.join(__dirname, '../public', filePath);
        const stats = fs.statSync(fullPath);
        return formatFileSize(stats.size);
    } catch (error) {
        return 'N/A';
    }
}

// 格式化檔案大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// 分析單個項目的圖片狀態
function analyzeProjectImages(project) {
    const section = project.section[0];
    const basePath = project.path.replace(/\.(webp|jpg|jpeg|png|mp4|webm)$/i, '');

    const sizes = ['thumb', 'sm', 'md'];
    const analysis = {
        projectId: project.id,
        section: section,
        basePath: basePath,
        originalPath: project.path,
        originalSize: getFileSize(project.path),
        variants: {},
        totalOptimization: 0,
        recommendedForContext: {}
    };

    // 檢查各種尺寸變體
    sizes.forEach(size => {
        const variantPath = `${basePath}-${size}.webp`;
        const exists = fileExists(variantPath);

        if (exists) {
            const fileSize = getFileSize(variantPath);
            analysis.variants[size] = {
                path: variantPath,
                size: fileSize,
                exists: true
            };
        } else {
            analysis.variants[size] = {
                path: variantPath,
                exists: false
            };
        }
    });

    // 計算優化程度
    const originalExists = fileExists(project.path);
    if (originalExists && analysis.variants.thumb.exists) {
        const originalSizeBytes = fs.statSync(path.join(__dirname, '../public', project.path)).size;
        const thumbSizeBytes = fs.statSync(path.join(__dirname, '../public', analysis.variants.thumb.path)).size;
        analysis.totalOptimization = Math.round((1 - thumbSizeBytes / originalSizeBytes) * 100);
    }

    // 為不同使用情境推薦最佳圖片
    analysis.recommendedForContext = {
        modalSidepanel: getRecommendedImage(analysis, 'thumbnail'),
        listView: getRecommendedImage(analysis, 'small'),
        modalContent: getRecommendedImage(analysis, 'medium'),
        fullscreen: getRecommendedImage(analysis, 'large')
    };

    return analysis;
}

// 為特定情境推薦最佳圖片
function getRecommendedImage(analysis, context) {
    const contextSizeMap = {
        thumbnail: 'thumb',
        small: 'sm',
        medium: 'md',
        large: 'lg'
    };

    const preferredSize = contextSizeMap[context];

    // 優先使用請求的尺寸
    if (analysis.variants[preferredSize]?.exists) {
        return {
            path: analysis.variants[preferredSize].path,
            size: analysis.variants[preferredSize].size,
            optimization: 'optimal'
        };
    }

    // Fallback 策略
    const fallbackOrder = {
        thumbnail: ['sm', 'md'],
        small: ['thumb', 'md'],
        medium: ['sm', 'thumb'],
        large: ['md', 'sm', 'thumb']
    };

    for (const fallbackSize of fallbackOrder[context] || []) {
        if (analysis.variants[fallbackSize]?.exists) {
            return {
                path: analysis.variants[fallbackSize].path,
                size: analysis.variants[fallbackSize].size,
                optimization: 'fallback'
            };
        }
    }

    // 最終使用原始圖片
    return {
        path: analysis.originalPath,
        size: analysis.originalSize,
        optimization: 'none'
    };
}

// 生成完整的驗證報告
function generateValidationReport() {
    console.log('🔍 驗證響應式圖片系統\n');
    console.log('='.repeat(50));

    const projects = loadProjectsData();
    const analysisResults = projects.map(analyzeProjectImages);

    // 統計資訊
    const stats = {
        totalProjects: projects.length,
        sectionsAnalyzed: [...new Set(projects.map(p => p.section[0]))],
        totalVariants: 0,
        optimizedProjects: 0,
        averageOptimization: 0
    };

    let totalOptimization = 0;
    let optimizedCount = 0;

    analysisResults.forEach(analysis => {
        const variantCount = Object.values(analysis.variants).filter(v => v.exists).length;
        stats.totalVariants += variantCount;

        if (analysis.totalOptimization > 0) {
            totalOptimization += analysis.totalOptimization;
            optimizedCount++;
            stats.optimizedProjects++;
        }
    });

    stats.averageOptimization = optimizedCount > 0 ? Math.round(totalOptimization / optimizedCount) : 0;

    // 輸出統計資訊
    console.log(`\n📊 系統統計:`);
    console.log(`   總項目數: ${stats.totalProjects}`);
    console.log(`   分析區塊: ${stats.sectionsAnalyzed.join(', ')}`);
    console.log(`   已優化項目: ${stats.optimizedProjects} / ${stats.totalProjects}`);
    console.log(`   平均檔案大小節省: ${stats.averageOptimization}%`);
    console.log(`   總圖片變體數: ${stats.totalVariants}\n`);

    // 按區塊分析
    const sectionAnalysis = {};
    stats.sectionsAnalyzed.forEach(section => {
        const sectionProjects = analysisResults.filter(a => a.section === section);
        const sectionOptimized = sectionProjects.filter(a => a.totalOptimization > 0);

        sectionAnalysis[section] = {
            total: sectionProjects.length,
            optimized: sectionOptimized.length,
            averageOptimization: sectionOptimized.length > 0
                ? Math.round(sectionOptimized.reduce((sum, a) => sum + a.totalOptimization, 0) / sectionOptimized.length)
                : 0
        };
    });

    console.log('📈 各區塊優化狀況:');
    Object.entries(sectionAnalysis).forEach(([section, data]) => {
        const percentage = Math.round((data.optimized / data.total) * 100);
        console.log(`   ${section}: ${data.optimized}/${data.total} (${percentage}%) - 平均節省 ${data.averageOptimization}%`);
    });

    // ModalSidepanel 專用分析
    console.log('\n🎯 ModalSidepanel 載入優化:');
    const sidepanelOptimized = analysisResults.filter(a => a.variants.thumb.exists);
    console.log(`   有縮圖的項目: ${sidepanelOptimized.length} / ${stats.totalProjects}`);
    console.log(`   預期載入速度提升: ${stats.averageOptimization}% (平均)`);

    if (sidepanelOptimized.length > 0) {
        console.log(`   縮圖檔案大小範圍: ${getFileSizeRange(sidepanelOptimized, 'thumb')}`);
    }

    // 問題項目報告
    const problemProjects = analysisResults.filter(a =>
        !a.variants.thumb.exists && !a.variants.sm.exists
    );

    if (problemProjects.length > 0) {
        console.log(`\n⚠️  需要注意的項目 (${problemProjects.length} 個):`);
        problemProjects.forEach(project => {
            console.log(`   • ${project.projectId}: 缺少優化圖片`);
        });
    }

    // 成功案例展示
    const bestOptimized = analysisResults
        .filter(a => a.totalOptimization > 0)
        .sort((a, b) => b.totalOptimization - a.totalOptimization)
        .slice(0, 3);

    if (bestOptimized.length > 0) {
        console.log(`\n🏆 最佳優化案例:`);
        bestOptimized.forEach(project => {
            console.log(`   • ${project.projectId}: 節省 ${project.totalOptimization}% (${project.originalSize} → ${project.variants.thumb.size})`);
        });
    }

    // 使用建議
    console.log('\n💡 使用建議:');
    console.log('   1. ModalSidepanel 會自動使用最小的可用圖片');
    console.log('   2. 系統會根據網路狀況智慧調整圖片品質');
    console.log('   3. 開發模式下會顯示優化指示器和檔案大小');
    console.log('   4. 所有圖片都有 fallback 機制確保正常顯示');

    return analysisResults;
}

// 獲取檔案大小範圍
function getFileSizeRange(projects, sizeType) {
    const sizes = projects
        .filter(p => p.variants[sizeType]?.exists)
        .map(p => {
            const sizeStr = p.variants[sizeType].size;
            const sizeNum = parseFloat(sizeStr.replace(/[^\d.]/g, ''));
            return sizeNum;
        })
        .sort((a, b) => a - b);

    if (sizes.length === 0) return 'N/A';

    const min = sizes[0];
    const max = sizes[sizes.length - 1];

    return `${min}KB - ${max}KB`;
}

// 測試特定項目的載入配置
function testProjectLoadingConfig(projectId) {
    const projects = loadProjectsData();
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        console.log(`❌ 找不到項目: ${projectId}`);
        return;
    }

    console.log(`\n🧪 測試項目載入配置: ${projectId}\n`);

    const analysis = analyzeProjectImages(project);

    console.log('📁 可用圖片變體:');
    Object.entries(analysis.variants).forEach(([size, data]) => {
        if (data.exists) {
            console.log(`   ✅ ${size}: ${data.path} (${data.size})`);
        } else {
            console.log(`   ❌ ${size}: ${data.path} (不存在)`);
        }
    });

    console.log('\n🎯 不同情境推薦:');
    Object.entries(analysis.recommendedForContext).forEach(([context, rec]) => {
        const status = rec.optimization === 'optimal' ? '✅' :
            rec.optimization === 'fallback' ? '⚠️' : '❌';
        console.log(`   ${status} ${context}: ${rec.path} (${rec.size}) - ${rec.optimization}`);
    });

    if (analysis.totalOptimization > 0) {
        console.log(`\n📊 優化效果: 節省 ${analysis.totalOptimization}% 檔案大小`);
    }
}

// 主程式
function main() {
    const args = process.argv.slice(2);

    if (args.includes('--test') || args.includes('-t')) {
        const projectId = args[args.indexOf('--test') + 1] || args[args.indexOf('-t') + 1];
        if (projectId) {
            testProjectLoadingConfig(projectId);
        } else {
            console.log('請指定要測試的項目 ID，例如: --test reports-1');
        }
    } else if (args.includes('--help') || args.includes('-h')) {
        console.log('📊 響應式圖片系統驗證工具\n');
        console.log('用法:');
        console.log('  node scripts/validate-responsive-images.js        # 完整驗證報告');
        console.log('  node scripts/validate-responsive-images.js -t ID  # 測試特定項目');
        console.log('  node scripts/validate-responsive-images.js -h     # 顯示幫助');
    } else {
        generateValidationReport();
    }
}

// 如果直接執行此腳本
if (require.main === module) {
    main();
}

module.exports = {
    analyzeProjectImages,
    generateValidationReport,
    testProjectLoadingConfig
};
