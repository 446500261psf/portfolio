# SportTile · 运动入口瓷砖

**Master reference:** `Sport_Run` (`113:1358`)  
**Component set:** `SportTile` (`114:692`)  
**Page:** Page 27 (`43:151`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=114-692

---

## Anatomy

| Part | Spec |
|------|------|
| Size | **112×76** |
| Radius | 20 |
| Layout | Vertical · center · itemSpacing 8 · paddingTop 14 / bottom 12 |
| Icon | Phosphor `icon.*` Fill · **36×36** · sport accent color |
| Label | SF Compact Rounded Semibold **20** · `#111827` |

---

## Variant properties

| Property | Values |
|----------|--------|
| **Sport** | Run · Bike · Swim · Walk · Strength · Yoga |
| **State** | Default · Selected |

**Total:** 6 × 2 = **12** variants

### Sport → icon → accent

| Sport | Icon | Accent |
|-------|------|--------|
| Run | `icon.run` | `#007AFF` |
| Bike | `icon.bike` | `#34C759` |
| Swim | `icon.swim` | `#3399E6` |
| Walk | `icon.walk` | `#FF9500` |
| Strength | `icon.strength` | `#FF3B30` |
| Yoga | `icon.yoga` | `#9650DF` |

### State

| State | Fill | Stroke |
|-------|------|--------|
| Default | White | none |
| Selected | Accent @ 10% | Accent 1.5px |

---

## Usage

Exercise Hub sport grid uses Default instances (`111:619` · SportGrid).

## Artifacts

- `/opt/cursor/artifacts/sport-tile-set.png`
- `/opt/cursor/artifacts/sport-tile-run.png`
