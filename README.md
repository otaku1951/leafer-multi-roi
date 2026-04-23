# LeaferJS Multi ROI 组件

[English](README_EN.md) | 中文

一个基于 Vue3 和 LeaferJS 的多区域选择组件，用于在图片上进行区域标注和编辑。

## 功能特点

- 🖼️ 支持图片加载和显示
- 📐 支持矩形区域的绘制、编辑和删除
- 🔍 支持画布缩放和拖拽
- ⌨️ 支持键盘热键操作
- 🔄 支持撤销/重做功能
- 📤 支持画布信息 JSON 导出和导入
- 🎨 支持 CSS 变量自定义样式

## 安装

### 使用 npm

```bash
npm install @zzalai/leafer-multi-roi
```

### 使用 yarn

```bash
yarn add @zzalai/leafer-multi-roi
```

### 使用 pnpm

```bash
pnpm add @zzalai/leafer-multi-roi
```

## 使用方法

### 全局注册

```javascript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import RoiEditor from '@zzalai/leafer-multi-roi'

const app = createApp(App)
app.use(RoiEditor)
app.mount('#app')
```

### 局部使用

```vue
<template>
  <div class="app">
    <RoiEditor
      :imageSrc="imageSrc"
      :options="editorOptions"
      @roiChange="handleRoiChange"
      @loadStart="handleLoadStart"
      @loadSuccess="handleLoadSuccess"
      @loadError="handleLoadError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RoiEditor } from '@zzalai/leafer-multi-roi'

// 图片源
const imageUrl = ref('https://picsum.photos/1280/1080')
const imageSrc = computed(() => ({
  id: 'test-image',
  url: imageUrl.value
}))

// 编辑器选项
const editorOptions = ref({
  regionStyle: {
    fill: 'rgba(100, 149, 237, 0.3)',
    stroke: 'rgba(100, 149, 237, 0.8)',
    strokeWidth: 2
  },
  selectedRegionStyle: {
    fill: 'rgba(100, 149, 237, 0.5)',
    stroke: 'rgba(100, 149, 237, 1)',
    strokeWidth: 2
  }
})

// 处理ROI变化
const handleRoiChange = (data: any) => {
  console.log('ROI changed:', data)
}

// 处理图片加载开始
const handleLoadStart = () => {
  console.log('Image load started')
}

// 处理图片加载成功
const handleLoadSuccess = () => {
  console.log('Image load success')
}

// 处理图片加载失败
const handleLoadError = (error: any) => {
  console.error('Image load error:', error)
}
</script>
```

### 手动调用方法

```vue
<template>
  <div class="app">
    <RoiEditor
      ref="roiEditor"
      :imageSrc="imageSrc"
    />
    <button @click="reloadImage">重新加载图片</button>
    <button @click="exportCanvas">导出画布</button>
    <input type="file" @change="importCanvas" accept=".json" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RoiEditor } from '@zzalai/leafer-multi-roi'

const roiEditor = ref<InstanceType<typeof RoiEditor> | null>(null)
const imageUrl = ref('https://picsum.photos/1280/1080')
const imageSrc = computed(() => ({
  id: 'test-image',
  url: imageUrl.value
}))

// 重新加载图片
const reloadImage = () => {
  roiEditor.value?.loadImage()
}

// 导出画布
const exportCanvas = () => {
  const json = roiEditor.value?.exportCanvasJSON()
  if (json) {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'canvas.json'
    a.click()
    URL.revokeObjectURL(url)
  }
}

// 导入画布
const importCanvas = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const jsonString = e.target?.result as string
      if (roiEditor.value) {
        const success = await roiEditor.value.importCanvasJSON(jsonString, { resetZoom: true })
        if (success) {
          alert('画布导入成功！')
        } else {
          alert('画布导入失败。')
        }
      }
    }
    reader.readAsText(file)
  }
  target.value = ''
}
</script>
```

## 适用场景

- **图片标注**：在图片上标注感兴趣的区域
- **目标检测**：为目标检测模型生成训练数据
- **图像分析**：标记图像中的特定区域进行分析
- **医疗影像**：在医疗影像上标记病变区域
- **电商产品**：在产品图片上标记不同的部件

## 热键操作

