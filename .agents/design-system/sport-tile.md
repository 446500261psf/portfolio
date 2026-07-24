# SportTile · 运动入口瓷砖

**Master reference:** `Sport_Run · reference` (`113:1400`)  
**Component set:** `SportTile` (`115:692`)  
**Page:** Page 27 (`43:151`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=115-692

---

## Layout rules（对齐主稿）

文字与图标位置固定，**左对齐**，勿居中：

```
┌────────────── 112 ──────────────┐
│ 14px                             │
│   [icon 36×36]     ← top-left    │
│   6px gap                        │
│   Label 20 Semibold ← left       │
│                     bottom 10px  │
└──────────────────────────────────┘
```

| Token | Value |
|-------|-------|
| Size | **112×76** |
| Radius | 20 |
| Padding | top **12** · left/right **14** · bottom **10** |
| Gap | **6** |
| Align | `primary=MIN` · `counter=MIN`（左上） |
| Icon | Phosphor Fill · **36×36** · sport accent |
| Label | SF Compact Rounded Semibold **20** · `#111827` · `textAlign=LEFT` |

---

## Variant properties

| Property | Values |
|----------|--------|
| **Sport** | Run · Bike · Swim · Walk · Strength · Yoga |
| **State** | Default · Selected |

**Total:** 6 × 2 = **12**

| Sport | Icon | Accent |
|-------|------|--------|
| Run | `icon.run` | `#007AFF` |
| Bike | `icon.bike` | `#34C759` |
| Swim | `icon.swim` | `#3399E6` |
| Walk | `icon.walk` | `#FF9500` |
| Strength | `icon.strength` | `#FF3B30` |
| Yoga | `icon.yoga` | `#9650DF` |

| State | Fill | Stroke |
|-------|------|--------|
| Default | White | none |
| Selected | Accent @ 10% | Accent 1.5px |

---

## Usage

Exercise Hub (`111:619`) SportGrid → `SportTile/*` Default instances.

## Artifacts

- `/opt/cursor/artifacts/sport-tile-set.png`
- `/opt/cursor/artifacts/sport-tile-run.png`
