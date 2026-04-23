import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// 部署在 GitHub Pages 项目站（username.github.io/<仓库名>/）时由 CI 注入 BASE_PATH=/<仓库名>/
// 本地开发不设置则使用根路径 /
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  server: {
    // 避免浏览器或中间层缓存 @vite/client 与模块，导致一直看到旧界面
    headers: {
      'Cache-Control': 'no-store',
    },
    // 若 5173 已被「别的项目」占用，Vite 会报错；请先结束占用该端口的进程再启动
    port: 5173,
    strictPort: true,
  },
})
