import type { MaterialConfig } from './types';

/**
 * 預設材質配置
 * 
 * 包含所有 Innovation Section 的材質配置
 */
export const defaultMaterialConfigs: Record<string, MaterialConfig> = {
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
        scale: 0.5,
        repeat: { x: 10, y: 10 }
      }
    }
  },
  
  'innovation-2': {
    'Metal': {
      color: '#FFF',
      metalness: 0.3,
      roughness: 0.5
    },
    'Plastic': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8
    }
  },
  
  'innovation-3': {
    'Metal': {
      color: '#FFF',
      metalness: 0.3,
      roughness: 0.5
    }
  },
  
  'innovation-4': {
    'Material': {
      color: '#FFF',
      metalness: 0.2,
      roughness: 0.7
    }
  },
  
  'innovation-5': {
    'Material': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8
    }
  },
  
  'innovation-6': {
    'Material': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8
    }
  },
  
  'innovation-7': {
    'Material': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8
    }
  },
  
  'innovation-8': {
    'Material': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8
    }
  },
  
  'innovation-9': {
    'Material': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8
    }
  },
  
  'innovation-10': {
    'Material': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8
    }
  },
  
  'innovation-11': {
    'Material': {
      color: '#FFF',
      metalness: 0.1,
      roughness: 0.8
    }
  }
};

/**
 * 材質配置管理器
 */
export class MaterialConfigManager {
  private static customConfigs: Record<string, MaterialConfig> = {};
  
  /**
   * 獲取材質配置
   */
  static getConfig(modelId: string): MaterialConfig | undefined {
    return this.customConfigs[modelId] || defaultMaterialConfigs[modelId];
  }
  
  /**
   * 設置自定義材質配置
   */
  static setCustomConfig(modelId: string, config: MaterialConfig): void {
    this.customConfigs[modelId] = config;
  }
  
  /**
   * 移除自定義材質配置
   */
  static removeCustomConfig(modelId: string): void {
    delete this.customConfigs[modelId];
  }
  
  /**
   * 獲取所有可用的配置 ID
   */
  static getAvailableConfigIds(): string[] {
    const defaultIds = Object.keys(defaultMaterialConfigs);
    const customIds = Object.keys(this.customConfigs);
    const allIds = defaultIds.concat(customIds);
    return Array.from(new Set(allIds));
  }
  
  /**
   * 檢查是否有特定配置
   */
  static hasConfig(modelId: string): boolean {
    return modelId in defaultMaterialConfigs || modelId in this.customConfigs;
  }
  
  /**
   * 清除所有自定義配置
   */
  static clearCustomConfigs(): void {
    this.customConfigs = {};
  }
} 