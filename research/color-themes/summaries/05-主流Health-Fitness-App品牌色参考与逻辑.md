# 主流 Health / Fitness App 品牌色彩：参考来源与定义逻辑

**问题：** Apple Health、Withings、Google Health/Fitbit 等品牌做色彩研究时引用了什么？为什么这样定色？  
**结论先行：** 这些公司**几乎不公开引用学术色彩心理学论文**作为品牌色决策依据。公开可追溯的参考主要是：平台设计系统、品牌战略差异化、医学/公卫指标定义、语义编码惯例、可访问性，以及（少数）艺术运动/用户研究。

---

## 1. 他们真正「参考」的是什么（证据层级）

| 参考类型 | 是否公开 | 典型用法 | 例子 |
|----------|----------|----------|------|
| 平台设计系统（HIG / Material） | 高 | 色角色、对比度、组件映射 | Apple Activity Rings；Fitbit → Material 3 / Flex |
| 品牌战略 / 品类差异化 | 高 | 选「像谁 / 不像谁」 | Oura 反 neon 运动风；Strava 单橙识别 |
| 医学/公卫指标（管指标，不管色） | 高 | 定义「什么算健康活动」 | Google Heart Points ← AHA 150 分钟建议 |
| 语义编码惯例 | 中–高 | 心=红、睡=紫、营养=绿 | Apple Health 分类色；多数 vitals UI |
| 艺术 / 文化意象 | 中（Fitbit 明确说过） | 气质方向，不是色卡处方 | Light and Space / James Turrell |
| 用户研究 / 心理学家协作 | 中 | 语气、告知坏消息、信任 | Withings + 心理学家原则；Fitbit compassion |
| 学术色彩心理论文 | **极低公开度** | 内部可能参考，但品牌案几乎不披露 | 未见 Apple/Google 白皮书点名 Hill & Barton 等 |

> 因此：不能把「红=支配」那类运动心理学论文，直接当成这些 App 品牌色的官方依据；更贴切的是**产品语义 + 平台规范 + 品牌定位**。

---

## 2. Apple Health / Fitness

### 公开参考
1. **Apple Human Interface Guidelines — Activity rings / HealthKit / Color**  
   - 官方强制：三环颜色与含义不可改；必须黑底；不可用于品牌/营销。  
   - 标签色需匹配环色（官方给出 RGB 表）。  
2. **系统色（systemRed / Green / Blue…）** — 跨 App 一致性与深浅色模式。  
3. **语义数据可视化实践**（第三方设计剖析也一致）：色是「分类编码」，不是装饰。

### 为什么这样定义
| 色 | 典型用途 | 定义逻辑（可推断 + 官方约束） |
|----|----------|-------------------------------|
| Move 红 ≈ `#FA114F` | 活动消耗 / Move 环 | 最内环、最醒目；红系与「心/能量/移动」文化联想一致；**品牌资产级锁定** |
| Exercise 绿 ≈ `#92E82A` | 锻炼环 | 与红强对比，完成感/积极；绿在健康语境偏「达标」 |
| Stand 青 ≈ `#1EEAEF` | 站立环 | 第三语义轴；青与「清醒/站起」差异化 |
| Health 分类色 | Heart 红、Sleep 紫、Nutrition 绿等 | **语义记忆**：扫一眼知品类；图表内几乎单色 + 灰对比 |

### 关键原则（比「色心理」更重要）
- **一致性 > 创意**：第三方 App 嵌入三环也不能改色（HIG）。  
- **色 = 数据通道**：类别色固定；对比期用灰；选中用同色变体。  
- **黑底发光**：手表/健身场景高对比，环像「能量仪表」，不是医疗诊所白墙。

**未公开的：** Apple 未发表「我们因某篇色彩论文选了这三色」；色值是品牌与系统规范产物。

---

## 3. Google Fit → Fitbit / Google Health 生态

### 公开参考（官方说过）
1. **Material Design / Material You /「form follows feeling」**  
   - Fitbit 并入 Google 时，Material You 尚未完全公开，但团队已知方向：个性化、情感化。  
2. **设计系统 Flex**（Google 健康生态整合用）。  
3. **艺术运动：Light and Space（1960s 加州）**；谈及 James Turrell 式光感装置。  
   - 来源：Google Design《The Goal Behind the Goal》。  
4. **美国心脏协会（AHA）活动建议** → 定义 **Heart Points** 指标（医学参考），不是品牌色卡。  
5. **健康素养 / 同情心（compassion）用户研究**：语气随「健身激励 vs 心律异常」光谱变化。  
6. **Material 3 Expressive**（Fitbit 新版）：Fitness 页 teal、Sleep 页 purple；圆润形、柔和色，刻意避开「硬线霓虹男性化运动风」。

### 为什么这样定义
| 决策 | 逻辑 |
|------|------|
| 从早期 Fit 四色 Google 心形 → 更白、更柔 | 普适、少吓人；Material 白底易读 |
| Heart Points 与「心」隐喻 | 指标跟 AHA；视觉用心形/暖强调「心肺健康」而非只计步 |
| 圆角 + 柔色 + 光感 | 手表圆形硬件；反 neon 竞技风；信任与 uplift |
| Fitness=teal / Sleep=purple | **场景分区语义**：青绿活动、紫睡眠（行业惯例） |
| 保留亲和但现代化 | 老用户认 Fitbit「彩色亲切」；新系统要未来感，故柔化而非砍亲和 |

**要点：** Google 公开谈的是**艺术气质 + Material 体系 + 医学指标定义**；不是「我们引用了某本色彩心理学教材选 teal」。

