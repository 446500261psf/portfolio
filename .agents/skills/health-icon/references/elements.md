# Elements · 点 / 线 / 面

Source board in Figma: `Icon Elements · 点线面` on page **Icons · HeartLine DNA**.

## 点 Point

| Element | Use |
|---------|-----|
| Solid disc (head / joint / hub) | Figure head, bike hub, pivot |
| Small disc (accent) | Spark, status, toe contact |
| Ring (hollow circle) | Wheel, O₂ hole, target |

Rules: perfect circles; no capsules unless intentional soft blob.

## 线 Line

| Element | Use |
|---------|-----|
| Straight ROUND stroke | Torso, bar, pole |
| Arc / curve ROUND stroke | Limb swing, wave, route |
| Soft polyline (≤2 bends) | Pulse, path kink |

Rules: stroke ≈2.25; ROUND cap + join; prefer arcs over polylines.

## 面 Face

| Element | Use |
|---------|-----|
| Soft disc / ellipse fill | Weight plate, footprint, moon |
| Soft blob / droplet fill | Water, flame body, apple |
| Soft triangle / flag fill | Challenge flag (rounded corners via stroke or soft path) |

Rules: filled shapes are first-class; combine with 1–2 strokes.

## 交叠深度 Overlap depth

When A sits over B:

1. **Under tint** — B (or the hidden segment) uses a darker sibling of the icon color  
2. **Optional soft shadow** — small DROP_SHADOW on the **upper** piece only:  
   - Default object icons: offset ≈ (0.5–1, 0.5–1), blur ≈ 2–3, black @ 25–40%  
   - **Soft Layer 球类**（Style I）: offset `(2, 3)`, blur `6`, black @ **20%** — 只挂在白球上  
3. Never cast a shadow from the whole icon to the cell floor  

## Assembly

Typical recipes:

- Head(点) + torso(线) + limbs(线) → figure  
- Plate(面) + bar(线) + under tint → strength  
- Blob(面) + inner cut/under(面) → droplet / flame  
- Equipment gray(面) + white ball(点) + local shadow → ball sports（见 `ball-sports.md`）
