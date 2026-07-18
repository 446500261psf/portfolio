# Figure Actions · 人物动作构成

Source boards on **Icons · HeartLine DNA**:

- `Figure Styles · 面构成 10 选` — style picker (A–J); superseded for limb clarity when conflicting with this doc  
- `Figure Actions · 构成` — v0.1 (too abstract; keep for history)  
- **`Figure Actions · 四肢清晰 v0.2`** — **current** articulated soft figures

## Root failure of v0.1

v0.1 budgeted **head + 2 limb strokes**. That merges arms/legs into one arc → no clear limbs, verbs misread.

## Articulated soft figure (required)

Figures are an **exception** to the general 2–3 mark icon budget.

| Part | Role | Form |
|------|------|------|
| **Head** | Always separate | Disc |
| **Torso** | Always separate | Soft capsule / oval (body mass) |
| **Arm L / Arm R** | Two distinct limbs | Prefer **soft capsule (面)**; elbow = two capsules meeting |
| **Leg L / Leg R** | Two distinct limbs | Prefer **soft capsule (面)**; knee = two capsules meeting |

**Minimum = 6 parts** (head + torso + 4 limbs). Props (bar / wave) are extra marks.

### Limb rules

1. **Never merge** both arms into one arc, or both legs into one V.  
2. Each limb has a **clear direction** (vector from joint to end).  
3. Elbow / knee read as a **direction change**, not a joint dot.  
4. At 24px: you must still count **four limb ends** + head.  
5. Depth only where a limb **crosses** the torso (under tint ± soft contact shadow).

### Soft geometry still applies

- ROUND caps / soft capsule ends  
- No fingers, shoes, face  
- No global ground shadow  

## Construction recipe (v0.2)

1. Place **head** disc  
2. Place **torso** capsule under head (gap ≈ 0–1px optical)  
3. Attach **4 limbs** from shoulder / hip points — each limb its own layer  
4. Bend elbow/knee **only if the verb needs it**  
5. Add local depth only at true overlaps  
6. Scale-check at 24px: verb still readable; limbs still countable  

Optical **28×28** in **48–72px** cell (review boards may use **40@96**).  
Capsule limb width ≈ **3.6–4.2** at review scale (scale down proportionally for 28px).  
Far-side limbs: lighter tint (`≈ #DBE3EA`), not missing. Near limbs may use light contact shadow only at torso cross.

## Action set — pose specs (v0.2)

Angles are approximate; prioritize **opposite limb rhythm** and **verb silhouette**.

| Key | Verb | Pose checklist |
|-----|------|----------------|
| `stand` | 站立 | Legs slightly apart, both nearly vertical; arms hang soft or short out |
| `walk` | 步行 | Front leg forward · back leg trail; **opposite** arm forward; mild lean |
| `run` | 跑步 | Strong lean; front knee bent; trail leg extended; larger arm swing |
| `sit` | 坐下 | Torso upright/slight lean; thighs near horizontal; shanks down (L-bend) |
| `stretch` | 伸展 | Both arms up/out; legs planted; long vertical torso |
| `yoga` | 瑜伽 | Tree: one foot at knee; arms up or prayer arc — **both legs still visible** |
| `lift` | 力量 | Both arms hold bar above / at shoulder; legs planted; plates as faces |
| `swim` | 游泳 | Body near horizontal; front arm reach + back arm trail; kick legs staggered |
| `cycle` | 骑行 | Seated torso; legs on pedals (opposite crank); arms to handlebar |
| `jump` | 跳跃 | Both knees tuck or both legs out; arms up — air gap under feet |

## Acceptance test (must pass)

- [ ] Can count **head + 4 limb tips** at 100%  
- [ ] Can name the **verb** without reading the label  
- [ ] Opposite arm/leg rhythm correct for walk/run  
- [ ] No blob where two limbs fused into one stroke  
- [ ] Soft geometry intact; depth only at overlaps  

## Don’ts

- No facial features / fingers / shoe detail  
- No single-stroke “whole body” silhouette as the only mark  
- No global drop shadow under the figure  
- Do not apply object-icon 2–3 mark budget to figures  

## Naming

`heartline.icon.{verb}` — e.g. `heartline.icon.run`
