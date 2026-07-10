# Cove 潭面模拟器

## 外形工作室（当前）

**2D 三视图轮廓编辑器** — 浅灰工程图背景，滑杆控制超椭圆表盘轮廓，暂不使用 3D。

```bash
cd visual-watch/apps/simulator
npm install
npm run dev
```

- 正视图 / 侧视图 / 俯视图 SVG 轮廓
- 超椭圆指数 n、宽、高、厚度（mm）实时同步
- 投影对齐虚线 + 尺寸标注

## 后续

- 由三视图轮廓挤出/旋转生成 3D 表壳
- 潭面动态场贴合曲面
