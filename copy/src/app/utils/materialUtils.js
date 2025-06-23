import * as THREE from "three";

/**
 * 根據配置對象應用材質屬性到3D模型
 * @param {THREE.Object3D} model - 3D模型對象
 * @param {Object} materialConfig - 材質配置對象
 */
export const applyMaterialConfig = (model, materialConfig) => {
  if (!materialConfig) return;

  // 檢查是否是直接材質映射（按名稱或索引）
  const hasDirectMapping = Object.keys(materialConfig).some(key => 
    key.startsWith('material_') || 
    typeof materialConfig[key] === 'object' && materialConfig[key].color !== undefined ||
    typeof materialConfig[key] === 'object' && materialConfig[key].emissive !== undefined
  );

  if (hasDirectMapping) {
    applyDirectMaterialMapping(model, materialConfig);
    return;
  }

  // 如果有分部材質配置，使用新的分部設置函數
  if (materialConfig.parts) {
    applyPartialMaterialConfig(model, materialConfig);
    return;
  }

  // 原有的全局材質設置
  model.traverse((child) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach(material => {
        applyMaterialProperties(material, materialConfig);
      });
    }
  });
};

/**
 * 應用直接材質映射（按材質名稱或索引）
 * @param {THREE.Object3D} model - 3D模型對象
 * @param {Object} materialConfig - 材質配置對象
 */
export const applyDirectMaterialMapping = (model, materialConfig) => {
  model.traverse((child) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach((material, materialIndex) => {
        // 檢查每個可能的配置鍵
        for (const [configKey, config] of Object.entries(materialConfig)) {
          if (shouldApplyToMaterial(child, material, materialIndex, configKey)) {
            applyMaterialProperties(material, config);
            break; // 找到匹配就停止
          }
        }
      });
    }
  });
};

/**
 * 應用分部材質配置到3D模型的不同部分
 * @param {THREE.Object3D} model - 3D模型對象
 * @param {Object} materialConfig - 材質配置對象
 */
export const applyPartialMaterialConfig = (model, materialConfig) => {
  const { parts, global } = materialConfig;

  model.traverse((child) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach((material, materialIndex) => {
        let configToApply = global || {}; // 預設使用全局設置
        
        // 檢查是否有針對特定部分的配置
        for (const [partKey, partConfig] of Object.entries(parts)) {
          if (shouldApplyToMaterial(child, material, materialIndex, partKey)) {
            configToApply = { ...configToApply, ...partConfig };
            break;
          }
        }
        
        applyMaterialProperties(material, configToApply);
      });
    }
  });
};

/**
 * 判斷是否應該將配置應用到特定材質
 * @param {THREE.Mesh} mesh - 網格對象
 * @param {THREE.Material} material - 材質對象
 * @param {number} materialIndex - 材質索引
 * @param {string} partKey - 部分識別鍵
 */
const shouldApplyToMaterial = (mesh, material, materialIndex, partKey) => {
  // 1. 按材質名稱匹配
  if (material.name && material.name.includes(partKey)) {
    return true;
  }
  
  // 2. 按mesh名稱匹配
  if (mesh.name && mesh.name.includes(partKey)) {
    return true;
  }
  
  // 3. 按材質索引匹配 (例如: "material_0", "material_1")
  if (partKey === `material_${materialIndex}`) {
    return true;
  }
  
  // 4. 按特殊標識匹配 (例如: "body", "wheels", "glass")
  const commonParts = {
    'body': ['body', 'chassis', 'main'],
    'glass': ['glass', 'window', 'transparent'],
    'metal': ['metal', 'chrome', 'steel'],
    'wheel': ['wheel', 'tire', 'rim'],
    'light': ['light', 'lamp', 'led']
  };
  
  if (commonParts[partKey]) {
    const keywords = commonParts[partKey];
    const nameToCheck = (material.name || mesh.name || '').toLowerCase();
    return keywords.some(keyword => nameToCheck.includes(keyword));
  }
  
  return false;
};

/**
 * 應用材質屬性的輔助函數
 * @param {THREE.Material} material - 材質對象
 * @param {Object} config - 配置對象
 */
