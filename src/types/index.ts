// ROI 类型定义
export interface ROI {
  id: string
  x: number
  y: number
  width: number
  height: number
}

// 坐标点类型
export interface Point {
  x: number
  y: number
}

// 区域坐标类型（4个点，顺时针顺序）
export type RegionCoordinates = [Point, Point, Point, Point]

// 归一化坐标类型
export type NormalizedPoint = [number, number]
export type NormalizedRegion = [NormalizedPoint, NormalizedPoint, NormalizedPoint, NormalizedPoint]

// ROI 注释类型（包含原始坐标和归一化坐标）
export interface ROIAnnotation {
  id: string
  coordinates: RegionCoordinates
  normalizedCoordinates: NormalizedRegion
}

// 工具配置选项类型
export interface RoiEditorOptions {
  // 区域样式
  regionStyle?: {
    fillColor?: string
    strokeColor?: string
    strokeWidth?: number
  }
  // 选中区域样式
  selectedRegionStyle?: {
    fillColor?: string
    strokeColor?: string
    strokeWidth?: number
  }
  // 其他配置
  [key: string]: any
}

// 图片加载状态
export type ImageLoadStatus = 'idle' | 'loading' | 'success' | 'error'