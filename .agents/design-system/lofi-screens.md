# Lo-fi Wireframe Screens

Brand-agnostic sports & health app wireframes. Grayscale boxes + labels only — no branding polish.

## Figma

| | |
|---|---|
| **File** | [Design System](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System) |
| **Page** | `07 · Screens · Lo-fi` |
| **Page ID** | `3:6` |
| **Board** | [Lo-fi Screens Board](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-474) (`3:474`) |

## IA (4-tab BottomNav)

`Today` · `Health` · `Exercise` · `Devices`

## Reusable Components

| Component | Node ID | Notes |
|-----------|---------|-------|
| Lo-fi / BottomNav | `3:59` | Variant property `Active`: Today \| Health \| Exercise \| Devices |
| Lo-fi / StatusBar | `3:60` | 390×44 status bar placeholder |

## Screens

| Screen | Node ID | Active Tab | Deep Link |
|--------|---------|------------|-----------|
| Today · Home | `3:77` | Today | [open](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-77) |
| Today · Empty | `3:118` | Today | [open](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-118) |
| Health · Hub | `3:148` | Health | [open](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-148) |
| Health · Metric Detail | `3:202` | Health | [open](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-202) |
| Exercise · Hub | `3:252` | Exercise | [open](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-252) |
| Exercise · Session Summary | `3:308` | Exercise | [open](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-308) |
| Devices · List | `3:357` | Devices | [open](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-357) |
| Devices · Detail | `3:415` | Devices | [open](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=3-415) |

## Screen Summaries

### Today
- **Home** — Greeting, summary metric cards (steps, heart rate, sleep), CTAs into Exercise/Health, recent activity placeholder.
- **Empty** — First-run welcome state with Get Started CTA.

### Health
- **Hub** — 2-column metric tile grid (heart rate, sleep, stress, SpO₂, blood pressure, weight).
- **Metric Detail** — Back nav, 7-day chart placeholder, avg/min/max stats, insights block.

### Exercise
- **Hub** — Last session card, sport picker list, START CTA.
- **Session Summary** — Completion header, route map placeholder, distance/calories/HR stats, Save & Done.

### Devices
- **List** — Device rows with connection status and + Add action.
- **Detail** — Device hero, connect/disconnect, settings rows, Connect/Pair CTA.

## Wireframe Rules Applied

- Phone frame: 390×844
- Gray rectangles, 8–12px corner radius, Inter labels
- Screen name annotated above each phone
- BottomNav on every root tab screen with correct active tab
- No color photography, illustrations, or brand-specific styling

## Artifacts

| File | Description |
|------|-------------|
| `/opt/cursor/artifacts/lofi-board.png` | Full 8-screen board (2×4 grid) |
| `/opt/cursor/artifacts/lofi-today-home.png` | Today · Home single screen |
