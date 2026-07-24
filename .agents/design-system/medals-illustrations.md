# Medals & Illustrations

In-app visual assets for the sports & health app (brand-agnostic).  
Figma: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System

## Style rules

- Soft geometry (circles, capsules, rounded rects)
- Brand blue `#3B82F6` + soft blue `#DBEAFE`; gold rim when earned; mint for calm scenes
- Local depth only (small contact shadow) — no global glam drop shadows
- No facial features on figures; encourage copy tone
- Fits mid-fi chrome (grayscale UI + blue accent)

## Medals · `14 · Medals`

Component set **`Medal`**: `Kind` × `State`

| Kind | Meaning | Unlock cue |
|------|---------|------------|
| **Streak** | Week streak / continuous activity | Keep moving through the week |
| **FirstWorkout** | First completed session | Finish first START → summary |
| **SleepGoal** | Hit sleep window | Overnight goal met |
| **DeviceConnected** | Wearable linked | Pair succeeds |

| State | Look |
|-------|------|
| **Locked** | Gray rim + muted glyph + unlock hint |
| **Earned** | Gold rim + brand-soft face + success/gold accents |

Deep link: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=22-3

## Illustrations · `15 · Illustrations`

Empty-state cards (art + title + subtitle):

| Card | Use on |
|------|--------|
| **A quiet start** | Today empty / cold calm morning |
| **No device yet** | Devices list empty |
| **No workouts yet** | Exercise history empty |

Deep link: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=22-4

## Wiring (next)

- Swap `EmptyState` component art slot with these illustrations
- Surface `Medal` on Today rewards / Session Summary celebrate
- Optional: Locked → Earned motion (scale + gold rim) in hi-fi later
