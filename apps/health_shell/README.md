# health_shell

Flutter simulator for Design System Meet Intro:

https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=133-728

## What opens by default

**AiPlanCoach · Meet · Intro Motion** (`133:728`)

- Cyan → warm page gradient `#D1F0F8 → #F8F7F6`
- TopBar: white back tile + `✦ Premium`
- 4.4s intro: star rise → typewriter lines → tip → chips + input
- Composer chips / input bar match Figma sizing

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
