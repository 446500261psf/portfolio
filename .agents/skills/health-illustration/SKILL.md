---
name: health-illustration
description: "Generate HUAWEI Health app hand-drawn spot illustrations for empty states, onboarding, and benefit moments. Use when the user asks for health/exercise illustrations, 手绘插画, empty state art, Morandi health art, kinetic exercise art, or app illustration matching HeartLine brand. Switches between Health Morandi (calm, high lightness, narrow gamut) and Exercise Kinetic (soft-bright, wider gamut). Complements naive-design and baoyu-article-illustrator."
license: MIT
compatibility: Agent-agnostic. Pairs with naive-design, baoyu-article-illustrator, and HeartLine logo guidelines.
metadata:
  author: HUAWEI Health Design System
  version: "0.1.0"
  palette: "Illustration Palettes v0.2"
  brand: "HeartLine / HUAWEI Health"
---

# health-illustration

> App spot illustrations that feel **hand-drawn and human**, but stay **on-brand and production-safe**.  
> Product chrome stays clean. Warmth lives in the illustration layer only.

This skill encodes:

1. **naive-design** — intentional imperfection, limited palette, brand-layer boundary  
2. **baoyu styles** — `warm` / `notion` for Health; `flat-doodle` energy for Exercise  
3. **kunaal DNA** — one image = one idea; subject 40–60%; generous whitespace  
4. **HeartLine + Illustration Palettes v0.2** — locked color systems

## When to use

**Use for**

- Empty states (no data / first-run / permission)
- Onboarding & celebration moments
- Benefit cards, AI+ soft coaching scenes
- Sleep / recovery / vitals / stress (Health track)
- Run / strength / outdoor / challenge (Exercise track)

**Do NOT use for**

- Data tables, charts chrome, settings forms, medical-critical UI
- Replacing icons (use `health-icon-system` / icon-set-generator)
- Full-screen photographic realism or 3D glossy renders
- Putting doodles on dense product UI

Rule of surface (from naive-design): **disciplined product UI, naive illustration layer.**

## The one rule

**Intentional, not broken.**  
Childlike warmth that would survive a senior design review. Grid + whitespace + limited palette underneath; wobble/grain only on decorative marks.

Fatal failures:

- Chaos (random rotation, overcrowded)
- Fake-handmade (perfect vector “doodle”, zero texture)
- Lazy shorthand (generic clip-art stars, Comic Sans, rainbow packs)

## Mode selection

Read the brief and pick **exactly one** mode:

| Mode | Use when | Style DNA | Palette file |
|------|----------|-----------|--------------|
| `health` | Sleep, HRV, stress, recovery, cycle care, health profile, AI soft consult | warm + notion; airy, high lightness | `references/palettes.md` → Health Morandi |
| `exercise` | Run, strength, outdoor, HIIT, challenges, weekly highlight, AI coach hype | flat-doodle + kinetic motion | `references/palettes.md` → Exercise Kinetic |

If mixed (e.g. “recovery after run”), prefer **health** for rest/recovery emotion, **exercise** only when the hero action is motion.

## Workflow

### 1. Lock context

Collect:

- Mode (`health` | `exercise`)
- Scene job (empty / onboard / celebrate / explain)
- Aspect (`1:1` default for app spots; `4:5` for tall empty; `16:9` for banners)
- Must include / must avoid objects
- Whether HeartLine mark appears (usually **no** inside spot art; if yes, follow logo guidelines)

Read before drawing:

1. `references/palettes.md` (mandatory)
2. `references/scenes.md` (scene recipes)
3. `references/prompt-template.md` (generation contract)
4. `references/qa-checklist.md` (before delivery)

Also load sibling skills when available:

- `naive-design` — imperfection discipline + AVOID block
- `baoyu-article-illustrator` — Type × Style × Palette prompt structure

### 2. One image, one job

From kunaal DNA:

- Subject occupies **~40–60%** of canvas
- Leave **≥35%** quiet negative space
- At most **one** metaphor / action / state
- No PPT titles, no flowchart chrome, no multi-panel storyboards unless asked

### 3. Build the prompt

Follow `references/prompt-template.md` exactly. Always include:

1. Artifact + scene
2. Style declaration (mode-specific)
3. Concrete marks (named objects, not vague “nice doodles”)
4. Layout / whitespace
5. **Named hex palette from palettes.md** (never invent new hues)
6. Texture (subtle paper/grain for health; clean soft flat for exercise)
7. Emotional target
8. AVOID block (cold perfection **and** childish chaos)

### 4. Generate & check

Generate with the available image tool. Then run `references/qa-checklist.md`.

If palette drift is visible (neon coral on Health, muddy gray on Exercise), regenerate with stricter hex list and “use ONLY these colors”.

### 5. Deliver

- Save assets under `Generated/health-illustration/` when in a workspace
- Name: `{mode}-{scene}-{nn}.png`
- Report: mode, scene, palette version (`v0.2`), path, QA notes

## Style recipes (short)

### Health Morandi

- High lightness, low saturation, **narrow** gamut (sage / mist / clay / peach)
- Soft rounded forms, gentle line wobble, calm breathing space
- Max **4–5** colors per image; sage + mist ≈ 70% of color area
- No neon, no pure black, no brand-orange full chroma (`#FD8F1B`)
- Line/ink: `#5A544E`; canvas: `#F7F3EE` / `#FCFAF7`
- Characters: soft limbs, quiet faces (dot eyes OK), restful poses

### Exercise Kinetic

- Soft-bright (saturation already lowered in v0.2), **wide** hue span
- Diagonal motion, speed marks, path curves; still not fluorescent
- Max **5–7** colors; `energy.orange` `#E89A45` appears at least once
- Allowed soft complements: orange↔blue, coral↔teal
- Deep night scenes use `#1A2028` + `#F2F4F7` line
- Do **not** mix Health Morandi dust-pinks as dominant fills

## HeartLine coexistence

- Prefer **no logo** inside spot illustrations
- If required: Health/light → Mono Gray or `accent.peach`; Exercise/dark → white mark
- Never stretch, recolor arbitrarily, or place on busy texture without scrim  
  (see Figma: Logo · Usage Guidelines)

## Pairing with code / UI

When placing art into screens:

- Illustration sits in empty-state / hero slot; UI chrome stays system components
- Do not roughen buttons, lists, or charts with wobble filters
- Keep tap targets and type in Design System tokens, not marker fonts

## Gotchas

Append-only failure log:

- [2026-07-16] Health samples drifted into cream+terracotta cliché → lock Morandi hex list; forbid `#F4F1EA` + terracotta pairing as default.
- [2026-07-16] Exercise looked neon → use v0.2 softened kinetic hexes, not `#FF4B5C` full chroma.
- [2026-07-16] Overcrowded empty states → enforce 40–60% subject + one metaphor.
