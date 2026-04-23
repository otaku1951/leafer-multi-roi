<template>
  <div
    class="roi-editor"
    @focus="isCanvasFocused = true"
    @blur="isCanvasFocused = false"
    @mouseenter="isMouseOverCanvas = true"
    @mouseleave="isMouseOverCanvas = false"
  >
    <!-- 画布容器 -->
    <div ref="canvasContainer" class="canvas-container" tabindex="0">
      <!-- 加载占位 -->
      <div
        v-if="loadStatus === 'loading'"
        class="loading-overlay"
        :style="{
          // width: imageWidth ? `${imageWidth}px` : '100%',
          // height: imageHeight ? `${imageHeight}px` : '100%',
        }"
      >
        <div class="gradient-animation"></div>
        <div class="loading-text">图片加载中</div>
      </div>

      <!-- 错误状态 -->
      <div v-if="loadStatus === 'error'" class="error-overlay">
        <p>加载失败</p>
        <button @click="loadImage()">重试</button>
      </div>

      <!-- 缩放控制器 -->
      <div class="zoom-controller">
        <button class="zoom-button" title="缩小 (Ctrl+-)" @click="zoomOut">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span class="hotkey-hint" v-if="showHotkeys">Ctrl+-</span>
        </button>
        <div
          class="zoom-value"
          @click="resetZoom"
          title="点击重置为100% (Ctrl+0)"
        >
          {{ zoomLevel }}%
          <span class="hotkey-hint" v-if="showHotkeys">Ctrl+0</span>
        </div>
        <button class="zoom-button" title="放大 (Ctrl++)" @click="zoomIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span class="hotkey-hint" v-if="showHotkeys">Ctrl++</span>
        </button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <button
        class="tool-button"
        :class="{ active: currentTool === 'select' }"
        title="选择工具 (V)"
        @click="selectTool"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-mouse-pointer2-icon lucide-mouse-pointer-2"
        >
          <path
            d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
          />
        </svg>
        <span class="hotkey-hint" v-if="showHotkeys">V</span>
      </button>
      <button
        class="tool-button"
        :class="{ active: currentTool === 'rectangle' }"
        title="框选工具 (M)"
        @click="rectangleTool"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
        <span class="hotkey-hint" v-if="showHotkeys">M</span>
      </button>
      <button class="tool-button" title="撤销 (Ctrl+Z)" @click="undo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 7v6h6"></path>
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
        </svg>
        <span class="hotkey-hint" v-if="showHotkeys">Ctrl+Z</span>
      </button>
      <button class="tool-button" title="重做 (Ctrl+Y)" @click="redo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 7v6h-6"></path>
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
        </svg>
        <span class="hotkey-hint" v-if="showHotkeys">Ctrl+Y</span>
      </button>
      <button class="tool-button" title="删除 (Delete)" @click="deleteSelected">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
        <span class="hotkey-hint" v-if="showHotkeys">Del</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  App,
  ImageEvent,
  PointerEvent,
  ZoomEvent,
  Image,
  Rect,
  Group,
  DragEvent,
} from "leafer-ui";
import { EditorScaleEvent } from "@leafer-in/editor";
import "@leafer-in/editor";
import "@leafer-in/resize";
import "@leafer-in/viewport";
import "@leafer-in/view";
import {
  CommandManager,
  AddElementCommand,
  RemoveElementCommand,
  BatchCommand,
  ICommand,
  MoveCommand,
  ResizeCommand,
} from "@zzalai/leafer-undo-redo";
// 扩展 Window 接口，添加热键取消订阅函数
declare global {
  interface Window {
    __roiEditorHotkeysUnsubscribe?: () => void;
  }
}

// @ts-ignore - tinykeys 类型声明问题
import { tinykeys } from "tinykeys";

// Props
export interface ImageSource {
  id?: string; // 图片ID，非必填
  url: string; // 图片URL或Base64，必填
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
}

const props = defineProps({
  // 图片源（URL 或 Base64）
  imageSource: {
    type: Object as () => ImageSource,
    required: true,
  },
  // 配置选项
  options: {
    type: Object as () => OptionsSource,
    default: () => ({}),
  },
});
// Emits
const emit = defineEmits([
  "roiChange",
  "loadStart",
  "loadSuccess",
  "loadError",
  "undoStateChange",
  "redoStateChange",
]);

// 画布容器引用
const canvasContainer = ref<HTMLElement | undefined>(undefined);
const loadStatus = ref<"idle" | "loading" | "success" | "error">("idle");
const imageWidth = ref<number | null>(null);
const imageHeight = ref<number | null>(null);
let app: App | null = null;
let imageBox: Image | null = null;
// const bottomLayer = new Group({ name: "bottom" });
// const roiLayer = new Group({ name: "roi" });
const contentLayer = new Group({ name: "contentLayer" });

// 鼠标位置
const mousePosition = ref({ x: 0, y: 0 });

