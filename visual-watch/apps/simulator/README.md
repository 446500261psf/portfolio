# Cove 潭面模拟器

Web 端 Phase 0 原型：超椭圆鹅软石 2.5D 表体 + 舒适区动态场渲染。

## 运行

```bash
cd visual-watch/apps/simulator
npm install
npm run dev
```

浏览器打开终端提示的本地地址（通常 `http://localhost:5173`）。

## 功能

- **超椭圆表体**：n=4.5，长宽比 1.156:1，SVG 精确路径裁剪
- **2.5D 鹅软石外壳**：渐变中框、唇边高光、侧键、潭口岸线
- **六舒适区原型**：深潭 / 暖流 / 跃泉 / 静岸 / 紊流 / 空潭
- **四时相**：Dwelling / Approach / Crossing / Drift
- **CZM 滑杆**：激活度 / 开放度 / 稳定度实时 morph
- **cove-field 引擎**：粒子 + 色场 + 边缘光 + 呼吸调制

## 构建

```bash
npm run build
npm run preview
```
