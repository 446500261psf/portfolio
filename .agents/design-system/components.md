# Design System — Component Inventory

**Figma File:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System  
**Total components built:** 11 component sets · MetricTile 16 + TodayP0Card 4 + other core variants

---

## 1. Button

**Page:** 04 · Button  
**Component Set Node ID:** `4:14`  
**Variants:** 6 (Style × State)

| Variant | Node ID | Description |
|---|---|---|
| Style=Primary, State=Default | `4:2` | Filled brand background, white text |
| Style=Primary, State=Disabled | `4:4` | Subtle gray background, disabled text |
| Style=Secondary, State=Default | `4:6` | Transparent, brand border, brand text |
| Style=Secondary, State=Disabled | `4:8` | Transparent, default border, disabled text |
| Style=Tertiary, State=Default | `4:10` | Transparent, no border, brand text |
| Style=Tertiary, State=Disabled | `4:12` | Transparent, no border, disabled text |

**Tokens bound:** color/brand/default, color/surface/subtle, color/text/inverse, color/text/brand, color/text/disabled, color/border/default, color/border/strong, radius/md  
**Size:** 160×44px (Medium), paddingH=20, paddingV=12

---

## 2. BottomNav

**Page:** 05 · BottomNav  
**Component Set Node ID:** `4:67`  
**Variants:** 4 (Active tab)

| Variant | Node ID | Active Tab |
|---|---|---|
| Active=Today | `4:15` | Today tab highlighted |
| Active=Health | `4:28` | Health tab highlighted |
| Active=Exercise | `4:41` | Exercise tab highlighted |
| Active=Devices | `4:54` | Devices tab highlighted |

**Tokens bound:** color/surface/page, color/text/brand, color/text/secondary, color/icon/brand, color/icon/secondary, color/border/default  
**Size:** 390×56px, 4 tab items evenly distributed

---

## 3. Header

**Page:** 06 · Header  
**Component Set Node ID:** `4:77`  
**Variants:** 2 (Style)

| Variant | Node ID | Description |
|---|---|---|
| Style=Large | `4:68` | Tab root header — large title 28px Bold + subtitle + avatar |
| Style=Standard | `4:73` | Sub-page header — 17px Semi Bold title + back icon + right action |

**Tokens bound:** color/surface/page, color/text/primary, color/text/secondary, color/icon/default, color/border/default  
**Size:** 390×96px (Large), 390×56px (Standard)

---

## 4. Card

**Page:** 07 · Card  
**Component Set Node ID:** `6:86`  
**Variants:** 2 (Type)

| Variant | Node ID | Description |
|---|---|---|
| Type=Default | `6:78` | Text-only card: title + body, 16px padding |
| Type=Media | `6:81` | Media card: 140px image placeholder + title + meta |

**Tokens bound:** color/surface/elevated, color/text/primary, color/text/secondary, color/border/default, color/surface/subtle, radius/lg  
**Size:** 358×88px (Default), 358×220px (Media)

---

## 5. ListRow

**Page:** 08 · ListRow  
**Component Set Node ID:** `6:100`  
**Variants:** 2 (HasIcon)

| Variant | Node ID | Description |
|---|---|---|
| HasIcon=False | `6:87` | Title + meta + chevron, no leading icon |
| HasIcon=True | `6:93` | Branded icon container + title + meta + chevron |

**Tokens bound:** color/surface/page, color/text/primary, color/text/secondary, color/icon/secondary, color/icon/brand, color/border/default  
**Size:** 390×56px

---

## 6. MetricTile

**Page:** 09 · MetricTile  
**Component Set Node ID:** `34:238`  
**Variants:** 16 (`Metric` × `Span`)

### Metrics（功能特性）

