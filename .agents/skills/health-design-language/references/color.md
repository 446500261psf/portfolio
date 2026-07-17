# Color · Brand & atmosphere

Logo-locked chroma. Illustration palettes remain in `health-illustration/references/palettes.md` but must **bridge** to these brand colors — never fight them.

## Core brand

| Token | Hex | Role |
|-------|-----|------|
| `brand.orange` | `#FD8F1B` | Primary brand / Primary mark |
| `brand.orange.deep` | `#E8591F` | Gradient partner / pressed / deep ribbon |
| `brand.orange.ribbon` | `#E55933` | Construction / motion stroke samples |
| `brand.white` | `#FFFFFF` | Reverse mark, atmosphere mark |
| `ink.primary` | `#1A2028` | UI ink / dark grounds |
| `ink.muted` | `#5A544E` | Secondary text (Health-adjacent) |

## Atmosphere (dark brand moments)

From the locked splash / brand plate (white mark on teal–green):

| Token | Hex | Role |
|-------|-----|------|
| `atmosphere.teal.deep` | `#0C3842` | Top / deep teal |
| `atmosphere.teal.mid` | `#145652` | Mid gradient |
| `atmosphere.forest` | `#1F6B55` | Lower forest lift |
| `atmosphere.mist` | `#B5C5CE` | Soft mist accent (shared with Health Morandi) |

Vertical gradient `deep → mid → forest` is the default dark brand atmosphere.  
Do **not** replace it with purple-indigo or pure black as the brand night look.

## Functional bridges

| Token | Hex | Role |
|-------|-----|------|
| `ai.violet` | `#7A6FD1` | AI+ only |
| `ai.blue` | `#5B8FD9` | AI+ / sport data bridge |
| `pulse.teal` | `#3DB8B0` | Aerobic / live pulse (Exercise Kinetic) |

## Illustration relationship

| Track | Strategy | Bridge to logo |
|-------|----------|----------------|
| Health · Morandi | Blended, high lightness | Soft echo via `accent.peach` / mist — **not** full `#FD8F1B` fills |
| Exercise · Kinetic | Partitioned fields | Energy orange `#E89A45` as softened brand cousin; full `#FD8F1B` OK as small accent |

Rules:

- Master logo mark uses **only** approved colorways above  
- UI CTAs / key accents may use `brand.orange`  
- Full-chroma brand orange is forbidden as a large Health illustration fill (keeps Morandi calm)  
- Avoid default AI clichés: purple-on-white UI, cream `#F4F1EA` + terracotta pairing as the brand kit

## Contrast

- White mark on atmosphere gradient: ensure lobe hole stays visible  
- Orange mark on white: WCAG for adjacent text still required for UI labels  
- Never put orange mark on orange field, or white mark on near-white without contrast plate  
