# health_shell

Flutter simulator for Design System Meet Intro:

https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=133-728

## What opens by default

**AiPlanCoach Meet flow**

1. Intro Motion (`133:728`) — star → typewriter → tip → chips + input  
2. Keyboard Focus (`136:695`) — tap input: chips vanish → middle fades → iOS keyboard slides up 202px in ~100ms  

Marker under tip: `meet-v7` — mock keyboard stays open while typing (return to dismiss)

Optional 4-tab shell: append `?shell=1` or open `/shell`.

## Run

```bash
cd apps/health_shell
flutter pub get
flutter run -d chrome
```

After updates on this branch:

```bash
git pull origin cursor/flutter-ds-shell-2578
cd apps/health_shell
flutter pub get
flutter run -d chrome
```
