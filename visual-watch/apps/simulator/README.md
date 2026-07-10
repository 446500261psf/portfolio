# Cove 潭面模拟器

Web 端 Phase 0 原型：**3D 超椭球鹅软石表壳** + **曲面凹潭动态场**（Three.js）。

## 运行

```bash
cd visual-watch/apps/simulator
npm install
npm run dev
```

## 3D 实现

- **超椭球表壳**（n=4.5，长宽比 1.156:1）：`createSuperellipsoidGeometry` + 前盖开窗
- **凹面潭网格**：`basinZ(x,y)` 在 3D 表壳上内凹，非平面 Canvas
- **曲面粒子**：在 (x,y) 参数域模拟，映射到 `basinZ` 曲面高度
- **潭面 Shader**：色场随 `vRho` 在曲面上变化 + Fresnel 边缘光
- **2.5D 唇边**：`createLipRing` 沿超椭圆岸隆起
- **交互**：OrbitControls 拖拽旋转、滚轮缩放

## 功能

- 六舒适区原型 + 四时相 + CZM 滑杆
- 抬腕亮潭（边缘光 boost）