const applyMaterialProperties = (material, config) => {
  // 應用顏色
  if (config.color) {
    material.color = new THREE.Color(config.color);
  }
  
  // 應用發光效果
  if (config.emissive) {
    material.emissive = new THREE.Color(config.emissive);
  }
  
  // 應用紋理
  if (config.texture) {
    applyTexture(material, config.texture);
  }
  
  // 應用數值屬性
  ['emissiveIntensity', 'metalness', 'roughness', 'opacity'].forEach(prop => {
    if (config[prop] !== undefined) {
      material[prop] = config[prop];
    }
  });
  
  // 應用透明度設置
  if (config.transparent !== undefined) {
    material.transparent = config.transparent;
  }
  
  // 標記材質需要更新
  material.needsUpdate = true;
};

/**
 * 應用紋理到材質
 * @param {THREE.Material} material - 材質對象
 * @param {Object} textureConfig - 紋理配置
 */
const applyTexture = (material, textureConfig) => {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(textureConfig.url);
  
  // 設置紋理重複和包裝
  if (textureConfig.repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(textureConfig.repeat.x || 1, textureConfig.repeat.y || 1);
  }
  
  // 設置紋理到不同的材質屬性
  if (textureConfig.mapType === 'normal') {
    material.normalMap = texture;
    if (textureConfig.scale) {
      material.normalScale = new THREE.Vector2(textureConfig.scale, textureConfig.scale);
    }
  } else if (textureConfig.mapType === 'roughness') {
    material.roughnessMap = texture;
  } else if (textureConfig.mapType === 'displacement') {
    material.displacementMap = texture;
    if (textureConfig.scale) {
      material.displacementScale = textureConfig.scale;
    }
  } else {
    // 預設為diffuse/color map
    material.map = texture;
  }
};

/**
 * 調試函數：檢查模型結構和材質名稱
 * @param {THREE.Object3D} model - 3D模型對象
 * @param {string} modelId - 模型ID
 */
export const debugModelStructure = (model, modelId) => {
  console.groupCollapsed(`Model Debug Info: ${modelId}`);
  model.traverse((child) => {
    if (child.isMesh) {
      console.log(`Mesh: "${child.name}"`);
      if (Array.isArray(child.material)) {
        child.material.forEach((mat, i) => {
          console.log(`Material ${i}: "${mat.name}"`);
        });
      } else {
        console.log(`Material: "${child.material.name}"`);
      }
    }
  });
  console.groupEnd();
};

/**
 * 預設材質配置
 */
export const defaultMaterialConfigs = {
  // 直接材質映射配置範例
  'innovation-1': {
    'Metal': {
      color: '#FFF',
      metalness: 0.3,
      roughness: 0.5,
      texture: {
        url: '/assets/3DModel/T_Noise_Normal_256.webp',
        mapType: 'normal',
        scale: 0.5,
        repeat: { x: 2, y: 2 }
      }
    },
    'Plastic': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8,
      texture: {
        url: '/assets/3DModel/T_Noise_Normal_256.webp',
        mapType: 'normal',
        scale: 0.7,
        repeat: { x: 1, y: 1 }
      }
    },
    'MicHead': {
      color: '#F1F1F1',
      texture: {
        url: '/assets/3DModel/T_Noise_Normal_256.webp',
        mapType: 'normal',
        scale: 0.5,              // 法線強度或位移強度
        repeat: { x: 10, y: 10 } // 紋理重複次數
      }
    }
  },
  'podcast-2': {
    'Metal': {
      color: '#FFF',
      metalness: 0.3,
      roughness: 0.5,
      texture: {
        url: '/assets/3DModel/T_Noise_Normal_256.webp',
        mapType: 'normal',
        scale: 0.5,
        repeat: { x: 2, y: 2 }
      }
    },
    'Plastic': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8,
      texture: {
        url: '/assets/3DModel/T_Noise_Normal_256.webp',
        mapType: 'normal',
        scale: 0.7,
        repeat: { x: 1, y: 1 }
      }
    },
    'Cloth-Noise': {
      color: '#F1F1F1',
      texture: {
        url: '/assets/3DModel/T_Noise_Normal_256.webp',
        mapType: 'normal',
        scale: 0.5,              // 法線強度或位移強度
        repeat: { x: 10, y: 10 } // 紋理重複次數
      }
    }
  }
}; 