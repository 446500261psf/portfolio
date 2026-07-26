# health_shell

Flutter simulator for Design System Meet + Chat:

https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=133-728

交互范式：`docs/chat-interaction-paradigm.md`

## What opens by default

**AiPlanCoach Meet → Chat flow**

1. Intro Motion (`133:728`) — star → typewriter → tip → chips + input  
2. Keyboard Focus (`136:695`) — tap input: chips vanish → middle fades → iOS keyboard slides up 202px  
3. Chip / ↑ send — user bubble → Generating → streamed Coach reply（Cursor 风格）  
   Demo 剧本：`Lose 3 kg in 15 days` / `15天减重3公斤`

Marker: `meet-v10` — thinking = ✦ Coach 高光扫过（无文案、无大星星）

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
