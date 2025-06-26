import * as THREE from 'three';
import type { TextureConfig } from './types';

/**
 * 紋理管理系統
 * 
 * 負責紋理的載入、配置和應用
 */
export class TextureManager {
  private static textureCache = new Map<string, THREE.Texture>();
  
  /**
   * 載入紋理（帶快取機制）
   */
  static loadTexture(url: string): THREE.Texture {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!;
    }
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load(url);
    
    this.textureCache.set(url, texture);
    return texture;
  }
  
  /**
   * 應用紋理配置到材質
   */
  static applyTextureToMaterial(material: THREE.Material, textureConfig: TextureConfig): void {
    const texture = this.loadTexture(textureConfig.url);
    
    // 設置紋理重複和包裝
    if (textureConfig.repeat) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(textureConfig.repeat.x || 1, textureConfig.repeat.y || 1);
    }
    
    // 根據類型應用紋理
    this.applyTextureByType(material, texture, textureConfig);
  }
  
  /**
   * 根據類型應用紋理到材質屬性
   */
  private static applyTextureByType(
    material: THREE.Material, 
    texture: THREE.Texture, 
    config: TextureConfig
  ): void {
    const materialAny = material as any;
    
    switch (config.mapType) {
      case 'normal':
        materialAny.normalMap = texture;
        if (config.scale) {
          materialAny.normalScale = new THREE.Vector2(config.scale, config.scale);
        }
        break;
        
      case 'roughness':
        materialAny.roughnessMap = texture;
        break;
        
      case 'displacement':
        materialAny.displacementMap = texture;
        if (config.scale) {
          materialAny.displacementScale = config.scale;
        }
        break;
        
      case 'diffuse':
      default:
        materialAny.map = texture;
        break;
    }
  }
  
  /**
   * 清理紋理快取
   */
  static clearCache(): void {
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
  }
  
  /**
   * 獲取快取統計
   */
  static getCacheStats(): { size: number; urls: string[] } {
    return {
      size: this.textureCache.size,
      urls: Array.from(this.textureCache.keys())
    };
  }
} 