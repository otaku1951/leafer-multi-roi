import { Point, NormalizedPoint, RegionCoordinates, NormalizedRegion } from '../types';
export declare function getNormalizedCoordinates(point: Point, imageWidth: number, imageHeight: number): NormalizedPoint;
export declare function getNormalizedRegionCoordinates(region: RegionCoordinates, imageWidth: number, imageHeight: number): NormalizedRegion;
export declare function getOriginalCoordinates(normalizedPoint: NormalizedPoint, imageWidth: number, imageHeight: number): Point;
export declare function rectToRegionCoordinates(x: number, y: number, width: number, height: number): RegionCoordinates;
