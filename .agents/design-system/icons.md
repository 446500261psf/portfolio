# Icons — Phosphor (Sports & Health)

**Figma page:** `18 · Icons` (`54:2`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=54-2  

## Source system

| | |
|---|---|
| **Library** | [Phosphor Icons](https://phosphoricons.com) |
| **Repo** | https://github.com/phosphor-icons/core |
| **License** | MIT |
| **Weight used** | Regular |
| **Why** | Strong coverage of sports people (run / walk / bike / swim / hike), vitals (heartbeat / pulse / waveform), sleep, nutrition, hydration — better product-UI fit than clinical medical sets |

> Alternatives considered: [Health Icons](https://healthicons.org) (CC0, public-health / clinical). Kept as optional supplement later if we need device/lab metaphors.

## Naming

Product components use `icon.<feature>` aliases mapped from Phosphor asset names.

## Inventory (30 components)

### Activity
| Component | Phosphor source | Use |
|---|---|---|
| `icon.steps` | footprints | Steps |
| `icon.walk` | person-simple-walk | Walking |
| `icon.run` | person-simple-run | Running / cardio |
| `icon.bike` | person-simple-bike | Cycling |
| `icon.swim` | person-simple-swim | Swimming |
| `icon.hike` | person-simple-hike | Hiking |
| `icon.sneaker` | sneaker-move | Workout / footwear |
| `icon.strength` | barbell | Strength |
| `icon.yoga` | person-simple-tai-chi | Yoga / mobility |
| `icon.distance` | path | Distance |
| `icon.active-min` | timer | Active minutes |
| `icon.person` | person-simple | Profile / generic |

### Vitals
| Component | Phosphor source | Use |
|---|---|---|
| `icon.heart` | heart | Heart |
| `icon.heart-rate` | heartbeat | Heart rate |
| `icon.hrv` | waveform | HRV |
| `icon.pulse` | pulse | Pulse / ECG-style |
| `icon.spo2` | gauge | SpO₂ |
| `icon.vitals` | stethoscope | Vitals hub |

### Sleep & Recovery
| Component | Phosphor source | Use |
|---|---|---|
| `icon.sleep` | moon-stars | Sleep score / night |
| `icon.bed` | bed | Sleep session |

### Nutrition & Hydration
| Component | Phosphor source | Use |
|---|---|---|
| `icon.nutrition` | fork-knife | Nutrition / diet |
| `icon.food` | bowl-food | Meals |
| `icon.calories` | fire-simple | Calories |
| `icon.water` | drop | Water |
| `icon.hydration` | drop-simple | Hydration |
| `icon.wellness` | leaf | Wellness |

### Body & Devices
| Component | Phosphor source | Use |
|---|---|---|
| `icon.weight` | scales | Weight |
| `icon.watch` | watch | Wearable |
| `icon.battery` | battery-medium | Device battery |
| `icon.trend` | chart-line-up | Trend / progress |

## Feature → icon mapping (Today / Health / Exercise)

| Feature | Preferred icon |
|---|---|
| Weight / Today P0 WeightTrend | `icon.weight` |
| Nutrition / DietGap | `icon.nutrition` or `icon.calories` |
| Sleep score | `icon.sleep` |
| Cardio / AerobicGap | `icon.run` or `icon.active-min` |
| Steps | `icon.steps` |
| Heart rate | `icon.heart-rate` |
| HRV | `icon.hrv` |
| Water | `icon.water` |
| SpO₂ | `icon.spo2` |
| Battery | `icon.battery` |
