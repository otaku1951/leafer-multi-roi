import type { Point, NormalizedPoint, RegionCoordinates, NormalizedRegion } from '../types'

// 将原始图片坐标转换为归一化坐标
export function getNormalizedCoordinates(
  point: Point,
  imageWidth: number,
  imageHeight: number
): NormalizedPoint {
  return [point.x / imageWidth, point.y / imageHeight]
}

// 将区域坐标转换为归一化区域坐标
export function getNormalizedRegionCoordinates(
  region: RegionCoordinates,
  imageWidth: number,
  imageHeight: number
): NormalizedRegion {
  return region.map(point => getNormalizedCoordinates(point, imageWidth, imageHeight)) as NormalizedRegion
}

// 将归一化坐标转换为原始图片坐标
export function getOriginalCoordinates(
  normalizedPoint: NormalizedPoint,
  imageWidth: number,
  imageHeight: number
): Point {
  return {
    x: normalizedPoint[0] * imageWidth,
    y: normalizedPoint[1] * imageHeight
  }
}

// 将矩形转换为区域坐标（4个点，顺时针顺序）
export function rectToRegionCoordinates(
  x: number,
  y: number,
  width: number,
  height: number
): RegionCoordinates {
  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height }
  ]
}