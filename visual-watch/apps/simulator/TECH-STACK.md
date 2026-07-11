# Cove Simulator 技术栈与效果演进日志

> 本文档记录模拟器的技术选型、各模块实现方案，以及**每次技术变更与效果变化的因果关系**。
> 每次修改代码时同步更新「演进日志」一节。

最后更新：2026-07-11

---

## 1. 技术栈总览

| 层 | 选型 | 用途 |
|----|------|------|
| 构建 | Vite 8 + TypeScript | 开发服务器、打包 |
| UI 框架 | React 19 | 组件与状态管理 |
| 3D 渲染 | Three.js + @react-three/fiber | WebGL 场景（声明式） |
| 3D 工具 | @react-three/drei | OrbitControls / Bounds / 相机等封装 |
| 2D 制图 | 原生 SVG + Canvas 2D | 外形工作室三视图、尺寸线 |
| 设计资产 | Figma MCP 导出 PNG | 表盘光场关键帧位图 |
| 持久化 | localStorage | 记住上次调整的参数 |

无后端，纯静态前端应用。

---

## 2. 各模块实现方案

### 2.1 外形工作室（2D 三视图）

- **超椭圆方程** `|x/a|ⁿ + |y/b|ⁿ = 1` 定义表壳正面轮廓，n 由滑杆控制（2≈椭圆，4–5≈圆角方）
- SVG path 由参数方程采样生成；轮廓与尺寸线共用同一 `SCALE=5.5`，保证对齐
- 参数单位：场景 1 单位 = 1mm

### 2.2 3D 白膜 / 镜面玻璃

- **几何**：`createWatchCaseGeometry` 隐式挤出 —— 正面超椭圆沿 ±Z 各挤出半球形穹顶；
  上下半球**共享单一赤道环**（消除侧面中线接缝），极点用单顶点扇面封口
- **玻璃材质**：`meshPhysicalMaterial`，`#050505`、`transmission≈0.22`、`clearcoat=1`
- **反射环境**：`ReflectionStudioEnv` —— 两块可调 emissive 柔光板（位置/大小/强度/色温）
  经 PMREM 烘焙成环境贴图，驱动 `envMapIntensity`；反射是**大面积可控光带**而非点光源
- **相机**：`PerspectiveCamera` + OrbitControls；首次进入由 `Bounds fit` 自动取景，
  之后恢复持久化的方位角/俯仰角/距离

### 2.3 正视预览（3D 玻璃实机演示 · Figma 表盘光场）

数据流：

```
Figma 表盘页（sZDBW36idsJ7op8FVhYq6W）
  → MCP 逐状态导出关键帧 PNG（972×972）
  → 白底泛洪转 alpha（构建期一次性处理）
  → public/dial/*.png
  → THREE.TextureLoader（sRGB）
  → 3D 显示屏网格（超椭圆扇面，嵌于玻璃穹顶之下）
  → 加法混合（AdditiveBlending）透出玻璃
  → 关键帧余弦交叉淡化 + 呼吸 envelope（useFrame 逐帧驱动）
```

- **场景结构**：镜面玻璃外壳（`meshPhysicalMaterial`，同 3D 白膜页玻璃参数，
  柔光板 PMREM 反射）+ 内嵌 3D 显示屏 + OrbitControls 拖拽旋转
- **屏幕嵌入深度**：`dialScreenZ` 由挤出剖面反解 —— 屏幕外缘（s=0.94）在
  `z = 0.88·c·(1−0.94ⁿ)^(1/n)`，保证任意 n 值下屏幕完整贴在穹顶正下方不穿模
- **玻璃下自发光**：屏幕用 `AdditiveBlending + premultipliedAlpha`——黑色区域
  不加光（保留玻璃自身反射），光带把光「透出」玻璃，模拟 AMOLED 屏下发光；
  玻璃 `depthWrite=false` 让内部屏幕通过深度测试
- **6 种状态**：Steady / Gather / Drift / Lift / Grounded / Low，共 10 帧关键帧
- **帧间动画**：同状态多关键帧用 `0.5 − 0.5·cos(2πt/loopSec)` 往返交叉淡化，连续 morph 永不硬切
- **呼吸**：亮度按 `breathBpm`（4–7bpm）正弦调制 ±5–12%，对应 PRD §3.2 各原型视觉签名
- **状态渡越**：切换状态时旧场 900ms smoothstep 淡出、新场淡入（PRD §3.4 禁止 ≥500ms 突变）
- **光源共享**：玻璃反射复用 3D 白膜页的柔光板参数（同一 `lights` 状态）

### 2.4 参数持久化

- `localStorage` key `cove-simulator-state-v1`，120ms 防抖写入
- 记住：标签页、外形滑杆、3D 光源、表盘状态、材质、3D 相机角度与 Orbit 缩放
- 读取时逐字段校验 + clamp，坏数据自动回退默认值

---

## 3. 演进日志（技术变更 ↔ 效果变化）

> 倒序排列。每条记录：**改了什么技术 → 效果为什么变好/变坏**。

