---
name: health-illustration
description: "Generate HUAWEI Health app card-flat illustrations for Achieve/Body/Heart content cards, empty states, and benefit moments. Use when the user asks for card illustration, card-flat, faceless flat vector, 卡片插画, health/exercise illustrations, Morandi blended health art, or partitioned exercise card art. Default style is card-flat: faceless rubber-limb characters, narrative props, Exercise partitioned color, Health blended atmosphere. MUST align with health-design-language (HeartLine logo-locked DNA)."
license: MIT
compatibility: Agent-agnostic. Requires health-design-language. Pairs with naive-design and baoyu-article-illustrator.
metadata:
  author: HUAWEI Health Design System
  version: "0.3.0"
  palette: "Illustration Palettes v0.2"
  brand: "HeartLine / HUAWEI Health"
  defaultStyle: "card-flat"
  alignsWith: "health-design-language@1.0.0"
---

# health-illustration

> **Primary deliverable: `card-flat` illustrations for content cards.**  
> Faceless flat characters + narrative props. Product chrome stays clean; art fills the card media area.

## Alignment (mandatory)

Before generating art, load **`health-design-language`** (v1.0+). Logo is locked; illustration is a downstream voice of that mark:

- Soft geometry, continuous narrative, local depth only  
- Brand orange `#FD8F1B` is identity chroma — not a large Health Morandi fill  
- Atmosphere teal–forest is valid for dark brand-adjacent empty states  
- No purple-on-white / cream+terracotta default kits  

This skill encodes:

1. **health-design-language** — parent DNA (logo / color / type / motion)  
2. **card-flat** — faceless flat vector for Achieve / Body / Heart cards (default)  
3. **naive-design** — intentional composition, limited palette, brand-layer boundary  
4. **Narrative props** — scene tells a story beyond a lone figure  
5. **Illustration Palettes v0.2** — Health Morandi / Exercise Kinetic  
6. **baoyu / doodle modes** — optional for empty-state sketch moments (non-default)

## When to use

**Use for**

- Content cards (Achieve / Body / Heart) — **default `card-flat`**
- Empty states, onboarding, benefit moments
- Sleep / recovery / nutrition / vitals (Health track)
- Run / strength / outdoor / challenge (Exercise track)

**Do NOT use for**

- Data tables, charts chrome, settings forms, medical-critical UI
- Replacing icons (use icon skills)
- Photoreal / 3D glossy / anime faces

## The one rule

**One card = 1 subject + 2–3 supporting elements + one clear verb.**  
Readable in 1 second. Camera can be 特写 / 中景 / 远景. Mild pose deformation OK.

Fatal failures:

- More than 3 supporting elements (busy card)
- Zero story (empty floating figure with no supports) — use 2–3, not 0–1 unless close-up object hero
- Health cards with harsh partitioned poster contrast (unless asked)
- Extreme cartoon chaos / horror distortion
- Detailed faces, neon glow, photo collage

## Mode selection

Pick **style** + **track**:

| Style | Default? | Use when |
|-------|----------|----------|
| `card-flat` | **Yes** | Content cards, benefit tiles, feed cards |
| `doodle` | No | Soft empty states that need sketch warmth |

| Track | Color strategy | Palette |
|-------|----------------|---------|
| `exercise` | **Partitioned** — solid field bg, character/props pop | Olive/ochre field + Kinetic accents (`palettes.md`) |
| `health` | **Blended** — bg + subject fuse in one Morandi atmosphere | Health Morandi v0.2 (`palettes.md`) |

Always read `references/card-flat.md` when style is `card-flat`.

If mixed (e.g. “recovery after run”), prefer **health + blended** for rest emotion; **exercise + partitioned** only when the hero verb is motion.

## Workflow

### 1. Lock context

Collect:

