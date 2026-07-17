# Motion · Path language

HeartLine is a drawn ribbon. Motion should feel like **ink flowing along one line**, not random UI bounce.

Figma references:

- `Logo · Splash Motion` (`52:2`) — trim + heartbeat  
- `HeartLine · Path Trim Loop` (`237:103`) — draw → wipe loop  

## Signature moves

| Move | How | When |
|------|-----|------|
| **Draw** | `PATH_TRIM` end grows (or start reveals) 0→1 | Splash, first paint, onboarding |
| **Wipe / Loop** | After full draw, trim the opposite bound so the **start disappears toward the end** | Idle brand loop, loading personality |
| **Fold shadow in** | Separate shadow layer opacity 0→1 **after** overlap is drawn | Master mark / final settle |
| **Heartbeat** | Soft `SCALE_XY` 1 → 1.06 → 1 (1–2 beats) | After draw completes; optional |

## Rules

1. Prefer **stroke path trim** for the mark — filled unions don’t trim cleanly  
2. Fold shadows are **separate layers**, timed after the crossing; never a global effect on the whole path during trim  
3. Multi-segment ribbons: stagger trims in draw order, erase in the same order (tail follows the story)  
4. Easing: calm cubic / ease-out; avoid elastic cartoon bounce on the master mark  
5. Looping brand films: end empty or end settled — don’t hard-cut mid-ribbon  

## UI motion kinship

App chrome doesn’t need path trim everywhere, but should feel related:

- Enter: short fade + small rise (≤16px), ease-out  
- Emphasis: one soft scale pulse max  
- Lists/cards: stagger lightly; no bounce festival  
- Forbidden as default: glow pulses, 3D flips, confetti on every success  

## Export notes

- Master mark Lottie/SVG: keep fold shadow as its own opacity track  
- `get_screenshot` shows resting state only — verify motion with timeline play or `export_video`  