// 画布是否获得焦点
const isCanvasFocused = ref(false);

// 鼠标是否在编辑器区域内
const isMouseOverCanvas = ref(false);

// 是否显示热键提示
const showHotkeys = ref(false);

// 当前工具模式
const currentTool = ref<"select" | "rectangle">("rectangle");

// 缩放相关状态
const zoomLevel = ref<number>(100);

// 拖拽相关状态
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
let tempRect: Rect | null = null;

// 移动撤销/重做相关状态
interface MoveData {
  target: Rect;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

let pendingMoveData: MoveData | null = null;

// 缩放撤销/重做相关状态
interface ResizeData {
  target: Rect;
  fromWidth: number;
  fromHeight: number;
  toWidth: number;
  toHeight: number;
}

let pendingResizeData: ResizeData | null = null;

// 命令管理器实例
let commandManager: CommandManager;

// 初始化命令管理器
const initCommandManager = () => {
  commandManager = new CommandManager();
};

// 执行命令并检查步数限制
const executeCommand = (command: ICommand) => {
  // 执行命令
  commandManager.executeCommand(command);
  
  // 检查步数限制（默认100）
  const maxUndoSteps = props.options.maxUndoSteps ?? 100;
  if (maxUndoSteps > 0) {
    // 类型断言，访问私有属性
    const cmdManager = commandManager as any;
    // 移除超过限制的最早命令
    while (cmdManager.commandStack && cmdManager.commandStack.length > maxUndoSteps) {
      // 移除最早的命令
      cmdManager.commandStack.shift();
      // 如果当前在栈的中间位置，需要调整当前索引
      if (cmdManager.currentIndex > 0) {
        cmdManager.currentIndex--;
      }
    }
  }
};

const initCanvas = () => {
  // 初始化命令管理器
  initCommandManager();
  
  // 创建 Leafer 实例
  app = new App({
    view: canvasContainer.value,
    width: canvasContainer.value?.clientWidth || 800,
    height: canvasContainer.value?.clientHeight || 600,
    fill: "#e3e3e3",
    zoom: { min: 0.2, max: 4 },
    // tree: { usePartLayout: false },
    editor: {
      rotateable: false, // 禁止旋转
      middlePoint: {}, // 展示中间手柄
      selectedStyle: {
        ...props.options.selectedRegionStyle,
        // strokeColor: "rgba(200, 149, 237, 0.8)",
        // fill: "rgba(200, 149, 237, 1)",
      }
    },
    tree: {
      type: "design",
    },
    // wheel: { zoomMode: true }
  });

  app?.tree.add(contentLayer);

  // 监听鼠标滚轮事件，处理缩放，暂时注释掉，按Ctrl+wheel也挺方便，直接滚轮缩放有点太轻易触发到了
  // if (app) {
  //   canvasContainer.value?.addEventListener("wheel", (e) => {
  //     e.preventDefault();
  //     if (app) {
  //       if (e.deltaY < 0) {
  //         // 向上滚动，放大
  //         app.tree.zoom("in");
  //       } else {
  //         // 向下滚动，缩小
  //         app.tree.zoom("out");
  //       }
  //       // 更新缩放级别显示
  //       updateZoomLevel();
  //     }
  //   });
  // }

  // 添加指针事件监听器
  if (app) {
    app.on(PointerEvent.DOWN, handlePointerDown);
    app.on(PointerEvent.MOVE, handlePointerMove);
    app.on(PointerEvent.UP, handlePointerUp);

    // 监听拖动开始事件（用于移动撤销/重做）
    app.on(DragEvent.START, (e: DragEvent) => {
      const target = e.target as Rect;
      if (target instanceof Rect && target.parent === contentLayer) {
        // 记录移动前的位置
        pendingMoveData = {
          target,
          fromX: target.x || 0,
          fromY: target.y || 0,
          toX: target.x || 0,
          toY: target.y || 0,
        };
      }
    });

    // 监听拖动事件（更新目标位置）
    app.on(DragEvent.DRAG, (e: DragEvent) => {
      if (pendingMoveData) {
        pendingMoveData.toX = (e.target as Rect).x || 0;
        pendingMoveData.toY = (e.target as Rect).y || 0;
      }
    });

    // 监听拖动结束事件（创建移动命令）
    app.on(DragEvent.END, () => {
      if (pendingMoveData) {
        const target = pendingMoveData.target;
        // 只有位置发生变化时才创建命令
        if (
          pendingMoveData.fromX !== pendingMoveData.toX ||
          pendingMoveData.fromY !== pendingMoveData.toY
        ) {
          const moveCommand = new MoveCommand(
            target,
            pendingMoveData.fromX,
            pendingMoveData.fromY,
            pendingMoveData.toX,
            pendingMoveData.toY,
          );
          executeCommand(moveCommand);
          // 触发ROI变化事件
          emit("roiChange", getROIAnnotations());
        }
        pendingMoveData = null;
      }
    });

    // 监听画布缩放事件（更新缩放级别显示）
    app.on(ZoomEvent.ZOOM, (e: ZoomEvent) => {
      console.log("ZoomEvent.ZOOM event:", e);
      updateZoomLevel();
    });

    // 监听缩放开始事件（用于缩放撤销/重做）
    app.editor?.on(EditorScaleEvent.BEFORE_SCALE, (e: EditorScaleEvent) => {
      console.log("EditorScaleEvent.BEFORE_SCALE event:", e);
      const target = e.target as Rect;
      if (target instanceof Rect && target.parent === contentLayer) {
        // 只有当没有待处理的缩放数据时才初始化（确保只记录一次初始尺寸）
        if (!pendingResizeData) {
          // 记录缩放前的尺寸
          pendingResizeData = {
            target,
            fromWidth: target.width || 0,
            fromHeight: target.height || 0,
            toWidth: target.width || 0,
            toHeight: target.height || 0,
          };
          console.log("pendingResizeData initialized:", pendingResizeData);
        }
      }
    });

    // 监听缩放事件（更新目标尺寸）
    app.editor?.on(EditorScaleEvent.SCALE, (e: EditorScaleEvent) => {
      if (pendingResizeData) {
        pendingResizeData.toWidth = (e.target as Rect).width || 0;
        pendingResizeData.toHeight = (e.target as Rect).height || 0;
        console.log("Scale updated, pendingResizeData:", pendingResizeData);
      }
    });

    // 监听指针释放事件（缩放完成时创建命令）
    app.on(PointerEvent.UP, () => {
      // 只有当存在待处理的缩放数据时才创建命令
      if (pendingResizeData) {
        processPendingResize();
      }
    });
  }
};

// 处理待处理的缩放数据
function processPendingResize() {
  if (pendingResizeData) {
    const target = pendingResizeData.target;
    // 只有尺寸发生变化时才创建命令
    if (
      pendingResizeData.fromWidth !== pendingResizeData.toWidth ||
      pendingResizeData.fromHeight !== pendingResizeData.toHeight
    ) {
      console.log("Creating ResizeCommand:", pendingResizeData);
      const resizeCommand = new ResizeCommand(
        target,
        pendingResizeData.fromWidth,
        pendingResizeData.fromHeight,
        pendingResizeData.toWidth,
        pendingResizeData.toHeight,
      );
      executeCommand(resizeCommand);
      // 触发ROI变化事件
      emit("roiChange", getROIAnnotations());
    }
    pendingResizeData = null;
  }
}
/**
 * 加载图片
 */
// 预获取图片尺寸
const preloadImageSize = (
  url: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const tempImage = new window.Image();
    tempImage.onload = () => {
      resolve({
        width: tempImage.width,
        height: tempImage.height,
      });
    };
    tempImage.onerror = reject;
    tempImage.src = url;
  });
};
const loadImage = async (imageSrc?: string | undefined) => {
  const _imageSrc = imageSrc ? imageSrc : props.imageSource.url;
  if (!app || !_imageSrc) return;

  // 清除旧图片
  if (imageBox) {
    contentLayer.clear();
    imageBox.destroy();
  }

  // 设置加载状态
  loadStatus.value = "loading";
  emit("loadStart");
  imageWidth.value = null;
  imageHeight.value = null;

  try {
    // 预获取图片尺寸
    const size = await preloadImageSize(_imageSrc);
    imageWidth.value = size.width;
    imageHeight.value = size.height;

    // 调整画布大小
    // app.resize(size.width, size.height);

    // 创建新图片
    imageBox = new Image({
      url: _imageSrc,
      draggable: false,
      editable: false,
      lazy: true,
      zIndex: -1,
      // around: 'top-left',
      // smooth: true,
      placeholderColor: "transparent", // 不使用默认占位符，使用我们自定义的
    });

    // 监听加载成功
    imageBox.on(ImageEvent.LOADED, function () {
      loadStatus.value = "success";
      emit("loadSuccess");

      // 调整图片在画布中的显示
      fitImageToCanvas();
      // app?.tree.zoom('fit');
    });

    // 监听加载失败
    imageBox.on(ImageEvent.ERROR, function (e: ImageEvent) {
      loadStatus.value = "error";
      emit("loadError", e);
      console.error("Failed to load image:", e);
    });

    // 添加到画布
    contentLayer.add(imageBox);
  } catch (error) {
    loadStatus.value = "error";
    emit("loadError", error);
    console.error("Failed to preload image size:", error);
  }
};
/**
 * 获取 ROI 坐标
 */
