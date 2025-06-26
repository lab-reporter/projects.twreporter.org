import * as THREE from 'three';
import { extend } from '@react-three/fiber';

/**
 * 彎曲平面幾何體 - 基於原始 Combined3DScene 的實作
 * 
 * 創建一個彎曲的平面幾何體，適用於圓柱畫廊的照片展示
 * 通過重新計算頂點位置來實現彎曲效果，使平面照片能夠完美貼合圓柱面
 */
export class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(width: number, height: number, cylinderRadius: number, segments: number = 15) {
    // 計算合適的分段數
    const segmentsX = segments * 6; // X 軸分段數
    const segmentsY = Math.floor(height * 15); // Y 軸分段數
    
    super(width, height, segmentsX, segmentsY);
    
    // 計算彎曲角度 - 照片寬度與圓柱半徑的關係
    const theta = (width / cylinderRadius) * 1.2; // 彎曲係數
    
    const position = this.attributes.position;
    const uv = this.attributes.uv;
    
    // 遍歷所有頂點重新計算位置
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      
      // 計算 X 軸上的角度比例
      const xRatio = x / width;
      const xAngle = xRatio * theta;
      
      // 計算圓弧上的新位置
      const newX = Math.sin(xAngle) * cylinderRadius;
      const newZ = Math.cos(xAngle) * cylinderRadius - cylinderRadius; // 調整中心位置
      
      position.setXYZ(i, newX, y, newZ);
      
      // 調整 UV 座標避免邊緣拉伸
      const u = uv.getX(i);
      const v = uv.getY(i);
      uv.setXY(i, u * 0.8 + 0.1, v); // U 座標邊距調整
    }
    
    position.needsUpdate = true;
    uv.needsUpdate = true;
    this.computeVertexNormals(); // 重新計算法向量
  }
}

// 註冊自定義幾何體到 React Three Fiber
extend({ BentPlaneGeometry });

// TypeScript 類型擴展
declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: any;
    }
  }
} 