import * as THREE from 'three';

/**
 * 材質調試系統
 * 
 * 提供材質和模型結構的調試功能
 */
export class MaterialDebugger {
  
  /**
   * 調試函數：檢查模型結構和材質名稱（僅在開發環境顯示）
   */
  static debugModelStructure(model: THREE.Object3D, modelId: string): void {
    // 完全禁用模型調試輸出（依據 Console.log 使用規範）
    return;
  }
  
  /**
   * 分析模型材質結構（開發工具）
   */
  static analyzeModelMaterials(model: THREE.Object3D): MaterialAnalysisResult {
    const materials: MaterialInfo[] = [];
    const meshes: MeshInfo[] = [];
    
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const meshInfo: MeshInfo = {
          name: child.name || 'Unnamed Mesh',
          materialCount: Array.isArray(child.material) ? child.material.length : 1,
          geometry: child.geometry.type,
          position: child.position.clone(),
          scale: child.scale.clone()
        };
        meshes.push(meshInfo);
        
        const meshMaterials = Array.isArray(child.material) ? child.material : [child.material];
        
        meshMaterials.forEach((material, index) => {
          const materialInfo: MaterialInfo = {
            name: material.name || `Material_${index}`,
            type: material.type,
            meshName: child.name || 'Unnamed Mesh',
            index,
            properties: this.extractMaterialProperties(material)
          };
          materials.push(materialInfo);
        });
      }
    });
    
    return {
      totalMeshes: meshes.length,
      totalMaterials: materials.length,
      meshes,
      materials,
      summary: this.generateAnalysisSummary(materials)
    };
  }
  
  /**
   * 提取材質屬性
   */
  private static extractMaterialProperties(material: THREE.Material): Record<string, any> {
    const props: Record<string, any> = {};
    const materialAny = material as any;
    
    // 常見屬性
    const commonProps = [
      'color', 'emissive', 'metalness', 'roughness', 
      'opacity', 'transparent', 'side', 'visible'
    ];
    
    commonProps.forEach(prop => {
      if (materialAny[prop] !== undefined) {
        if (materialAny[prop] instanceof THREE.Color) {
          props[prop] = `#${materialAny[prop].getHexString()}`;
        } else {
          props[prop] = materialAny[prop];
        }
      }
    });
    
    // 紋理資訊
    const textureProps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap'];
    textureProps.forEach(prop => {
      if (materialAny[prop]) {
        props[`${prop}_url`] = materialAny[prop].image?.src || 'Unknown';
      }
    });
    
    return props;
  }
  
  /**
   * 生成分析摘要
   */
  private static generateAnalysisSummary(materials: MaterialInfo[]): AnalysisSummary {
    const materialTypes = new Set(materials.map(m => m.type));
    const namedMaterials = materials.filter(m => m.name && !m.name.startsWith('Material_'));
    const unnamedMaterials = materials.filter(m => !m.name || m.name.startsWith('Material_'));
    
    return {
      uniqueTypes: Array.from(materialTypes),
      namedMaterialsCount: namedMaterials.length,
      unnamedMaterialsCount: unnamedMaterials.length,
      mostCommonType: this.getMostCommonType(materials),
      hasTextures: materials.some(m => 
        Object.keys(m.properties).some(key => key.endsWith('_url'))
      )
    };
  }
  
  /**
   * 獲取最常見的材質類型
   */
  private static getMostCommonType(materials: MaterialInfo[]): string {
    const typeCounts = materials.reduce((acc, material) => {
      acc[material.type] = (acc[material.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
  }
  
  /**
   * 生成材質配置建議
   */
  static generateConfigSuggestions(analysisResult: MaterialAnalysisResult): ConfigSuggestion[] {
    const suggestions: ConfigSuggestion[] = [];
    
    // 檢查未命名材質
    if (analysisResult.summary.unnamedMaterialsCount > 0) {
      suggestions.push({
        type: 'naming',
        priority: 'medium',
        message: `發現 ${analysisResult.summary.unnamedMaterialsCount} 個未命名材質，建議使用索引匹配 (material_0, material_1...)`
      });
    }
    
    // 檢查材質多樣性
    if (analysisResult.summary.uniqueTypes.length > 3) {
      suggestions.push({
        type: 'complexity',
        priority: 'low',
        message: `模型包含 ${analysisResult.summary.uniqueTypes.length} 種不同材質類型，考慮統一材質系統`
      });
    }
    
    // 檢查紋理使用
    if (!analysisResult.summary.hasTextures) {
      suggestions.push({
        type: 'enhancement',
        priority: 'low',
        message: '模型未使用紋理，可考慮添加法線貼圖提升視覺效果'
      });
    }
    
    return suggestions;
  }
}

// 向後兼容的導出函數
export const debugModelStructure = MaterialDebugger.debugModelStructure.bind(MaterialDebugger);

// 類型定義
export interface MaterialInfo {
  name: string;
  type: string;
  meshName: string;
  index: number;
  properties: Record<string, any>;
}

export interface MeshInfo {
  name: string;
  materialCount: number;
  geometry: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
}

export interface AnalysisSummary {
  uniqueTypes: string[];
  namedMaterialsCount: number;
  unnamedMaterialsCount: number;
  mostCommonType: string;
  hasTextures: boolean;
}

export interface MaterialAnalysisResult {
  totalMeshes: number;
  totalMaterials: number;
  meshes: MeshInfo[];
  materials: MaterialInfo[];
  summary: AnalysisSummary;
}

export interface ConfigSuggestion {
  type: 'naming' | 'complexity' | 'enhancement';
  priority: 'high' | 'medium' | 'low';
  message: string;
} 