interface ROIAnnotation {
  id: string; // 唯一标识符
  x: number; // 左上角 x 坐标
  y: number; // 左上角 y 坐标
  width: number; // 宽度
  height: number; // 高度
  points: { x: number; y: number }[]; // 四个角的坐标
  // 归一化数据
  normalized: {
    x: number;
    y: number;
    width: number;
    height: number;
    points: { x: number; y: number }[];
  };
}
const getROIAnnotations = (): ROIAnnotation[] => {
  if (!contentLayer || !imageWidth.value || !imageHeight.value) return [];

  const annotations: ROIAnnotation[] = [];
  const width = imageWidth.value;
  const height = imageHeight.value;

  // 遍历 ROI 图层中的所有矩形元素
  const children = Array.from(contentLayer.children) as Array<any>;
  children.forEach((child) => {
    if (!child.url) {
      // 把【图片】排除
      const rect = child as Rect;
      const id = rect.id || `roi-${annotations.length}`;
      const x = rect.x || 0;
      const y = rect.y || 0;
      const rectWidth = rect.width || 0;
      const rectHeight = rect.height || 0;

      // 计算四个角的坐标
      const points = [
        { x, y },
        { x: x + rectWidth, y },
        { x: x + rectWidth, y: y + rectHeight },
        { x, y: y + rectHeight },
      ];

      // 计算归一化坐标（0-1 范围）
      const normalizedPoints = points.map((point) => ({
        x: width > 0 ? point.x / width : 0,
        y: height > 0 ? point.y / height : 0,
      }));

      annotations.push({
        id,
        x,
        y,
        width: rectWidth,
        height: rectHeight,
        points,
        normalized: {
          x: width > 0 ? x / width : 0,
          y: height > 0 ? y / height : 0,
          width: width > 0 ? rectWidth / width : 0,
          height: height > 0 ? rectHeight / height : 0,
          points: normalizedPoints,
        },
      });
    }
  });

  return annotations;
};

