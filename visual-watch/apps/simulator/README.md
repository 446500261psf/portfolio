# Cove 潭面模拟器

独立 Vite 应用，**固定端口 5174**，可与根目录作品集（5173）同时打开。

| 页面 | 命令 | 地址 |
|------|------|------|
| 作品集 / 其他页面 | 仓库根目录 `npm run dev` | http://localhost:5173 |
| 本模拟器（外形 / 3D 白膜 / 正视预览） | `npm run dev`（本目录）或根目录 `npm run dev:simulator` | http://localhost:5174 |

```bash
# 终端 1 — 作品集
npm run dev

# 终端 2 — 模拟器
cd visual-watch/apps/simulator
npm install
npm run dev
```

也可在仓库根目录执行 `npm run dev:simulator`。生产构建预览同样占用 5174：`npm run preview` 或根目录 `npm run preview:simulator`（需先 `npm run build`）。

## 当前能力

- **外形工作室**：2D 三视图超椭圆轮廓 + 尺寸标注
- **3D 白膜**：共享赤道隐式挤出网格、镜面玻璃、柔光板反射
- **正视预览**：镜面玻璃与 Pool 发光壳层同面叠加，Figma 关键帧 morph
