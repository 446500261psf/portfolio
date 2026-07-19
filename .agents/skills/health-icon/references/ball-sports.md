# Ball Sports · Soft Layer

Source board on **Icons · HeartLine DNA**:

- **`Ball Sports · Soft Layer v1.0`** — object icons for ball sports  
- Reference glyph: **Style I · 乒乓球** (`292:2`) on Figure Styles board

Parallel to figure-action boards. Same two DNA rules: soft geometry · local overlap depth.

## Soft Layer recipe (from Style I)

| Layer | Spec |
|-------|------|
| Cell | `#1A1F24`, corner radius **28**, review **200×200** |
| Equipment (面) | Mid gray `#666B73` — soft ellipse / capsule / rounded rect |
| Under tint (optional) | Darker sibling ≈ `#52565E` where a face needs inner depth |
| Ball / focus (点) | Pure white `#FFFFFF` — circle or soft oval |
| Local shadow | `DROP_SHADOW` **only on the white ball**: offset `(2, 3)`, blur `6`, black **20%** |
| Marks | **2–3** typical (器材面 + 白球 ± 一根柄/柱) |

### Hard rules

1. White ball **must overlap** gray equipment so the local shadow reads.  
2. No whole-icon floor shadow.  
3. No texture, no fine mesh grids, no logo lettering.  
4. Soft geometry only — round caps, soft ellipses, capsule handles.

## Set (v1.0)

| Name | `heartline.icon.*` | Construction |
|------|-------------------|--------------|
| 乒乓球 | `table-tennis` | Gray paddle oval + handle capsule + white ball on face |
| 网球 | `tennis` | Gray racket head + under-tint face + handle + white ball |
| 羽毛球 | `badminton` | Tilted racket + under-tint + white shuttle (cork+skirt) |
| 篮球 | `basketball` | Backboard + rim ellipse + white ball on rim |
| 足球 | `soccer` | Goal U (2 posts + crossbar) + white ball |
| 排球 | `volleyball` | Net band + posts + white ball on net |
| 高尔夫 | `golf` | Shaft capsule + club-head ellipse + white ball on face |
| 棒球 | `baseball` | Bat barrel + grip + white ball on barrel |
| 保龄球 | `bowling` | Pin stack + white ball overlapping base |
| 橄榄球 | `rugby` | H posts + white oval ball on crossbar |

## Naming

`heartline.icon.{sport}` — e.g. `heartline.icon.tennis`
