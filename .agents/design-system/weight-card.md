# WeightCard — Smart-scale Day / Week / Month

**Figma page:** `19 · WeightCard`  
**Component set:** `WeightCard` (`75:122`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=75-122  

**Locale:** English · **Typeface:** SF Compact Rounded · **Width:** 358

## Variants (`Period`)

| Period | Node | Focus |
|---|---|---|
| **Day** | `72:2` | Today weigh-in + full body composition grid + AI tip |
| **Week** | `75:2` | 7-day weight line + composition deltas + AI tip |
| **Month** | `75:57` | 30-day weight line + start/now summary + AI tip |

Each variant stacks:
1. **WeightPanel** — elevated card  
2. **AISuggestion** — brand-subtle tip card under the panel (*AI tip · Today*)

## Smart-scale metrics (Day grid)

Typical consumer body-fat scale outputs included:

| Metric | Sample | Unit |
|---|---|---|
| Weight | 68.4 | kg |
| BMI | 22.8 | — |
| Body fat | 24.6 | % |
| Muscle mass | 48.2 | kg |
| Body water | 52.1 | % |
| Bone mass | 2.8 | kg |
| Visceral fat | 7 | level |
| Protein | 16.8 | % |
| BMR | 1,420 | kcal |
| Body age | 29 | yrs |
| Skeletal muscle | 42.3 | % |
| Subcutaneous fat | 20.1 | % |
| Lean mass | 51.6 | kg |

Week/Month show a subset of deltas (fat / muscle / visceral / BMI / water / body age) alongside the trend chart.

## AI tip (always “Today” action)

Examples:
- **Day:** Fat down, muscle steady → keep intake under 2,000 kcal + finish 18 cardio min  
- **Week:** −0.6 kg with stable muscle → protect weekend intake  
- **Month:** Fat loss + small muscle gain → protein at dinner + sleep score ≥ 80  

## Relationship to Today P0

`TodayP0Card / Kind=WeightTrend` remains the compact home teaser.  
`WeightCard` is the expanded weight dashboard (detail / Health body section).
