# health_shell

Flutter simulator for Design System Meet + Chat:

https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=133-728

交互范式：`docs/chat-interaction-paradigm.md`

## What opens by default

**AiPlanCoach Meet → Chat → Plan flow**

1. Intro Motion (`133:728`) — star → typewriter → tip → chips + input  
2. Keyboard Focus (`136:695`) — tap input: chips vanish → middle fades → iOS keyboard slides up 202px  
3. Chip / ↑ send — **仅思考态**白气泡：`Plan Coach` 高光 + 旋转星星 → 出字后静态标签  
4. 确认生成计划 — 思考文案渐隐 → 每周折叠卡（同宽原位纵向展开详情）  
5. 计划后 mood chips（☺ That’s it! / ☹ i don’t like it）→ 点击后再回复 Today 收尾  

Demo：`Lose 3 kg in 15 days` → `3 days / week · Home only` → `Yes, generate my plan` → `☺ That’s it!`

Marker: `meet-v23` — transcript order: plan → mood chip → Today reply

Portfolio（合并到 `main` 后上线）：

- 案例页：https://446500261psf.github.io/portfolio/coach.html
- 全屏原型：https://446500261psf.github.io/portfolio/coach/

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
