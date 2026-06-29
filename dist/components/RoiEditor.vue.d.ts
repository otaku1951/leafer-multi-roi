export interface ImageSource {
    id?: string;
    url: string;
}
export interface OptionsSource {
    regionStyle?: {
        fill: string;
        stroke: string;
        strokeWidth: number;
    };
    selectedRegionStyle?: {
        fill: string;
        stroke: string;
        strokeWidth?: number;
    };
    maxRegions?: number;
    maxUndoSteps?: number;
    enableHotkeys?: boolean;
}
/**
 * 获取 ROI 坐标
 */
interface ROIAnnotation {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    points: {
        x: number;
        y: number;
    }[];
    normalized: {
        x: number;
        y: number;
        width: number;
        height: number;
        points: {
            x: number;
            y: number;
        }[];
    };
}
interface ImportCanvasOptions {
    resetZoom?: boolean;
}
declare const __VLS_export: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    imageSource: {
        type: () => ImageSource;
        required: true;
    };
    options: {
        type: () => OptionsSource;
        default: () => {};
    };
}>, {
    getROIAnnotations: () => ROIAnnotation[];
    getImageInfo: () => {
        id: string | undefined;
        url: string;
        width: number | null;
        height: number | null;
    };
    exportCanvasJSON: () => string;
    importCanvasJSON: (jsonString: string, options?: ImportCanvasOptions) => Promise<boolean>;
    loadImage: (imageSrc?: string | undefined) => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    roiChange: (...args: any[]) => void;
    loadStart: (...args: any[]) => void;
    loadSuccess: (...args: any[]) => void;
    loadError: (...args: any[]) => void;
    undoStateChange: (...args: any[]) => void;
    redoStateChange: (...args: any[]) => void;
    "max-regions-exceeded": (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    imageSource: {
        type: () => ImageSource;
        required: true;
    };
    options: {
        type: () => OptionsSource;
        default: () => {};
    };
}>> & Readonly<{
    onRoiChange?: ((...args: any[]) => any) | undefined;
    onLoadStart?: ((...args: any[]) => any) | undefined;
    onLoadSuccess?: ((...args: any[]) => any) | undefined;
    onLoadError?: ((...args: any[]) => any) | undefined;
    onUndoStateChange?: ((...args: any[]) => any) | undefined;
    onRedoStateChange?: ((...args: any[]) => any) | undefined;
    "onMax-regions-exceeded"?: ((...args: any[]) => any) | undefined;
}>, {
    options: OptionsSource;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
