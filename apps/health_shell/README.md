# health_shell

Flutter mid-fi simulator for the **Design System** product shell:

**Today · Health · Exercise · Devices**

Figma: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System

## Note on node `143:738`

The linked node (`node-id=143-738`) is **not present** in the live Figma file
(only the Cover page remains). This app reconstructs the documented L1 shell
plus the AiPlanCoach **Meet** motion stack (closest “效果” work in that node
range):

| Motion | Source node |
|--------|-------------|
| Intro (star + typewriter) | `133:728` |
| Keyboard focus (chips hide · 100ms lift) | `136:695` |
| Chip tap → user bubble → ✦ light sweep ×2 | `132:981` |

## Run

```bash
cd apps/health_shell
flutter pub get
flutter run -d chrome
# or
flutter build web
```

## Demo path

1. Open **Today**
2. Tap **✦ Plan Coach → Open Meet**
3. Watch intro motion, then tap a quick-reply chip or focus the input field
