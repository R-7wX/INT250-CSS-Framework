import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Use @vitejs/plugin-vue if using Vue
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // Integrated Tailwind v4 plugin
  ],
  resolve: {
    alias: {
      // This allows you to use '@' to refer to your 'src' directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})