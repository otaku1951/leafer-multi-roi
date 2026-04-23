import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'LeaferjsMultiRoi',
      formats: ['es', 'umd'],
      fileName: (format) => `leaferjs-multi-roi.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    // 构建选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 去掉 console
        drop_debugger: true, // 去掉 debugger
        pure_funcs: ['console.log'] // 移除 console.log 函数调用
      }
    }
  }
})