// 获取图片信息
const getImageInfo = () => {
  return {
    id: props.imageSource.id,
    url: props.imageSource.url,
    width: imageWidth.value,
    height: imageHeight.value,
  };
};

const exportCanvasJSON = (): string => {
  const canvasData = {
    version: "1.0",
    canvas: {
      width: imageWidth.value,
      height: imageHeight.value,
      zoom: zoomLevel.value / 100,
    },
    image: getImageInfo(),
    leaferJSON: app?.tree?.toJSON?.() || null,
    annotations: getROIAnnotations(),
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(canvasData, null, 2);
};

interface ImportCanvasOptions {
  resetZoom?: boolean;
}

const importCanvasJSON = async (
  jsonString: string,
  options?: ImportCanvasOptions,
): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonString);

    if (!data.leaferJSON) {
      console.error("无效的 JSON 数据：缺少 leaferJSON 字段");
      return false;
    }

    // 清空 contentLayer 中的所有元素
    if (contentLayer) {
      // 重置 contentLayer 相关信息
      // contentLayer.scale = 1;
      // contentLayer.x = 0;
      // contentLayer.y = 0;
      // 清空所有子元素
      while (contentLayer.children.length > 0) {
        contentLayer.children[0].remove();
      }

      // 从 leaferJSON 加载新元素
      if (data.leaferJSON && data.leaferJSON.children) {
        // 检查是否有图片元素（可能在 children 的 children 中）
        let imageData = null;

        // 递归查找图片元素
        const findImage = (children: any[]) => {
          for (const child of children) {
            if (child.url) {
              imageData = child;
              return true;
            }
            if (child.children && child.children.length > 0) {
              if (findImage(child.children)) {
                return true;
              }
            }
          }
          return false;
        };

        findImage(data.leaferJSON.children);
        if (imageData) {
          // 使用 loadImage 加载图片，确保获取到真实尺寸
          try {
            await loadImage((imageData as any).url);
          } catch (error) {
            console.error("Failed to load image:", error);
            // 如果加载失败，使用JSON中的尺寸
            imageWidth.value =
              (imageData as any).width || data.canvas?.width || 0;
            imageHeight.value =
              (imageData as any).height || data.canvas?.height || 0;
          }
        }

        // 递归添加元素（跳过图片元素，因为已经通过 loadImage 添加）
        const addElements = (children: any[]) => {
          for (const child of children) {
            if ((child as any).url) {
              // 跳过图片元素，因为已经通过 loadImage 添加
              continue;
            }
            // 创建元素并添加到 contentLayer
            const element = JSON.parse(JSON.stringify(child));
            contentLayer.add(element);
            // 递归添加子元素
            if ((child as any).children && (child as any).children.length > 0) {
              addElements((child as any).children);
            }
          }
        };

        addElements(data.leaferJSON.children[0].children);
      }

      app?.tree.forceUpdate();
    }

    // 如果需要，重置缩放
    if (options?.resetZoom && data.canvas?.zoom) {
      zoomLevel.value = data.canvas.zoom * 100;
      updateZoomLevel();
    }

    // 触发 ROI 变化事件
    emit("roiChange", getROIAnnotations());

    return true;
  } catch (error) {
    console.error("导入 JSON 失败：", error);
    return false;
  }
};

