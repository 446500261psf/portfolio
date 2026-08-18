# Weekly Weight Plan · 以周为维度的减重计划

**Figma page:** `20 · WeeklyPlan` (`85:2`)  
**Mid-fi screen:** `02 · Weekly Weight Plan` (`88:5`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=88-5  
**Locale:** English UI · Mid-fi（不做高保真）

---

## Goal model

| Field | Sample |
|-------|--------|
| Horizon | **8 weeks**（≈ 2 months） |
| Target | Lose **8 jin = 4.0 kg** |
| Start → Goal | `70.2 → 66.2 kg` |
| Current (sample) | Week **5 / 8** · Progress **−2.2 kg · 55%** |
| Planner | AI generates weekly micro-goals; adapts after each week |

每周一个可验证小目标（体重 / 有氧 / 饮食 / 睡眠）。**达成 → 解锁一张计划贴纸**；未达成周位留空，可后续补领（catch-up）。

---

## Components

### PlanWeekRow

**Component set:** `86:95` · Variants: `Status=Done | Current | Upcoming | Missed`

| Status | Meaning | Sticker slot |
|--------|---------|--------------|
| Done | 周目标达成 | 显示对应 `Sticker/Plan/*` |
| Current | 本周进行中 | `?` 占位（未解锁） |
| Upcoming | 未来周 | 空 / `·` |
| Missed | 已过且未达成 | 空槽（可补领） |

**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=86-95

### Sticker/Plan/*（周计划奖励贴纸）

| Component | Week | Unlock cue |
|-----------|------|------------|
| `Sticker/Plan/Kickoff` | W1 | 开局称重 + 起步习惯 |
| `Sticker/Plan/Deficit` | W2 | 锁住热量缺口 |
| `Sticker/Plan/Cardio3` | W3 | 一周 3 次有氧 |
| `Sticker/Plan/Sleep80` | W4 | 睡眠分 ≥80 |
| `Sticker/Plan/Halfway` | W5 | 半程冲刺 |
| `Sticker/Plan/Protein` | W6 | 蛋白质餐次 |
| `Sticker/Plan/Steady` | W7 | 稳态不反弹 |
| `Sticker/Plan/Finish` | W8 | 总目标 −4.0 kg |

与通用 Stickers（`16 · Stickers`）同为**平面激励贴纸**，不是 3D Medal。命名空间 `Sticker/Plan/` 专用于周计划墙。

---

## 8-week AI plan (sample narrative)

| Week | Theme | Target | Focus line | Sample status | Sticker |
|------|-------|--------|------------|---------------|---------|
| 1 | Kickoff habit | −0.5 kg | Daily weigh-in · 3× cardio 20min · deficit −300 kcal | Done · −0.6 kg | Kickoff |
| 2 | Lock the deficit | −0.5 kg | Stay under 2,000 kcal · water 8 cups · 3× walk | Done · −0.5 kg | Deficit |
| 3 | Cardio consistency | −0.5 kg | Hit 3 cardio sessions · no zero-move days | **Missed** · +0.1 kg | — (empty) |
| 4 | Sleep recovery | −0.5 kg | Sleep score ≥80 · bedtime before 11pm · 2× strength | Done · −0.4 kg | Sleep80 |
| 5 | Halfway push | −0.5 kg | 4× cardio · protein at dinner · sleep ≥80 | **Current** · −0.2 / −0.5 | pending |
| 6 | Protein focus | −0.5 kg | Protein every meal · 3× cardio · weekend guardrail | Upcoming | — |
| 7 | Steady finish | −0.5 kg | Hold deficit · 3× cardio · no weekend spike | Upcoming | — |
| 8 | Final stretch | −0.5 kg | Hit −4.0 kg total · celebrate with sticker wall | Upcoming | — |

累计示例：已完成周净减约 −1.4 kg 量级 + 当前周进度，GoalCard 汇总为 **−2.2 kg / 55%**（含自适应叙事，不必与单周严格相加）。

---

## Screen · `02 · Weekly Weight Plan`

**Node:** `88:5` · phone 390 × ~2086（可滚动 mid-fi）

| Zone | Content |
|------|---------|
| Status + Header | Large title **Weekly Plan** · subtitle *AI · 8 weeks to −4.0 kg* |
| GoalCard | `8-WEEK GOAL` · Lose 8 jin · `70.2 → 66.2 kg` · Week 5/8 · progress bar + copy |
| Week list | 8 周卡片：序号 · theme · Target · status chip · focus · result · sticker |
| StickerWall | 已解锁贴纸 + 虚线空槽 `?`（未达成 / 未到） |
| BottomNav | Today active |

**StickerWall 规则（UI）**
- 4 列 wrap；已得贴纸显示实例；未得显示虚线 72×72 空槽
- Sample：W1/W2/W4 已解锁 · W3 Missed 空 · W5–W8 空

---

## Artifacts

- `/opt/cursor/artifacts/midfi-weekly-weight-plan.png`
- `/opt/cursor/artifacts/component-plan-week-row.png`
