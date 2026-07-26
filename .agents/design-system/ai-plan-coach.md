# AiPlanCoach · AI 生成式计划对话

**Role:** Plan Coach — precise, concise plan maker  
**Icon:** `✦`（参考 [119:962](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=119-962)）  
**Component set:** `AiPlanCoach` (`124:861`)  
**Variants:** `Step=Meet | Typing | Thinking | Reply | FollowUp | Process | Plan`  
**Page:** Page 27  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=124-861

---

## Visual shell（全步骤统一）

- 390×844 · **浅蓝渐变** bg（Meet 同款）  
- TopBar: Back ← · ✦ Plan Coach  
- SF Compact Rounded · Accent `#007AFF`  
- Composer: 白色胶囊输入框 + 蓝色圆形发送

---

## Flow

| # | Step | 内容 |
|---|------|------|
| 1 | **Meet** | 问候 `Hi Sifan,` · How can I help you? · 小字说明 → 快速示例 chips → 输入框 |
| 2 | **Typing** | 拉起 **iOS 键盘** · 用户正在输入 `Lose 5 kg in 7 weeks|` |
| 3 | **Thinking** | Coach 思考态 · ✦ **高光闪过**（radial flash · motion note） |
| 4 | **Reply** | Coach 反馈 + **主动追问**（天数 / 冲击限制） |
| 5 | **FollowUp** | 用户再反馈（3 days · home gym · knees） |
| 6 | **Process** | 思考过程文字列表 · **向上滚动 + fade**（motion note） |
| 7 | **Plan** | 计划框架卡 · 卡下 **☺ i feel good / ☹ i don't like it** · **保留输入框** |

---

## Meet details

- Greeting + tip，然后才出现对话框  
- Quick examples: Lose fat · Build muscle · Exercise habit · High-intensity · Serious runner  
- Placeholder: `e.g. Lose 5 kg in 7 weeks`

## Motion notes（实现）

| State | Motion |
|-------|--------|
| Thinking | Highlight flash sweeps across ✦ |
| Process | Process lines scroll up · opacity ramp |

Keyboard: mid-fi iOS-style open component (`Keyboard/iOS`).

### Meet · Intro Motion（Figma timeline）

**Frame:** `AiPlanCoach · Meet · Intro Motion` (`133:728`)  
（原 instance `132:701` 已 detach 以便打字机裁切）  
**Duration:** 4.4s · Deep link: https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=133-728

| t | Action |
|---|--------|
| 0.00–0.55 | ✦ 从下往上隐现（OPACITY + TRANSLATION_Y） |
| 0.65–1.45 | **Hi Sifan,** 打字机 |
| 1.55–2.55 | **i am your personal coach** 打字机 |
| 2.65–3.25 | 副标题 tip 从下往上隐现 |
| 3.35–3.95 | Back + QuickExamples + InputBar 同时出现 |

Artifact: `/opt/cursor/artifacts/ai-plan-coach-meet-intro.mp4`

### Meet · Keyboard Focus Motion

**Frame:** `AiPlanCoach · Meet · Keyboard Focus` (`136:695`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=136-695

| t | Action |
|---|--------|
| 0–0.35s | 静止：中间问候区 + 输入框可见，键盘隐藏在下方 |
| 0.35–0.95s | 点击输入框：键盘上滑浮现 · **中间内容同时渐隐上移** |

Artifact: `/opt/cursor/artifacts/ai-plan-coach-meet-keyboard.mp4`

---

## Artifacts

- `/opt/cursor/artifacts/ai-plan-coach-meet.png`
- `/opt/cursor/artifacts/ai-plan-coach-typing.png`
- `/opt/cursor/artifacts/ai-plan-coach-thinking.png`
- `/opt/cursor/artifacts/ai-plan-coach-reply.png`
- `/opt/cursor/artifacts/ai-plan-coach-followup.png`
- `/opt/cursor/artifacts/ai-plan-coach-process.png`
- `/opt/cursor/artifacts/ai-plan-coach-plan.png`
