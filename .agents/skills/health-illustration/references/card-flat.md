# card-flat · Card illustration style (primary)

Default style for **Achieve / Body / Heart** content cards in HUAWEI Health.

Inspired by modern faceless flat wellness apps (Corporate Memphis–adjacent), tuned for our palettes.

## Visual DNA

- **Faceless characters** — no eyes/nose/mouth; rubbery simplified limbs
- **Flat vector** — hard-edged soft shadows, minimal or no gradients
- **Single primary action** — one clear verb per card
- **Narrative props** — 2–5 supporting elements that tell the story (not decorative clutter)
- **No UI chrome, no card title text inside the art** (copy lives in the app)

## Narrative rules (required)

Do **not** ship a lonely floating figure.

Build a mini-story with:

1. **Hero action** — what the person is doing (run / cook / rest / lift)
2. **Context props** — 2–4 objects that prove the scene (kettlebell, juice glass, moon, track path, herb pot…)
3. **Environment cue** — 1 ground plane / path / counter / soft room shape
4. **Optional motif** — 1 brand-safe symbol (waveform, route dots, steam, ribbon) — never spam

Subject + props together still occupy ~45–65% of canvas; keep quiet margins.

### Prop budgets

| Mode | Props | Notes |
|------|-------|-------|
| Exercise | 3–5 | Motion helpers: path, bottle, towel, flag, hills — OK |
| Health | 3–5 | Soft domestic/nature: plant, blanket, bowl, moon — OK |
| Either | ≤ 5 total meaningful props | Delete anything that doesn’t carry story |

## Color strategy (critical difference)

### Exercise · Partitioned（分区配色）

- **Solid field background** in a muted sport ground (olive / ochre / deep teal field)
- Character + key props **pop** with higher contrast (white / charcoal / sport blue / energy orange)
- Ground shadow can be a darker sibling of the field color
- Feels energetic, poster-like, scannable in a feed

Suggested field grounds (pick one per card set):

- Olive Achieve: `#8B8C5E` / `#7E8A56`
- Or deep sport field from Kinetic: `#1A2028` (night run) + light pops

Accent pops from Exercise Kinetic v0.2: `#E89A45`, `#5B8FD9`, `#3DB8B0`, `#E86B78`.

### Health · Blended（背景与主体融合）

- Background and subject share the **same Morandi family**
- Clothing / props / backdrop sit close in lightness & saturation — figure feels *inside* the atmosphere
- Avoid stark “white character on dark indigo block” unless explicitly requested
- Shadows use same-hue soft shapes (`stone` / `mist`), not black slabs
- Feels calm, continuous, trustworthy — less poster, more space

Use Health Morandi v0.2 exclusively: `#F7F3EE`, `#B7C7B5`, `#B5C5CE`, `#D4C2BC`, `#D8BFA8`, `#5A544E`, etc.

## Composition for cards

- Default aspect **1:1** (or slightly taller 4:5 if card is vertical)
- Leave top-left / top-right relatively clear for **app title typography overlay**
- Prefer action reading left→right or slight diagonal for Exercise; centered calm for Health
- No corner watermarks, no fake UI arrows inside the illustration

## Do / Don’t

**Do**

- Faceless rubber-limb characters
- Narrative props that explain the benefit
- Exercise = partitioned pop; Health = blended fuse
- One verb, one emotion

**Don’t**

- Detailed faces / realistic skin
- Neon glow, 3D plastic, photo collage
- Overcrowd into sticker sheets
- Put Health Morandi dust-pinks as dominant fills on Exercise cards
- Put high-contrast partitioned blocks on Health cards (unless user asks)
