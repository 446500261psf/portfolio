# Cove Watch

**鹅软石 2.5D 表体 × 舒适区动态场** —— 从 0 到 1 的腕上日程表达设备。

## 产品一句话

表盘是一块接近椭圆的鹅软石凹面；其中色彩与粒子持续流动，表达此刻身体与心理应处的舒适区——**没有文字，没有几何图标**。

## 文档

| 文档 | 说明 |
|------|------|
| [PRD v2.0](./docs/PRD.md) | 完整产品需求（形态、场态、硬件、App、路线图） |
| [Comfort Field System](./docs/COMFORT-FIELD-SYSTEM.md) | 舒适区动态场技术-设计规格（CZM、粒子、2.5D、渲染引擎） |

## v2.0 核心范式（相对 v1.0）

| v1.0（已废弃） | v2.0（当前） |
|----------------|--------------|
| 正圆表盘 | **超椭圆鹅软石 + 大 R 角** |
| 平面屏 | **2.5D 弧面潭口** |
| 几何形 = 任务 | **CZM 坐标 + 粒子/色场** |
| 静态可截图识别 | **动态 morph + 具身感受** |
| e-ink 优先 | **AMOLED 30fps 场渲染** |

## 目录规划

```
visual-watch/
├── docs/              # PRD + 场系统规格
├── apps/
│   └── simulator/     # Web 潭面模拟器 ✅
├── packages/
│   └── cove-field/    # 共享渲染内核（待提取）
├── firmware/
└── hardware/
```

## 快速体验 · 潭面模拟器

```bash
cd visual-watch/apps/simulator
npm install
npm run dev
```

- 超椭圆 n=4.5 鹅软石 2.5D 表体（SVG 精确路径）
- 六舒适区粒子场 + 四时相 + CZM 滑杆