// 组件挂载时初始化
onMounted(() => {
  // 初始化逻辑将在此处添加
  nextTick(() => {
    initCanvas();
    loadImage();

    // 添加事件监听
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);

    // 注册热键
    const unsubscribe = tinykeys(window, {
      // 选择工具
      v: (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        selectTool();
      },
      // 框选工具
      m: (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        rectangleTool();
      },
      // 撤销
      "$mod+KeyZ": (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        event.stopPropagation();
        undo();
      },
      // 重做
      "$mod+KeyY": (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        event.stopPropagation();
        redo();
      },
      // 删除
      Delete: (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        event.stopPropagation();
        deleteSelected();
      },
      // 放大
      "$mod+Equal": (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        event.stopPropagation();
        zoomIn();
      },
      // 缩小
      "$mod+Minus": (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        event.stopPropagation();
        zoomOut();
      },
      // 重置缩放
      "$mod+0": (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        event.stopPropagation();
        resetZoom();
      },
      // 切换热键提示
      Alt: (event: KeyboardEvent) => {
        if (!isCanvasFocused.value && !isMouseOverCanvas.value) return;
        event.preventDefault();
        showHotkeys.value = !showHotkeys.value;
      },
    });

    // 保存取消订阅函数
    window.__roiEditorHotkeysUnsubscribe = unsubscribe;
  });
});

// 鼠标移动事件处理
const handleMouseMove = (e: MouseEvent) => {
  // 更新鼠标位置
  mousePosition.value = {
    x: e.clientX,
    y: e.clientY,
  };
};

/**
 * 调整图片在画布中的显示
 * 1. 计算合适的缩放比例，使图片完全显示在画布中
 * 2. 将画布移动到使图片绝对居中的位置
 */
const fitImageToCanvas = () => {
  if (!app || !imageBox || !imageWidth.value || !imageHeight.value) return;

  // 获取画布尺寸
  const canvasWidth = app.width as number;
  const canvasHeight = app.height as number;

  // 获取图片尺寸
  const imageWidthVal = imageWidth.value;
  const imageHeightVal = imageHeight.value;

  // 计算缩放比例
  const scaleX = canvasWidth / imageWidthVal;
  const scaleY = canvasHeight / imageHeightVal;
  const scale = Math.min(scaleX, scaleY, 1); // 不放大图片，只缩小

  // 计算居中位置
  const centerX = (canvasWidth - imageWidthVal * scale) / 2;
  const centerY = (canvasHeight - imageHeightVal * scale) / 2;

  // 设置画布缩放和位置
  app.tree.scale = scale;
  app.tree.x = centerX;
  app.tree.y = centerY;
  // 更新缩放级别显示
  updateZoomLevel();
  // contentLayer.scale = scale;
  // contentLayer.x = centerX;
  // contentLayer.y = centerY;
  // imageBox.scale = scale;
  // imageBox.x = centerX;
  // imageBox.y = centerY;

  console.log(
    `Image fit to canvas: scale=${scale.toFixed(2)}, position=(${centerX.toFixed(2)}, ${centerY.toFixed(2)})`,
  );
};

// 指针按下事件处理
const handlePointerDown = (e: any) => {
  console.log("Pointer down:", e);
  // 只在矩形工具模式下处理
  if (currentTool.value !== "rectangle") return;

  // 检查是否按住Ctrl键
  if (e.ctrlKey || e.metaKey) {
    // 按住Ctrl键，不创建新Rect
    return;
  }

  // 检查是否点击在已有的Rect上或其缩放手柄上
  if (e.target) {
    // 检查是否点击在元素本身
    if (e.target.parent === contentLayer && !e.target.url) {
      // 点击在已有的Rect上，不创建新Rect
      return;
    }
    // 检查是否点击在元素的缩放手柄上（通过检查目标元素是否有parent且parent是contentLayer中的元素）
    if (
      e.target.parent &&
      e.target.parent.parent === contentLayer &&
      !e.target.parent.url
    ) {
      // 点击在缩放手柄上，不创建新Rect
      return;
    }
    // 检查是否是调整大小的操作
    if (e.target.pointType === "resize") {
      // 调整大小操作，不创建新Rect
      return;
    }

    // 检查是否是旋转的操作
    if (e.target.pointType === "rotate") {
      // 旋转操作，不创建新Rect
      return;
    }
  }
  const getBoxPoint = contentLayer.getBoxPoint({ x: e.x, y: e.y });
  // 检查是否在图片区域内
  if (!isPointInImageArea(getBoxPoint.x, getBoxPoint.y)) return;

  // 开始拖拽
  isDragging.value = true;

  startX.value = getBoxPoint.x;
  startY.value = getBoxPoint.y;
};