| Metric | Tab 场景 | 示例值 | Accent |
|---|---|---|---|
| Steps | Today / Health | 8,521 steps | Blue |
| HeartRate | Health | 72 bpm | Red |
| Sleep | Health / Today | 7h 12m | Purple |
| SpO2 | Health | 98% | Teal |
| Calories | Exercise / Today | 486 kcal | Orange |
| Distance | Exercise | 5.2 km | Green |
| ActiveMin | Exercise / Today | 42 min | Gold |
| Battery | Devices | 78% | Gray-blue |

### Span

| Span | Size | Layout |
|---|---|---|
| **1pr** | 168×168 | 方卡：icon + value + unit/period |
| **2pr** | 358×168 | 通栏：icon + value/delta + sparkline |

### 宽度算法

```
content = 390 − 16×2 = 358
gap     = 22
1pr     = (358 − 22) / 2 = 168
2pr     = 358
```

Deep link: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=34-238

---

## 7. SectionHeader

**Page:** 10 · SectionHeader  
**Component Set Node ID:** `6:121`  
**Variants:** 2 (HasSeeAll)

| Variant | Node ID | Description |
|---|---|---|
| HasSeeAll=False | `6:116` | Title only, 17px Semi Bold |
| HasSeeAll=True | `6:118` | Title + "See all" link in brand text color |

**Tokens bound:** color/text/primary, color/text/brand  
**Size:** 358×28px

---

## 8. Chip

**Page:** 11 · Chip  
**Component Set Node ID:** `6:128`  
**Variants:** 3 (State)

| Variant | Node ID | Description |
|---|---|---|
| State=Unselected | `6:122` | Outlined chip, secondary text |
| State=Selected | `6:124` | Brand-filled chip, inverse text |
| State=Active | `6:126` | Brand-subtle fill, brand text |

**Tokens bound:** color/brand/default, color/brand/subtle, color/text/secondary, color/text/inverse, color/text/brand, color/border/default, radius/full  
**Size:** ~80×32px (HUG width)

---

## 9. EmptyState

**Page:** 12 · EmptyState  
**Component Set Node ID:** `6:139`  
**Variants:** 2 (HasAction)

| Variant | Node ID | Description |
|---|---|---|
| HasAction=False | `6:129` | Illustration + title + description |
| HasAction=True | `6:133` | Illustration + title + description + "Get Started" CTA |

**Tokens bound:** color/text/primary, color/text/secondary, color/text/inverse, color/brand/default, color/surface/subtle, radius/md  
**Size:** 358×260px (no action), 358×320px (with action)

---

## 10. Badge

**Page:** 13 · Badge  
**Component Set Node ID:** `6:152`  
**Variants:** 8 (Type × Color)

| Variant | Node ID | Description |
|---|---|---|
| Type=Dot, Color=Brand | `6:140` | 8×8px brand dot |
| Type=Dot, Color=Success | `6:141` | 8×8px success dot |
| Type=Dot, Color=Warning | `6:142` | 8×8px warning dot |
| Type=Dot, Color=Error | `6:143` | 8×8px error dot |
| Type=Count, Color=Brand | `6:144` | Pill with count "3", brand fill |
| Type=Status, Color=Success | `6:146` | "Active" pill, success fill |
| Type=Status, Color=Warning | `6:148` | "Pending" pill, warning fill |
| Type=Status, Color=Error | `6:150` | "Alert" pill, error fill |

**Tokens bound:** color/brand/default, color/feedback/success, color/feedback/warning, color/feedback/error, color/text/inverse, radius/full  
**Size:** Dot=8×8px, Count≈24×18px, Status≈60×20px

---

## 11. TodayP0Card

**Page:** 17 · TodayP0Card  
**Component Set Node ID:** `38:34`  
**Variants:** 4 (`Kind`)  
**Persona:** 减肥核心 — 体重 + 饮食摄入 + 睡眠保障 + 有氧平衡  
**Usage:** Today 首页顶部 P0 区（先组件、再组页）

