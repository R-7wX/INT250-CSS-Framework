import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Add this import
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(), // Add this here
    tailwindcss(),
  ],
})