// 指针移动事件处理
const handlePointerMove = (e: any) => {
  if (!isDragging.value) return;

  // 计算矩形尺寸
  const getBoxPoint = contentLayer.getBoxPoint({ x: e.x, y: e.y });
  const endX = getBoxPoint.x;
  const endY = getBoxPoint.y;

  // 确保矩形在图片区域内
  const constrainedX = Math.max(0, Math.min(endX, imageWidth.value || 0));
  const constrainedY = Math.max(0, Math.min(endY, imageHeight.value || 0));

  // 计算矩形位置和尺寸
  const x = Math.min(startX.value, constrainedX);
  const y = Math.min(startY.value, constrainedY);
  const width = Math.abs(constrainedX - startX.value);
  const height = Math.abs(constrainedY - startY.value);

  // 如果临时矩形不存在，创建它
  if (!tempRect) {
    tempRect = new Rect({
      id: crypto.randomUUID(),
      x: x,
      y: y,
      width: width,
      height: height,
      stroke: "rgba(100, 149, 237, 0.8)",
      fill: "rgba(100, 149, 237, 0.3)",
      strokeWidth: 2,
      draggable: false,
      editable: false,
      ...props.options.regionStyle,
    });

    contentLayer.add(tempRect);
  } else {
    // 更新临时矩形的位置和尺寸
    tempRect.x = x;
    tempRect.y = y;
    tempRect.width = width;
    tempRect.height = height;
  }
};

// 指针释放事件处理
const handlePointerUp = () => {
  if (!isDragging.value) return;

  // 结束拖拽
  isDragging.value = false;

  // 检查矩形是否有效（最小尺寸）
  if (tempRect) {
    const width = tempRect.width || 0;
    const height = tempRect.height || 0;

    if (width < 5 || height < 5) {
      // 移除过小的矩形
      tempRect.remove();
      tempRect = null;
    } else {
      // 检查是否超过最大区域数量限制（默认值为20）
      const maxRegions = props.options.maxRegions ?? 20;
      const currentRegionCount = getROIAnnotations().length;
      if (currentRegionCount >= maxRegions) {
        alert(`已达到最大区域数量限制（${maxRegions}个）`);
        tempRect.remove();
        tempRect = null;
        return;
      }

      // 设置矩形为可编辑可拖动
      tempRect.draggable = true;
      tempRect.editable = true;

      // 设置拖拽边界，确保不能拖出图片范围
      tempRect.dragBounds = {
        x: 0,
        y: 0,
        width: imageWidth.value || 0,
        height: imageHeight.value || 0,
      };

      // 使用命令模式添加元素，以便支持撤销/重做
      // 使用 contentLayer 作为父容器，因为 ROI 是添加在 contentLayer 上的
      const addCommand = new AddElementCommand(contentLayer, tempRect as any);
      executeCommand(addCommand);

      // 触发ROI变化事件
      emit("roiChange", getROIAnnotations());

      tempRect = null;
    }
  }
};

// 检查点是否在图片区域内
const isPointInImageArea = (x: number, y: number): boolean => {
  return (
    x >= 0 &&
    x <= (imageWidth.value || 0) &&
    y >= 0 &&
    y <= (imageHeight.value || 0)
  );
};

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  // 检查是否按下空格键
  if (e.code === "Space") {
    // 检查鼠标是否在画布内
    if (isMouseInCanvas()) {
      // 阻止默认的滚动行为
      e.preventDefault();
      return false;
    }
  }
};

// 判断鼠标是否在画布内
const isMouseInCanvas = (): boolean => {
  if (!canvasContainer.value) return false;

  const rect = canvasContainer.value.getBoundingClientRect();

  // 检查鼠标是否在画布范围内
  return (
    mousePosition.value.x >= rect.left &&
    mousePosition.value.x <= rect.right &&
    mousePosition.value.y >= rect.top &&
    mousePosition.value.y <= rect.bottom
  );
};

// 组件卸载时清理
onUnmounted(() => {
  // 清理逻辑将在此处添加
  if (imageBox) {
    app?.tree.remove(imageBox);
    imageBox = null;
  }
  app?.destroy();
  app = null;

  // 移除事件监听
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("mousemove", handleMouseMove);

  // 清理热键
  if (window.__roiEditorHotkeysUnsubscribe) {
    window.__roiEditorHotkeysUnsubscribe();
    delete window.__roiEditorHotkeysUnsubscribe;
  }
});

// 工具方法
const selectTool = () => {
  console.log("Select tool clicked");
  currentTool.value = "select";
  // 后续实现选择工具逻辑
};

const rectangleTool = () => {
  console.log("Rectangle tool clicked");
  currentTool.value = "rectangle";
  // 后续实现框选工具逻辑
};

const undo = () => {
  console.log("Undo clicked");
  commandManager.undo();
  // 触发ROI变化事件
  emit("roiChange", getROIAnnotations());
};

const redo = () => {
  console.log("Redo clicked");
  commandManager.redo();
  // 触发ROI变化事件
  emit("roiChange", getROIAnnotations());
};

/**
 * 缩小
 */
const zoomOut = () => {
  if (!app) return;
  app.tree.zoom("out");
  // 更新缩放级别显示
  updateZoomLevel();
};