| Kind | Node ID | Span | Size | Visual |
|---|---|---|---|---|
| WeightTrend | `37:5` | 2pr | 358×200 | 7-day weight line + current kg + weekly change |
| DietGap | `38:2` | 1pr | 168×168 | Calorie deficit (goal − intake) + intake bar |
| SleepScore | `38:12` | 1pr | 168×168 | Last-night sleep score /100 + duration note |
| AerobicGap | `38:24` | 1pr | 168×168 | Minutes remaining to today’s cardio goal |

**Locale:** English UI copy (product language).

### Sample data (Mid-fi)

| Kind | Primary | Secondary |
|---|---|---|
| WeightTrend | 68.4 kg | ↓ 0.6 kg · 7 days |
| DietGap | −420 kcal deficit | In 1,580 / Goal 2,000 |
| SleepScore | 82 /100 | 7h 12m · solid deep sleep |
| AerobicGap | 18 min to goal | Done 12 / Goal 30 |

**Tokens bound:** color/surface/elevated, color/surface/subtle, color/text/primary·secondary·tertiary·success·warning, color/brand/default, color/feedback/success·warning, radius/xl·full  
**Grid:** 与 MetricTile 一致 — `content=358` · `gap=22` · `1pr=168` · `2pr=358`  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=38-34

---

## 12. Icons (Phosphor)

**Page:** 18 · Icons (`54:2`)  
**Source:** [Phosphor Icons](https://phosphoricons.com) · MIT · Regular + Fill  
**Sets:** 30 (`icon.<feature>`) · **Variants each:** Style=`Outline|Fill` × Color=`Black|White` · **Size:** 18×18  
**Docs:** [icons.md](./icons.md)

Deep link: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=54-2

---

## 13. WeightCard

**Page:** 19 · WeightCard  
**Component Set Node ID:** `75:122`  
**Variants:** 3 (`Period` = Day | Week | Month)  
**Docs:** [weight-card.md](./weight-card.md)

| Period | Content |
|---|---|
| Day | Today kg + 12 smart-scale metrics + AI tip |
| Week | 7-day line + composition deltas + AI tip |
| Month | 30-day line + start/now summary + AI tip |

**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=75-122

---

## 14. WeeklyPlan

**Page:** `20 · WeeklyPlan` (`85:2`)  
**Docs:** [weekly-plan.md](./weekly-plan.md)

| Asset | Node ID | Notes |
|---|---|---|
| `PlanWeekRow` set | `86:95` | Status = Done \| Current \| Upcoming \| Missed |
| `Sticker/Plan/*` × 8 | `86:2` … `86:30` | 周目标达成奖励贴纸 |
| Mid-fi screen | `88:5` | 8-week goal −4.0 kg · week list · sticker wall |

**Goal sample:** 2 months · lose **8 jin (4.0 kg)** · AI weekly plan · sticker per achieved week.

**Deep links:**  
- Screen: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=88-5  
- PlanWeekRow: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=86-95

---

## 15. WeekFocusCard

**Page:** `20 · WeeklyPlan` (`85:2`)  
**Component Set Node ID:** `95:343`  
**Variants:** 7 (`Week` = 1…7)  
**Docs:** [week-focus-card.md](./week-focus-card.md)

| Zone | Content |
|---|---|
| Title + subtitle | Week N · purpose · how to train |
| Targets | 3 metrics + fat-loss kg + reward sticker |
| Schedule | Mon–Sun day rows (progressive sessions) |
| Recommended | 1 course + 1 meditation |

**Goal:** lose **5.0 kg** fat in **7 weeks** (progressive intensity · daily plan).

**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=95-343

---

## Foundation Documentation Frames

| Page | Node ID | Contents |
|---|---|---|
| 01 · Color | `7:6` | Color swatch grid — 6 groups of semantic tokens |
| 02 · Typography | `7:91` | 13 text style specimens with labels |
| 03 · Spacing | `7:190` | Spacing bars (10 steps) + Radius scale grid (6 shapes) |
| 05 · IA / UX | `6:153` | 4-tab IA frame: Today / Health / Exercise / Devices with sub-sections |
