# L1 Primary Screens · 一级 Tab 页

**Style master:** [`01 · Today Home`](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=104-588) (`104:588`)  
**Page:** Page 27 (`43:151`)  
**Locale:** English · Mid-fi

---

## Shared shell (from 104:588)

| Layer | Spec |
|-------|------|
| Canvas | 390 wide · bg `#F8F7F6` |
| StatusBar | 44px · `9:41` + signal |
| Header | Title 28 Bold + subtitle 14 · **Avatar** 52 right |
| Cards | White · radius **24** · 16 padding |
| Type | SF Compact Rounded · text `#111827` |
| Accent | `#007AFF` |
| BottomNav | Instance · Active matches tab · Phosphor icons |

---

## Avatar

| Set | Node | Variants |
|-----|------|----------|
| `Avatar` | `104:798` | `Face=A` · `Face=B` (photo ellipse 52×52) |
| `AvatarBadge` | `104:884` | `Face=C` · `Face=D` (photo + badge) |

Deep link: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=104-798

All four L1 headers use `Avatar` / `Face=B` instance (top-right).

---

## Screen inventory

| # | Screen | Node | Active tab | Deep link |
|---|--------|------|------------|-----------|
| 1 | Today Home | `104:588` | Today | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=104-588 |
| 2 | Health Hub | `111:518` | Health | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=111-518 |
| 3 | Exercise Hub | `111:619` | Exercise | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=111-619 |
| 4 | Devices | `111:713` | Devices | https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=111-713 |

### 01 · Today Home
- Greeting + Avatar  
- TODAY'S PLAN gap rows (Cardio / Nutrition / Sleep)  
- WeekFocusCard + P0 cards  

### 02 · Health Hub
- Heart rate hero + spark bars  
- SpO₂ · Steps tiles  
- Sleep stages  
- Body weight / fat  
- Stress · Blood pressure  

### 03 · Exercise Hub
- 3×2 sports (Run / Bike / Swim / Walk / Strength / Yoga) + icons  
- Recent outdoor run  
- Start workout CTA  
- Training plans  

### 04 · Devices
- GT Sport Pro connected + battery  
- Sync now  
- Add device  
- Nearby: GT Band 4 · Scale Pro  

---

## Artifacts

- `/opt/cursor/artifacts/l1-today-home.png`
- `/opt/cursor/artifacts/l1-health-hub.png`
- `/opt/cursor/artifacts/l1-exercise-hub.png`
- `/opt/cursor/artifacts/l1-devices.png`