/**
 * 放大
 */
const zoomIn = () => {
  if (!app) return;
  app.tree.zoom("in");
  // 更新缩放级别显示
  updateZoomLevel();
};

/**
 * 重置缩放
 */
const resetZoom = () => {
  if (!app) return;
  app.tree.zoom(1);
  // 更新缩放级别显示
  updateZoomLevel();
};

/**
 * 更新缩放级别显示
 */
const updateZoomLevel = () => {
  if (!app || !app.tree || app.tree.scaleX === undefined) return;
  zoomLevel.value = Math.round(app.tree.scaleX * 100);
};

/**
 * 删除选中的ROI
 */
const deleteSelected = () => {
  console.log("Delete selected clicked");
  if (!app) return;

  // 获取选中的元素
  const selectedElements = app.editor?.list || [];

  // 检查是否有选中的元素
  if (selectedElements.length === 0) {
    console.log("No elements selected");
    return;
  }

  // 过滤出在contentLayer中的Rect元素
  const selectedROIs = selectedElements.filter(
    (element) => element instanceof Rect && element.parent === contentLayer,
  );

  // 检查是否有选中的ROI
  if (selectedROIs.length === 0) {
    console.log("No ROI elements selected");
    return;
  }

  // 删除选中的ROI
  // 使用 BatchCommand 将多个删除操作合并为一个，以便批量撤销/重做
  const removeCommands: ICommand[] = [];
  selectedROIs.forEach((element) => {
    // 使用命令模式删除元素，以便支持撤销/重做
    // 注意：这里使用 element.remove() 而不是 destroy()，因为 destroy 会破坏元素导致无法 undo
    const index = element.parent?.children.indexOf(element) ?? -1;
    element.remove();
    // 使用 contentLayer 作为父容器，因为 ROI 是添加在 contentLayer 上的
    const removeCommand = new RemoveElementCommand(
      contentLayer,
      element as any,
      index,
    );
    removeCommands.push(removeCommand);
  });

  // 使用 BatchCommand 批量执行
  if (removeCommands.length > 0) {
    const batchCommand = new BatchCommand(removeCommands);
    executeCommand(batchCommand);
  }

  // 取消编辑器选中状态，避免残留边框
  if (app && app.editor) {
    // 使用cancel()方法取消选中，不会影响其他Rect的可选性
    app.editor.cancel();
  }

  console.log(`Deleted ${selectedROIs.length} selected ROI(s)`);

  // 触发ROI变化事件
  emit("roiChange", getROIAnnotations());
};

// 暴露方法
defineExpose({
  getROIAnnotations,
  getImageInfo,
  exportCanvasJSON,
  importCanvasJSON,
  loadImage,
  // selectTool,
  // rectangleTool,
  // undo,
  // redo,
  // deleteSelected,
});
</script>

<style>
:root {
  /* 颜色变量 */
  --leafer-roi-color-primary: #007aff;
  --leafer-roi-color-background: #f5f5f5;
  --leafer-roi-color-background-light: #f0f0f0;
  --leafer-roi-color-white: #fff;
  --leafer-roi-color-text: #333;
  --leafer-roi-color-text-secondary: #666;
  --leafer-roi-color-text-tertiary: #999999;
  --leafer-roi-color-border: #ddd;
  --leafer-roi-color-border-light: #e0e0e0;
  --leafer-roi-color-error: #e74c3c;
  --leafer-roi-color-button: #3498db;
  --leafer-roi-color-button-hover: #2980b9;

  /* 尺寸变量 */
  --leafer-roi-padding-toolbar: 10px;
  --leafer-roi-padding-tool-button: 8px;
  --leafer-roi-size-tool-icon: 18px;
  --leafer-roi-size-zoom-button: 36px;
  --leafer-roi-size-zoom-value: 60px;
  --leafer-roi-font-size-hotkey: 10px;
  --leafer-roi-padding-hotkey: 1px 3px;
  --leafer-roi-padding-error: 20px;
  --leafer-roi-padding-error-button: 8px 16px;

  /* 边框圆角 */
  --leafer-roi-border-radius-tool-button: 4px;
  --leafer-roi-border-radius-hotkey: 2px;
  --leafer-roi-border-radius-overlay: 8px;
  --leafer-roi-border-radius-zoom: 8px;

  /* 阴影 */
  --leafer-roi-shadow-tool-button: 0 2px 4px rgba(0, 0, 0, 0.1);
  --leafer-roi-shadow-tool-button-active: 0 2px 4px rgba(0, 122, 255, 0.3);
  --leafer-roi-shadow-tool-button-hover: 0 4px 6px rgba(0, 0, 0, 0.1);
  --leafer-roi-shadow-overlay: 0 4px 12px rgba(0, 0, 0, 0.1);
  --leafer-roi-shadow-zoom: 0 2px 8px rgba(0, 0, 0, 0.15);

  /* 动画 */
  --leafer-roi-transition-time: 0.2s;
  --leafer-roi-animation-gradient: 2s;
}
</style>
<style scoped>
.roi-editor {
  width: 100%;
  height: 100%;
}

