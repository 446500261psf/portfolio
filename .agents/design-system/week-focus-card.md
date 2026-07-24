# WeekFocusCard · 周训练焦点卡（减脂 −5.0 kg / 7 周）

**Figma page:** `20 · WeeklyPlan` (`85:2`)  
**Component set:** `WeekFocusCard` (`95:343`) · Variants `Week=1…7`  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=95-343  
**Locale:** English UI · Mid-fi

---

## Card anatomy

| Zone | Content |
|------|---------|
| **Title** | `Week N · {purpose}` + sparkle accents |
| **Subtitle** | How to train this week (1–2 lines) |
| **Targets** | Left: fat-loss kg + 3 metrics · Right: reward `Sticker/Plan/*` |
| **Recommended** | 1 course + 1 meditation (progressive duration/intensity) |

Width **358** (content grid) · radius 16 · light elevation shadow.

---

## Goal split · −5.0 kg fat / 7 weeks

| Week | Purpose | Fat target | Walk / load | Sleep / fuel | Sticker | Course | Meditation |
|------|---------|------------|-------------|--------------|---------|--------|------------|
| 1 | Kickoff habit | −0.5 kg | Walk **12 km** · weigh-in 5/7 | Sleep ≥ **75** | Kickoff | Easy Walk 20 min | Body-scan 5 min |
| 2 | Lock the deficit | −0.6 kg | Walk **16 km** | Intake ≤ **1,900** · water 8 cups | Deficit | Brisk Walk 25 min | Mindful eating 8 min |
| 3 | Cardio base | −0.7 kg | Walk/run **22 km** · **3×** cardio ≥25 | Active 6/7 | Cardio3 | Fat-burn jog 28 min | Breath focus 10 min |
| 4 | Sleep & recover | −0.7 kg | Walk **20 km** | Sleep ≥ **80** · bed before 23:00 ×5 | Sleep80 | Yoga Recover 25 min | Sleep wind-down 12 min |
| 5 | Intensity climb | −0.8 kg | Walk/run **28 km** · **4×** cardio | Protein every dinner | Halfway | Tempo run 30 min | Stress-reset 10 min |
| 6 | Strength + burn | −0.8 kg | Walk/run **30 km** · **2×** strength | Avg deficit **−500** kcal | Protein | Full-body strength 35 min | Power-nap reset 8 min |
| 7 | Peak push | −0.9 kg | Walk/run **35 km** · **5×** sessions | Hit total **−5.0 kg** | Finish | HIIT fat-burn 28 min | Victory calm 15 min |

**Sum:** 0.5 + 0.6 + 0.7 + 0.7 + 0.8 + 0.8 + 0.9 = **5.0 kg**

Intensity ramp: distance 12 → 35 km · cardio sessions 0/3 → 5 · course length 20 → 35 min · meditation 5 → 15 min.

---

## Variants

| Variant | Node ID |
|---------|---------|
| Week=1 | `95:78` |
| Week=2 | `95:122` |
| Week=3 | `95:166` |
| Week=4 | `95:210` |
| Week=5 | `95:254` |
| Week=6 | `95:298` |
| Week=7 | `95:342` |

---

## Related

- List-row status pattern: `PlanWeekRow` (`86:95`) — Done / Current / Upcoming / Missed  
- Stickers: `Sticker/Plan/*` on the same page  
- Docs sibling: [weekly-plan.md](./weekly-plan.md)

## Artifacts

- `/opt/cursor/artifacts/week-focus-card-w1.png`
- `/opt/cursor/artifacts/week-focus-card-w7.png`
- `/opt/cursor/artifacts/week-focus-card-set.png`
