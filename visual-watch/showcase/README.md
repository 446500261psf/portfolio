# Cove Watch — 接入 v2 作品集

本目录是 Cove Watch 对外展示用的成品资产，供 [`sifan.pan.v2`](https://github.com/446500261psf/sifan.pan.v2) 作品集引用。

## 线上模拟器

`portfolio` 仓库的 Pages 部署已包含模拟器（见 `.github/workflows/deploy-pages.yml`）：

```
https://446500261psf.github.io/portfolio/simulator/
```

四个标签：外形工作室 / 3D 白膜 / 正视预览 / 整机交互。合并到 `main` 后随主站一起发布。

模拟器的 Vite `base` 是 `'./'`，全部资源走相对路径，所以放在任意子目录都能直接跑，不需要注入 `BASE_PATH`。

## 资产清单

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `cover.png` | 1360×764（16:9） | Playground 封面。16:9 在 12 列网格里占 6 列（半宽） |
| `01-whole.png` | 1360×1020 | 整机四分之三：表壳 + 一体化表带 + 手腕 |
| `02-answer.png` | 1360×1020 | 轻触后的精确答案（`09:00 / PRIORITY TASK`） |
| `03-strap-interface.png` | 1360×1020 | 背面连接结构：接口块、表带出口、传感器窗、指拨 |
| `04-front-pool.png` | 1360×1020 | 正视 Pool 光场 |
| `05-technical-drawing.png` | 1640×1122 | 外形工作室三视图工程图 |

全部由模拟器实机截图导出，不是渲染稿或贴图合成。要重新导出就跑模拟器再截一次，形状参数改了图也跟着变。

## 接入步骤

在 `sifan.pan.v2` 仓库（分支 `v2.1`）里：

```bash
# 1. 素材
mkdir -p public/portfolio/cove-watch
cp <portfolio>/visual-watch/showcase/*.png public/portfolio/cove-watch/

# 2. 代码（两处，共 10 行）
git apply <portfolio>/visual-watch/showcase/v2-portfolio.patch

# 3. 验证子路径部署
BASE_PATH=/sifan.pan.v2/ npm run build
BASE_PATH=/sifan.pan.v2/ npx vite preview
```

补丁包含两处改动：

1. **`src/data/playground.ts`** — 新增 `cove-watch` 条目（cover + href 指向线上模拟器）
2. **`src/components/PlaygroundCard.tsx`** — cover 路径改走 `publicUrl()`

第 2 处是必需的 bug 修复，不只是风格问题：原本写的是

```ts
const cover = item.cover!.startsWith('/') ? item.cover : `/${item.cover}`
```

在 Pages 子路径 `/sifan.pan.v2/` 下会请求 `/portfolio/cove-watch/cover.png` 而 404。之前 `playgroundItems` 里只有 `demo` 条目、没有 `cover` 条目，所以这个分支从未被执行过，问题一直没暴露。

## 已验证

在本地以 `/sifan.pan.v2/` 子路径起静态服务器实测：

- Playground tile 渲染为 504×283，与 Claim Medal demo 并排
- cover 请求 `/sifan.pan.v2/portfolio/cove-watch/cover.png` → 200，`naturalWidth > 0`
- tile 链接指向 `https://446500261psf.github.io/portfolio/simulator/`
- `tsc -b && vite build` 通过，无新增控制台报错

## 放 Playground 而不是 Work

Work 区是华为 Health 的在职项目（`workProjects`，带 mockup 布局与业务指标）。Cove Watch 是自主概念产品——自己定 PRD、自己做形态与交互，没有业务方，因此归 Playground 的「design experiments」。

若以后要升级成 Work 级案例（长图 + 指标 + 用户旅程），可以用 `WorkProject` 的 `panelLayout: 'exposure'`，把上面 01–05 五张图分配到 `exposureCases`。
