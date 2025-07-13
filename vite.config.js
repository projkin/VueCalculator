import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}
  },
  build: {
    lib: {
      entry: 'src/widget.js',
      name: 'CalculatorWidget',
      fileName: () => 'index.js',
      formats: ['iife']
    },
    assetsInlineLimit: 10000000, // Инлайнить все изображения до 10 МБ
    rollupOptions: {
      output: {
        name: 'CalculatorWidget',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return assetInfo.name;
        }
      }
    }
  }
})
