# 架构设计文档 (Architecture Design Document)

## 1. 总体架构目标

本项目的核心目标是构建一个高性能、可复用、可发布到 npm 的 Vue3 包插件，用于多区域框选（Multi-ROI Selection）。该工具将封装图片处理、ROI 交互、撤销/重做以及数据输出等核心逻辑，并通过提供统一的接口，使其能轻松集成到 Vue3 前端项目中。

## 2. 核心技术栈

本项目将尽可能利用 LeaferJS 官方提供的插件来满足需求。

*   **画布渲染与交互**: [LeaferJS](https://www.leaferjs.com/)
    *   包名: `leafer-ui` (pnpm)
    *   插件:
        *   `@leafer-in/editor`: 用于 ROI 选区的编辑态管理。
        *   `@leafer-in/resize`: 配合 `editor` 插件实现 ROI 选区的大小变更。
        *   `@leafer-in/viewport`: 用于实现画布的平移和缩放功能。
        *   `@leafer-in/view`: 提供视图支持。
    *   选择理由: LeaferJS 提供高效的 2D 渲染能力和丰富的图形对象模型，非常适合处理复杂的画布交互，如 ROI 的绘制、移动、缩放等。
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
    *   选择理由: 提升代码的可维护性、可读性，减少运行时错误，并为大型项目提供更好的开发体验和类型安全。
*   **撤销/重做**: [@zzalai/leafer-undo-redo](https://www.npmjs.com/package/@zzalai/leafer-undo-redo)(https://github.com/otaku1951/@zzalai/leafer-undo-redo)
    *   选择理由: 专门为 LeaferJS 设计的撤销/重做库，可以无缝集成，简化状态管理。本项目将使用此插件来管理所有可撤销/重做操作，包括 ROI 的创建、删除、移动和大小调整。
*   **热键管理**: [Tinykeys](https://github.com/jamiebuilds/tinykeys)
    *   选择理由: 轻量级的键盘快捷键库，用于实现热键系统，支持复杂的键盘组合。
*   **图标**: 直接嵌入 SVG 代码
    *   选择理由: 减少依赖，提高性能，直接使用需要的 SVG 图标。

## 3. 模块结构设计

本项目采用单组件架构，将核心逻辑直接集成在 Vue 组件中，简化了架构设计并提高了开发效率。

### 3.0 用户交互模式设计

为了明确区分用户的操作意图并避免事件冲突，工具将引入不同的交互模式，并通过工具栏按钮进行切换。

*   **“选中”模式 (Selection Mode)**: 对应鼠标箭头图标。
    *   功能: 选择、移动、调整现有 ROI，以及取消选中。
*   **“绘制”模式 (Draw Mode)**: 对应矩形绘制图标。
    *   功能: 在图片上拖拽绘制新的矩形 ROI。

### 3.1 RoiEditor 组件

*   **职责**: 封装所有与 ROI 工具相关的核心业务逻辑和 UI 界面。
*   **内容**:
    *   **模板结构**:
        *   画布容器 (`canvas-container`)
        *   加载占位和错误状态
        *   缩放控制器 (`zoom-controller`)
        *   工具栏 (`toolbar`)
    *   **核心逻辑**:
        *   LeaferJS 画布实例的管理与初始化。
        *   ROI 对象的创建、存储、更新和删除。
        *   与 `@zzalai/leafer-undo-redo` 的集成，管理所有可撤销/重做操作。
        *   鼠标事件处理（绘制、选择、移动、缩放）。
        *   热键事件处理（工具切换、撤销/重做、删除、缩放）。
        *   图片加载（URL/Base64）及显示，包括：
            *   加载时的过渡状态显示
            *   加载失败的处理逻辑
        *   坐标转换逻辑（屏幕坐标 <=> 原始图片坐标 <=> 归一化坐标）。
        *   ROI 数据输出（原始坐标、归一化坐标）。
        *   画布整体 JSON 数据的导入/导出逻辑（用于还原或保存使用）。
        *   样式配置的管理。
    *   **Props 定义**:
        *   `imageSource`: 图片源对象，包含 `id` (可选) 和 `url` (必填) 字段。
        *   `options`: 配置选项，包含 `regionStyle`、`selectedRegionStyle` 和 `maxRegions` 字段。
    *   **Emits 事件**:
        *   `roiChange`: ROI 数据变化时触发。
        *   `loadStart`: 图片加载开始时触发。
        *   `loadSuccess`: 图片加载成功时触发。
        *   `loadError`: 图片加载失败时触发。
        *   `undoStateChange`: 撤销状态变化时触发。
        *   `redoStateChange`: 重做状态变化时触发。
    *   **暴露接口**:
        *   `getROIAnnotations`: 获取 ROI 标注数据。
        *   `getImageInfo`: 获取图片信息。
        *   `exportCanvasJSON`: 导出画布 JSON 数据。
        *   `importCanvasJSON`: 导入画布 JSON 数据。
        *   `loadImage`: 手动加载图片。

## 4. 样式管理

*   **CSS 变量**: 使用 CSS 变量统一管理样式，前缀为 `leafer-roi-`，包括：
    *   颜色变量（主色、背景色、文本色等）
    *   尺寸变量（内边距、图标大小、按钮尺寸等）
    *   边框圆角
    *   阴影效果
    *   动画时间
*   **作用域样式**: 使用 Vue 的 `scoped` 样式确保样式隔离，避免影响全局样式。

## 5. 构建与发布

### 5.1 构建工具

*   **指定**: [Vite](https://vitejs.dev/)
    *   选择理由: 现代化的打包工具，能够高效地处理 TypeScript 和生成多种模块格式，非常适合库的开发。

### 5.2 构建配置

*   **代码压缩**: 使用 Terser 进行代码压缩，移除 `console.log` 等调试信息。
*   **配置示例**:
    ```typescript
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        }
      }
    }
    ```

### 5.3 npm 包结构

*   `package.json`: 需包含 `main` (CJS), `module` (ESM), `types` (TypeScript 类型定义), `exports` (现代 Node.js 和打包工具的入口点) 等字段，以及 Vue3 插件所需的配置。
*   **依赖管理**:
    *   `leafer-ui` 及其插件应作为 `dependencies`。
    *   `@zzalai/leafer-undo-redo` 应作为 `dependencies`。
    *   `tinykeys` 应作为 `dependencies`。
    *   `vue` 应作为 `peerDependency`，确保与宿主应用的 Vue3 版本兼容。

## 6. 开发与测试工作流

*   **项目初始化**: 使用 Vite 搭建 TypeScript 项目，配置 Vue3 插件开发环境。
*   **组件开发**: 直接在 `RoiEditor.vue` 中实现核心逻辑和 UI。
*   **集成测试**: 开发完成后，使用 Vue3 作为宿主应用进行集成测试，验证组件的功能和与框架的集成效果。
*   **文档编写**: 维护详细的 API 文档和使用示例，包括 Vue3 插件的使用方法。
*   **测试**: 编写单元测试和集成测试以确保功能正确性和稳定性。
