# LeaferJS Multi ROI Component

中文 | [English](README.md)

A Vue3 component for multi-region selection on images using LeaferJS, designed for image annotation and editing.

## Features

- 🖼️ Image loading and display
- 📐 Rectangle region drawing, editing, and deletion
- 🔍 Canvas zooming and panning
- ⌨️ Optional keyboard shortcuts support (must be explicitly enabled)
- 🔄 Undo/redo functionality
- 📤 Canvas JSON export and import
- 🎨 CSS variables for custom styling
- 👥 Multi-instance support (each component instance has isolated state)

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

### Basic Usage

```vue
<template>
  <div class="app">
    <RoiEditor
      :imageSource="imageSource"
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
import '@zzalai/leafer-multi-roi/dist/leafer-multi-roi.css'

// Image source
const imageUrl = ref('https://picsum.photos/1280/1080')
const imageSource = computed(() => ({
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
  maxRegions: 20, // Maximum number of regions, default is 20
  maxUndoSteps: 100, // Maximum undo/redo steps, default is 100
  enableHotkeys: true, // Enable keyboard hotkeys, default is false. Set to true to register hotkeys
  loadingGradientColors: ['#e8e0ff', '#d8e8ff'], // Loading animation gradient colors, default light purple to light blue
  loadingTextColor: '#4a5568' // Loading text color, default dark gray
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
const handleLoadSuccess = (info: { url: string; width: number; height: number; id: string }) => {
  console.log('Image load success:', info)
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
      :imageSource="imageSource"
    />
    <button @click="reloadImage">Reload Image</button>
    <button @click="exportCanvas">Export Canvas</button>
    <input type="file" @change="importCanvas" accept=".json" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RoiEditor } from '@zzalai/leafer-multi-roi'
import '@zzalai/leafer-multi-roi/dist/leafer-multi-roi.css'

const roiEditor = ref<InstanceType<typeof RoiEditor> | null>(null)
const imageUrl = ref('https://picsum.photos/1280/1080')
const imageSource = computed(() => ({
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

## Use Cases

- **Image Annotation**: Annotate regions of interest on images
- **Object Detection**: Generate training data for object detection models
- **Image Analysis**: Mark specific regions for analysis
- **Medical Imaging**: Mark lesion areas on medical images
- **E-commerce**: Mark different parts on product images

## Keyboard Shortcuts

> ⚠️ **Note**: Hotkeys are disabled by default. Explicitly set `options.enableHotkeys: true` during initialization to enable them. Each `RoiEditor` component instance manages hotkeys independently, supporting multiple concurrent instances without conflicts.

| Shortcut | Function |
|----------|----------|
| V | Select tool |
| M | Rectangle tool |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Delete | Delete selected region |
| Ctrl++ | Zoom in |
| Ctrl+- | Zoom out |
| Ctrl+0 | Reset zoom |
| Alt | Show/hide shortcut hints |

### Enabling Hotkeys

```vue
<RoiEditor
  :imageSource="imageSource"
  :options="{ enableHotkeys: true }"
/>
```

## Exposed Methods

- `getROIAnnotations()`: Get all ROI annotation data
- `getImageInfo()`: Get image information
- `exportCanvasJSON()`: Export canvas information as JSON string
- `importCanvasJSON(jsonString, options)`: Import canvas information from JSON string
- `loadImage()`: Manually load image
- `undo()`: Undo the last operation
- `redo()`: Redo the last undone operation
- `selectTool()`: Switch to selection tool
- `rectangleTool()`: Switch to rectangle drawing tool
- `deleteSelected()`: Delete selected regions
- `zoomIn()`: Zoom in the canvas
- `zoomOut()`: Zoom out the canvas
- `resetZoom()`: Reset zoom level

## CSS Customizable Variables

```css
:root {
  /* Color variables */
  --leafer-roi-color-primary: #007aff; /* Primary color */
  --leafer-roi-color-background: #f5f5f5; /* Background color */
  --leafer-roi-color-background-light: #f0f0f0; /* Light background color */
  --leafer-roi-color-white: #fff; /* White */
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
  --leafer-roi-padding-error: 20px; /* Error message padding */
  --leafer-roi-padding-error-button: 8px 16px; /* Error button padding */

  /* Border radius */
  --leafer-roi-border-radius-tool-button: 4px; /* Tool button border radius */
  --leafer-roi-border-radius-hotkey: 2px; /* Hotkey hint border radius */
  --leafer-roi-border-radius-overlay: 8px; /* Overlay border radius */
  --leafer-roi-border-radius-zoom: 8px; /* Zoom control border radius */

  /* Shadow */
  --leafer-roi-shadow-tool-button: 0 2px 4px rgba(0, 0, 0, 0.1); /* Tool button shadow */
  --leafer-roi-shadow-tool-button-active: 0 2px 4px rgba(0, 122, 255, 0.3); /* Tool button active shadow */
  --leafer-roi-shadow-tool-button-hover: 0 4px 6px rgba(0, 0, 0, 0.1); /* Tool button hover shadow */
  --leafer-roi-shadow-overlay: 0 4px 12px rgba(0, 0, 0, 0.1); /* Overlay shadow */
  --leafer-roi-shadow-zoom: 0 2px 8px rgba(0, 0, 0, 0.15); /* Zoom control shadow */

  /* Animation */
  --leafer-roi-transition-time: 0.2s; /* Transition animation duration */
  --leafer-roi-animation-gradient: 2s; /* Gradient animation duration */
}
```

## Events

- `roiChange`: Triggered when ROI changes
- `loadStart`: Triggered when image starts loading
- `loadSuccess`: Triggered when image loads successfully
- `loadError`: Triggered when image fails to load
- `undoStateChange`: Triggered when undo state changes
- `redoStateChange`: Triggered when redo state changes

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- Vue 3.3.0+
- LeaferUI 2.1.0+
- Tinykeys 4.0.0+
- @zzalai/leafer-undo-redo 1.0.3+

## License

MIT License

## Contributing

Welcome to submit issues and pull requests!
