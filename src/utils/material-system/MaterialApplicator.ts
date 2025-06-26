import * as THREE from 'three';
import { TextureManager } from './TextureManager';
import { MaterialMatcher } from './MaterialMatcher';
import type { 
  MaterialConfig, 
  MaterialProperties, 
  PartialMaterialConfig,
  MaterialApplicationContext 
} from './types';

/**
 * 材質應用系統
 * 
 * 負責將材質配置應用到 3D 模型上
 */
export class MaterialApplicator {
  
  /**
   * 根據配置對象應用材質屬性到 3D 模型
   * 
   * 這是主要的公開 API，保持向後兼容
   */
  static applyMaterialConfig(model: THREE.Object3D, materialConfig: any): void {
    if (!materialConfig) return;

    // 檢查是否是直接材質映射（按名稱或索引）
    const hasDirectMapping = this.hasDirectMaterialMapping(materialConfig);

    if (hasDirectMapping) {
      this.applyDirectMaterialMapping(model, materialConfig);
      return;
    }

    // 如果有分部材質配置，使用分部設置函數
    if (materialConfig.parts) {
      this.applyPartialMaterialConfig(model, materialConfig);
      return;
    }

    // 原有的全局材質設置
    this.applyGlobalMaterialConfig(model, materialConfig);
  }
  
  /**
   * 檢查是否有直接材質映射
   */
  private static hasDirectMaterialMapping(materialConfig: any): boolean {
    return Object.keys(materialConfig).some(key => 
      key.startsWith('material_') || 
      (typeof materialConfig[key] === 'object' && 
       (materialConfig[key].color !== undefined || materialConfig[key].emissive !== undefined))
    );
  }
  
  /**
   * 應用直接材質映射（按材質名稱或索引）
   */
  private static applyDirectMaterialMapping(model: THREE.Object3D, materialConfig: MaterialConfig): void {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        
        materials.forEach((material, materialIndex) => {
          // 檢查每個可能的配置鍵
          for (const [configKey, config] of Object.entries(materialConfig)) {
            const matchResult = MaterialMatcher.shouldApplyToMaterial(
              child, material, materialIndex, configKey
            );
            
            if (matchResult.matched) {
              this.applyMaterialProperties(material, config as MaterialProperties);
              break; // 找到匹配就停止
            }
          }
        });
      }
    });
  }
  
  /**
   * 應用分部材質配置到 3D 模型的不同部分
   */
  private static applyPartialMaterialConfig(model: THREE.Object3D, materialConfig: PartialMaterialConfig): void {
    const { parts, global } = materialConfig;

    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        
        materials.forEach((material, materialIndex) => {
          let configToApply = global || {}; // 預設使用全局設置
          
          // 檢查是否有針對特定部分的配置
          for (const [partKey, partConfig] of Object.entries(parts)) {
            const matchResult = MaterialMatcher.shouldApplyToMaterial(
              child, material, materialIndex, partKey
            );
            
            if (matchResult.matched) {
              configToApply = { ...configToApply, ...(partConfig as MaterialProperties) };
              break;
            }
          }
          
          this.applyMaterialProperties(material, configToApply);
        });
      }
    });
  }
  
  /**
   * 應用全局材質配置
   */
  private static applyGlobalMaterialConfig(model: THREE.Object3D, materialConfig: MaterialProperties): void {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        
        materials.forEach(material => {
          this.applyMaterialProperties(material, materialConfig);
        });
      }
    });
  }
  
  /**
   * 應用材質屬性到單一材質
   */
  private static applyMaterialProperties(material: THREE.Material, config: MaterialProperties): void {
    const materialAny = material as any;
    
    // 應用顏色
    if (config.color) {
      materialAny.color = new THREE.Color(config.color);
    }
    
    // 應用發光效果
    if (config.emissive) {
      materialAny.emissive = new THREE.Color(config.emissive);
    }
    
    // 應用紋理
    if (config.texture) {
      TextureManager.applyTextureToMaterial(material, config.texture);
    }
    
    // 應用數值屬性
    const numericProperties = ['emissiveIntensity', 'metalness', 'roughness', 'opacity'];
    numericProperties.forEach(prop => {
      if (config[prop as keyof MaterialProperties] !== undefined) {
        materialAny[prop] = config[prop as keyof MaterialProperties];
      }
    });
    
    // 應用透明度設置
    if (config.transparent !== undefined) {
      material.transparent = config.transparent;
    }
    
    // 標記材質需要更新
    material.needsUpdate = true;
  }
  
  /**
   * 批次應用材質配置（效能優化版本）
   */
  static batchApplyMaterialConfigs(
    contexts: MaterialApplicationContext[]
  ): void {
    // 按材質類型分組以提升效能
    const materialGroups = new Map<string, MaterialApplicationContext[]>();
    
    contexts.forEach(context => {
      const key = context.material.type;
      if (!materialGroups.has(key)) {
        materialGroups.set(key, []);
      }
      materialGroups.get(key)!.push(context);
    });
    
    // 批次處理每個材質類型
    materialGroups.forEach(group => {
      group.forEach(context => {
        this.applyMaterialProperties(context.material, context.config);
      });
    });
  }
}

// 向後兼容的導出函數
export const applyMaterialConfig = MaterialApplicator.applyMaterialConfig.bind(MaterialApplicator); 