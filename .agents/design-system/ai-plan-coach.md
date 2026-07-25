# AiPlanCoach · AI 生成式计划对话

**Role:** Plan Coach — precise, concise plan maker（精准、干练的计划制定师）  
**Icon:** `✦`（参考 [119:962](https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=119-962) 页面星星）  
**Component set:** `AiPlanCoach` (`124:861`) · `Step=Meet|Goal|Capacity|Brief|Chat`  
**Page:** Page 27  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=124-861

---

## Flow

引导简报完成前，**不上自由对话框**。顺序：

| Step | Screen | Purpose |
|------|--------|---------|
| 1 | **Meet** | 角色亮相 · ✦ 大星星 · CTA `Start briefing` |
| 2 | **Goal** | 引导问答 · 主目标 chips |
| 3 | **Capacity** | 引导问答 · 每周训练天数 |
| 4 | **Brief** | 锁定 horizon + Brief 卡 · CTA `Open chat` |
| 5 | **Chat** | 生成式对话 · 输入框 + 快捷建议 |

---

## Persona copy (English UI)

- Voice: short, direct, no fluff  
- Meet: *Precise. Concise. Your plan, built fast.*  
- Chat opening: locks brief, asks hard constraints, drafts Week 1  

---

## Shell

- 390×844 · bg `#F8F7F6` · SF Compact Rounded  
- TopBar: Back ← · ✦ Plan Coach  
- Meet: centered star gradient + Start briefing  
- Guide steps: AI bubble (✦ avatar) + choice chips · progress 3 bars  
- Chat: thread + suggestion chips + composer (`Message Plan Coach…` + send)

---

## Entry

Suggested: Premium Onboarding / Today plan CTA → **Meet** → briefing → **Chat**

## Artifacts

- `/opt/cursor/artifacts/ai-plan-coach-meet.png`
- `/opt/cursor/artifacts/ai-plan-coach-goal.png`
- `/opt/cursor/artifacts/ai-plan-coach-capacity.png`
- `/opt/cursor/artifacts/ai-plan-coach-brief.png`
- `/opt/cursor/artifacts/ai-plan-coach-chat.png`
