"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import projectsData from '../data/projects.json';
import { useUiContext } from '../context/UiContext';
import { getContentComponentByProjectId } from '../sidepanel-contents/contentMap';
import { applyMaterialConfig, defaultMaterialConfigs, debugModelStructure } from '../utils/materialUtils';
import SectionOpenTitle from '../components/SectionOpenTitle';
import ReportsOpen from '../components/ReportsOpen';

gsap.registerPlugin(ScrollTrigger);

const Combined3DScene = ({ setSelectedProject, setSidePanelContent }) => {
    // 容器引用
    const canvasContainerRef = useRef(null);
    const sectionRef = useRef(null);

    // Three.js 核心對象
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const animationFrameRef = useRef(null);

    // 物件群組引用
    const reportsGroupRef = useRef(null);
    const innovationGroupRef = useRef(null);
    const blocksRef = useRef([]);
    const modelMeshesRef = useRef([]);
    const clickableObjectsRef = useRef([]);

    // 狀態管理
    const { setIsSidePanelOpen } = useUiContext();
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentFrontObject, setCurrentFrontObject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showInnovationTitle, setShowInnovationTitle] = useState(false);
    const [showReportsTitle, setShowReportsTitle] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0); // 添加滾動進度狀態

    // 項目資料篩選
    const reportsProjects = useMemo(() => {
        return projectsData.filter(p =>
            p.section && (p.section.includes('reports') || p.section === 'reports')
        );
    }, []);

    const innovationProjects = useMemo(() => {
        return projectsData.filter(p =>
            p.section && (p.section.includes('innovation') || p.section === 'innovation')
        );
    }, []);

    // NOTE: 區域高度配置 - 重新添加 reportsOpen 作為第一階段
    const SECTION_HEIGHTS = {
        reportsOpen: 100,    // ReportsOpen 靜態展示：100vh
        reports: 800,        // Reports 3D圓柱體場景：800vh
        transition: 200,     // 相機過渡區間：200vh
        innovation: 900      // Innovation 3D物件場景：900vh
    };

    // 自動計算滾動區間配置
    const SCROLL_SECTIONS = useMemo(() => {
        const totalHeight = Object.values(SECTION_HEIGHTS).reduce((sum, height) => sum + height, 0);

        let currentProgress = 0;
        const sections = {};

        // ReportsOpen 區域
        sections.reportsOpen = {
            start: currentProgress,
            end: currentProgress + (SECTION_HEIGHTS.reportsOpen / totalHeight)
        };
        currentProgress = sections.reportsOpen.end;

        // Reports 區域
        sections.reports = {
            start: currentProgress,
            end: currentProgress + (SECTION_HEIGHTS.reports / totalHeight)
        };
        currentProgress = sections.reports.end;

        // Transition 區域
        sections.transition = {
            start: currentProgress,
            end: currentProgress + (SECTION_HEIGHTS.transition / totalHeight)
        };
        currentProgress = sections.transition.end;

        // Innovation 區域
        sections.innovation = {
            start: currentProgress,
            end: 1.0 // 總是到 100%
        };

        console.log('📊 自動計算的滾動區間:', {
            totalHeight: `${totalHeight}vh`,
            reportsOpen: `${Math.round(sections.reportsOpen.start * 100)}% - ${Math.round(sections.reportsOpen.end * 100)}%`,
            reports: `${Math.round(sections.reports.start * 100)}% - ${Math.round(sections.reports.end * 100)}%`,
            transition: `${Math.round(sections.transition.start * 100)}% - ${Math.round(sections.transition.end * 100)}%`,
            innovation: `${Math.round(sections.innovation.start * 100)}% - ${Math.round(sections.innovation.end * 100)}%`
        });

        return sections;
    }, []);

    // 計算總高度（vh）
    const totalVH = useMemo(() => {
        return Object.values(SECTION_HEIGHTS).reduce((sum, height) => sum + height, 0);
    }, []);

    // 燈光配置
    const LIGHT_CONFIG = {
        spotLightIntensity: 5,         // 增加聚光燈強度
        spotLightAngle: Math.PI * 0.6,  // 增加聚光燈角度範圍
        penumbra: 0.2,                  // 增加邊緣柔化
        ambientIntensity: 0.3,          // 增加環境光強度
        followStrength: 0.2,
    };

    // 響應式參數
    const cylinderRadius = useMemo(() => {
        if (windowWidth >= 1200) return 8;
        if (windowWidth >= 768) return 6;
        return 4;
    }, [windowWidth]);

    // 監聽視窗大小變化
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 處理項目點擊
    const handleProjectClick = useCallback((project) => {
        if (!setSelectedProject) return;

        setSelectedProject(project);

        const ContentComponent = getContentComponentByProjectId(project.id);

        if (setSidePanelContent && typeof setSidePanelContent === 'function') {
            setSidePanelContent({
                ContentComponent,
                contentProps: { projectData: project }
            });
        }

        setIsSidePanelOpen(true);
    }, [setSelectedProject, setSidePanelContent, setIsSidePanelOpen]);

    //NOTE:原本ReportsThree.jsx的3D圓柱體
    //NOTE:原本ReportsThree.jsx的3D圓柱體

    // 創建彎曲平面幾何體（Reports 使用）
    const createCurvedPlane = useCallback((width, height, radius, segments) => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        const uvs = [];

        const segmentsX = segments * 6;
        const segmentsY = Math.floor(height * 15);
        const theta = width / radius * 1.2;

        for (let y = 0; y <= segmentsY; y++) {
            const yPos = (y / segmentsY - 0.5) * height;

            for (let x = 0; x <= segmentsX; x++) {
                const xAngle = (x / segmentsX - 0.5) * theta;
                const xPos = Math.sin(xAngle) * radius;
                const zPos = Math.cos(xAngle) * radius;

                vertices.push(xPos, yPos, zPos);
                uvs.push((x / segmentsX) * 0.8 + 0.1, y / segmentsY);
            }
        }

        for (let y = 0; y < segmentsY; y++) {
            for (let x = 0; x < segmentsX; x++) {
                const a = x + (segmentsX + 1) * y;
                const b = x + (segmentsX + 1) * (y + 1);
                const c = x + 1 + (segmentsX + 1) * (y + 1);
                const d = x + 1 + (segmentsX + 1) * y;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }, []);

    // 載入媒體紋理（Reports 使用）
    const loadMediaTexture = useCallback((mediaPath) => {
        return new Promise((resolve) => {
            const fileExtension = mediaPath.split('.').pop().toLowerCase();
            const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];
            const isVideo = videoFormats.includes(fileExtension);

            if (isVideo) {
                const video = document.createElement('video');
                video.crossOrigin = 'anonymous';
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.preload = 'metadata';

                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.generateMipmaps = false;
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBAFormat;
                videoTexture.colorSpace = THREE.SRGBColorSpace;

                const onCanPlayThrough = () => {
                    video.play().catch(() => { });
                    videoTexture.needsUpdate = true;
                    resolve(videoTexture);
                };

                video.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
                video.addEventListener('error', () => resolve(null), { once: true });

                try {
                    const encodedPath = mediaPath.includes('%') ? mediaPath : encodeURI(mediaPath);
                    video.src = encodedPath;
                    video.load();
                } catch (encodingError) {
                    video.src = mediaPath;
                    video.load();
                }

                setTimeout(() => resolve(null), 10000);

            } else {
                const textureLoader = new THREE.TextureLoader();

                textureLoader.load(
                    mediaPath,
                    (loadedTexture) => {
                        loadedTexture.generateMipmaps = true;
                        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
                        loadedTexture.magFilter = THREE.LinearFilter;
                        loadedTexture.colorSpace = THREE.SRGBColorSpace;
                        resolve(loadedTexture);
                    },
                    undefined,
                    () => resolve(null)
                );
            }
        });
    }, []);

    // 計算圖片尺寸
    const calculateImageSize = useCallback(() => {
        const totalImages = reportsProjects.length;
        if (totalImages === 0) return { width: 1.5, height: 1.0 };

        const circumference = 2 * Math.PI * cylinderRadius;
        const availableSpacePerImage = circumference / totalImages;
        const imageWidth = availableSpacePerImage * 0.75;
        const imageHeight = imageWidth * 0.8;

        return {
            width: Math.max(imageWidth, 1.5),
            height: Math.max(imageHeight, 1.0)
        };
    }, [cylinderRadius, reportsProjects.length]);

    // 計算相機距離
    const calculateCameraDistance = useCallback(() => {
        const targetWidthRatio = 0.9;
        const fov = 120 * (Math.PI / 180); // Reports 魚眼 FOV
        const cylinderDiameter = cylinderRadius * 2;
        const requiredDistance = cylinderDiameter / (2 * Math.tan(fov / 2) * targetWidthRatio);
        const safetyMargin = cylinderRadius * 0.15;
        return Math.max(requiredDistance, cylinderRadius + safetyMargin);
    }, [cylinderRadius]);

    // 🏗️ 創建 Reports 圖片方塊 - 建立彎曲平面並排列成圓柱體
    const createReportsBlock = useCallback(async (project, index) => {
        const imageSize = calculateImageSize();
        // 創建彎曲的平面幾何體，讓每張圖片呈現弧形效果
        const blockGeometry = createCurvedPlane(imageSize.width, imageSize.height, cylinderRadius, 15);

        let texture = await loadMediaTexture(project.path);

        if (!texture) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const context = canvas.getContext('2d');

            context.fillStyle = '#333333';
            context.fillRect(0, 0, 512, 256);
            context.fillStyle = '#ffffff';
            context.font = '24px Arial';
            context.textAlign = 'center';
            context.fillText('載入失敗', 256, 120);
            context.fillText(project.title, 256, 150);

            texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;
        }

        const blockMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
            toneMapped: false,
        });

        const block = new THREE.Mesh(blockGeometry, blockMaterial);
        block.position.y = 0;

        // 🎯 將每張圖片包裝在容器中並設置圓柱體位置
        const blockContainer = new THREE.Group();
        // 計算每張圖片在圓柱體上的角度位置
        const sectionAngle = (Math.PI * 2) / reportsProjects.length;
        const finalAngle = sectionAngle * index;

        // 設置容器的Y軸旋轉，讓圖片呈現圓柱形排列
        blockContainer.rotation.y = finalAngle;
        blockContainer.add(block);
        blockContainer.userData = { project, index };

        return blockContainer;
    }, [calculateImageSize, createCurvedPlane, cylinderRadius, loadMediaTexture, reportsProjects.length]);



    //NOTE:原本InnovationThree.jsx的3D模型
    //NOTE:原本InnovationThree.jsx的3D模型

    // 創建 Innovation 3D 模型
    const createInnovationModel = useCallback((modelData) => {
        return new Promise((resolve) => {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

            const gltfLoader = new GLTFLoader();
            gltfLoader.setDRACOLoader(dracoLoader);

            gltfLoader.load(
                modelData.path,
                (gltf) => {
                    const model = gltf.scene;

                    // 處理動畫
                    if (gltf.animations && gltf.animations.length > 0) {
                        const mixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach((clip) => {
                            const action = mixer.clipAction(clip);
                            action.loop = THREE.LoopRepeat;
                            action.play();
                        });
                        model.userData.animationMixer = mixer;
                    }

                    // 設置材質和陰影
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.renderOrder = 1;
                            if (child.material) {
                                if (Array.isArray(child.material)) {
                                    child.material.forEach(mat => {
                                        mat.transparent = true;
                                        mat.depthWrite = true;
                                        mat.depthTest = true;
                                        mat.needsUpdate = true;
                                        if (mat.opacity !== undefined) mat.opacity = 1;
                                    });
                                } else {
                                    child.material.transparent = true;
                                    child.material.depthWrite = true;
                                    child.material.depthTest = true;
                                    child.material.needsUpdate = true;
                                    if (child.material.opacity !== undefined) child.material.opacity = 1;
                                }
                            }
                            child.visible = true;
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    model.castShadow = true;
                    model.receiveShadow = true;

                    // 設置比例和位置
                    if (modelData.scale) {
                        model.scale.set(modelData.scale.x, modelData.scale.y, modelData.scale.z);
                    } else {
                        model.scale.set(0.25, 0.25, 0.25);
                    }

                    if (modelData.rotation) {
                        model.rotation.set(modelData.rotation.x, modelData.rotation.y, modelData.rotation.z);
                    }

                    model.userData.targetPosition = {
                        x: modelData.position.x,
                        y: modelData.position.y,
                        z: modelData.position.z
                    };
                    model.userData.projectId = modelData.id;
                    model.userData.originalScale = model.scale.clone();

                    // 應用材質配置
                    debugModelStructure(model, modelData.id);
                    const materialConfig = (modelData.material && Object.keys(modelData.material).length > 0)
                        ? modelData.material
                        : defaultMaterialConfigs[modelData.id];
                    applyMaterialConfig(model, materialConfig);

                    model.position.set(modelData.position.x, modelData.position.y, modelData.position.z);

                    resolve(model);
                },
                undefined,
                (error) => {
                    console.error('Error loading GLTF model:', modelData.id, error);
                    resolve(null);
                }
            );
        });
    }, []);

    // 清理資源
    const cleanup = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // 清理 Reports 方塊
        blocksRef.current.forEach(block => {
            if (block.children[0]) {
                const mesh = block.children[0];
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (mesh.material.map) {
                        if (mesh.material.map.image && mesh.material.map.image.tagName === 'VIDEO') {
                            const video = mesh.material.map.image;
                            video.pause();
                            video.src = '';
                            video.load();
                        }
                        mesh.material.map.dispose();
                    }
                    mesh.material.dispose();
                }
            }
        });

        // 清理 Innovation 模型
        modelMeshesRef.current.forEach(model => {
            if (model.userData.animationMixer) {
                model.userData.animationMixer.stopAllAction();
                model.userData.animationMixer.uncacheRoot(model.userData.animationMixer.getRoot());
            }
        });

        if (sceneRef.current) {
            while (sceneRef.current.children.length > 0) {
                sceneRef.current.remove(sceneRef.current.children[0]);
            }
        }

        if (rendererRef.current) {
            rendererRef.current.dispose();
            if (canvasContainerRef.current && rendererRef.current.domElement) {
                canvasContainerRef.current.removeChild(rendererRef.current.domElement);
            }
        }

        sceneRef.current = null;
        cameraRef.current = null;
        rendererRef.current = null;
        reportsGroupRef.current = null;
        innovationGroupRef.current = null;
        blocksRef.current = [];
        modelMeshesRef.current = [];
        clickableObjectsRef.current = [];
    }, []);

    // 初始化統一 3D 場景
    const initCombinedScene = useCallback(async () => {
        if (!canvasContainerRef.current) return;

        cleanup();

        // 創建場景
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // 📷 創建相機（初始為 Reports 設定）
        const camera = new THREE.PerspectiveCamera(
            120, // 魚眼效果 FOV，讓 Reports 圓柱體可以完整顯示
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        cameraRef.current = camera;

        // 創建渲染器
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.toneMappingExposure = 1.0;

        // 啟用陰影映射（Innovation 需要）
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        rendererRef.current = renderer;
        canvasContainerRef.current.appendChild(renderer.domElement);

        // 🗂️ 創建物件群組 - 分別管理兩種不同的3D場景
        const reportsGroup = new THREE.Group();       // Reports 圓柱體圖片群組
        const innovationGroup = new THREE.Group();    // Innovation 3D模型群組

        // 🏔️ 設置 Reports 群組位置在上方，Innovation 群組在下方
        reportsGroup.position.set(0, 100, 0);         // Reports 在 Y=100 的位置
        innovationGroup.position.set(0, 0, 0);        // Innovation 在 Y=0 的位置

        scene.add(reportsGroup);
        scene.add(innovationGroup);
        reportsGroupRef.current = reportsGroup;
        innovationGroupRef.current = innovationGroup;

        // 設置燈光系統 - Reports 聚光燈
        const reportsSpotLight = new THREE.SpotLight(0xffffff, LIGHT_CONFIG.spotLightIntensity);
        const optimalDistance = calculateCameraDistance(); // 使用精確計算的距離

        // 聚光燈位置對準 Reports 群組（Y=100），與初始相機位置一致
        reportsSpotLight.position.set(0, 100, optimalDistance);

        // 聚光燈目標照向 Reports 群組中央
        reportsSpotLight.target.position.set(0, 100, 0);
        scene.add(reportsSpotLight.target);

        // 調整聚光燈參數
        reportsSpotLight.angle = LIGHT_CONFIG.spotLightAngle;
        reportsSpotLight.penumbra = LIGHT_CONFIG.penumbra;
        reportsSpotLight.distance = optimalDistance * 3; // 增加照射距離
        reportsSpotLight.decay = 1;
        scene.add(reportsSpotLight);

        console.log('💡 初始聚光燈設定:', {
            position: { x: 0, y: 100, z: Math.round(optimalDistance) },
            target: { x: 0, y: 100, z: 0 },
            intensity: LIGHT_CONFIG.spotLightIntensity,
            angle: Math.round(LIGHT_CONFIG.spotLightAngle * 180 / Math.PI) + '°',
            distance: optimalDistance * 3
        });

        // 環境光（增強整體亮度）
        const ambientLight = new THREE.AmbientLight(0xffffff, LIGHT_CONFIG.ambientIntensity);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(512, 512);
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 30;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.top = 15;
        directionalLight.shadow.camera.bottom = -15;
        directionalLight.shadow.bias = -0.0005;
        scene.add(directionalLight);

        // 🎯 添加 3D 軸線輔助顯示
        // const axesHelper = new THREE.AxesHelper(500);
        // scene.add(axesHelper);
        // console.log('✅ 3D軸線已添加 (紅色=X軸, 綠色=Y軸, 藍色=Z軸)');

        // 📍 添加網格輔助顯示
        // const gridHelper = new THREE.GridHelper(100, 100);
        // gridHelper.position.y = 0; // 在 Y=0 位置顯示網格
        // scene.add(gridHelper);
        // console.log('✅ 網格輔助線已添加在 Y=0 位置');

        // 添加上層網格（Reports 層）
        // const upperGridHelper = new THREE.GridHelper(100, 100);
        // upperGridHelper.position.y = 100; // 在 Y=100 位置顯示網格
        // upperGridHelper.material.color.setHex(0xff0000); // 紅色網格
        // scene.add(upperGridHelper);
        // console.log('✅ 上層網格輔助線已添加在 Y=100 位置');

        // 創建軌道控制器（Innovation 需要）
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.enabled = false;
        controls.autoRotate = false;
        // 🚫 禁用所有自動更新，避免覆蓋手動設定的 lookAt
        controls.enablePan = false;
        controls.enableRotate = false;
        controlsRef.current = controls;

        // 📍 設置初始相機位置 - 預設對準第一張圖片（index 0）
        const firstImageAngle = 0; // 第一張圖片角度為 0
        camera.position.x = Math.sin(firstImageAngle) * optimalDistance; // = 0
        camera.position.y = 100;              // Y軸對準 Reports 群組位置
        camera.position.z = Math.cos(firstImageAngle) * optimalDistance; // = optimalDistance
        camera.lookAt(0, 100, 0);             // 相機看向圓心

        // 🔍 初始化時隱藏 Innovation 群組，避免被相機看到
        innovationGroup.visible = false;

        console.log('📍 初始相機設置（相機旋轉模式）:', {
            position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
            lookAt: { x: 0, y: 100, z: 0 },
            fov: camera.fov,
            mode: 'camera-rotation',
            reportsGroupPosition: { x: 0, y: 100, z: 0 },
            innovationGroupPosition: { x: 0, y: 0, z: 0 },
            innovationVisible: innovationGroup.visible
        });


        // 載入進度追踪
        let loadedCount = 0;
        const totalToLoad = reportsProjects.length + innovationProjects.length;

        console.log('📊 載入項目統計:', {
            reportsCount: reportsProjects.length,
            innovationCount: innovationProjects.length,
            total: totalToLoad
        });

        const updateProgress = () => {
            loadedCount++;
            const progress = (loadedCount / totalToLoad) * 100;
            console.log(`📈 載入進度: ${loadedCount}/${totalToLoad} (${Math.round(progress)}%)`);
            setLoadingProgress(progress);
            if (loadedCount === totalToLoad) {
                console.log('✅ 所有項目載入完成');
                setIsLoading(false);
            }
        };

        // 如果沒有項目要載入，直接完成
        if (totalToLoad === 0) {
            console.log('⚠️ 沒有項目要載入，直接完成');
            setIsLoading(false);
        }

        // 載入 Reports 內容
        const blocks = [];
        const reportsClickableObjects = [];

        for (let i = 0; i < reportsProjects.length; i++) {
            const project = reportsProjects[i];
            console.log(`📸 載入 Reports 項目 ${i + 1}/${reportsProjects.length}:`, project.title);

            try {
                const blockContainer = await createReportsBlock(project, i);

                if (blockContainer) {
                    blocks.push(blockContainer);
                    reportsGroup.add(blockContainer);
                    reportsClickableObjects.push(blockContainer.children[0]);
                    console.log(`✅ Reports 項目載入成功: ${project.title}`);
                } else {
                    console.log(`⚠️ Reports 項目載入失敗: ${project.title}`);
                }
            } catch (error) {
                console.error(`❌ Reports 項目載入錯誤 ${project.title}:`, error);
            }

            updateProgress();
        }

        blocksRef.current = blocks;

        // 載入 Innovation 內容
        const models = [];
        const innovationClickableObjects = [];

        for (const modelData of innovationProjects) {
            console.log(`🏗️ 載入 Innovation 模型:`, modelData.id);

            try {
                const model = await createInnovationModel(modelData);
                if (model) {
                    models.push(model);
                    innovationGroup.add(model);
                    innovationClickableObjects.push(model);
                    console.log(`✅ Innovation 模型載入成功: ${modelData.id}`);
                } else {
                    console.log(`⚠️ Innovation 模型載入失敗: ${modelData.id}`);
                }
            } catch (error) {
                console.error(`❌ Innovation 模型載入錯誤 ${modelData.id}:`, error);
            }

            updateProgress();
        }

        modelMeshesRef.current = models;
        clickableObjectsRef.current = [...reportsClickableObjects, ...innovationClickableObjects];

        // 點擊檢測
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        const onMouseClick = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(clickableObjectsRef.current, true);

            if (intersects.length > 0) {
                let clickedObject = intersects[0].object;

                // 找到帶有項目資料的父物件
                while (clickedObject && !clickedObject.userData.project && !clickedObject.userData.projectId) {
                    clickedObject = clickedObject.parent;
                }

                let projectData = null;

                if (clickedObject.userData.project) {
                    // Reports 項目
                    projectData = clickedObject.userData.project;
                } else if (clickedObject.userData.projectId) {
                    // Innovation 項目
                    projectData = projectsData.find(p => p.id === clickedObject.userData.projectId);
                }

                if (projectData) {
                    handleProjectClick(projectData);
                }
            }
        };

        const onMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(clickableObjectsRef.current, true);

            if (canvasContainerRef.current) {
                canvasContainerRef.current.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
            }
        };

        renderer.domElement.addEventListener('click', onMouseClick);
        renderer.domElement.addEventListener('mousemove', onMouseMove);

        // 動畫循環
        const clock = new THREE.Clock();
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            const delta = clock.getDelta();

            // 更新 Innovation 動畫
            modelMeshesRef.current.forEach(model => {
                if (model.userData.animationMixer) {
                    model.userData.animationMixer.update(delta);
                }
            });

            // 更新 Reports 影片紋理
            blocksRef.current.forEach(block => {
                if (block.children[0] && block.children[0].material && block.children[0].material.map) {
                    const texture = block.children[0].material.map;
                    if (texture.image && texture.image.tagName === 'VIDEO') {
                        texture.needsUpdate = true;
                    }
                }
            });

            // 🚫 移除 controls.update()，避免覆蓋手動設定的相機 lookAt
            // controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // 視窗調整處理
        const onWindowResize = () => {
            if (!camera || !renderer) return;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // 重新計算相機距離並更新 Reports 聚光燈位置
            const newOptimalDistance = calculateCameraDistance();
            const reportsSpotLight = scene.children.find(child =>
                child.type === 'SpotLight' && child.position.y === 100
            );
            if (reportsSpotLight) {
                reportsSpotLight.position.set(0, 100, newOptimalDistance);
                reportsSpotLight.distance = newOptimalDistance * 2;
            }
        };

        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.domElement.removeEventListener('click', onMouseClick);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
        };
    }, [calculateCameraDistance, createReportsBlock, createInnovationModel, handleProjectClick, reportsProjects, innovationProjects, cleanup]);


    //NOTE：滾動控制核心函數
    //NOTE：滾動控制核心函數

    // 根據滾動進度切換和控制兩個3D場景
    const updateScrollControl = useCallback((progress) => {
        const camera = cameraRef.current;           // 相機參考
        const reportsGroup = reportsGroupRef.current;    // Reports 圓柱體群組
        const innovationGroup = innovationGroupRef.current; // Innovation 模型群組

        if (!camera || !reportsGroup || !innovationGroup) {
            console.log('⚠️ updateScrollControl: 缺少必要的參考對象');
            return;
        }

        // 更新滾動進度狀態
        setScrollProgress(progress);

        console.log('🔄 滾動進度更新:', progress);

        // 📊 簡化追蹤：只顯示相機看向位置
        const lookAtTarget = new THREE.Vector3();
        camera.getWorldDirection(lookAtTarget);
        lookAtTarget.add(camera.position);
        console.log('📍 相機看向位置:', {
            x: Math.round(lookAtTarget.x * 100) / 100,
            y: Math.round(lookAtTarget.y * 100) / 100,
            z: Math.round(lookAtTarget.z * 100) / 100
        });

        // Reports Title 顯示控制（只在 Reports 區間內顯示）
        if (progress >= SCROLL_SECTIONS.reports.start && progress < SCROLL_SECTIONS.reports.end) {
            setShowReportsTitle(true);
        } else {
            setShowReportsTitle(false);
        }

        if (progress < SCROLL_SECTIONS.reportsOpen.start) {
            //NOTE: 場景開始前 - 隱藏所有內容，等待轉場
            reportsGroup.visible = false;
            innovationGroup.visible = false;
            console.log('🌟 場景開始前 - 隱藏所有 3D 內容');

        } else if (progress >= SCROLL_SECTIONS.reportsOpen.start && progress < SCROLL_SECTIONS.reportsOpen.end) {
            //NOTE: ReportsOpen 階段 - 顯示靜態的 ReportsOpen 內容
            // 隱藏 3D 場景，只顯示 ReportsOpen 內容
            reportsGroup.visible = false;
            innovationGroup.visible = false;
            console.log('📄 ReportsOpen 階段 - 顯示靜態內容');

        } else if (progress >= SCROLL_SECTIONS.reports.start && progress < SCROLL_SECTIONS.reports.end) {
            //NOTE: Reports 區段 - 控制相機旋轉（效能優化版本）
            const reportsProgress = (progress - SCROLL_SECTIONS.reports.start) /
                (SCROLL_SECTIONS.reports.end - SCROLL_SECTIONS.reports.start);

            // 🔭 相機設定為魚眼效果，適合觀看圓柱體全景
            camera.fov = 120;                           // 寬視角FOV
            camera.updateProjectionMatrix();            // 更新投影矩陣

            // 🔄 相機旋轉邏輯（帶緩衝區）- 效能優化：只旋轉相機而非整個圓柱體
            const startBuffer = 0.05;   // 開始5%為緩衝區，不旋轉
            const endBuffer = 0.05;     // 結束5%為緩衝區，不旋轉
            const activeRange = 1 - startBuffer - endBuffer; // 中間90%為有效旋轉區間

            let rotationFraction = 0;   // 旋轉比例，0-1之間
            if (reportsProgress >= startBuffer && reportsProgress <= (1 - endBuffer)) {
                // 在有效區間內，計算旋轉比例
                rotationFraction = (reportsProgress - startBuffer) / activeRange;
            } else if (reportsProgress > (1 - endBuffer)) {
                // 超過結束緩衝區，保持最大旋轉
                rotationFraction = 1;
            }

            // 🎯 計算當前應該顯示哪張圖片
            const totalProjects = reportsProjects.length;
            const currentImageIndex = Math.round(rotationFraction * (totalProjects - 1));
            const clampedIndex = Math.max(0, Math.min(currentImageIndex, totalProjects - 1));

            // 🎥 計算相機圍繞圓心的旋轉位置
            const optimalDistance = calculateCameraDistance(); // 計算最佳觀看距離
            const sectionAngle = (Math.PI * 2) / totalProjects;  // 每張圖片佔用的角度
            const cameraAngle = sectionAngle * clampedIndex;     // 相機當前角度

            // 📍 使用角度插值確保相機沿圓弧運動，保持固定距離
            const currentAngle = Math.atan2(camera.position.x, camera.position.z);

            // 處理角度跨越問題（例如從 350° 到 10°）
            let targetAngle = cameraAngle;
            const angleDiff = targetAngle - currentAngle;

            if (angleDiff > Math.PI) {
                targetAngle -= 2 * Math.PI;
            } else if (angleDiff < -Math.PI) {
                targetAngle += 2 * Math.PI;
            }

            // 🎬 使用角度插值進行圓弧運動，確保始終保持固定距離
            // 只有當角度差異超過閾值時才執行動畫，避免過於頻繁的觸發
            const angleThreshold = 0.01; // 約0.57度的閾值
            if (Math.abs(targetAngle - currentAngle) > angleThreshold) {
                gsap.to({ angle: currentAngle }, {
                    angle: targetAngle,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: true,
                    onUpdate: function () {
                        // 在動畫過程中根據當前角度計算圓弧上的位置
                        const currentAnimAngle = this.targets()[0].angle;
                        camera.position.x = Math.sin(currentAnimAngle) * optimalDistance;
                        camera.position.z = Math.cos(currentAnimAngle) * optimalDistance;
                        camera.position.y = 100; // Y軸保持不變

                        // 確保相機始終看向圓心
                        camera.lookAt(0, 100, 0);
                    }
                });
            }

            console.log('🎥 Reports 區段相機平滑旋轉 - 角度插值:', {
                currentAngle: Math.round(currentAngle * 180 / Math.PI) + '°',
                targetAngle: Math.round(targetAngle * 180 / Math.PI) + '°',
                distance: Math.round(optimalDistance)
            });

            // 📄 更新當前顯示的圖片索引（用於標題顯示）
            setCurrentSlide(clampedIndex);

            // 💡 聚光燈同樣使用角度插值，確保與相機保持同步
            const reportsSpotLight = sceneRef.current.children.find(child =>
                child.type === 'SpotLight' && child.position.y === 100
            );
            if (reportsSpotLight && Math.abs(targetAngle - currentAngle) > angleThreshold) {
                // 聚光燈跟隨相機的角度插值動畫，同樣使用閾值控制
                const lightDistance = optimalDistance; // 跟相機距離一樣

                gsap.to({ angle: currentAngle }, {
                    angle: targetAngle,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: true,
                    onUpdate: function () {
                        // 聚光燈位置跟相機同步旋轉
                        const currentAnimAngle = this.targets()[0].angle;
                        reportsSpotLight.position.x = Math.sin(currentAnimAngle) * lightDistance;
                        reportsSpotLight.position.z = Math.cos(currentAnimAngle) * lightDistance;
                        reportsSpotLight.position.y = 100;

                        // 聚光燈目標始終指向圓心
                        reportsSpotLight.target.position.set(0, 100, 0);
                    }
                });

                console.log('💡 聚光燈角度插值更新:', {
                    angle: Math.round(cameraAngle * 180 / Math.PI) + '°',
                    distance: lightDistance
                });
            }

            // 👁️ Reports 區段：只顯示 Reports 群組
            reportsGroup.visible = true;
            innovationGroup.visible = false; // 隱藏 Innovation，避免被看到

        } else if (progress >= SCROLL_SECTIONS.transition.start && progress < SCROLL_SECTIONS.innovation.start) {
            //NOTE: 相機過渡區間 - 從 Reports 旋轉位置平移到 Innovation（電梯效果）

            // 🛑 停止所有可能衝突的GSAP動畫，避免與過渡區間的相機控制衝突
            gsap.killTweensOf(camera.position);
            gsap.killTweensOf({ angle: 0 }); // 停止角度插值動畫

            // 🛑 也停止聚光燈的GSAP動畫
            const transitionSpotLight = sceneRef.current.children.find(child =>
                child.type === 'SpotLight' && child.position.y === 100
            );
            if (transitionSpotLight) {
                gsap.killTweensOf(transitionSpotLight.position);
            }

            const transitionProgress = (progress - SCROLL_SECTIONS.transition.start) /
                (SCROLL_SECTIONS.transition.end - SCROLL_SECTIONS.transition.start);

            // 🎬 相機 FOV 從魚眼 (120) 過渡到正常 (45)
            const startFOV = 120;
            const endFOV = 45;
            camera.fov = startFOV + (endFOV - startFOV) * transitionProgress;

            // 📍 計算 Reports 區段結束時的相機位置（最後一張圖片的角度）
            const totalProjects = reportsProjects.length;
            const lastImageIndex = totalProjects - 1;
            const sectionAngle = (Math.PI * 2) / totalProjects;
            const lastCameraAngle = sectionAngle * lastImageIndex;

            // Reports 結束時的相機位置
            const optimalDistance = calculateCameraDistance();
            const startX = Math.sin(lastCameraAngle) * optimalDistance;
            const startY = 100;
            const startZ = Math.cos(lastCameraAngle) * optimalDistance;

            // Innovation 開始時的相機位置
            const endX = 0;
            const endY = 0;
            const endZ = 40;

            // 🚁 電梯效果：相機從 Reports 最後位置平移到 Innovation 位置
            camera.position.x = startX + (endX - startX) * transitionProgress;
            camera.position.y = startY + (endY - startY) * transitionProgress;
            camera.position.z = startZ + (endZ - startZ) * transitionProgress;

            // 🎯 相機視角從看向 Reports 圓心過渡到看向 Innovation 圓心
            const lookAtY = startY + (endY - startY) * transitionProgress;
            camera.lookAt(0, lookAtY, 0);

            camera.updateProjectionMatrix();

            console.log(`🎬 過渡區段相機設定完成 - 從旋轉位置 (${Math.round(startX)}, ${startY}, ${Math.round(startZ)}) 移動到 (${Math.round(camera.position.x)}, ${Math.round(camera.position.y)}, ${Math.round(camera.position.z)})`);

            // 💡 過渡區段：聚光燈已在區間開始時停止動畫，保持在最後位置
            console.log('💡 過渡區段：聚光燈已停止跟隨相機，保持在最後位置');

            // 👁️ 過渡區間：兩個群組都顯示，實現平滑過渡
            reportsGroup.visible = true;
            innovationGroup.visible = true;

            console.log('🎬 相機過渡中:', {
                transitionProgress: transitionProgress,
                cameraY: camera.position.y,
                lookAtY: lookAtY,
                fov: camera.fov,
                fromAngle: Math.round(lastCameraAngle * 180 / Math.PI) + '°'
            });

        } else {
            // NOTE:Innovation 區段 (37.5% - 100%) - 控制3D模型移動和相機

            // 🛑 確保進入Innovation區段時停止所有相機動畫
            gsap.killTweensOf(camera.position);
            gsap.killTweensOf({ angle: 0 });

            const innovationProgress = (progress - SCROLL_SECTIONS.innovation.start) /
                (SCROLL_SECTIONS.innovation.end - SCROLL_SECTIONS.innovation.start);

            // 📐 相機設定為正常視角，適合觀看單個3D模型
            camera.fov = 45;            // 正常FOV，聚焦效果
            camera.position.x = 0;      // X軸居中
            camera.position.y = 0;      // Y軸高度對準 Innovation 群組
            camera.position.z = 40;     // 較近的距離，觀看3D模型細節
            camera.lookAt(0, 0, 0);     // 看向同一水平線的前方，保持水平視角
            camera.updateProjectionMatrix();

            console.log('🏗️ Innovation 區段相機設定完成 - 看向 (0, 0, 0)');

            // 🎭 Innovation 3D模型依序移動到鏡頭前的邏輯
            const innovationItems = innovationProjects.sort((a, b) => {
                const numA = parseInt(a.id.split('-')[1]);
                const numB = parseInt(b.id.split('-')[1]);
                return numA - numB;  // 按ID編號排序
            });

            const bufferStart = 0.1;    // 前10%緩衝區
            const bufferEnd = 0.9;      // 後10%緩衝區

            let currentIndex = -1;      // 當前在鏡頭前的模型索引，-1表示無
            if (innovationProgress >= bufferStart && innovationProgress <= bufferEnd) {
                // 在有效區間內，計算當前應該顯示哪個模型
                const effectiveProgress = (innovationProgress - bufferStart) / (bufferEnd - bufferStart);
                currentIndex = Math.floor(effectiveProgress * innovationItems.length);
                currentIndex = Math.min(currentIndex, innovationItems.length - 1);
            }

            const currentItem = currentIndex >= 0 ? innovationItems[currentIndex] : null;
            setCurrentFrontObject(currentItem ? currentItem.id : null);  // 更新狀態用於標題顯示

            // 🏃‍♂️ 遍歷所有3D模型，根據當前索引移動到鏡頭前或回到原位
            modelMeshesRef.current.forEach((model) => {
                if (!model.userData.projectId) return;

                // 找到當前模型在排序列表中的位置
                const itemIndex = innovationItems.findIndex(item => item.id === model.userData.projectId);
                if (itemIndex === -1) return;

                const originalPos = model.userData.targetPosition;  // 模型的原始位置

                if (itemIndex === currentIndex) {
                    // 🎯 當前模型：移動到鏡頭前中央位置 (0, 0, 20)
                    gsap.to(model.position, {
                        x: 0, y: 0, z: 20,      // 鏡頭前中央位置
                        duration: 1,
                        ease: "power2.out",
                        overwrite: "auto"
                    });

                    // 🔍 放大當前模型以增強聚焦效果
                    const originalScale = model.userData.originalScale;
                    if (originalScale) {
                        gsap.to(model.scale, {
                            x: originalScale.x * 1.2,  // 放大到120%
                            y: originalScale.y * 1.2,
                            z: originalScale.z * 1.2,
                            duration: 1,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                } else {
                    // 🔙 其他模型：回到原始位置
                    gsap.to(model.position, {
                        x: originalPos.x,           // 回到原始X位置
                        y: originalPos.y,           // 回到原始Y位置
                        z: originalPos.z,           // 回到原始Z位置
                        duration: 1,
                        ease: "power2.out",
                        overwrite: "auto"
                    });

                    // 📏 恢復原始比例
                    const originalScale = model.userData.originalScale;
                    if (originalScale) {
                        gsap.to(model.scale, {
                            x: originalScale.x,     // 恢復原始大小
                            y: originalScale.y,
                            z: originalScale.z,
                            duration: 1,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                }
            });

            // 👁️ Innovation 區段：只顯示 Innovation 群組
            reportsGroup.visible = false; // 隱藏 Reports，專注於 Innovation
            innovationGroup.visible = true;
        }
    }, [SCROLL_SECTIONS, calculateCameraDistance, reportsProjects.length, innovationProjects, setScrollProgress]);

    // 初始化 useEffect
    useEffect(() => {
        if (typeof window === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        let cleanupScene = null;
        let scrollTriggers = [];

        const initializeScene = async () => {
            try {
                console.log('🚀 開始初始化 Combined3D 場景...');

                cleanupScene = await initCombinedScene();

                if (!sectionRef.current) {
                    console.error('❌ sectionRef.current 不存在');
                    return;
                }

                console.log('✅ 3D 場景初始化完成，設置滾動觸發器...');

                // 入場動畫
                if (canvasContainerRef.current) {
                    gsap.set(canvasContainerRef.current, {
                        opacity: 0,
                        scale: 0.8
                    });

                    const revealTrigger = ScrollTrigger.create({
                        trigger: sectionRef.current,
                        start: "top 50%",
                        once: true,
                        id: "combined-scene-reveal-trigger",
                        onEnter: () => {
                            console.log('🎬 觸發入場動畫');
                            gsap.to(canvasContainerRef.current, {
                                opacity: 1,
                                scale: 1,
                                duration: 1,
                                ease: "power1.out"
                            });
                        }
                    });
                    scrollTriggers.push(revealTrigger);
                }

                // 🎮 主要滾動控制觸發器 - 連接滾動事件與3D場景控制
                const trigger = ScrollTrigger.create({
                    trigger: sectionRef.current,       // 觸發元素：整個Combined3DScene容器
                    start: 'top top',                   // 開始：容器頂部到達視窗頂部
                    end: 'bottom bottom',               // 結束：容器底部到達視窗底部
                    scrub: 2,                          // 平滑跟隨滾動，延遲2幀
                    onUpdate: (self) => {
                        // 將滾動進度 (0-1) 傳給控制函數
                        updateScrollControl(self.progress);
                    },
                    id: 'combined-3d-trigger'
                });
                scrollTriggers.push(trigger);

                // 🏷️ Innovation 標題顯示控制觸發器 - 在場景切換時短暫顯示標題
                const innovationTitleTrigger = ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: `${Math.round(SCROLL_SECTIONS.transition.start * 100)}% top`,     // 在相機過渡開始時
                    end: `${Math.round(SCROLL_SECTIONS.innovation.start * 100)}% top`,       // 到 Innovation 區段開始時結束
                    onEnter: () => {
                        console.log('🎬 顯示 Innovation 標題');
                        setShowInnovationTitle(true);   // 進入時顯示標題
                    },
                    onLeave: () => {
                        console.log('🎬 隱藏 Innovation 標題');
                        setShowInnovationTitle(false);  // 離開時隱藏標題
                    },
                    onEnterBack: () => {
                        console.log('🎬 重新顯示 Innovation 標題');
                        setShowInnovationTitle(true);   // 向上捲回時重新顯示
                    },
                    onLeaveBack: () => {
                        console.log('🎬 回滾隱藏 Innovation 標題');
                        setShowInnovationTitle(false);  // 向上捲離開時隱藏
                    },
                    id: 'innovation-title-trigger'
                });
                scrollTriggers.push(innovationTitleTrigger);

                console.log('✅ 滾動觸發器設置完成');

            } catch (error) {
                console.error('❌ Combined3D 場景初始化失敗:', error);
                setIsLoading(false); // 即使失敗也要隱藏載入畫面
            }
        };

        initializeScene();

        return () => {
            console.log('🧹 清理 Combined3D 場景');
            scrollTriggers.forEach(trigger => trigger.kill());
            if (cleanupScene) cleanupScene();
            cleanup();
        };
    }, []); // 移除依賴項，避免無限重新渲染

    // 獲取當前項目資料
    const currentProject = reportsProjects[currentSlide] || null;
    const currentInnovationProject = currentFrontObject ?
        projectsData.find(p => p.id === currentFrontObject) : null;

    return (
        <div
            ref={sectionRef}
            className="relative overflow-visible"
            style={{
                height: `${totalVH}vh`,
                marginTop: '-100vh' // 向上偏移 100vh，讓 ReportsOpen 階段能夠正確顯示
            }}
            id="combined-3d-section"
        >
            {/* Combined 3D Scene */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                {/* ReportsOpen 靜態內容 - 在 reportsOpen 階段顯示 */}
                <div
                    className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-500 ${scrollProgress >= SCROLL_SECTIONS.reportsOpen.start && scrollProgress < SCROLL_SECTIONS.reportsOpen.end
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <ReportsOpen />
                </div>

                <div
                    ref={canvasContainerRef}
                    className="absolute inset-0 bg-transparent"
                    style={{ zIndex: 1 }}
                />

                {/* Loading Indicator */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="text-white text-center">
                        <div className="mb-4 text-xl">載入中...</div>
                        <div className="w-[200px] h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-300"
                                style={{ width: `${loadingProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Reports Title */}
                {showReportsTitle && currentProject && (
                    <div className="absolute w-full px-2 bottom-12 left-1/2 -translate-x-1/2 text-center z-10">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                            {currentProject.title}
                        </h2>
                        <h3 className="text-xl sm:text-2xl">
                            {currentProject.subtitle}
                        </h3>
                    </div>
                )}

                {/* Innovation Title */}
                {currentInnovationProject && (
                    <div className="absolute bottom-[25%] bg-white px-8 py-4 bg-opacity-50 backdrop-blur-md border border-black rounded-lg left-1/2 transform -translate-x-1/2 z-30 text-white p-6">
                        <div>
                            <h3 className="text-4xl text-center font-bold mb-2">{currentInnovationProject.title}</h3>
                            {currentInnovationProject.subtitle && (
                                <p className="text-2xl text-center text-gray-800">{currentInnovationProject.subtitle}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Innovation Section Title - 根據滾動位置顯示 */}
            {showInnovationTitle && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="transform transition-all duration-700 ease-out">
                        <SectionOpenTitle
                            englishTitle={"Innovation"}
                            chinestTitle={"多元創新"}
                            text={"報導者，不只有報導，以非營利模式實踐媒體新路"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Combined3DScene; 