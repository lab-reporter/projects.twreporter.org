import * as THREE from 'three';

/**
 * 紋理配置介面
 */
export interface TextureConfig {
  url: string;
  mapType?: 'normal' | 'roughness' | 'displacement' | 'diffuse';
  scale?: number;
  repeat?: {
    x: number;
    y: number;
  };
}

/**
 * 材質屬性配置
 */
export interface MaterialProperties {
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
  texture?: TextureConfig;
}

/**
 * 材質配置介面
 */
export interface MaterialConfig {
  [materialName: string]: MaterialProperties;
}

/**
 * 分部材質配置
 */
export interface PartialMaterialConfig {
  parts: {
    [partKey: string]: MaterialProperties;
  };
  global?: MaterialProperties;
}

/**
 * 材質匹配策略
 */
export type MaterialMatchStrategy = 
  | 'name'      // 按材質名稱匹配
  | 'mesh'      // 按 mesh 名稱匹配
  | 'index'     // 按材質索引匹配
  | 'keyword';  // 按關鍵字匹配

/**
 * 材質匹配結果
 */
export interface MaterialMatchResult {
  matched: boolean;
  strategy: MaterialMatchStrategy;
  confidence: number; // 匹配信心度 0-1
}

/**
 * 材質應用上下文
 */
export interface MaterialApplicationContext {
  model: THREE.Object3D;
  mesh: THREE.Mesh;
  material: THREE.Material;
  materialIndex: number;
  config: MaterialProperties;
} 