---

## 4. Withings（Health Mate）

### 公开参考
1. **品牌属性研究：** health / innovation / elegance / precision / reliability / reassuring（视觉识别重塑时的目标词）。  
2. **内部设计系统 Remedy**（组件与可视化统一）。  
3. **与心理学家协作的告知原则**（2020，Myriam Paperman）：界面如何传达房颤、睡眠呼吸暂停等「坏消息」——视觉与文案联动，降低恐慌。  
4. **品类惯例：** 医疗设备感 → 冷静蓝系；绿作健康/药/达标点缀。  
5. 公开 UI 色板常见抽取：主强调蓝约 `#3048CE`，浅底 `#DFE4F4`，深墨 `#040611`。

### 为什么这样定义
| 决策 | 逻辑 |
|------|------|
| 主色偏蓝 | 信任、精确、医疗设备；与「家用医疗」定位一致 |
| 浅冷灰蓝底 | 洁净、专业，但比纯医院白更柔 |
| 绿点缀 | 健康正向、药物/达标符号（图标库也有 Green Pill） |
| 克制高饱和红作主品牌 | 红留给告警/生命体征；避免日常 App 像急救 |

**要点：** Withings 更接近「医疗信任色 + 告知伦理」，而不是「运动唤醒色」。

---

## 5. 其他主流 Fitness App（对照）

### Strava — `#FC4C02` 单橙
- **参考逻辑：** 品牌识别最大化；地图折线、CTA、Kudos、PR 全部同一橙。  
- **为什么：** 社交竞技、汗水、行动；中性灰底让路线成为主角。  
- **故意不做：** 多品牌色、Dynamic Color（保持固定橙）。  
- **与学术关系：** 橙=能量/行动是品类常识；未见官方点名论文。

### Nike Run Club / Training
- **参考逻辑：** 高对比、霓虹进度（如 Volt 系）服务「运动中一眼可读」。  
- **为什么：** 训练场景、户外光线、快速扫视；品牌运动精神 > 诊所信任。

### Peloton
- **参考逻辑：** 影院黑底 + 品牌红强调直播/主 CTA。  
- **为什么：** 居家课程像「舞台」；红=进行中/能量，黑=沉浸。

### MyFitnessPal
- **参考逻辑：** **语义状态色**（热量环：绿/蓝/琥珀/红）+ **固定宏量营养素色**（碳/脂/蛋白）。  
- **为什么：** 饮食 App 要「超额立刻懂」；色是反馈系统，不是品牌花活。

### Oura
- **参考逻辑：** 反 fitness-tech 陈词滥调；暖砂岩底 + 极少彩；Instrument 合作引入 **统一语义色语言** + 分层数据可视化。  
- **为什么：** 奢侈 wellness、睡眠/恢复优先；不像腕上仪表盘。

### WHOOP / Garmin
- **参考逻辑：** 表现/训练负荷导向；色服务恢复分、压力、负荷分区，功能色密度高。  
- **为什么：** 严肃训练用户要读复杂指标；品牌感次于可读编码。

---

## 6. 横向对照：他们在「定义颜色」时的决策树

```
1. 产品站在光谱哪里？
   医疗信任 ← Withings / Apple Health 病历侧
   综合 wellness ← Fitbit / Oura
   社交竞技 ← Strava / Nike / Peloton

2. 色的主职是什么？
   品牌识别（Strava 橙）
   品类语义（心红/睡紫）
   状态反馈（热量超标变红）
   平台资产锁定（Apple 三环）

3. 公开依据优先级（实测）
   平台规范 > 品牌差异化 > 医学指标定义 > 用户研究语气
   ≫ 学术色彩论文（几乎不披露）
```

---

## 7. 对你做品牌色研究的实用启示

1. **不要指望从 Apple/Google 找到「我们引用了哪篇色彩论文」的白皮书**——他们公开讲的是 HIG/Material、品牌气质、医学指标与用户研究。  
2. **先定产品角色再定色：**  
   - 家用医疗 / 体征 → 蓝绿白、克制红  
   - 日常 wellness → 柔和分区色（teal/purple）  
   - 竞技社交 → 单点高能强调色（橙/红/霓虹）  
3. **语义色表比品牌主色更重要：** 同类数据永远同色，用户才建立肌肉记忆。  
4. **医学合作影响的是指标定义**（如 AHA→Heart Points），色只是把指标「说成人话」的皮肤。  
5. 若你要补「学术依据」，应自己桥接：用上一批健康/运动色彩文献支撑**方向**，但标注这是**外部证据**，不是品牌官方参考文献。

---

## 8. 主要公开源链接

| 品牌 | 源 |
|------|-----|
| Apple | https://developer.apple.com/design/human-interface-guidelines/activity-rings |
| Apple HealthKit HIG | https://developer.apple.com/design/human-interface-guidelines/healthkit |
| Google Fitbit UX | https://design.google/library/the-goal-behind-the-goal |
| Google Heart Points / AHA | https://support.google.com/fit/answer/7619539 |
| Fitbit M3E 报道 | https://9to5google.com/2025/11/09/fitbit-material-3-expressive/ |
| Withings UX / Remedy | https://medium.com/@Lucas_Guarneri/human-kpis-other-stories-of-how-we-created-a-ux-research-culture-at-withings-9b271fe584e4 |
| Oura × Instrument | https://www.instrument.com/work/oura-app |
| Strava 设计拆解 | https://blakecrosley.com/guides/design/strava |