.canvas-container {
  width: 100%;
  height: calc(100% - 55px);
  position: relative;
  overflow: hidden;
  outline: none;
}

.canvas-container:focus {
  outline: 2px solid var(--leafer-roi-color-primary);
  outline-offset: -2px;
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--leafer-roi-color-background-light);
  border-radius: var(--leafer-roi-border-radius-overlay);
  box-shadow: var(--leafer-roi-shadow-overlay);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  min-width: 100%;
  min-height: 100%;
}

.gradient-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 200% 200%;
  animation: gradientShift var(--leafer-roi-animation-gradient) ease-in-out
    infinite;
  opacity: 0.7;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.loading-text {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--leafer-roi-color-white);
  border-radius: var(--leafer-roi-border-radius-overlay);
  box-shadow: var(--leafer-roi-shadow-overlay);
  padding: var(--leafer-roi-padding-error);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  min-width: 200px;
}

.error-overlay p {
  margin-bottom: 20px;
  color: var(--leafer-roi-color-error);
  font-size: 16px;
}

.error-overlay button {
  padding: var(--leafer-roi-padding-error-button);
  background-color: var(--leafer-roi-color-button);
  color: white;
  border: none;
  border-radius: var(--leafer-roi-border-radius-tool-button);
  cursor: pointer;
  font-size: 14px;
}

.error-overlay button:hover {
  background-color: var(--leafer-roi-color-button-hover);
}

/* 缩放控制器样式 */
.zoom-controller {
  position: absolute;
  left: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  background-color: var(--leafer-roi-color-white);
  border-radius: var(--leafer-roi-border-radius-zoom);
  box-shadow: var(--leafer-roi-shadow-zoom);
  overflow: hidden;
  z-index: 100;
}

.zoom-button {
  width: var(--leafer-roi-size-zoom-button);
  height: var(--leafer-roi-size-zoom-button);
  border: none;
  background-color: var(--leafer-roi-color-white);
  color: var(--leafer-roi-color-text);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all var(--leafer-roi-transition-time) ease;
  position: relative;
}

.zoom-button:hover {
  background-color: var(--leafer-roi-color-background-light);
  color: var(--leafer-roi-color-primary);
}

.zoom-button:active {
  background-color: #e0e0e0;
}

.zoom-value {
  min-width: var(--leafer-roi-size-zoom-value);
  height: var(--leafer-roi-size-zoom-button);
  line-height: var(--leafer-roi-size-zoom-button);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--leafer-roi-color-text);
  cursor: pointer;
  border-left: 1px solid var(--leafer-roi-color-border-light);
  border-right: 1px solid var(--leafer-roi-color-border-light);
  transition: all var(--leafer-roi-transition-time) ease;
  position: relative;
}
.zoom-value .hotkey-hint {
  line-height: 1;
}

.zoom-value:hover {
  background-color: var(--leafer-roi-color-background-light);
  color: var(--leafer-roi-color-primary);
}

/* 工具栏样式 */
.toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--leafer-roi-padding-toolbar);
  background-color: var(--leafer-roi-color-background);
  border-top: 1px solid var(--leafer-roi-color-border);
  gap: 10px;
}

.tool-button {
  /* width: 40px;
  height: 40px; */
  padding: var(--leafer-roi-padding-tool-button);
  border: none;
  border-radius: var(--leafer-roi-border-radius-tool-button);
  background-color: var(--leafer-roi-color-white);
  color: var(--leafer-roi-color-text);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--leafer-roi-shadow-tool-button);
  transition: all var(--leafer-roi-transition-time) ease;
  position: relative;
}

.tool-button:hover {
  background-color: #e3e3e3;
  transform: translateY(-1px);
  box-shadow: var(--leafer-roi-shadow-tool-button-hover);
}

.tool-button:active {
  transform: translateY(0);
  box-shadow: var(--leafer-roi-shadow-tool-button);
}

.tool-button.active {
  background-color: var(--leafer-roi-color-primary);
  color: white;
  box-shadow: var(--leafer-roi-shadow-tool-button-active);
}

.tool-button svg {
  width: var(--leafer-roi-size-tool-icon);
  height: var(--leafer-roi-size-tool-icon);
}

/* 热键提示样式 */
.hotkey-hint {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: var(--leafer-roi-font-size-hotkey);
  font-weight: bold;
  color: var(--leafer-roi-color-text-tertiary);
  background-color: var(--leafer-roi-color-background);
  padding: var(--leafer-roi-padding-hotkey);
  border-radius: var(--leafer-roi-border-radius-hotkey);
  pointer-events: none;
}

.tool-button.active .hotkey-hint {
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(0, 0, 0, 0.2);
}
</style>

