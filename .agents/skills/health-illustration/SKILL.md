---
name: health-illustration
description: "Generate HUAWEI Health app card-flat illustrations for Achieve/Body/Heart content cards, empty states, and benefit moments. Use when the user asks for card illustration, card-flat, faceless flat vector, 卡片插画, health/exercise illustrations, Morandi blended health art, or partitioned exercise card art. Default style is card-flat: faceless rubber-limb characters, narrative props, Exercise partitioned color, Health blended atmosphere. Complements naive-design and baoyu-article-illustrator."
license: MIT
compatibility: Agent-agnostic. Pairs with naive-design, baoyu-article-illustrator, and HeartLine logo guidelines.
metadata:
  author: HUAWEI Health Design System
  version: "0.2.0"
  palette: "Illustration Palettes v0.2"
  brand: "HeartLine / HUAWEI Health"
  defaultStyle: "card-flat"
---

# health-illustration

> **Primary deliverable: `card-flat` illustrations for content cards.**  
> Faceless flat characters + narrative props. Product chrome stays clean; art fills the card media area.

This skill encodes:

1. **card-flat** — faceless flat vector for Achieve / Body / Heart cards (default)  
2. **naive-design** — intentional composition, limited palette, brand-layer boundary  
3. **Narrative props** — scene tells a story beyond a lone figure  
4. **HeartLine + Illustration Palettes v0.2** — locked color systems  
5. **baoyu / doodle modes** — optional for empty-state sketch moments (non-default)

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

**One card = one verb + a short visual story.**  
Hero action is clear in 1 second; props explain *why it matters*; composition stays card-safe (room for title overlay).

Fatal failures:

- Lonely floating figure with no narrative props
- Overcrowded sticker sheet
- Health cards with harsh partitioned poster contrast (unless asked)
- Exercise cards that feel muddy / un-scannable
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

1. `references/card-flat.md` (mandatory for cards)
2. `references/palettes.md` (mandatory)
3. `references/scenes.md` (scene recipes)
4. `references/prompt-template.md` (generation contract)
5. `references/qa-checklist.md` (before delivery)

Also load sibling skills when available:

- `naive-design` — composition discipline + AVOID block
- `baoyu-article-illustrator` — optional for `doodle` style only

### 2. One image, one job + narrative

- **One hero verb** only
- Subject + props occupy **~45–65%** of canvas
- **2–5 narrative props** required (see `card-flat.md`)
- Leave quiet margins / top band for app typography
- No PPT titles, no flowchart chrome, no multi-panel storyboards unless asked

### 3. Build the prompt

Follow `references/prompt-template.md` → **card-flat** section. Always include:

1. Artifact + scene (app content card)
2. Style: faceless card-flat vector
3. Hero action + named narrative props (3–5)
4. Color strategy: Exercise **partitioned** OR Health **blended**
5. **Named hex list** from `palettes.md` / card-flat grounds
6. Layout: clear top band for title overlay
7. Emotional target
8. AVOID block

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
- Bg + clothing + props share Morandi family — **fused atmosphere**
- Narrative props: moon/plant/bowl/blanket/waveform… (3–5)
- Soft same-hue shadows; high lightness; max ~5–6 colors
- Forbidden: stark poster blocks, neon, pure black, full `#FD8F1B`

### card-flat · Exercise (partitioned)

- Faceless character pops on **solid olive/ochre (or deep) field**
- Accents from Kinetic v0.2 (orange/blue/teal/coral)
- Narrative props: path/bottle/kettlebell/flag/hills… (3–5)
- Hard soft ground shadow; scannable feed energy
- Forbidden: muddy low-contrast fields, Health dust-pinks as dominant fills

### doodle (optional, non-default)

- Soft sketch empty states only; see earlier Morandi / Kinetic doodle notes
- Still require one verb; props can be lighter (2–3)

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
- [2026-07-16] Lonely figure on cards → require 2–5 narrative props (`card-flat.md`).
- [2026-07-16] Health cards used harsh indigo partition like Achieve → switch to **blended** Morandi fuse.
