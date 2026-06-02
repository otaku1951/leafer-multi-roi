export interface ROI {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface Point {
    x: number;
    y: number;
}
export type RegionCoordinates = [Point, Point, Point, Point];
export type NormalizedPoint = [number, number];
export type NormalizedRegion = [NormalizedPoint, NormalizedPoint, NormalizedPoint, NormalizedPoint];
export interface ROIAnnotation {
    id: string;
    coordinates: RegionCoordinates;
    normalizedCoordinates: NormalizedRegion;
}
export interface RoiEditorOptions {
    regionStyle?: {
        fillColor?: string;
        strokeColor?: string;
        strokeWidth?: number;
    };
    selectedRegionStyle?: {
        fillColor?: string;
        strokeColor?: string;
        strokeWidth?: number;
    };
    [key: string]: any;
}
export type ImageLoadStatus = 'idle' | 'loading' | 'success' | 'error';
