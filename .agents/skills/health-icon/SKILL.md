---
name: health-icon
description: "Design HUAWEI Health / HeartLine feature icons using soft geometry and local overlap depth. Use when creating or revising in-app icons, figure-action constructions, point-line-face element kits, or heartline.icon.* samples in Figma. Parent DNA: health-design-language (icons inherit only soft geometry + local depth)."
license: MIT
compatibility: Agent-agnostic. Requires health-design-language. Parallel to Icons · Feature Samples (HarmonyOS).
metadata:
  author: HUAWEI Health Design System
  version: "0.1.0"
  brand: "HeartLine / HUAWEI Health"
  figmaPage: "Icons · HeartLine DNA"
  alignsWith: "health-design-language@1.0.0"
---

# health-icon

> Icons inherit **two DNA rules only**: soft geometry · local overlap depth.  
> Build from **点 / 线 / 面**. Prefer **2–3 marks** per icon. Soft shadows OK **only at overlaps**.

## When to use

- New feature icons for Health / Exercise / Activity
- Figure-action constructions (run, walk, stand, yoga…)
- Element kits (point / line / face) for the icon system
- Revising `heartline.icon.*` samples in Figma

**Do not use for**

- Launcher app icons (see App Icon Samples)
- Replacing HarmonyOS `sys.symbol.*` legacy board unless asked
- Illustrations / card-flat art (`health-illustration`)

## Read order

1. `health-design-language` → `references/icons.md` (parent rules)
2. `references/elements.md` — 点线面 kit
3. `references/figure-actions.md` — human action constructions
4. Figma: **Icons · HeartLine DNA** → boards `Icon Elements · 点线面` + `Figure Actions · 构成`

## The two rules

| Rule | Do | Don’t |
|------|----|-------|
| **软几何** | Circles, arcs, ROUND caps/joins, soft blobs | Sharp spikes, square caps, jagged detail |
| **交叠深度** | Darker under-face / soft contact shadow **only where layers cross** | Global drop shadow under the whole icon |

## Construction budget

- **1 idea** per icon  
- **2–3 marks** typical (point + line + face combinations)  
- Optical **28×28** in **48×48** cell  
- Stroke when used ≈ **2.25**  
- Filled faces welcome  

## States (On Dark first)

| State | Color |
|-------|-------|
| Default | `#FFFFFF` |
| Active | `#FD8F1B` |
| AI | `#7A6FD1` |
| Disabled | `#595E66` |

## Workflow

1. Pick metaphor (one verb / object)  
2. Assemble from element kit (点/线/面) — see Figma board  
3. Where shapes overlap, add **local depth** (under tint ± soft shadow)  
4. Check soft geometry at 100% and 24px scale  
5. Deliver on dark plate first; light plate optional  

## Naming

`heartline.icon.{name}` — e.g. `heartline.icon.run`

## Sibling skills

| Skill | Boundary |
|-------|----------|
| `health-design-language` | Brand DNA parent |
| `health-illustration` | Card art — not 24px icons |
| Harmony Feature Samples | Legacy parallel — keep unless migrating |
