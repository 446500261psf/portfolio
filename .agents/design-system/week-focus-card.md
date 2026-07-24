# WeekFocusCard · 周训练焦点卡（减脂 −5.0 kg / 7 周）

**Master source:** `91:240`（P0Stack / TodayP0Card）→ 转为组件主变体  
**Component set:** `WeekFocusCard` (`106:1085`) · Variants `Week=1…7`  
**Page:** Page 27 (`43:151`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=106-1085  
**Locale:** English UI · Mid-fi

---

## Card anatomy（主组件结构）

| Zone | Content |
|------|---------|
| **Title** | `planLabel` — `Week N· {purpose}` |
| **Subtitle** | `planCopy` — how to train this week |
| **Targets** | Metrics（Goal kg + 3 bullets）+ **Sticker** instance |
| **Recommended** | Section label（sparkles） |
| **Days** | Mon–Sun training rows |

Width **358** · derived from master `91:241`.

---

## Sticker component set

**Page:** `16 · Stickers` (`29:2`)  
**Set:** `Sticker` (`106:317`) · property **`Kind`**

| Kind | Node | Used in |
|------|------|---------|
| FirstStart | `29:8` | Week 1 Kickoff |
| Hydration | `29:31` | Week 2 Deficit / water |
| Day3 | `29:26` | Week 3 Cardio consistency |
| SleepTried | `29:13` | Week 4 Sleep & recover |
| Insight | `29:41` | Week 5 Intensity climb |
| NewFeature | `29:3` | Week 6 Strength + burn |
| EarlyBird | `29:36` | Week 7 Peak push |
| DevicePaired | `29:19` | （库内保留，本计划未用） |

Deep link: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=106-317

各周卡片通过 `instance.swapComponent` 挂载对应 `Kind`。

---

## Goal split · −5.0 kg / 7 weeks

| Week | Purpose | Fat | Sticker Kind | Key metrics |
|------|---------|-----|--------------|-------------|
| 1 | Kickoff habit | −0.5 kg | FirstStart | Walk 5 km · Sleep ≥75 · Weigh-in 5/7 |
| 2 | Lock the deficit | −0.6 kg | Hydration | Walk 10 km · ≤1,900 kcal · Water 8 cups |
| 3 | Cardio base | −0.7 kg | Day3 | 16 km · 3× cardio · Active 6/7 |
| 4 | Sleep & recover | −0.7 kg | SleepTried | Sleep ≥80 · Bed before 23:00 ×5 · Walk 12 km |
| 5 | Intensity climb | −0.8 kg | Insight | 22 km · 4× cardio · Protein dinners |
| 6 | Strength + burn | −0.8 kg | NewFeature | 26 km · 2× strength · Deficit −500 |
| 7 | Peak push | −0.9 kg | EarlyBird | 30 km · 5× sessions · Hit −5.0 kg |

**Sum:** 0.5+0.6+0.7+0.7+0.8+0.8+0.9 = **5.0 kg**

---

## Mon–Sun schedule (progressive)

| Day | W1 | W2 | W3 | W4 | W5 | W6 | W7 |
|-----|----|----|----|----|----|----|-----|
| Mon | Easy walk 20 | Brisk walk 25 | Jog intervals 28 | Yoga recover 25 | Tempo run 30 | Full-body strength 35 | HIIT 28 |
| Tue | Weigh-in · body-scan 5 | Walk 25 · mindful eating | Steady walk 30 | Walk 30 · early bed | Walk 35 · protein | Cardio 35 | Strength 35 |
| Wed | Easy walk 20 | Brisk walk 30 | Cardio 30 | Easy cardio 25 | Cardio 35 | Full-body strength 35 | Tempo 35 |
| Thu | Rest · mobility 10 | Rest · stretch 12 | Rest · breath 10 | Light walk 20 · wind-down | Strength intro 25 | Brisk walk 30 | HIIT 28 |
| Fri | Easy walk 25 | Brisk walk 30 | Jog intervals 28 | Yoga recover 25 | Tempo run 30 | Cardio intervals 35 | Strength 35 |
| Sat | Easy walk 20 | Long walk 40 | Long walk/run 45 | Walk 35 | Long cardio 50 | Long session 55 | Peak long 60 |
| Sun | Rest · plan next | Active recovery 20 | Recovery walk 25 | Full rest · sleep | Recovery · stress-reset | Active recovery 25 | Easy walk 20 · victory calm |

---

## Variants

| Variant | Node ID |
|---------|---------|
| Week=1 | `106:615` |
| Week=2 | `106:683` |
| Week=3 | `106:750` |
| Week=4 | `106:817` |
| Week=5 | `106:885` |
| Week=6 | `106:951` |
| Week=7 | `106:1018` |

Demo instance stack: `P0Stack` (`106:1086`) @ original master location.

---

## Artifacts

- `/opt/cursor/artifacts/week-focus-card-w1.png`
- `/opt/cursor/artifacts/week-focus-card-w4.png`
- `/opt/cursor/artifacts/week-focus-card-set.png`
- `/opt/cursor/artifacts/sticker-kind-set.png`
