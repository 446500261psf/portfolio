# Premium Onboarding · 开通引导落地页（4 页）

**Entry:** Profile Modal (Free) → **Upgrade** CTA  
**Component set:** `PremiumOnboarding` (`122:988`) · `Page=1…4`  
**Page:** Page 27 (`43:151`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=122-988

---

## Interaction

- **Swipe** between pages 1–3（无 Continue / Next）
- **Back** ← 左上角（替代关闭 ✕）；返回 Profile Free
- **仅第 4 页**出现开通 CTA：`Start Premium`
- Dots 指示当前页；pages 1–3 footer 文案：`Swipe to explore`

---

## Narrative

主题：**AI 制定个人计划** → **展示计划细节** → 冥想/睡眠 → 精品课程 → 开通。

| Page | Theme | Title | CTA |
|------|-------|-------|-----|
| 1 | AI plan | AI builds your personal plan | —（滑动） |
| 2 | Plan details | Every detail of your plan | —（滑动）· 含 PlanPreview 周计划卡 |
| 3 | Recovery | Meditate & sleep into the plan | —（滑动） |
| 4 | Courses | Premium courses for lasting habits | **Start Premium** |

Page 4 footer note: `7-day free trial · cancel anytime`

### Page 1 · AI
- Eyebrow: `AI PLAN`
- Body: Share your goal once — AI designs training, nutrition, and recovery…
- Points: AI goal intake · Plan in minutes

### Page 2 · Details
- Eyebrow: `PLAN DETAILS`
- **PlanPreview** card: Week 1 · Fat loss · Mon–Sun strip · session rows（Run / Strength / Recovery）
- Badge: `AI draft`

---

## Shell

- 390×844 · bg `#F8F7F6`
- TopBar: Back ←（左）· `Premium`（居中）· Spacer
- Hero art card + eyebrow（Page 2 Hero 更矮，让出 PlanPreview）
- Title ~26–28 Bold · body 15
- Pages 1 / 3 / 4：benefit point cards；Page 2：PlanPreview
- Footer：Dots +（1–3）Swipe hint **或**（4）Start Premium + trial note

---

## Motion note（实现）

App 内可放动效：优先 **Lottie / Rive**；也可用短 **mp4 / animated WebP**；GIF 可用但体积与清晰度较差。Figma mid-fi 用静态 PlanPreview / Hero 占位，开发阶段替换为 Lottie。

---

## Related

- Profile Free Upgrade → this funnel  
- Profile edit pencil: `icon.edit` (`122:16`) on ProfileHero top-right  
- Docs: [profile-modal.md](./profile-modal.md)

## Artifacts

- `/opt/cursor/artifacts/premium-onboarding-p1.png`
- `/opt/cursor/artifacts/premium-onboarding-p2.png`
- `/opt/cursor/artifacts/premium-onboarding-p3.png`
- `/opt/cursor/artifacts/premium-onboarding-p4.png`
- `/opt/cursor/artifacts/premium-onboarding-set.png`
