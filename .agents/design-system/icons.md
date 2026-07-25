# Icons — Phosphor (Sports & Health)

**Figma page:** `18 · Icons` (`54:2`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=54-2  

## Source system

| | |
|---|---|
| **Library** | [Phosphor Icons](https://phosphoricons.com) |
| **Repo** | https://github.com/phosphor-icons/core |
| **License** | MIT |
| **Weights** | Regular (outline / 线图) + Fill (filled / 面图) |
| **Why** | Strong coverage of sports people (run / walk / bike / swim / hike), vitals, sleep, nutrition, hydration |

## Component API

Each feature icon is a **component set** named `icon.<feature>` with variants:

| Property | Values |
|---|---|
| **Style** | `Outline` (线图) · `Fill` (面图) |
| **Color** | `Black` · `White` |
| **Size** | **18×18** (fixed) |

**4 variants per icon** → `Style=Outline, Color=Black` | `Style=Outline, Color=White` | `Style=Fill, Color=Black` | `Style=Fill, Color=White`

Total: **31 sets × 4 = 124 components**（含 `icon.edit`）

## Inventory (31 sets)

### Activity
`icon.steps` · `icon.walk` · `icon.run` · `icon.bike` · `icon.swim` · `icon.hike` · `icon.sneaker` · `icon.strength` · `icon.yoga` · `icon.distance` · `icon.active-min` · `icon.person`

### Vitals
`icon.heart` · `icon.heart-rate` · `icon.hrv` · `icon.pulse` · `icon.spo2` · `icon.vitals`

### Sleep & Recovery
`icon.sleep` · `icon.bed`

### Nutrition & Hydration
`icon.nutrition` · `icon.food` · `icon.calories` · `icon.water` · `icon.hydration` · `icon.wellness`

### Body & Devices
`icon.weight` · `icon.watch` · `icon.battery` · `icon.trend`

## Feature → icon mapping

| Feature | Preferred icon |
|---|---|
| **BottomNav · Today** | `icon.person` |
| **BottomNav · Health** | `icon.heart` |
| **BottomNav · Exercise** | `icon.run` |
| **BottomNav · Devices** | `icon.watch` |
| Weight / WeightTrend | `icon.weight` |
| Nutrition / DietGap | `icon.nutrition` or `icon.calories` |
| Sleep score | `icon.sleep` |
| Cardio / AerobicGap | `icon.run` or `icon.active-min` |
| Steps | `icon.steps` |
| Heart rate | `icon.heart-rate` |
| HRV | `icon.hrv` |
| Water | `icon.water` |
| SpO₂ | `icon.spo2` |
| Battery | `icon.battery` |

## Phosphor source map

| Component | Outline asset | Fill asset |
|---|---|---|
| steps | footprints | footprints-fill |
| walk | person-simple-walk | person-simple-walk-fill |
| run | person-simple-run | person-simple-run-fill |
| bike | person-simple-bike | person-simple-bike-fill |
| swim | person-simple-swim | person-simple-swim-fill |
| hike | person-simple-hike | person-simple-hike-fill |
| sneaker | sneaker-move | sneaker-move-fill |
| strength | barbell | barbell-fill |
| yoga | person-simple-tai-chi | person-simple-tai-chi-fill |
| distance | path | path-fill |
| active-min | timer | timer-fill |
| person | person-simple | person-simple-fill |
| heart | heart | heart-fill |
| heart-rate | heartbeat | heartbeat-fill |
| hrv | waveform | waveform-fill |
| pulse | pulse | pulse-fill |
| spo2 | gauge | gauge-fill |
| vitals | stethoscope | stethoscope-fill |
| sleep | moon-stars | moon-stars-fill |
| bed | bed | bed-fill |
| nutrition | fork-knife | fork-knife-fill |
| food | bowl-food | bowl-food-fill |
| calories | fire-simple | fire-simple-fill |
| water | drop | drop-fill |
| hydration | drop-simple | drop-simple-fill |
| wellness | leaf | leaf-fill |
| weight | scales | scales-fill |
| watch | watch | watch-fill |
| battery | battery-medium | battery-medium-fill |
| trend | chart-line-up | chart-line-up-fill |
| edit | pencil-simple | pencil-simple-fill |
