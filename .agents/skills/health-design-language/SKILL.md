---
name: health-design-language
description: "Source of truth for HUAWEI Health / HeartLine visual language. Use whenever designing UI, logo lockups, motion, icons, illustrations, marketing, or empty states for this brand. Derived from the finalized HeartLine ribbon-heart mark. All other health-* skills must align with this document."
license: MIT
compatibility: Agent-agnostic. Parent of health-illustration and future health-icon / health-motion skills.
metadata:
  author: HUAWEI Health Design System
  version: "1.0.0"
  brand: "HeartLine / HUAWEI Health"
  figma: "Pqwb3XVRiAyle9WOao5G5L"
  status: "logo-locked"
---

# health-design-language

> **Logo is locked.** Every surface — UI, type, motion, icon, illustration — must inherit from the finalized HeartLine mark.  
> If a choice conflicts with this skill, **this skill wins**.

## What was locked

HeartLine is a **single continuous thick ribbon** folded into a heart:

- Left lobe = perfect circular loop (negative hole)
- Right lobe = soft geometric arc
- Bottom = sharp/diagonal tip from the ribbon fold
- Depth = **localized overlap shadow only** (folded paper), not a global drop shadow
- Presence = bold, even stroke weight; modern, minimal, approachable

Canonical atmospheres:

| Surface | Mark | Ground |
|---------|------|--------|
| Brand / Splash / Marketing | White ribbon | Teal → forest green vertical gradient |
| Primary product accent | Brand orange ribbon `#FD8F1B` | White / light UI |
| Reverse on brand | White ribbon | Solid brand orange |

Figma: `Logo · Usage Guidelines`, `Logo · HeartLine`, Master Mark frames.

## When to use

**Always load this skill before** any HUAWEI Health / HeartLine design work:

- Logo lockups, splash, marketing KV
- App UI chrome, type, color tokens
- Motion / PATH_TRIM / onboarding animation
- Feature icons, tab icons
- Card illustrations, empty states (`health-illustration` still applies — but under this DNA)

## The five DNA rules

Every deliverable must pass these:

1. **One continuous idea** — prefer a single flowing path / narrative, not collage clutter  
2. **Soft geometry** — circles, arcs, generous radii; no sharp serifs, no aggressive spikes  
3. **Bold but calm** — visual weight like the thick ribbon; never fragile hairlines as the hero  
4. **Local depth only** — overlap / fold shadows at contact; no neon glow, no multi-layer glam shadows  
5. **Vital & approachable** — health + motion energy without clinical coldness or cartoon chaos  

Fatal failures:

- Breaking the mark (stretch, arbitrary recolor, busy texture without scrim)
- Purple-on-white / cream+terracotta AI clichés as the default brand look
- Sharp display serifs or handwriting competing with the ribbon
- Global heavy drop shadows on the whole heart
- Neon / glassmorphism / skeuomorphic chrome as the system voice

## Read order

1. `references/principles.md` — worldview & do/don't  
2. `references/logo.md` — construction, clear space, misuse  
3. `references/color.md` — brand + atmosphere + illustration bridges  
4. `references/typography.md` — locked type stack  
5. `references/motion.md` — path language for animation  
6. `references/icons.md` — HeartLine DNA icon rules + page map  
7. Then domain skills (`health-illustration`, etc.)

## System stack (quick)

| Layer | Choice |
|-------|--------|
| Mark | HeartLine ribbon heart (locked) |
| Brand chroma | Orange `#FD8F1B` · deep `#E8591F` / `#E55933` |
| Atmosphere | Teal–forest gradient for dark brand moments |
| Display / CN UI | **HarmonyOS Sans SC** |
| EN lockup alt | Plus Jakarta Sans · SF Pro Rounded |
| Body / data | Atkinson Hyperlegible |
| Illustration | `card-flat` — see `health-illustration` (must obey DNA above) |
| Motion signature | Path trim: draw → optional wipe/loop; fold shadow fades in after overlap |

## Sibling skills

| Skill | Role under this language |
|-------|--------------------------|
| `health-illustration` | Card-flat art; Health blended / Exercise partitioned — colors & softness must echo HeartLine |
| `naive-design` | Composition discipline only; do not override HeartLine color/type |
| Feature icons (Figma) | **Icons · HeartLine DNA** — thick (~2.5) ROUND stroke, circle/arc first; keep **Icons · Feature Samples** (HarmonyOS) as parallel legacy |

## Versioning

- **1.0.0** — Logo style locked; this document becomes the design-language source of truth.  
- Bump version when mark geometry, brand orange, atmosphere gradient, or type stack changes.
