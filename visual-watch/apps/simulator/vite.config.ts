import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 模拟器固定 5174，与根目录作品集（5173）并行，互不抢端口
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
})
