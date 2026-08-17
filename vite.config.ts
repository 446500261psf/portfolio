import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// 部署在 GitHub Pages 项目站（username.github.io/<仓库名>/）时由 CI 注入 BASE_PATH=/<仓库名>/
// 本地开发不设置则使用根路径 /
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        demo: 'demo.html',
      },
    },
  },
  server: {
    // 避免浏览器或中间层缓存 @vite/client 与模块，导致一直看到旧界面
    headers: {
      'Cache-Control': 'no-store',
    },
    // 作品集固定 5173；Cove 模拟器在 visual-watch/apps/simulator 使用 5174
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
