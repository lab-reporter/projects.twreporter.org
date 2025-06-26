import * as THREE from 'three';
import type { MaterialMatchStrategy, MaterialMatchResult } from './types';

/**
 * 材質匹配系統
 * 
 * 負責判斷材質配置是否應該應用到特定的材質上
 */
export class MaterialMatcher {
  
  /**
   * 常見材質部件關鍵字映射
   */
  private static readonly COMMON_PARTS: Record<string, string[]> = {
    'body': ['body', 'chassis', 'main'],
    'glass': ['glass', 'window', 'transparent'],
    'metal': ['metal', 'chrome', 'steel'],
    'wheel': ['wheel', 'tire', 'rim'],
    'light': ['light', 'lamp', 'led'],
    'plastic': ['plastic', 'polymer'],
    'fabric': ['fabric', 'cloth', 'textile']
  };
  
  /**
   * 判斷是否應該將配置應用到特定材質
   */
  static shouldApplyToMaterial(
    mesh: THREE.Mesh, 
    material: THREE.Material, 
    materialIndex: number, 
    partKey: string
  ): MaterialMatchResult {
    
    // 嘗試不同的匹配策略
    const strategies = [
      () => this.matchByMaterialName(material, partKey),
      () => this.matchByMeshName(mesh, partKey),
      () => this.matchByIndex(materialIndex, partKey),
      () => this.matchByKeyword(mesh, material, partKey)
    ];
    
    for (const strategy of strategies) {
      const result = strategy();
      if (result.matched) {
        return result;
      }
    }
    
    return { matched: false, strategy: 'name', confidence: 0 };
  }
  
  /**
   * 按材質名稱匹配
   */
  private static matchByMaterialName(material: THREE.Material, partKey: string): MaterialMatchResult {
    if (material.name && material.name.includes(partKey)) {
      return {
        matched: true,
        strategy: 'name',
        confidence: 0.9
      };
    }
    return { matched: false, strategy: 'name', confidence: 0 };
  }
  
  /**
   * 按 mesh 名稱匹配
   */
  private static matchByMeshName(mesh: THREE.Mesh, partKey: string): MaterialMatchResult {
    if (mesh.name && mesh.name.includes(partKey)) {
      return {
        matched: true,
        strategy: 'mesh',
        confidence: 0.8
      };
    }
    return { matched: false, strategy: 'mesh', confidence: 0 };
  }
  
  /**
   * 按材質索引匹配
   */
  private static matchByIndex(materialIndex: number, partKey: string): MaterialMatchResult {
    if (partKey === `material_${materialIndex}`) {
      return {
        matched: true,
        strategy: 'index',
        confidence: 1.0
      };
    }
    return { matched: false, strategy: 'index', confidence: 0 };
  }
  
  /**
   * 按關鍵字匹配
   */
  private static matchByKeyword(
    mesh: THREE.Mesh, 
    material: THREE.Material, 
    partKey: string
  ): MaterialMatchResult {
    const keywords = this.COMMON_PARTS[partKey.toLowerCase()];
    if (!keywords) {
      return { matched: false, strategy: 'keyword', confidence: 0 };
    }
    
    const nameToCheck = (material.name || mesh.name || '').toLowerCase();
    const matchedKeyword = keywords.find(keyword => nameToCheck.includes(keyword));
    
    if (matchedKeyword) {
      return {
        matched: true,
        strategy: 'keyword',
        confidence: 0.7
      };
    }
    
    return { matched: false, strategy: 'keyword', confidence: 0 };
  }
  
  /**
   * 新增自定義關鍵字映射
   */
  static addCustomKeywords(partKey: string, keywords: string[]): void {
    this.COMMON_PARTS[partKey.toLowerCase()] = keywords;
  }
  
  /**
   * 獲取所有支援的關鍵字
   */
  static getSupportedKeywords(): Record<string, string[]> {
    return { ...this.COMMON_PARTS };
  }
} 