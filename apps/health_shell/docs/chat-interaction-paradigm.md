# Plan Coach · 对话交互范式（Cursor 风格）

目标：快速回复 / 输入发送后，进入可持续多轮的计划对话，并以确认生成周计划卡片收尾。  
参考 Cursor 对话：用户气泡立刻出现 → 生成态 → 流式回复 → 可继续追问。

---

## 1. 角色与边界

| 角色 | 行为 |
|------|------|
| **User** | 一句话目标（目标 + 周期）；可点 chip 或键盘发送 |
| **Coach（✦）** | 精简、可执行；先确认约束，再给计划框架，确认后生成周卡 |
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
  ├─ Generating    白气泡 · `Plan Coach` 高光闪过 + 右侧旋转星星（对话尚未产生）
  ├─ Streaming     AI 气泡逐字出现（无星星、无高光）
  ├─ AwaitingUser  回复完成，可再发 / 点 follow-up chips
  │
  ▼  confirm（同意 / generate my plan）
PlanGenerating
  ├─ 白气泡 · `Plan Coach` 高光 + 旋转星星（计划正文尚未出现）
  └─ 思考文案逐行渐隐：fade in → hold → fade out → 下一行
       │
       ▼
PlanReady
  └─ 每周折叠卡（摘要）→ 点击后在卡片同宽范围内纵向展开详情
```

规则：

- **Generating / Streaming / PlanThinking 时**：禁止再发。
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
| 200–900 ms | **Generating**（白气泡 · Plan Coach + 旋转星星） |
| 900 ms+ | AI 气泡出现，**流式打字**（约 28–40 字/秒） |
| 结束 | 若剧本有追问 → 底部出现 follow-up chips |

---

## 4. 气泡与布局

- **User**：右对齐 · 蓝底 `#007AFF` · 白字 · 圆角 18  
- **AI**：左对齐 · 白底浅描边 · 深字 · 上方可带小 ✦  
- **Generating / PlanThinking（仅对话未产生时）**：白气泡内 `Plan Coach` 高光闪过 + 右侧旋转星星（每圈稍停）  
- **Streaming / 已出字**：静态蓝色 `Plan Coach`，无星星、无高光  
- **Plan thinking lines**：一行文案渐隐切换  
- **Week cards**：折叠摘要；详情在**同一卡片宽度**内纵向展开（不铺满全屏），圆角/描边连续过渡  

---

## 5. 示例剧本：15 天减重 3 公斤

### Turn 1 — User
`Lose 3 kg in 15 days`

### Turn 1 — AI
确认目标，追问训练天数 / 场地。

### Turn 2 — User
`3 days / week · Home only`

### Turn 2 — AI（框架）
给出 Week shape + daily non-negotiables，并请用户确认生成完整周卡。

**Follow-up：** `Yes, generate my plan` · `Looks good — generate it` · `Make it easier first`

### Confirm → PlanGenerating
白气泡 `Plan Coach` + 旋转星星，思考文案（例）：
1. Considering your weekly training days…  
2. Arranging the right training sessions…  
3. Balancing strength and cardio…  
4. Creating reward stickers…  
5. Locking your 15-day plan framework…  

### PlanReady
Week 1 / Week 2 / Week 3 折叠卡 → 点击后在原卡片宽度内展开详情（可再点收起）。

收尾对话（卡片下方）：  
> I’ve added your generated plan to the Today page. I’ll adjust it anytime based on your status. Let’s get started!

---

## 6. 与现有 Figma 帧的映射

| 范式步骤 | Figma |
|----------|--------|
| Meet intro | `133:728` |
| Keyboard | `136:695` |
| Chip → user bubble → Generating | `132:981` |
| AI 流式回复 / 追问 | 扩展实现（Cursor 交互） |
| Plan 卡同宽展开 | 扩展实现 |

---

## 7. 验收

1. 点「Lose 3 kg in 15 days」→ 立刻出用户气泡  
2. 白气泡 Plan Coach + 旋转星星 → AI 流式回复  
3. 约束 chip → 框架回复 + 确认 chips  
4. 点确认 → 思考文案渐隐 → 出现 Week 折叠卡  
5. 点 Week 卡 → 同宽纵向展开详情（再点收起）  
6. Generating / PlanThinking 期间点发送无效  
