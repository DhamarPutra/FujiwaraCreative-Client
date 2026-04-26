import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: '../Server/public',
    emptyOutDir: false,
    manifest: true,
    rollupOptions: {
      input: './src/main.tsx',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.fujiwaracreative.my.id',
        changeOrigin: true,
      },
    },
  },
})
