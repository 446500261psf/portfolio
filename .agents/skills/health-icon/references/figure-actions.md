# Figure Actions · 人物动作构成

Source boards on **Icons · HeartLine DNA**:

- `Figure Styles · 面构成 10 选` — style picker (A–J); superseded when conflicting  
- `Figure Actions · 构成` — v0.1 (history)  
- `Figure Actions · 四肢清晰 v0.2` — separate capsules (history)  
- **`Figure Actions · 连体渐细 v0.3 · 正视`** — front (includes props / scene)  
- **`Figure Actions · 侧面 v0.4`** — **side / profile**  
- **`Figure Actions · 45° v0.4`** — **three-quarter**  
- **`Figure Actions · Soft Block v0.5`** — playful soft-block look + anatomical limbs

## Root failures

| Version | Failure |
|---------|---------|
| v0.1 | Head + 2 arcs → limbs fused, verb unreadable |
| v0.2 | Separate capsules → limbs float off torso; equal thickness ignores anatomy |

## Soft Block style (v0.5 · parallel look)

Playful soft-block reading inspired by chunky capsule figures — **not** a replacement for 连体渐细 boards.

| Keep from reference | Must still obey anatomy |
|---------------------|-------------------------|
| Head = disc, slight optical gap from torso | Full **4 limbs** (never stub arms only) |
| Torso = soft capsule (略更敦厚 OK) | **连体光滑** join into torso |
| Soft filled 面, dark cell | **近粗远细** continuous arm/leg |
| Optional **silhouette cast** (hard offset shadow of whole figure) as style signature | Props/scene when verb needs them |

Soft Block silhouette cast (front OK for this style only): offset ≈ `{-2, 2}`, blur `0–0.5`, opacity ≈ `0.35–0.45`, dark gray — one unified cast, **not** per-limb junction shadows mixed with 连体渐细 side rules.

---

## Articulated soft figure (required)

Figures are an **exception** to the general 2–3 mark icon budget.

| Part | Role | Form |
|------|------|------|
| **Head** | Always separate | Disc |
| **Torso** | Body mass; limbs grow from it | Soft capsule / oval |
| **Arm L / Arm R** | Two distinct limbs | **One continuous filled taper** per arm |
| **Leg L / Leg R** | Two distinct limbs | **One continuous filled taper** per leg |

**Minimum = 6 parts** (head + torso + 4 limbs). **Props / scene cues are required** when the verb depends on equipment or environment — they are not optional decoration.

---

## View angles (ship as a set)

Every action should exist in **three views**. Same DNA (连体渐细 + props/scene); only camera changes.

| View | Board | Read as |
|------|-------|---------|
| **正视 front** | `…正视` | Facing camera; left/right limbs symmetric or mirrored |
| **侧面 side** | `…侧面 v0.4` | Profile (default facing **right**); stride & lean clearest |
| **45° three-quarter** | `…45° v0.4` | Between front and side; show near + far limbs with depth |

### View rules

1. **Side**: body depth collapsed; far arm/leg use FAR tint; one silhouette lean/stride reads the verb.  
2. **45°**: shoulder/hip line slightly offset; **near** limbs WHITE in front, **far** limbs FAR behind torso; still 4 limb tips countable.  
3. Props/scene follow the body (wheels in profile, waves under horizontal swim, bar foreshortened at 45°).  
4. Do not mix cameras inside one icon.

### Shadow by view (硬规则)

| View | Shadow |
|------|--------|
| **正视 front** | **无阴影** — flat fill only; no drop shadow, no contact shadow |
| **侧面 side** | **肢体交界处有阴影** — soft contact shadow only where a near limb meets / crosses the torso (or another limb) |
| **45°** | Same as side at junctions (lighter OK); still no global ground shadow |

Side / 45° contact shadow recipe (review 40px): offset ≈ `{x: 0.4–0.6, y: 0.5–0.8}`, blur ≈ `1.0–1.4`, opacity ≈ `0.18–0.28`, color black. Apply on the **near (WHITE)** limb layer that sits in front — not on the whole figure, not on FAR limbs as a second global shade.

---

## Props & scene (required when verb needs them)

If the action is hard to read **without** gear or place, add a **minimal soft-geometry cue** (1–3 marks). Still optical 28px-legible.

| Kind | Do | Don’t |
|------|----|-------|
| **器材 prop** | Bar, plates, wheels, mat, seat — soft discs / capsules / arcs | Realistic product detail, logos, text |
| **场景 scene** | Water waves, speed dashes, ground gap for jump | Full backgrounds, horizons, scenery illustration |

Budget: prop/scene marks **on top of** the 6-part figure; prefer **FAR tint** for secondary cues so the body stays primary.

### Per-action cue map

| Key | Cue (required) | Form hint |
|-----|----------------|-----------|
| `stand` | — | Body only |
| `walk` | — | Body only |
| `run` | Scene: speed dashes | 2–3 short arcs trailing behind |
| `sit` | Prop: seat / bench | Soft horizontal slab under thighs |
| `stretch` | — | Body only |
| `yoga` | Prop: mat | Soft thin pad under support foot |
| `lift` | Prop: bar + plates | Bar through hands; disc faces at ends |
| `swim` | Scene: water flow | 2–3 soft wave arcs under / around body |
| `cycle` | Prop: bike | Two wheel circles + simple top tube / bar |
| `jump` | Scene: air gap | Clear space under feet; optional tiny bounce arcs |

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

| Key | Verb | Pose checklist | Cue |
|-----|------|----------------|-----|
| `stand` | 站立 | Legs slightly apart; arms hang soft | — |
| `walk` | 步行 | Front leg forward · back trail; **opposite** arm; mild lean | — |
| `run` | 跑步 | Lean; front knee bent; trail leg extended; arm swing | Speed dashes |
| `sit` | 坐下 | Thighs near horizontal; shanks down (continuous L-bend) | Bench slab |
| `stretch` | 伸展 | Both arms up; legs planted | — |
| `yoga` | 瑜伽 | Tree: support + bent leg both visible as continuous tapers | Mat |
| `lift` | 力量 | Arms to bar; legs planted | Bar + plates |
| `swim` | 游泳 | Body horizontal; reach + trail arms; staggered kick | Water waves |
| `cycle` | 骑行 | Seated; opposite pedals; arms to handlebar | Wheels + frame |
| `jump` | 跳跃 | Arms up; legs out/tuck — air under feet | Air gap (± bounce arcs) |

## Acceptance test (must pass)

- [ ] Limbs **connected** to torso with smooth silhouette (no floating sticks)  
- [ ] Each arm/leg is **one continuous** shape (upper+lower joined)  
- [ ] Proximal **thicker** than distal on every limb  
- [ ] Can count **head + 4 limb tips** at 100% and ~24px  
- [ ] Can name the **verb** without the label  
- [ ] Walk/run opposite arm/leg rhythm correct  
- [ ] Soft geometry; depth only at overlaps  
- [ ] If verb needs gear/place: **cue present** and readable at 24px  

## Don’ts

- No facial features / fingers / shoe detail  
- No equal-width stick limbs  
- No gap between 大臂/小臂 or 大腿/小腿  
- No floating limbs detached from torso  
- No single-stroke whole-body blob as the only mark  
- No global drop shadow under the figure  
- No omitting required prop/scene cues (swim without water, cycle without wheels, etc.)  
- Do not apply object-icon 2–3 mark budget to figures  

## Naming

`heartline.icon.{verb}` — e.g. `heartline.icon.run`