- Style (`card-flat` default | `doodle`)
- Track (`health` | `exercise`)
- Scene job (card / empty / onboard / celebrate)
- Aspect (`1:1` default for cards; `4:5` tall card; `16:9` banner)
- Narrative beats (hero verb + required props)
- Leave clear zone for title overlay? (default yes — keep top band quieter)

Read before drawing:

0. **`health-design-language`** (mandatory parent — principles + color bridges)
1. `references/card-flat.md` (mandatory for cards)
2. `references/palettes.md` (mandatory)
3. `references/scenes.md` (scene recipes)
4. `references/prompt-template.md` (generation contract)
5. `references/qa-checklist.md` (before delivery)

Also load sibling skills when available:

- `naive-design` — composition discipline + AVOID block
- `baoyu-article-illustrator` — optional for `doodle` style only

### 2. One image, one job + sparse narrative

- **One hero verb** only
- **1 subject + 2–3 supporting elements** (hard cap)
- Choose shot: **特写 / 中景 / 远景**
- Mild squash–stretch / elongated stride OK
- Subject group occupies ~40–65% depending on shot
- Quiet top band for app typography

### 3. Build the prompt

Follow `references/prompt-template.md` → **card-flat** section. Always include:

1. Artifact + scene (app content card)
2. Style: faceless card-flat vector + slight deformation allowed
3. Shot type (close / medium / wide)
4. Hero action + **exactly 2–3 named supports** (not more)
5. Color strategy: Exercise **partitioned** OR Health **blended**
6. **Named hex list** from `palettes.md` / card-flat grounds
7. Layout: clear top band for title overlay
8. AVOID block (including “too many props”)

### 4. Generate & check

Generate with the available image tool. Then run `references/qa-checklist.md`.

If palette drift is visible (neon coral on Health, muddy gray on Exercise), regenerate with stricter hex list and “use ONLY these colors”.

### 5. Deliver

- Save assets under `Generated/health-illustration/` when in a workspace
- Name: `{mode}-{scene}-{nn}.png`
- Report: mode, scene, palette version (`v0.2`), path, QA notes

## Style recipes (short)

### card-flat · Health (blended)

- Faceless rubber-limb character; **no facial features**
- Bg + clothing + supports share Morandi family — **fused atmosphere**
- **2–3 supports only** (e.g. moon + blanket, or glass + board)
- Soft same-hue shadows; high lightness
- Shot varies: sleep often 中景/特写; food 中景
- Forbidden: stark poster blocks, prop clutter, neon

### card-flat · Exercise (partitioned)

- Faceless character pops on **solid olive/ochre (or deep) field**
- Accents from Kinetic v0.2 (orange/blue/teal/coral)
- **2–3 supports only** (e.g. path + bottle; kettlebell + mat)
- Mild stride stretch / squash landing OK
- Shot varies: run 中景 or 远景; strength 特写/中景
- Forbidden: muddy fields, 4+ props, Health dust-pinks as dominant fills

### doodle (optional, non-default)

- Soft sketch empty states only; see earlier Morandi / Kinetic doodle notes
- Still require one verb; props can be lighter (2–3)

## HeartLine coexistence

- Prefer **no logo** inside spot illustrations
- If required: follow `health-design-language/references/logo.md` colorways only  
  (Health/light → Mono / soft peach echo; Exercise/dark → white mark on deep field)
- Never stretch, recolor arbitrarily, or place on busy texture without scrim
- Props/lines may echo ribbon kinship (even stroke, soft arcs) without copying the mark

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
- [2026-07-16] Lonely figure on cards → require supports (`card-flat.md`).
- [2026-07-16] Health cards used harsh indigo partition like Achieve → switch to **blended** Morandi fuse.
- [2026-07-17] Cards too busy → hard cap **1 subject + 2–3 supports**; vary 特写/中景/远景; allow mild deformation.
- [2026-07-17] Logo style locked → parent skill `health-design-language@1.0.0`; illustration must inherit soft-geometry / local-depth / brand chroma rules.