### 2026-07-11 · 正视预览升级：2D 正交平贴 → 3D 玻璃实机演示

- **变更**：
  1. 正交相机 → 透视相机 + OrbitControls，可拖拽旋转观察
  2. 表盘面从「浮在壳体上方的平面」→「嵌入玻璃穹顶之下的 3D 显示屏」，
     嵌入深度 `dialScreenZ` 由挤出剖面方程反解，任意 n 值不穿模
  3. 屏幕材质 `NormalBlending` → `AdditiveBlending + premultipliedAlpha`
  4. 外壳从哑光黑 → 镜面玻璃（复用 3D 白膜页的柔光板 PMREM 反射与 lights 状态）
- **效果变化**：✅ 从「平面贴图对照稿」变成「实机演示」——正面看是玻璃反射
  叠加光场 UI（黑色区域保留玻璃高光，光带透出玻璃，像真的屏下 AMOLED）；
  旋转侧看能看到屏幕嵌在玻璃壳体内部
- **关键技术点**：加法混合天然适合自发光屏幕——黑像素加零光、亮像素加光，
  无需处理「屏幕遮挡玻璃反射」的层序问题；`premultipliedAlpha` 消除了
  位图透明角落的白色 RGB 溢出；玻璃 `depthWrite=false` 让内嵌屏幕可见

### 2026-07-11 · 正视预览重做：手绘 Canvas → Figma 关键帧位图

- **变更**：弃用 Canvas 2D 渐变手绘近似（`renderFigmaDial.ts`），改为直接加载 Figma
  逐状态导出的关键帧 PNG，`meshBasicMaterial` 多层叠加做交叉淡化
- **效果变化**：✅ 大幅变好。光带位置、颜色（Lift 琥珀 / Low 青绿 / Grounded 冷白）、
  边缘羽化与设计稿完全一致——手绘近似永远追不上设计稿本身
- **顺带修复的三个 bug**（非技术栈原因，是实现错误）：
  1. 正交相机 zoom 写死 → 改为随画布尺寸计算（之前表盘溢出只显示一角）
  2. 表盘面 z=0.999c 低于穹顶极点 z=c → 抬高到 1.02c（之前中心冒白斑）
  3. UV v 轴翻转 → Low 的底部光带曾跑到顶部

### 2026-07-11 · Orbit 相机持久化：Bounds 自动取景 → 球坐标恢复

- **变更**：`OrbitControls` 的方位角/俯仰角/距离存入 localStorage；
  有记录时跳过 `Bounds fit`（`fit={false}`），直接还原视角
- **效果变化**：✅ 刷新后视角不再跳回默认；首次进入仍自动取景，两者兼得

### 2026-07-11 · 参数持久化：内存 state → localStorage

- **变更**：新增 `simulatorStorage.ts` + `usePersistSimulator` 防抖 hook
- **效果变化**：✅ 每次进入不用从头调参

### 2026-07-10 · 反射方案：SpotLight/场景贴图 → emissive 柔光板 + PMREM

- **变更**：镜面反射先后试过 HDR 场景贴图（有杂景）、SpotLight（只有两个高光点），
  最终改为两块 emissive 平面烘焙 PMREM 环境贴图
- **效果变化**：✅ 反射变成**大面积可控光带**，位置/大小/强度/色温全部可调；
  场景贴图方案的杂乱反射消失；SpotLight 方案「两个点」的问题消失

### 2026-07-10 · 3D 几何：参数化半球拼接 → 共享赤道隐式挤出

- **变更**：上下半球原本各自生成顶点再拼接，改为共享单一赤道环的单网格；
  同时修复 `cosN(nu)` 误传弧度导致的破面
- **效果变化**：✅ 侧面中线接缝消失、V 形破面三角消失；法线连续，高光平滑

### 2026-07-10 · 2D 对齐：独立缩放 → 统一 SCALE

- **变更**：`pointsToSvgPath` 增加 `scale` 参数，轮廓与尺寸线统一 `SCALE=5.5`
- **效果变化**：✅ 三视图轮廓与尺寸标注不再错位

---

## 4. 已知取舍

| 决策 | 取舍 |
|------|------|
| 关键帧位图 vs 实时粒子场 | 位图保真度高、成本低；但无法做粒子级动态。PRD 的 cove-field 粒子引擎留给「潭面场」标签页 |
| PNG 白底泛洪转 alpha | Figma 导出的 PNG 背景是不透明白色；构建期一次性处理，运行时零开销 |
| 屏幕平面 vs 曲面屏 | 屏幕是平面网格嵌在穹顶下（真实腕表结构也是平屏+曲面玻璃）；未做曲面贴合，侧视极限角度下屏幕边缘可见平面感 |
| 加法混合 vs transmission 透射 | transmission 渲染内部物体依赖折射通道，暗色玻璃下屏幕几乎不可见；加法混合直接把屏幕光叠加在玻璃着色之上，效果直观且省一次透射 pass |
| watchCaseGeometry chunk 较大（~880KB） | Three.js 主体；已按标签页懒加载，首屏不受影响 |
