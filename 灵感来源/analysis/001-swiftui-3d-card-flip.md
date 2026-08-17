# SwiftUI 3D Card Flip（SUCODEE）

> 分析日期：2026-07-04  
> 分类：motion-design  
> 状态：已复刻为 React 组件  
> 来源：社交媒体参考（SUCODEE · SwiftUI 3D Card Flip）

## 参考截图

用户通过 Cursor 对话提供的截图，展示 SwiftUI 实现的双面卡片 Y 轴 3D 翻转，点击触发 spring 动画。

核心代码（截图中可见）：

```swift
ZStack {
    front
        .opacity(flipped ? 0 : 1)
    back
        .opacity(flipped ? 1 : 0)
}
.clipShape(RoundedRectangle(cornerRadius: 20))
.rotation3DEffect(.degrees(flipped ? 180 : 0), axis: (x: 0, y: 1, z: 0))
.onTapGesture {
    withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
        flipped.toggle()
    }
}
```

## 效果概述

- **交互**：点击卡片，绕 **Y 轴** 旋转 180°，从正面切到背面
- **视觉**：旋转过程中 front/back 通过 **opacity 交叉淡入淡出**（非 backface-visibility 方案）
- **动效**：Spring 物理动画（response ≈ 0.6s，damping ≈ 0.8，轻微回弹）
- **形态**：圆角矩形卡片（cornerRadius 20），竖版比例约 3:4

## 技术栈

| 类别 | SwiftUI 原版 | 本项目复刻 |
|------|-------------|------------|
| 3D 变换 | `rotation3DEffect` | CSS `perspective` + `rotateY` / `rotateX` |
| 双面内容 | `ZStack` + opacity | 绝对定位双层 + opacity 或 `backface-visibility` |
| 动画 | `.spring(response:dampingFraction:)` | CSS `cubic-bezier` 近似 spring |
| 圆角裁剪 | `clipShape(RoundedRectangle)` | `border-radius` + `overflow: hidden` |
| 交互 | `onTapGesture` | `onClick` / `onKeyDown`（可访问性） |

## 实现方式

### 1. 结构（React）

```tsx
<div className="perspective">
  <div className={flipped ? 'rotate-y-180' : ''} style={{ transition: spring }}>
    <div className="face front">{front}</div>
    <div className="face back">{back}</div>
  </div>
</div>
```

### 2. 两种翻转模式

**A. Opacity Swap（与 SwiftUI 参考一致）**

- 旋转同时：`front opacity 1→0`，`back opacity 0→1`
- 实现简单，适合正反面都是「平面内容」
- 90° 时两面各 50% 透明度，会有短暂叠影（设计可接受）

**B. Backface（真实 3D 卡片）**

- `backface-visibility: hidden`
- 背面预先 `rotateY(180deg)`
- 旋转到 90° 时只看到侧面边缘，更「实体卡」

### 3. 关键参数

| 参数 | SwiftUI 值 | CSS / React 映射 |
|------|-----------|------------------|
| 旋转轴 | Y `(0,1,0)` | `rotateY(180deg)` |
| Spring response | 0.6 | `transition-duration: 600ms` |
| Damping | 0.8 | `cubic-bezier(0.34, 1.15, 0.64, 1)` |
| 圆角 | 20 | `rounded-[20px]` |
| 比例 | 300×400 | `aspect-[3/4]` |

### 4. 可扩展变体（本项目 `FlipCard` 组件）

| 变体 | 说明 | 适用场景 |
|------|------|----------|
| **Y 轴 flip** | 左右翻，像扑克牌 | 作品集卡片正面图 ↔ 背面详情 |
| **X 轴 flip** | 上下翻 | 日历、通知展开 |
| **Opacity 模式** | 贴近 SwiftUI 参考 | 快速原型 |
| **Backface 模式** | 真实双面卡 | 高端 UI、实体感 |
| **Flip + Info** | 背面展示 goal/action/result | 接入 `PortfolioCard` 元数据 |
| **Scroll-trigger flip** | 滚动到视口自动翻 | 叙事型长页 |
| **Drag-to-flip** | 拖拽角度控制旋转 | 交互探索（需 JS 驱动 transform） |

### 5. 落地到本项目

- 组件：`src/components/FlipCard.tsx`
- 可接入：`CardStage` 的 `CardFace`，点击当前卡片翻转显示 `InfoPanel` 内容
- 与现有 Cover Flow 不冲突：仅 flat 模式下对 active 卡片启用 flip

## 参考文献

- [MDN — rotateY()](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotateY) — 3D Y 轴旋转
- [MDN — perspective](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective) — 透视深度
- [MDN — backface-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility) — 背面隐藏方案
- [Apple — rotation3DEffect](https://developer.apple.com/documentation/swiftui/view/rotation3deffect(_:axis:anchor:anchorz:perspective:)) — SwiftUI 原版 API
- [Apple — spring animation](https://developer.apple.com/documentation/swiftui/animation/spring(response:dampingfraction:blendduration:)) — Spring 参数含义
- [CSS spring() easing](https://developer.chrome.com/docs/css-easing/spring-easing) — 未来可用原生 spring 缓动

## 复刻记录

| 日期 | 动作 | 备注 |
|------|------|------|
| 2026-07-04 | 创建分析文档 | 基于用户截图 |
| 2026-07-04 | 实现 `FlipCard.tsx` | Y/X 轴 + opacity/backface 双模式 |
