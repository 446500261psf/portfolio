# Mid-Fi Prototype — Screen Inventory

**Figma file:** `1ibE2wPPDAauJKaj1ft6AC`  
**Page:** `08 · Screens · Mid-fi` (page id: `3:5`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=3:5  
**Phone frame:** 390 × 844 px (iOS-standard viewport)  
**Fidelity:** Mid-fi — real typography, component-like modules, one brand accent (#007AFF), no hi-fi illustration

---

## Screen Inventory

| # | Screen | Node ID | Canvas X | Deep Link |
|---|--------|---------|----------|-----------|
| 1 | Today Home (EN · P0) | `45:2` | 0 | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=45:2 |
| — | Today Home · Legacy | `8:2` | 430 | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=8:2 |
| 2 | Health Hub | `8:81` | 430 | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=8:81 |
| 3 | Metric Detail (Heart Rate) | `10:2` | 860 | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=10:2 |
| 4 | Exercise Hub | `10:90` | 1290 | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=10:90 |
| 5 | Session Summary | `11:2` | 1720 | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=11:2 |
| 6 | Devices List | `11:68` | 2150 | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=11:68 |
| 7 | Device Detail / Connect | `11:127` | 2580 | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=11:127 |

---

## Design Tokens

### Colors
| Token | Hex | Role |
|-------|-----|------|
| Accent | `#007AFF` | Primary CTA, active tab, links |
| Background | `#F7F7F7` | Page background |
| Surface | `#FFFFFF` | Cards, headers, navs |
| Text Primary | `#1A1A1A` | Headlines, values |
| Text Secondary | `#6B6B6B` | Labels, subtitles |
| Text Tertiary | `#9E9E9E` | Units, hints, timestamps |
| Divider | `#E5E5E5` | Hairline separators |
| Red | `#FF3B30` | Heart rate, Move ring, alerts |
| Green | `#34C759` | Success, Exercise ring, health |
| Purple | `#9650DF` | Sleep metric |
| Orange | `#FF9500` | Running, warmup zone |

### Typography (SF Compact Rounded)
| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 72px | Bold | Hero metric values (heart rate, pace) |
| H1 | 28px | Bold | Page titles |
| H2 | 18–24px | Semi Bold | Section headers, card titles |
| Body | 13–15px | Regular / Medium | Primary content |
| Label | 11–12px | Regular | Secondary labels, units |
| Caption | 9–10px | Regular | Chart axis labels, timestamps |

### Spacing & Radius
- Screen horizontal margin: 16px
- Card gap: 12px
- Card corner radius: 12px (standard), 16px (featured card)
- Button radius: 30px (full pill CTA), 14px (small buttons)
- Bottom nav height: 83px (tab area 66px + safe area ~17px)
- Status bar height: 44px

---

## Screen Descriptions

### 01 · Today Home
**Active tab:** Today · **Locale:** English  
**Node:** `45:2` · https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/?node-id=45:2  
**Layout zones:**
- **Status bar** — 9:41, signal, battery
- **Header** — “Good morning” + “Today · Thu, Jul 24” + avatar
- **Today’s Plan (gap → effort)** — eyebrow `TODAY'S PLAN` + line: *Close the gap from where you are to today’s targets — time and effort still required.*  
  Gap rows (current → goal + remaining): Cardio `12 → 30 min · 18 min left` · Nutrition `1,580 → 2,000 kcal · 420 kcal room` · Sleep `82 → 80+ · On track`
- **P0 stack** — `TodayP0Card` instances: WeightTrend (2pr) → DietGap + SleepScore (1pr row) → AerobicGap (1pr)
- **BottomNav** — Today active · screen height ~1000 (scroll mid-fi)

**Legacy:** `8:2` kept for reference (mixed ZH activity rings layout).

### 02 · Health Hub
**Active tab:** Health  
**Layout zones:**
- **Heart Rate card** — Large 72 bpm value + 15-bar histogram chart (bar sparkline)
- **SpO₂ + Steps row** — Two 168px cards with labeled progress bars
- **Sleep card** — 7h 20m + sleep stage stacked bar (5 segments, blue-purple range) + time labels
- **Body metrics card** — Weight / Body fat side by side with weekly trend indicator
- **Other metrics row** — Stress Index (42) + Blood Pressure (118/76) with color-coded status labels
- **BottomNav** — Health tab highlighted

### 03 · Metric Detail (Heart Rate)
**Navigation:** Detail screen, no BottomNav — back arrow header  
**Layout zones:**
- **Header** — Back arrow, centered title "心率详情", share icon
- **Hero value** — 72 bpm in 72px Bold + "正常范围" badge (green pill)
- **Period picker** — 今天 / 本周 / 本月 segments (today active with pill background)
- **Chart card** — 24-bar hourly histogram with y-axis gridlines (40/80/120/160) and x-axis time labels
- **Stats row** — Min 48 / Avg 72 / Max 124 in three-column layout with dividers
- **History card** — 3 readings (18:32 · 76 bpm · 正常, 14:15 · 88 bpm · 运动后, 09:04 · 64 bpm · 静息) with hairline dividers

### 04 · Exercise Hub
**Active tab:** Exercise  
**Layout zones:**
- **Sport picker grid** — 3×2 grid of sport tiles (跑步, 骑行, 游泳, 散步, 力量, 瑜伽); each with tinted icon background, sport symbol, and name
- **Recent workout** — Last session card: 5.2 km · 28:36 · 312 kcal with sport icon and timestamp
- **START button** — Full-width 358×60 pill in accent blue with drop shadow (elevation effect), label "开始运动 / Start Workout"
- **Training plans** — 2-up cards: 初学者有氧 (3 km · 30 min, green) + 进阶有氧 (8 km · 45 min, blue)
- **BottomNav** — Exercise tab highlighted

### 05 · Session Summary
**Navigation:** Post-workout modal view (shown after Exercise ends)  
**Layout zones:**
- **Header** — Close button, centered "运动总结 / Session Summary", Save button (filled accent)
- **Map placeholder** — Green-tinted terrain with simplified road lines, start (blue) and end (red) markers
- **Metric strip** — Distance 5.2 km / Duration 28:36 / Calories 312 kcal in three equal columns
- **Pace card** — 3 split rows (km 1–3) with proportional progress bars showing 5:32 / 5:28 / 5:48
- **HR zones** — Stacked horizontal zone bars (热身 / 有氧 / 燃脂 / 无氧 / 最大) with average label
- **Action bar** — Share (outlined) + Save to Health (filled accent) full-width buttons

### 06 · Devices List
**Active tab:** Devices  
**Layout zones:**
- **Connected device card** — GT Sport Pro watch icon + name + "已连接" green status dot + 78% battery bar
- **Sync card** — Last synced time + "立即同步" link
- **Add device button** — Outlined card with "+" icon and "添加设备" label (accent stroke)
- **Nearby devices** — 2 discovered devices (GT Band 4 / Scale Pro) with type, tinted icon, and "连接" action button
- **BottomNav** — Devices tab highlighted

### 07 · Device Detail / Connect
**Navigation:** Detail screen pushed from Devices List  
**Layout zones:**
- **Header** — Back to Devices, centered device name, overflow "⋯" menu
- **Device visual** — Stylized watch silhouette (dark rounded rect + screen + bands + crown button) showing 9:41 + date
- **Info card** — Model / Firmware v2.4.1 / Serial number in label-value pairs
- **Battery card** — 78% value + full-width bar (green fill) + estimated days remaining
- **Settings card** — 4 toggle rows (抬腕亮屏, 自动识别运动, 消息通知, 勿打扰模式) with ON/OFF pill toggles
- **Disconnect button** — Outlined pill with red text "断开连接"

---

## Structural Patterns

### BottomNav
Present on all 4 tab-root screens (Today, Health, Exercise, Devices).  
- Height: 83px, white fill, 1px top divider
- 4 equal tabs: 98px wide each
- Active state: accent blue color + semi-transparent pill background behind icon

### Card Module
Consistent card pattern across all screens:
- White fill, corner radius 12–16px
- `DROP_SHADOW`: y=2, blur=10, opacity 6% (very subtle elevation)
- Colored top accent bar (4px) for metric cards to indicate data category

### Stat Columns
Reusable 3-column layout (Stats Row) using transparent frames:
- Divider lines between columns
- Label (gray-2, 11px) / Value (primary, 22–24px Bold) / Unit (gray-3, 10px)
- Text center-aligned within each column

---

## Artifacts

All screenshots saved to `/opt/cursor/artifacts/`:
- `midfi-01-today-home.png` — 57 KB
- `midfi-02-health-hub.png` — 51 KB
- `midfi-03-metric-detail.png` — 37 KB
- `midfi-04-exercise-hub.png` — 61 KB
- `midfi-05-session-summary.png` — 36 KB
- `midfi-06-devices-list.png` — 42 KB
- `midfi-07-device-detail.png` — 36 KB

---

## Coordination Notes

- Page `08 · Screens · Mid-fi` (id `3:5`) is owned exclusively by the mid-fi subagent
- Lo-fi screens live on a separate page; do not edit or reference them
- Design System page (`00 · Cover`) was not modified
- All content is brand-agnostic — no HUAWEI / HeartLine naming appears
- Accent color `#007AFF` is the single brand accent used sparingly for CTAs, active states, and data highlights