| 热键 | 功能 |
|------|------|
| V | 选择工具 |
| M | 框选工具 |
| Ctrl+Z | 撤销 |
| Ctrl+Y | 重做 |
| Delete | 删除选中区域 |
| Ctrl++ | 放大 |
| Ctrl+- | 缩小 |
| Ctrl+0 | 重置缩放 |
| Alt | 显示/隐藏热键提示 |

## 暴露的方法

- `getROIAnnotations()`：获取所有 ROI 标注数据
- `getImageInfo()`：获取图片信息
- `exportCanvasJSON()`：导出画布信息为 JSON 字符串
- `importCanvasJSON(jsonString, options)`：从 JSON 字符串导入画布信息
- `loadImage()`：手动加载图片

## CSS 可重置变量

```css
:root {
  /* 颜色变量 */
  --leafer-roi-color-primary: #007aff; /* 主题色 */
  --leafer-roi-color-background: #f5f5f5; /* 背景色 */
  --leafer-roi-color-background-light: #f0f0f0; /* 浅背景色 */
  --leafer-roi-color-white: #fff; /* 白色 */
  --leafer-roi-color-text: #333; /* 文本色 */
  --leafer-roi-color-text-secondary: #666; /* 次要文本色 */
  --leafer-roi-color-text-tertiary: #999999; /* 三级文本色 */
  --leafer-roi-color-border: #ddd; /* 边框色 */
  --leafer-roi-color-border-light: #e0e0e0; /* 浅边框色 */
  --leafer-roi-color-error: #e74c3c; /* 错误色 */
  --leafer-roi-color-button: #3498db; /* 按钮色 */
  --leafer-roi-color-button-hover: #2980b9; /* 按钮悬停色 */

  /* 尺寸变量 */
  --leafer-roi-padding-toolbar: 10px; /* 工具栏内边距 */
  --leafer-roi-padding-tool-button: 8px; /* 工具按钮内边距 */
  --leafer-roi-size-tool-icon: 18px; /* 工具图标尺寸 */
  --leafer-roi-size-zoom-button: 36px; /* 缩放按钮尺寸 */
  --leafer-roi-size-zoom-value: 60px; /* 缩放值显示宽度 */
  --leafer-roi-font-size-hotkey: 10px; /* 热键提示字体大小 */
  --leafer-roi-padding-hotkey: 1px 3px; /* 热键提示内边距 */
  --leafer-roi-padding-error: 20px; /* 错误提示内边距 */
  --leafer-roi-padding-error-button: 8px 16px; /* 错误提示按钮内边距 */

  /* 边框圆角 */
  --leafer-roi-border-radius-tool-button: 4px; /* 工具按钮圆角 */
  --leafer-roi-border-radius-hotkey: 2px; /* 热键提示圆角 */
  --leafer-roi-border-radius-overlay: 8px; /* 遮罩圆角 */
  --leafer-roi-border-radius-zoom: 8px; /* 缩放控制器圆角 */

  /* 阴影 */
  --leafer-roi-shadow-tool-button: 0 2px 4px rgba(0, 0, 0, 0.1); /* 工具按钮阴影 */
  --leafer-roi-shadow-tool-button-active: 0 2px 4px rgba(0, 122, 255, 0.3); /* 工具按钮激活阴影 */
  --leafer-roi-shadow-tool-button-hover: 0 4px 6px rgba(0, 0, 0, 0.1); /* 工具按钮悬停阴影 */
  --leafer-roi-shadow-overlay: 0 4px 12px rgba(0, 0, 0, 0.1); /* 遮罩阴影 */
  --leafer-roi-shadow-zoom: 0 2px 8px rgba(0, 0, 0, 0.15); /* 缩放控制器阴影 */

  /* 动画 */
  --leafer-roi-transition-time: 0.2s; /* 过渡动画时长 */
  --leafer-roi-animation-gradient: 2s; /* 渐变动画时长 */
}
```

## 事件

- `roiChange`：当 ROI 发生变化时触发
- `loadStart`：当图片开始加载时触发
- `loadSuccess`：当图片加载成功时触发
- `loadError`：当图片加载失败时触发
- `undoStateChange`：当撤销状态变化时触发
- `redoStateChange`：当重做状态变化时触发

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 依赖

- Vue 3.3.0+
- LeaferUI 2.0.8+
- Tinykeys 3.0.0+
- @zzalai/leafer-undo-redo 1.0.3+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！