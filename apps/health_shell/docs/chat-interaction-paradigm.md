# Plan Coach · 对话交互范式（Cursor 风格）

目标：快速回复 / 输入发送后，进入可持续多轮的计划对话。  
参考 Cursor 对话：用户气泡立刻出现 → 生成态 → 流式回复 → 可继续追问。

---

## 1. 角色与边界

| 角色 | 行为 |
|------|------|
| **User** | 一句话目标（目标 + 周期）；可点 chip 或键盘发送 |
| **Coach（✦）** | 精简、可执行；先确认约束，再给计划框架 |
| **系统** | 管状态机、动效、是否允许发送 |

不做：真后端 / 真模型。本阶段用 **脚本化剧本** 模拟。

---

## 2. 状态机

```
Meet
  ├─ Intro（问候动效）
  ├─ Idle（chips + 输入框）
  └─ KeyboardFocus（点输入）
       │
       ▼  send(chip | text)
Chat
  ├─ UserPending   用户气泡已上屏，输入框清空
  ├─ Generating    ✦ + Generating…（可闪光线）
  ├─ Streaming     AI 气泡逐字出现（Cursor 流式感）
  ├─ AwaitingUser  回复完成，可再发 / 点 follow-up chips
  └─ PlanReady     给出计划卡 + ☺/☹ 反馈（后续）
```

规则：

- **Generating / Streaming 时**：禁止再发（发送按钮置灰或忽略），避免叠楼。
- **AwaitingUser**：允许发送；follow-up chips 等同发送。
- **发送瞬间**：用户气泡 optimistic 上屏，不需等 AI。

---

## 3. 一回合的时间轴（Cursor 味）

| t | 动作 |
|---|------|
| 0 ms | 用户点 chip / 按发送 |
| 0–80 ms | chip 轻 scale；Meet 问候区收起 |
| 80–200 ms | **用户蓝气泡**右上滑入 |
| 200 ms | chips 隐藏（或换成 follow-up）；composer 留底 |
| 200–900 ms | **Generating**（✦ + LightSweep） |
| 900 ms+ | AI 气泡出现，**流式打字**（约 28–40 字/秒） |
| 结束 | 若剧本有追问 → 底部出现 follow-up chips |

---

## 4. 气泡与布局（对齐 Figma + Cursor）

- **User**：右对齐 · 蓝底 `#007AFF` · 白字 · 圆角 18  
- **AI**：左对齐 · 白底浅描边 · 深字 · 上方可带小 ✦  
- **Generating**：居中 ✦ + `Generating…`（非气泡）  

- 消息区可滚；新消息自动滚到底  
- Composer 始终在底（键盘打开时上移，逻辑沿用 136:695）

---

## 5. 示例剧本：15 天减重 3 公斤

### Turn 1 — User
`Lose 3 kg in 15 days`  
（或中文：`15天减重3公斤`）

### Turn 1 — AI（流式）
> Got it — **lose 3 kg in 15 days**.  
> That’s aggressive (~0.2 kg/day). I can draft a tight plan, but I need two constraints first:  
> 1) How many days/week can you train?  
> 2) Gym or home only?

**Follow-up chips：**  
`3 days / week` · `Home only` · `Gym OK` · `Knees sensitive`

### Turn 2 — User（点 chip）
`3 days / week` + 自动附带语境，或用户连点 `Home only`

为演示简洁：点 `3 days / week · Home only` 合成一条：  
`3 days/week · home only`

### Turn 2 — AI（流式 + 短计划）
> Locked: **3 days/week · home · −3 kg / 15 days**.  
>  
> **Week structure**  
> • Day A — Full-body strength 35–40 min  
> • Day B — Zone-2 cardio 30 min + core  
> • Day C — Strength + finishers 40 min  
>  
> **Daily non-negotiables**  
> • Protein ~1.6 g/kg · 500 kcal deficit  
> • 7k–9k steps · sleep 7h+  
>  
> Want me to expand Day A into a set-by-set workout?

**Follow-up：** `Expand Day A` · `Make it easier` · `☺ looks good`

---

## 6. 与现有 Figma 帧的映射

| 范式步骤 | Figma |
|----------|--------|
| Meet intro | `133:728` |
| Keyboard | `136:695` |
| Chip → user bubble → Generating | `132:981` |
| AI 流式回复 / 追问 | 扩展实现（Cursor 交互） |
| Plan 卡 | 后续 `Step=Plan` |

---

## 7. 验收

1. 点「Lose 3 kg in 15 days」→ 立刻出用户气泡  
2. 出现 Generating（≥400ms）  
3. AI 逐字回复，可滚动  
4. 出现 follow-up chips，可再点进入 Turn 2  
5. Generating 期间点发送无效  
