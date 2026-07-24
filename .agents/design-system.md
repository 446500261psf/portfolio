# Design System — Sports & Health App

**Figma File:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System  
**File Key:** `1ibE2wPPDAauJKaj1ft6AC`  
**Product:** 4-Tab App — Today · Health · Exercise · Devices  
**Build:** v1 Foundations + Core Components  
**Font:** Inter (all weights)

---

## Token Summary

### Variable Collections

| Collection | Modes | Variable Count | Purpose |
|---|---|---|---|
| Primitives | Value | 29 | Raw color values — gray scale, brand blues, success/warning/error |
| Color | Light | 33 | Semantic aliases → surface, text, border, brand, icon, feedback |
| Spacing | Value | 10 | 4/8/12/16/20/24/32/40/48/64px |
| Radius | Value | 7 | none/sm/md/lg/xl/2xl/full |

**Total variables: 79**

### Semantic Color Tokens (Light mode)

| Group | Tokens |
|---|---|
| Surface | page, card, subtle, elevated, brand-subtle |
| Text | primary, secondary, tertiary, disabled, inverse, brand, success, warning, error |
| Border | default, strong, focus, error |
| Brand | default (#3B82F6), subtle, hover, text |
| Icon | default, secondary, brand, inverse, disabled |
| Feedback | success, success-subtle, warning, warning-subtle, error, error-subtle |

### Spacing Scale

`spacing/1`=4 · `spacing/2`=8 · `spacing/3`=12 · `spacing/4`=16 · `spacing/5`=20  
`spacing/6`=24 · `spacing/8`=32 · `spacing/10`=40 · `spacing/12`=48 · `spacing/16`=64

### Radius Scale

`radius/none`=0 · `radius/sm`=4 · `radius/md`=8 · `radius/lg`=12 · `radius/xl`=16 · `radius/2xl`=24 · `radius/full`=9999

### Text Styles (13 total)

| Group | Styles |
|---|---|
| Display | XL (40/48 Bold), L (32/40 Bold) |
| Title | L (24/32 Semi Bold), M (20/28 Semi Bold), S (18/24 Medium) |
| Body | L (16/24 Regular), M (14/20 Regular), S (12/16 Regular) |
| Caption | M (12/16 Medium), S (11/14 Medium) |
| Tab | Default (10/12 Medium) |
| Button | M (14/20 Medium), S (12/16 Medium) |

---

## File Structure

| Index | Page | Type | Contents |
|---|---|---|---|
| 0 | 00 · Cover | Cover | Updated: "Today · Health · Exercise · Devices — 4-Tab Product Shell" |
| 1 | ──── Foundation ──── | Separator | — |
| 2 | 01 · Color | Foundation | Color swatch grid (6 groups × semantic tokens) |
| 3 | 02 · Typography | Foundation | Type specimens — all 13 text styles |
| 4 | 03 · Spacing | Foundation | Spacing bars + radius scale grid |
| 5 | ──── Components ──── | Separator | — |
| 6 | 04 · Button | Component | Button component set (6 variants) |
| 7 | 05 · BottomNav | Component | BottomNav component set (4 variants) |
| 8 | 06 · Header | Component | Header component set (2 variants) |
| 9 | 07 · Card | Component | Card component set (2 variants) |
| 10 | 08 · ListRow | Component | ListRow component set (2 variants) |
| 11 | 09 · MetricTile | Component | MetricTile component set (2 variants) |
| 12 | 10 · SectionHeader | Component | SectionHeader component set (2 variants) |
| 13 | 11 · Chip | Component | Chip component set (3 variants) |
| 14 | 12 · EmptyState | Component | EmptyState component set (2 variants) |
| 15 | 13 · Badge | Component | Badge component set (8 variants) |
| — | 17 · TodayP0Card | Component | Today P0 insight cards (4 Kind · 减肥画像) |
| 16 | ──── Product ──── | Separator | — |
| 17 | 05 · IA / UX | Product | 4-tab IA document frame |
| 18 | 06 · Screens | Product | (reserved) |
| 19 | 07 · Screens · Lo-fi | Product | 8 grayscale wireframes |
| 20 | 08 · Screens · Mid-fi | Product | 7 mid-fi screens |

### Related files

| Artifact | URL |
|---|---|
| FigJam user flows | https://www.figma.com/board/L8dn3zBruD2EermIve4CXU |
| Lo-fi page | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-6 |
| Mid-fi page | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-5 |
| Project index | [../README.md](./README.md) → `.agents/README.md` |

---

## Components Built

See [./design-system/components.md](./design-system/components.md) for full component inventory with node IDs.

Lo-fi: [./design-system/lofi-screens.md](./design-system/lofi-screens.md) · Mid-fi: [./design-system/midfi-screens.md](./design-system/midfi-screens.md)

---

## Constraints Applied

- No HUAWEI / HeartLine / old brand references anywhere
- Brand accent: `#3B82F6` (blue-500) — used as `color/brand/default`
- All fills, radii, and spacing bound to variables where applicable
- All variables have specific scopes set (not ALL_SCOPES)
- WEB code syntax set on all variables (`var(--token-name)`)
