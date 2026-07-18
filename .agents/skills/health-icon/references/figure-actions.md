# Figure Actions · 人物动作构成

Source boards on **Icons · HeartLine DNA**:

- `Figure Styles · 面构成 10 选` — style picker (A–J); superseded when conflicting  
- `Figure Actions · 构成` — v0.1 (history)  
- `Figure Actions · 四肢清晰 v0.2` — separate capsules (history)  
- **`Figure Actions · 连体渐细 v0.3`** — **current**

## Root failures

| Version | Failure |
|---------|---------|
| v0.1 | Head + 2 arcs → limbs fused, verb unreadable |
| v0.2 | Separate capsules → limbs float off torso; equal thickness ignores anatomy |

## Articulated soft figure (required)

Figures are an **exception** to the general 2–3 mark icon budget.

| Part | Role | Form |
|------|------|------|
| **Head** | Always separate | Disc |
| **Torso** | Body mass; limbs grow from it | Soft capsule / oval |
| **Arm L / Arm R** | Two distinct limbs | **One continuous filled taper** per arm |
| **Leg L / Leg R** | Two distinct limbs | **One continuous filled taper** per leg |

**Minimum = 6 parts** (head + torso + 4 limbs). Props are extra.

---

## Two hard rules (v0.3)

### 1. 连体光滑曲线 · Continuous soft join

- Each limb **joins the torso** — no floating gap between shoulder/hip and body.  
- The silhouette at the join is a **smooth curve** (soft geometry), not a hard T-junction or broken stick.  
- Upper + lower segments of the **same** limb are **one continuous shape** (大臂↔小臂、大腿↔小腿连在一起).  
- Elbow / knee = **smooth direction change** along that one shape — not two separate capsules with a gap.

### 2. 符合人体结构 · Proximal thick → distal thin

| Limb | Proximal (near body) | Distal (end) |
|------|----------------------|--------------|
| Arm | 大臂 thicker | 小臂 thinner → hand tip soft round |
| Leg | 大腿 thicker | 小腿 thinner → foot tip soft round |

Typical width ratio at review scale (40px optical):  
**大臂 : 小臂 ≈ 1 : 0.65–0.75** · **大腿 : 小腿 ≈ 1 : 0.65–0.75**

Never draw equal-width sticks for upper and lower segments.

---

## Other limb rules

1. **Never merge** both arms into one arc, or both legs into one V.  
2. Each limb has a **clear direction** (centerline through joints).  
3. At 24px: count **four limb tips** + head; taper still readable as thick→thin.  
4. Depth only where a limb **crosses** the torso (under tint ± soft contact shadow).

### Soft geometry still applies

- Soft joins, ROUND tips  
- No fingers, shoes, face  
- No global ground shadow  

## Construction recipe (v0.3)

1. Place **torso** capsule  
2. Place **head** disc (slight gap OK optically)  
3. For each limb: draw **one filled taper path**  
   - Centerline: shoulder→elbow→wrist **or** hip→knee→ankle  
   - Width: proximal thick → distal thin  
   - Root overlaps torso so the outer contour reads as one smooth body  
4. Bend only where the verb needs elbow/knee  
5. Local depth only at true overlaps  
6. Scale-check at 24px  

Optical **28×28** in **48–72px** cell (review **40@96**).  
Far-side limbs: lighter tint (`≈ #DBE3EA`).  

## Action set — pose specs

Angles are approximate; prioritize **opposite limb rhythm** and **verb silhouette**.

| Key | Verb | Pose checklist |
|-----|------|----------------|
| `stand` | 站立 | Legs slightly apart; arms hang soft |
| `walk` | 步行 | Front leg forward · back trail; **opposite** arm; mild lean |
| `run` | 跑步 | Lean; front knee bent; trail leg extended; arm swing |
| `sit` | 坐下 | Thighs near horizontal; shanks down (continuous L-bend) |
| `stretch` | 伸展 | Both arms up; legs planted |
| `yoga` | 瑜伽 | Tree: support + bent leg both visible as continuous tapers |
| `lift` | 力量 | Arms to bar; legs planted |
| `swim` | 游泳 | Body horizontal; reach + trail arms; staggered kick |
| `cycle` | 骑行 | Seated; opposite pedals; arms to bar |
| `jump` | 跳跃 | Arms up; legs out/tuck — air under feet |

## Acceptance test (must pass)

- [ ] Limbs **connected** to torso with smooth silhouette (no floating sticks)  
- [ ] Each arm/leg is **one continuous** shape (upper+lower joined)  
- [ ] Proximal **thicker** than distal on every limb  
- [ ] Can count **head + 4 limb tips** at 100% and ~24px  
- [ ] Can name the **verb** without the label  
- [ ] Walk/run opposite arm/leg rhythm correct  
- [ ] Soft geometry; depth only at overlaps  

## Don’ts

- No facial features / fingers / shoe detail  
- No equal-width stick limbs  
- No gap between 大臂/小臂 or 大腿/小腿  
- No floating limbs detached from torso  
- No single-stroke whole-body blob as the only mark  
- No global drop shadow under the figure  
- Do not apply object-icon 2–3 mark budget to figures  

## Naming

`heartline.icon.{verb}` — e.g. `heartline.icon.run`
