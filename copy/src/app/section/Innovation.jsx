"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import projectsData from '../data/projects.json';
import { useRouter } from 'next/navigation';
import { useUiContext } from '../context/UiContext';
import { getContentComponentByProjectId } from '../sidepanel-contents/contentMap';
import { applyMaterialConfig, defaultMaterialConfigs, debugModelStructure } from '../utils/materialUtils';
import SectionOpenTitle from "../components/SectionOpenTitle";

const Innovation = ({ setSelectedProject, setSidePanelContent }) => {
  const orbRef = useRef(null);
  const sectionRef = useRef(null); // 新增容器參考
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();



  // 新增狀態來追蹤是否在 Innovation 區域內
  const [isInInnovationSection, setIsInInnovationSection] = useState(false);

  // 新增狀態來追蹤當前在鏡頭前的物件
  const [currentFrontObject, setCurrentFrontObject] = useState(null);

  // 使用全局 UI 上下文
  const { setIsSidePanelOpen } = useUiContext();

  // 使用useRef存储需要在组件不同函数间共享的变量
  const stateRef = useRef({
    controls: null,
    camera: null,
    modelMeshes: [], // 改名為 modelMeshes 以更精確
    isSceneReady: false,
    loadedItems: 0,
    totalItems: 0,
    originalScales: {}, // 新增一個物件來保存每個模型的原始比例
    scrollTrigger: null, // 新增 ScrollTrigger 參考
    lastMousePosition: { x: 0, y: 0 }, // 儲存最後的滑鼠位置
    sectionTrigger: null, // 新增 sectionTrigger 參考
    animationMixers: [], // 新增動畫混合器陣列
    clock: new THREE.Clock() // 新增時鐘用於動畫更新
  });

  // 创建射线检测器和鼠标位置变量，使其在所有函数中可用
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // 创建一个单一的点击事件处理函数
  const handleClick = (event) => {
    const renderer = stateRef.current.renderer;
    if (!renderer) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const { camera } = stateRef.current;

    // 确保相机引用存在
    if (!camera) return;

    raycaster.setFromCamera(mouse, camera);

    // 檢測與所有3D模型的交集
    const intersects = raycaster.intersectObjects(stateRef.current.modelMeshes, true);

    if (intersects.length > 0) {
      // 找到被點擊物件的頂層父物件
      let clickedObject = intersects[0].object;
      // 遍歷父層直到找到帶有projectId的物件
      while (clickedObject && !clickedObject.userData.projectId) {
        clickedObject = clickedObject.parent;
      }

      // 如果找到有效物件
      if (clickedObject && clickedObject.userData.projectId) {
        const projectId = clickedObject.userData.projectId;
        const projectData = projectsData.find(p => p.id === projectId);

        if (projectData) {
          // 設置選中的項目數據
          setSelectedProject(projectData);

          // 獲取對應的內容組件
          const ContentComponent = getContentComponentByProjectId(projectId);

          // 設置側邊欄內容組件，如果有定義的話
          if (setSidePanelContent && typeof setSidePanelContent === 'function') {
            setSidePanelContent({
              ContentComponent,
              contentProps: { projectData }
            });
          }

          // 打開側邊欄
          setIsSidePanelOpen(true);
        }
      }
    }
  };







  useEffect(() => {
    if (!orbRef.current) return;

    // 註冊 GSAP ScrollTrigger 插件
    gsap.registerPlugin(ScrollTrigger);



    // 1. 創建場景
    const scene = new THREE.Scene();
    // 1.5 加一盞環境光，前面是光線色票，後面是光線強度
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // 增加環境光強度
    scene.add(ambientLight);

    // 加入方向光來確保模型被正確照亮
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10); // 調整光源位置以獲得更好的陰影效果
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024 / 2, 1024 / 2); // 提高陰影質量
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 30; // 增加遠平面距離
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15; // 添加遺失的bottom屬性
    directionalLight.shadow.bias = -0.0005; // 減少陰影粉刺現象
    scene.add(directionalLight);

    // const LightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // scene.add(LightCameraHelper)

    // 2. 創建相機
    const camera = new THREE.PerspectiveCamera(
      45, // 視野角度
      window.innerWidth / window.innerHeight, // 長寬比
      0.1, // 近平面
      10000 // 增加遠平面，因為模型很大
    );
    camera.position.set(0, 0, 40); // 調整到適合所有模型的距離
    camera.lookAt(0, 0, 0); // 確保相機看向場景中心

    // 保存相机引用
    stateRef.current.camera = camera;

    // 3. 創建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    const container = orbRef.current;
    const canvasWrapper = document.createElement('div');
    canvasWrapper.className = "w-full h-full absolute top-0 left-0 z-10 cursor-grab";
    container.appendChild(canvasWrapper);

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);

    // 使用 container 寬高更新相機投影比例，維持照片原始比例
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(window.devicePixelRatio);
    // LinearEncoding 在新版 Three.js 中已被移除，使用預設設定
    // renderer.outputEncoding = THREE.LinearEncoding;
    renderer.gammaFactor = 2.2;

    // 啟用陰影映射
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用軟陰影以獲得更好的效果

    canvasWrapper.appendChild(renderer.domElement);
    stateRef.current.renderer = renderer;

    // 4. 創建軌道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 啟用阻尼效果
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // 禁用滑鼠滾輪縮放功能
    controls.enabled = false; // 關閉控制器

    // 保存控制器引用
    stateRef.current.controls = controls;

    // 5. 創建一個陣列來存儲所有3D模型
    let modelMeshes = [];
    stateRef.current.modelMeshes = modelMeshes;

    // 從JSON文件導入3D模型位置數據
    // 篩選具有 innovation section 的項目
    const modelPositions = projectsData.filter(p =>
      p.section && (p.section.includes('innovation') || p.section === 'innovation')
    );

    // 設定要載入的總項目數
    stateRef.current.totalItems = modelPositions.length;
    setIsLoading(true);

    // 創建所有3D模型
    let loadedModels = 0;
    const totalModels = modelPositions.length;

    const checkSceneReady = () => {
      loadedModels++;
      stateRef.current.loadedItems = loadedModels;

      if (loadedModels === totalModels) {
        stateRef.current.isSceneReady = true;
        setIsSceneReady(true);
        setIsLoading(false);

        // 所有模型載入完成後，設置滾動觸發器
        if (sectionRef.current) {
          // 獲取所有 innovation 項目並按 id 排序
          const innovationItems = modelPositions.sort((a, b) => {
            const numA = parseInt(a.id.split('-')[1]);
            const numB = parseInt(b.id.split('-')[1]);
            return numA - numB;
          });



          // 創建滾動觸發器，控制3D物件依序移動到鏡頭前
          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1, // 平滑過渡
            onUpdate: (self) => {
              const progress = self.progress; // 0 到 1
              const totalItems = innovationItems.length;

              // 設定緩衝區：開始 15% 和結束 15% 為緩衝區
              const bufferStart = 0.1;
              const bufferEnd = 0.9;

              let currentIndex = -1; // -1 表示沒有物件在鏡頭前

              if (progress >= bufferStart && progress <= bufferEnd) {
                // 在有效區間內，計算當前應該顯示的物件索引
                const effectiveProgress = (progress - bufferStart) / (bufferEnd - bufferStart);
                currentIndex = Math.floor(effectiveProgress * totalItems);
                currentIndex = Math.min(currentIndex, totalItems - 1);
              }



              // 設置當前在鏡頭前的物件
              const currentItem = currentIndex >= 0 ? innovationItems[currentIndex] : null;
              setCurrentFrontObject(currentItem ? currentItem.id : null);

              // 遍歷所有3D模型
              stateRef.current.modelMeshes.forEach((model, index) => {
                if (!model.userData.projectId) return;

                // 找到對應的項目索引
                const itemIndex = innovationItems.findIndex(item => item.id === model.userData.projectId);

                if (itemIndex === -1) return;

                // 獲取原始位置
                const originalPos = model.userData.targetPosition;

                if (itemIndex === currentIndex) {
                  // 當前項目移動到鏡頭前 (0, 0, 20)
                  gsap.to(model.position, {
                    x: 0,
                    y: 0,
                    z: 20,
                    duration: 1,
                    ease: "power2.out",
                    overwrite: "auto"
                  });

                  // 稍微放大當前物件以增強聚焦效果
                  const originalScale = stateRef.current.originalScales[model.userData.projectId];
                  if (originalScale) {
                    gsap.to(model.scale, {
                      x: originalScale.x * 1.2,
                      y: originalScale.y * 1.2,
                      z: originalScale.z * 1.2,
                      duration: 1,
                      ease: "power2.out",
                      overwrite: "auto"
                    });
                  }


                } else {
                  // 其他項目回到原位
                  gsap.to(model.position, {
                    x: originalPos.x,
                    y: originalPos.y,
                    z: originalPos.z,
                    duration: 1,
                    ease: "power2.out",
                    overwrite: "auto"
                  });

                  // 恢復原始比例
                  const originalScale = stateRef.current.originalScales[model.userData.projectId];
                  if (originalScale) {
                    gsap.to(model.scale, {
                      x: originalScale.x,
                      y: originalScale.y,
                      z: originalScale.z,
                      duration: 1,
                      ease: "power2.out",
                      overwrite: "auto"
                    });
                  }
                }
              });
            },
            id: 'innovation-sequence-trigger'
          });

          // 儲存觸發器供清理使用
          stateRef.current.scrollTrigger = trigger;

          // 創建另一個 ScrollTrigger 來檢測是否在 Innovation 區域內
          const sectionTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom', // 當區域頂部到達視窗底部時開始
            end: 'bottom top', // 當區域底部到達視窗頂部時結束
            onEnter: () => {
              setIsInInnovationSection(true);
            },
            onLeave: () => {
              setIsInInnovationSection(false);
            },
            onEnterBack: () => {
              setIsInInnovationSection(true);
            },
            onLeaveBack: () => {
              setIsInInnovationSection(false);
            },
            id: 'innovation-section-detector'
          });

          // 儲存第二個觸發器供清理使用
          stateRef.current.sectionTrigger = sectionTrigger;
        }
      }
    };

    // 添加单一点击事件监听器
    renderer.domElement.addEventListener('click', handleClick);

    // 修改 mousemove 事件處理
    renderer.domElement.addEventListener('mousemove', (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      // 檢測與所有3D模型的交集
      const intersects = raycaster.intersectObjects(modelMeshes, true);

      // 將滑鼠改為手型當懸停在3D模型上方
      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    });

    const createModel = (modelData) => {
      // 創建DRACO載入器
      const dracoLoader = new DRACOLoader();
      // 設置DRACO解碼器路徑（使用CDN）
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

      const gltfLoader = new GLTFLoader();
      // 設置DRACO載入器給GLTF載入器
      gltfLoader.setDRACOLoader(dracoLoader);

      gltfLoader.load(
        modelData.path,
        (gltf) => {
          const model = gltf.scene;

          // 處理動畫（如果有的話）
          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);

            // 播放所有動畫
            gltf.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              action.loop = THREE.LoopRepeat; // 設定為循環播放
              action.play(); // 開始播放
            });

            // 將 mixer 保存到 stateRef 中
            stateRef.current.animationMixers.push(mixer);


          }

          // 遞迴地設置所有子物件的renderOrder和材質屬性，以確保正確渲染
          model.traverse((child) => {
            if (child.isMesh) {
              // 提高渲染順序確保3D模型正確顯示
              child.renderOrder = 1;

              // 設置材質的透明度屬性
              if (child.material) {
                // 如果是陣列材質
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    mat.transparent = true;
                    mat.depthWrite = true;
                    mat.depthTest = true;
                    mat.needsUpdate = true;
                    // 確保材質可見
                    if (mat.opacity !== undefined) mat.opacity = 1;
                  });
                } else {
                  child.material.transparent = true;
                  child.material.depthWrite = true;
                  child.material.depthTest = true;
                  child.material.needsUpdate = true;
                  // 確保材質可見
                  if (child.material.opacity !== undefined) child.material.opacity = 1;
                }
              }

              // 確保物件可見
              child.visible = true;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          model.castShadow = true;
          model.receiveShadow = true;

          // 創建動畫混合器和播放動畫
          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);

            // 播放所有動畫
            gltf.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              action.play();
            });

            // 將混合器添加到陣列中
            stateRef.current.animationMixers.push(mixer);

            // 將混合器也存儲在模型的userData中，方便後續訪問
            model.userData.animationMixer = mixer;
          }

          // 設置模型比例
          if (modelData.scale) {
            model.scale.set(
              modelData.scale.x,
              modelData.scale.y,
              modelData.scale.z
            );

            // 保存原始比例
            stateRef.current.originalScales[modelData.id] = {
              x: modelData.scale.x,
              y: modelData.scale.y,
              z: modelData.scale.z
            };
          } else {
            model.scale.set(0.25, 0.25, 0.25); // 預設比例

            // 保存原始比例
            stateRef.current.originalScales[modelData.id] = {
              x: 0.25,
              y: 0.25,
              z: 0.25
            };
          }

          // 設置3D模型的旋轉
          if (modelData.rotation) {
            model.rotation.set(
              modelData.rotation.x,
              modelData.rotation.y,
              modelData.rotation.z
            );
          }

          // 保存原始目標位置
          model.userData.targetPosition = {
            x: modelData.position.x,
            y: modelData.position.y,
            z: modelData.position.z
          };

          // 保存項目ID
          model.userData.projectId = modelData.id;

          // 調試：檢查模型結構和材質名稱
          debugModelStructure(model, modelData.id);

          // 應用材質配置（優先使用JSON中的配置，其次使用預設配置）
          const materialConfig = (modelData.material && Object.keys(modelData.material).length > 0)
            ? modelData.material
            : defaultMaterialConfigs[modelData.id];

          applyMaterialConfig(model, materialConfig);

          modelMeshes.push(model);
          scene.add(model);

          // 直接設置模型位置，取代動畫
          model.position.set(modelData.position.x, modelData.position.y, modelData.position.z);

          checkSceneReady();
        },
        undefined, // 移除進度回調
        (error) => {
          console.error('Error loading GLTF model:', modelData.id, modelData.path, error);
          checkSceneReady(); // 即使載入失敗也要調用，避免卡住

        }
      );
    };

    // 創建所有3D模型
    modelPositions.forEach(createModel);

    // 在創建場景後添加座標軸
    const axesHelper = new THREE.AxesHelper(10); // 參數是軸線長度
    scene.add(axesHelper);

    // 6. 修改動畫循環，只保留必要的更新
    const animate = () => {
      requestAnimationFrame(animate);

      // 更新控制器
      controls.update();


      // 獲取時間差來更新動畫混合器
      const delta = stateRef.current.clock.getDelta();

      // 更新所有動畫混合器
      stateRef.current.animationMixers.forEach(mixer => {
        mixer.update(delta);
      });

      const time = performance.now();

      // 移除hover浮動效果相關代碼

      renderer.render(scene, camera);
    };
    animate();

    // 7. 處理視窗大小變化
    const handleResize = () => {
      // 使用 container 寬高更新相機投影比例與 renderer 大小
      const container = orbRef.current;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    window.addEventListener('resize', handleResize);

    // 8. 清理函數
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);

      // 清理動畫混合器
      stateRef.current.animationMixers.forEach(mixer => {
        mixer.stopAllAction();
        mixer.uncacheRoot(mixer.getRoot());
      });
      stateRef.current.animationMixers = [];

      // 清理 ScrollTrigger
      if (stateRef.current.scrollTrigger) {
        stateRef.current.scrollTrigger.kill();
      }

      if (stateRef.current.sectionTrigger) {
        stateRef.current.sectionTrigger.kill();
      }

      if (orbRef.current) {
        const canvasWrapper = orbRef.current.querySelector('.cursor-grab');
        if (canvasWrapper) {
          orbRef.current.removeChild(canvasWrapper);
        }
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full h-[1000vh]">
      <div className="w-full h-[200vh] relative">
        <div className="w-full h-screen sticky top-0 flex items-center justify-center">
          <SectionOpenTitle
            englishTitle={"Innovation"}
            chinestTitle={"多元創新"}
            text={"報導者，不只有報導，以非營利模式實踐媒體新路"}
          />
        </div>
      </div>

      <div ref={orbRef} className="w-full h-screen sticky top-0">
        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="text-white text-center">
            <div className="mb-4 text-xl">載入中...</div>
            <div className="w-[200px] h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${(stateRef.current.loadedItems / stateRef.current.totalItems) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 當前在鏡頭前的物件資訊 */}
        {currentFrontObject && (
          <div className="absolute bottom-[25%] bg-white px-8 py-4 bg-opacity-50 backdrop-blur-md border border-black rounded-lg left-1/2 transform -translate-x-1/2 z-30 text-white p-6">
            {(() => {
              const currentProject = projectsData.find(p => p.id === currentFrontObject);
              return currentProject ? (
                <div>
                  <h3 className="text-4xl text-center font-bold mb-2">{currentProject.title}</h3>
                  {currentProject.subtitle && (
                    <p className="text-2xl text-center text-gray-800">{currentProject.subtitle}</p>
                  )}
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Innovation;
