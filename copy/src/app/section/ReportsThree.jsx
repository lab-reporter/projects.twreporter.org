"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import projectsData from '../data/projects.json';
import { useUiContext } from '../context/UiContext';
import { getContentComponentByProjectId } from '../sidepanel-contents/contentMap';

const ReportsThree = ({ setSelectedProject, setSidePanelContent }) => {
    // 燈光配置 - 可以調整這些數值來改變聚光燈效果
    const LIGHT_CONFIG = {
        spotLightIntensity: 10,         // 聚光燈強度，稍微提高以補償更大範圍
        spotLightAngle: Math.PI * 0.4, // 擴大角度以覆蓋中央+兩側照片 (從0.15增加到0.4)
        penumbra: 0.1,                 // 稍微增加邊緣軟化
        ambientIntensity: 0.1,       // 大幅降低環境光，讓周圍更暗 (從0.05降到0.005)
        followStrength: 0.2,           // 稍微減少跟隨強度，讓光圈更穩定
    };

    const canvasContainerRef = useRef(null);
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    // Three.js 核心對象
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const galleryGroupRef = useRef(null);
    const blocksRef = useRef([]);
    const clickableObjectsRef = useRef([]);
    const animationFrameRef = useRef(null);
    const currentProjectIndexRef = useRef(0); // 追蹤當前項目索引
    const isAnimatingRef = useRef(false); // 追蹤動畫狀態

    // 狀態管理
    const { setIsSidePanelOpen } = useUiContext();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    // 項目數據：根據 section 屬性篩選出 reports 相關項目
    const reportsProjects = useMemo(() => {
        return projectsData.filter(p =>
            p.section && (p.section.includes('reports') || p.section === 'reports')
        );
    }, []);

    // 響應式參數計算
    const cylinderRadius = useMemo(() => {
        if (windowWidth >= 1200) return 8;
        if (windowWidth >= 768) return 6;
        return 4;
    }, [windowWidth]);

    // 魚眼效果視野角度
    const fisheyeFOV = 120;

    // 移除背景色函數引用

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

    // 用於控制側邊欄的狀態和互動效果
    const handleProjectClick = useCallback((project) => {
        if (!setSelectedProject) return;

        setSelectedProject(project);

        // 獲取對應的內容組件
        const ContentComponent = getContentComponentByProjectId(project.id);

        // 設置側邊欄內容組件
        if (setSidePanelContent && typeof setSidePanelContent === 'function') {
            setSidePanelContent({
                ContentComponent,
                contentProps: { projectData: project }
            });
        }

        // 打開側邊欄
        setIsSidePanelOpen(true);
    }, [setSelectedProject, setSidePanelContent, setIsSidePanelOpen]);

    // 創建彎曲平面幾何體
    const createCurvedPlane = useCallback((width, height, radius, segments) => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        const uvs = [];

        const segmentsX = segments * 6;
        const segmentsY = Math.floor(height * 15);
        const theta = width / radius * 1.2;

        // 生成所有頂點
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

        // 生成三角形索引
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

    // 載入圖片/影片紋理
    const loadMediaTexture = useCallback((mediaPath) => {
        return new Promise((resolve) => {
            // 檢查檔案格式
            const fileExtension = mediaPath.split('.').pop().toLowerCase();
            const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];
            const isVideo = videoFormats.includes(fileExtension);

            if (isVideo) {
                // 處理影片格式
                const video = document.createElement('video');

                // 設置影片屬性
                video.crossOrigin = 'anonymous';
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.preload = 'metadata';

                // 創建影片紋理
                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.generateMipmaps = false;
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBAFormat;
                videoTexture.colorSpace = THREE.SRGBColorSpace;

                if (rendererRef.current) {
                    videoTexture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
                }

                // 監聽影片載入事件
                const onCanPlayThrough = () => {
                    // 嘗試播放影片
                    video.play().catch(() => {
                        // 影片自動播放可能失敗，但紋理已建立
                    });
                    videoTexture.needsUpdate = true;
                    resolve(videoTexture);
                };

                const onLoadedData = () => {
                    // 如果 canplaythrough 事件沒有觸發，這裡也可以 resolve
                    if (video.readyState >= 3) { // HAVE_FUTURE_DATA
                        videoTexture.needsUpdate = true;
                        resolve(videoTexture);
                    }
                };

                const onError = (error) => {
                    // 影片載入失敗時返回 null
                    resolve(null);
                };

                const onLoadStart = () => {
                    // 影片開始載入
                };

                // 綁定事件監聽器
                video.addEventListener('loadstart', onLoadStart, { once: true });
                video.addEventListener('loadeddata', onLoadedData, { once: true });
                video.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
                video.addEventListener('error', onError, { once: true });

                // 處理路徑編碼 - 確保中文字符正確編碼
                try {
                    // 如果路徑已經編碼就直接使用，否則進行編碼
                    const encodedPath = mediaPath.includes('%') ? mediaPath : encodeURI(mediaPath);
                    video.src = encodedPath;
                    video.load();
                } catch (encodingError) {
                    video.src = mediaPath; // 回退到原始路徑
                    video.load();
                }

                // 設置超時處理
                setTimeout(() => {
                    if (!videoTexture.image || videoTexture.image.readyState < 2) {
                        resolve(null);
                    }
                }, 15000); // 增加到15秒超時

            } else {
                // 處理圖片格式
                const textureLoader = new THREE.TextureLoader();

                // 同樣處理圖片路徑編碼
                let imagePath = mediaPath;
                try {
                    imagePath = mediaPath.includes('%') ? mediaPath : encodeURI(mediaPath);
                } catch (encodingError) {
                    // 編碼失敗時使用原始路徑
                }

                const texture = textureLoader.load(
                    imagePath,
                    (loadedTexture) => {
                        loadedTexture.generateMipmaps = true;
                        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
                        loadedTexture.magFilter = THREE.LinearFilter;
                        loadedTexture.colorSpace = THREE.SRGBColorSpace;
                        if (rendererRef.current) {
                            loadedTexture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
                        }

                        resolve(loadedTexture);
                    },
                    undefined,
                    (error) => {

                        resolve(null);
                    }
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

    // 創建單個圖片方塊
    const createBlock = useCallback(async (project, index) => {
        const imageSize = calculateImageSize();
        const blockGeometry = createCurvedPlane(imageSize.width, imageSize.height, cylinderRadius, 15);

        // 載入項目媒體
        let texture = await loadMediaTexture(project.path);

        // 如果主要媒體載入失敗，嘗試創建一個佔位紋理
        if (!texture) {


            // 創建一個簡單的佔位紋理
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const context = canvas.getContext('2d');

            // 繪製佔位內容
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

        // 創建容器群組
        const blockContainer = new THREE.Group();
        const sectionAngle = (Math.PI * 2) / reportsProjects.length;
        const finalAngle = sectionAngle * index;

        blockContainer.rotation.y = finalAngle;
        blockContainer.add(block);

        // 存儲項目資料到容器上，方便點擊檢測時使用
        blockContainer.userData = { project, index };

        return blockContainer;
    }, [calculateImageSize, createCurvedPlane, cylinderRadius, loadMediaTexture, reportsProjects.length]);

    // 計算相機距離
    const calculateCameraDistance = useCallback(() => {
        const targetWidthRatio = 0.9;
        const fov = fisheyeFOV * (Math.PI / 180);
        const cylinderDiameter = cylinderRadius * 2;
        const requiredDistance = cylinderDiameter / (2 * Math.tan(fov / 2) * targetWidthRatio);
        const safetyMargin = cylinderRadius * 0.15;
        return Math.max(requiredDistance, cylinderRadius + safetyMargin);
    }, [cylinderRadius]);

    // 清理資源
    const cleanup = useCallback(() => {
        // 清理動畫循環
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // 清理 Three.js 資源
        if (sceneRef.current) {
            // 清理所有方塊的幾何體和材質
            blocksRef.current.forEach(block => {
                if (block.children[0]) {
                    const mesh = block.children[0];
                    if (mesh.geometry) mesh.geometry.dispose();
                    if (mesh.material) {
                        if (mesh.material.map) {
                            // 如果是影片紋理，需要停止影片播放
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

            // 清理場景
            while (sceneRef.current.children.length > 0) {
                sceneRef.current.remove(sceneRef.current.children[0]);
            }
        }

        // 清理渲染器
        if (rendererRef.current) {
            rendererRef.current.dispose();
            if (canvasContainerRef.current && rendererRef.current.domElement) {
                canvasContainerRef.current.removeChild(rendererRef.current.domElement);
            }
        }

        // 重置 refs
        sceneRef.current = null;
        cameraRef.current = null;
        rendererRef.current = null;
        galleryGroupRef.current = null;
        blocksRef.current = [];
        clickableObjectsRef.current = [];
    }, []);

    // 初始化 Three.js 場景
    const initThreeJS = useCallback(async () => {
        if (!canvasContainerRef.current) return;

        // 清理舊的場景
        cleanup();

        // 創建場景
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // 創建相機（魚眼效果）
        const camera = new THREE.PerspectiveCamera(
            fisheyeFOV,
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
        renderer.setClearColor(0x000000, 0); // 改為透明背景，讓 3D 背景牆顯示

        // 設置色彩管理 - 確保正確的色彩顯示
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.toneMappingExposure = 1.0;

        rendererRef.current = renderer;

        canvasContainerRef.current.appendChild(renderer.domElement);

        // 創建畫廊群組
        const galleryGroup = new THREE.Group();
        scene.add(galleryGroup);
        galleryGroupRef.current = galleryGroup;

        // 設置燈光 - 聚光燈效果
        const spotLight = new THREE.SpotLight(0xffffff, LIGHT_CONFIG.spotLightIntensity);

        // 設置聚光燈位置（從相機位置照射）
        const optimalDistance = calculateCameraDistance();
        spotLight.position.set(0, 0, optimalDistance);

        // 設置聚光燈目標（照向場景中央）
        spotLight.target.position.set(0, 0, 0);
        scene.add(spotLight.target);

        // 調整聚光燈參數
        spotLight.angle = LIGHT_CONFIG.spotLightAngle;
        spotLight.penumbra = LIGHT_CONFIG.penumbra;
        spotLight.distance = optimalDistance * 2;
        spotLight.decay = 1;

        scene.add(spotLight);

        // 添加少量環境光避免完全黑暗
        const dimAmbientLight = new THREE.AmbientLight(0xffffff, LIGHT_CONFIG.ambientIntensity);
        scene.add(dimAmbientLight);

        // 設置相機位置
        camera.position.z = optimalDistance;
        camera.position.y = 0;

        // 創建圖片方塊
        const blocks = [];
        const clickableObjects = [];

        for (let i = 0; i < reportsProjects.length; i++) {
            const project = reportsProjects[i];
            const blockContainer = await createBlock(project, i);

            if (blockContainer) {
                blocks.push(blockContainer);
                galleryGroup.add(blockContainer);
                clickableObjects.push(blockContainer.children[0]);
            }
        }

        blocksRef.current = blocks;
        clickableObjectsRef.current = clickableObjects;

        // 點擊檢測
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        const onMouseClick = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(clickableObjects, false);

            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                const blockContainer = clickedObject.parent;
                const projectData = blockContainer.userData.project;

                // 檢查是否為影片，提供播放控制
                if (clickedObject.material && clickedObject.material.map) {
                    const texture = clickedObject.material.map;
                    if (texture.image && texture.image.tagName === 'VIDEO') {
                        const video = texture.image;
                        if (video.paused) {
                            video.play().catch(() => {
                                // 影片播放失敗
                            });
                        } else {
                            video.pause();

                        }
                        // 暫停一下再開啟側邊欄，讓使用者知道點擊生效了
                        setTimeout(() => {
                            if (projectData) {
                                handleProjectClick(projectData);
                            }
                        }, 200);
                    } else {
                        // 圖片直接開啟側邊欄
                        if (projectData) {
                            handleProjectClick(projectData);
                        }
                    }
                } else {
                    // 沒有材質的情況下直接開啟側邊欄
                    if (projectData) {
                        handleProjectClick(projectData);
                    }
                }
            }
        };

        renderer.domElement.addEventListener('click', onMouseClick);

        // ===== 滑鼠 hover 偵測及 cursor 設定 =====
        /**
         * 滑鼠移動時偵測是否 hover 到 mesh，並根據結果設定 cursor 樣式
         */
        const onMouseMove = (event) => {
            // 取得 renderer 畫布的 bounding rect
            const rect = renderer.domElement.getBoundingClientRect();
            // 計算 normalized device coordinates (NDC)
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // 使用 raycaster 檢測是否有 intersect
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(clickableObjects, false);

            // 如果有 intersect（hover 到圖片 mesh），則顯示 pointer，否則恢復 default
            if (canvasContainerRef.current) {
                if (intersects.length > 0) {
                    // 滑鼠移到可點擊 mesh 上，顯示 pointer
                    canvasContainerRef.current.style.cursor = 'pointer';
                } else {
                    // 沒有 hover 到 mesh，恢復 default
                    canvasContainerRef.current.style.cursor = 'default';
                }
            }
        };
        // ===== 滑鼠 hover 偵測及 cursor 設定結束 =====

        // 綁定 mousemove 事件
        renderer.domElement.addEventListener('mousemove', onMouseMove);

        // 動畫循環
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            // 更新影片紋理
            blocksRef.current.forEach(block => {
                if (block.children[0] && block.children[0].material && block.children[0].material.map) {
                    const texture = block.children[0].material.map;
                    if (texture.image && texture.image.tagName === 'VIDEO') {
                        texture.needsUpdate = true;
                    }
                }
            });

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

            // 重新計算相機距離並更新聚光燈位置
            const newOptimalDistance = calculateCameraDistance();
            camera.position.z = newOptimalDistance;

            // 更新聚光燈位置以匹配相機
            const spotLight = scene.children.find(child => child.type === 'SpotLight');
            if (spotLight) {
                spotLight.position.set(0, 0, newOptimalDistance);
                spotLight.distance = newOptimalDistance * 2;
            }
        };

        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.domElement.removeEventListener('click', onMouseClick);
            // 清理 mousemove 事件
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
        };
    }, [calculateCameraDistance, createBlock, handleProjectClick, reportsProjects, cleanup]);

    // 更新幻燈片索引和聚光燈位置
    const updateSlideAndLighting = useCallback((fraction) => {
        if (reportsProjects.length === 0) return;

        const imageIndex = Math.floor(fraction * (reportsProjects.length - 1));
        const clampedIndex = Math.max(0, Math.min(imageIndex, reportsProjects.length - 1));

        // 更新當前幻燈片索引（這會觸發 JSX 重新渲染標題）
        setCurrentSlide(clampedIndex);

        // 輕微調整聚光燈目標位置，讓光圈稍微跟隨當前圖片
        if (sceneRef.current) {
            const spotLight = sceneRef.current.children.find(child => child.type === 'SpotLight');
            if (spotLight && galleryGroupRef.current) {
                // 計算當前圖片的大致位置
                const totalProjects = reportsProjects.length;
                const sectionAngle = (Math.PI * 2) / totalProjects;
                const currentAngle = sectionAngle * clampedIndex;
                const radius = cylinderRadius;

                // 讓聚光燈目標輕微偏移到當前圖片方向
                const offsetStrength = LIGHT_CONFIG.followStrength;
                const targetX = Math.sin(currentAngle) * radius * offsetStrength;
                const targetZ = (Math.cos(currentAngle) - 1) * radius * offsetStrength;

                spotLight.target.position.set(targetX, 0, targetZ);
            }
        }
    }, [reportsProjects, cylinderRadius]);

    // 主要初始化 useEffect
    useEffect(() => {
        if (typeof window === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        let cleanupThreeJS = null;

        const initializeScene = async () => {
            cleanupThreeJS = await initThreeJS();

            // 設定滾動控制
            const section = sectionRef.current;
            const galleryGroup = galleryGroupRef.current;

            if (!section || !galleryGroup) return;

            // 入場動畫
            gsap.set(canvasContainerRef.current, {
                opacity: 0,
                scale: 0.8
            });

            const revealTrigger = ScrollTrigger.create({
                trigger: section,
                start: "top 50%",
                once: true,
                id: "reports-three-reveal-trigger",
                onEnter: () => {
                    gsap.to(canvasContainerRef.current, {
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: "power1.out"
                    });
                }
            });

            // 主要滾動控制
            const trigger = ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2,
                onUpdate: (self) => {
                    const totalProjects = reportsProjects.length;
                    if (totalProjects === 0) return;

                    // 設定緩衝區域
                    const startBuffer = 0.05;
                    const endBuffer = 0.05;
                    const activeRange = 1 - startBuffer - endBuffer;

                    let rotationFraction = 0;
                    if (self.progress >= startBuffer && self.progress <= (1 - endBuffer)) {
                        rotationFraction = (self.progress - startBuffer) / activeRange;
                    } else if (self.progress > (1 - endBuffer)) {
                        rotationFraction = 1;
                    }

                    // 計算當前應該顯示的項目索引
                    const currentImageIndex = Math.round(rotationFraction * (totalProjects - 1));
                    const clampedIndex = Math.max(0, Math.min(currentImageIndex, totalProjects - 1));

                    // 計算該項目對應的離散角度
                    const sectionAngle = (Math.PI * 2) / totalProjects;
                    const targetRotation = -sectionAngle * clampedIndex; // 負號讓旋轉方向符合直覺

                    // 使用GSAP平滑過渡到目標角度
                    gsap.to(galleryGroup.rotation, {
                        y: targetRotation,
                        duration: 0.5,
                        ease: "power2.out",
                        overwrite: true // 避免動畫衝突
                    });

                    // 更新幻燈片索引和聚光燈位置（使用離散索引）
                    updateSlideAndLighting(clampedIndex / (totalProjects - 1));
                },
                id: 'reports-three-trigger'
            });

            triggerRef.current = trigger;

            return () => {
                revealTrigger.kill();
                if (triggerRef.current) {
                    triggerRef.current.kill();
                }
            };
        };

        const setupCleanup = initializeScene();

        return () => {
            setupCleanup.then(cleanup => {
                if (cleanup) cleanup();
            });
            if (cleanupThreeJS) cleanupThreeJS();

            // 最終清理
            cleanup();
        };
    }, [initThreeJS, reportsProjects.length, updateSlideAndLighting, cleanup]);

    // 獲取當前項目
    const currentProject = reportsProjects[currentSlide] || null;

    return (
        <div ref={sectionRef} className="relative h-[600vh] overflow-visible" id="reports-three-section">
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                <div
                    ref={canvasContainerRef}
                    className="absolute inset-0 bg-transparent"
                    style={{ zIndex: 1 }}
                />

                {/* 動態標題區塊 */}
                <div className="absolute w-full px-2 bottom-12 left-1/2 -translate-x-1/2 text-center z-10">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                        {currentProject?.title || '綁債．黑工．留學陷阱'}
                    </h2>
                    <h3 className="text-xl sm:text-2xl">
                        {currentProject?.subtitle || '失控的高教技職國際招生'}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default ReportsThree; 