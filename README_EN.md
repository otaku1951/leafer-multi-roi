# LeaferJS Multi ROI Component

[中文](README.md) | English

A Vue3 component based on LeaferJS for multi-region selection on images, used for area annotation and editing on images.

## Features

- 🖼️ Support image loading and display
- 📐 Support drawing, editing and deleting rectangular regions
- 🔍 Support canvas zooming and dragging
- ⌨️ Support keyboard hotkey operations
- 🔄 Support undo/redo functionality
- 📤 Support canvas information JSON export and import
- 🎨 Support CSS variables for custom styling

## Installation

### Using npm

```bash
npm install @zzalai/leafer-multi-roi
```

### Using yarn

```bash
yarn add @zzalai/leafer-multi-roi
```

### Using pnpm

```bash
pnpm add @zzalai/leafer-multi-roi
```

## Usage

### Global Registration

```javascript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import RoiEditor from '@zzalai/leafer-multi-roi'

const app = createApp(App)
app.use(RoiEditor)
app.mount('#app')
```

### Local Usage

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

// Image source
const imageUrl = ref('https://picsum.photos/1280/1080')
const imageSrc = computed(() => ({
  id: 'test-image',
  url: imageUrl.value
}))

// Editor options
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
  },
  maxRegions: 20 // Maximum number of regions, default is 20
})

// Handle ROI change
const handleRoiChange = (data: any) => {
  console.log('ROI changed:', data)
}

// Handle image load start
const handleLoadStart = () => {
  console.log('Image load started')
}

// Handle image load success
const handleLoadSuccess = () => {
  console.log('Image load success')
}

// Handle image load error
const handleLoadError = (error: any) => {
  console.error('Image load error:', error)
}
</script>
```

### Manual Method Calls

```vue
<template>
  <div class="app">
    <RoiEditor
      ref="roiEditor"
      :imageSrc="imageSrc"
    />
    <button @click="reloadImage">Reload Image</button>
    <button @click="exportCanvas">Export Canvas</button>
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

// Reload image
const reloadImage = () => {
  roiEditor.value?.loadImage()
}

// Export canvas
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

// Import canvas
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
          alert('Canvas imported successfully!')
        } else {
          alert('Failed to import canvas.')
        }
      }
    }
    reader.readAsText(file)
  }
  target.value = ''
}
</script>
```

## Application Scenarios

- **Image Annotation**：Annotate regions of interest on images
- **Object Detection**：Generate training data for object detection models
- **Image Analysis**：Mark specific regions in images for analysis
- **Medical Imaging**：Mark lesion areas on medical images
- **E-commerce Products**：Mark different parts on product images

## Hotkey Operations

| Hotkey | Function |
|--------|----------|
| V | Select tool |
| M | Rectangle tool |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Delete | Delete selected region |
| Ctrl++ | Zoom in |
| Ctrl+- | Zoom out |
| Ctrl+0 | Reset zoom |
| Alt | Show/hide hotkey hints |

## Exposed Methods

- `getROIAnnotations()`：Get all ROI annotation data
- `getImageInfo()`：Get image information
- `exportCanvasJSON()`：Export canvas information as JSON string
- `importCanvasJSON(jsonString, options)`：Import canvas information from JSON string
- `loadImage()`：Manually load image

## CSS Customizable Variables

```css
:root {
  /* Color variables */
  --leafer-roi-color-primary: #007aff; /* Primary color */
  --leafer-roi-color-background: #f5f5f5; /* Background color */
  --leafer-roi-color-background-light: #f0f0f0; /* Light background color */
  --leafer-roi-color-white: #fff; /* White color */
  --leafer-roi-color-text: #333; /* Text color */
  --leafer-roi-color-text-secondary: #666; /* Secondary text color */
  --leafer-roi-color-text-tertiary: #999999; /* Tertiary text color */
  --leafer-roi-color-border: #ddd; /* Border color */
  --leafer-roi-color-border-light: #e0e0e0; /* Light border color */
  --leafer-roi-color-error: #e74c3c; /* Error color */
  --leafer-roi-color-button: #3498db; /* Button color */
  --leafer-roi-color-button-hover: #2980b9; /* Button hover color */

  /* Size variables */
  --leafer-roi-padding-toolbar: 10px; /* Toolbar padding */
  --leafer-roi-padding-tool-button: 8px; /* Tool button padding */
  --leafer-roi-size-tool-icon: 18px; /* Tool icon size */
  --leafer-roi-size-zoom-button: 36px; /* Zoom button size */
  --leafer-roi-size-zoom-value: 60px; /* Zoom value display width */
  --leafer-roi-font-size-hotkey: 10px; /* Hotkey hint font size */
  --leafer-roi-padding-hotkey: 1px 3px; /* Hotkey hint padding */
  --leafer-roi-padding-error: 20px; /* Error hint padding */
  --leafer-roi-padding-error-button: 8px 16px; /* Error hint button padding */

  /* Border radius */
  --leafer-roi-border-radius-tool-button: 4px; /* Tool button border radius */
  --leafer-roi-border-radius-hotkey: 2px; /* Hotkey hint border radius */
  --leafer-roi-border-radius-overlay: 8px; /* Overlay border radius */
  --leafer-roi-border-radius-zoom: 8px; /* Zoom controller border radius */

  /* Shadows */
  --leafer-roi-shadow-tool-button: 0 2px 4px rgba(0, 0, 0, 0.1); /* Tool button shadow */
  --leafer-roi-shadow-tool-button-active: 0 2px 4px rgba(0, 122, 255, 0.3); /* Tool button active shadow */
  --leafer-roi-shadow-tool-button-hover: 0 4px 6px rgba(0, 0, 0, 0.1); /* Tool button hover shadow */
  --leafer-roi-shadow-overlay: 0 4px 12px rgba(0, 0, 0, 0.1); /* Overlay shadow */
  --leafer-roi-shadow-zoom: 0 2px 8px rgba(0, 0, 0, 0.15); /* Zoom controller shadow */

  /* Animations */
  --leafer-roi-transition-time: 0.2s; /* Transition animation duration */
  --leafer-roi-animation-gradient: 2s; /* Gradient animation duration */
}
```

## Events

- `roiChange`：Triggered when ROI changes
- `loadStart`：Triggered when image starts loading
- `loadSuccess`：Triggered when image loads successfully
- `loadError`：Triggered when image fails to load
- `undoStateChange`：Triggered when undo state changes
- `redoStateChange`：Triggered when redo state changes

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- Vue 3.3.0+
- LeaferUI 2.0.8+
- Tinykeys 3.0.0+
- @zzalai/leafer-undo-redo 1.0.3+

## License

MIT License

## Contribution

Welcome to submit Issues and Pull Requests!