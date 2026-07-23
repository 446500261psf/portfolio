# Components · UX → 组件库

> Source of truth for **which UI components** HeartLine / HUAWEI Health needs.  
> Derived from Figma `25 · IA · UX Map` (Progress Architect v3 · Plan Shared Context · AI+ flow) + existing pages `05–13`.  
> Visual DNA still follows `principles.md` / `color.md` / `typography.md`. **Do not invent chrome from random icon samples.**

Figma file: `Pqwb3XVRiAyle9WOao5G5L`

---

## 1. Product features extracted (运动健康)

| Domain | Feature | User value |
|--------|---------|------------|
| **Plan** | Goal · Baseline · Phase · Progress · Rewards · Adjustment | Shared context that drives Home / Exercise / Health |
| **Home** | Journey progress + rewards · For you today · Yesterday · See more | Encourage + rewards — **no task language** |
| **Health** | Metrics hub · Insights · Drill from Yesterday · Safety first | Explain trends & “why this matters” |
| **Exercise** | SportPicker · START free move · Invite entry · Session summary | Deliver movement; free activity counts |
| **AI+** | Badge · Locked benefit · Benefits hub · Trial / subscribe | Membership conversion & AI value moments |
| **Shell** | Header · BottomNav · Avatar/Me | App chrome |

**IA tabs (Progress Architect v3):** Home · Health · Exercise · Plan  

**Language:** USE Progress / For you today / Reward / Yesterday / See more. CTA: Sounds good / Let’s go. AVOID Task / To-do / Incomplete / Due / Missed / Complete task.

---

## 2. Existing component library (`05–13`)

| Page | Component | Variants |
|------|-----------|----------|
| `05 · Button` | Button | Primary/Secondary/Tertiary × Large/Medium × Default/Disabled |
| `06 · Badge` | Badge · Badge/AI+ · MembershipChip | VIP/New/Trial · AI+ sizes · Member/NonMember |
| `07 · Card` | Card | Hero / Horizontal / Grid-Large / Grid-Small / List-Item |
| `08 · BenefitCard` | BenefitCard | Default / Pressed / AI / Locked / Skeleton |
| `09 · Header` | Header (+ Avatar leading loose) | TabBar / BrandTitle / ModuleTitle |
| `10 · BottomNav` | BottomNav | **Legacy:** Today / Exercise / Health / Devices |
| `11 · Section` | Section | Stack / HorizontalScroll / Grid-1+2 + SeeAll |
| `12 · SportPicker` | SportPicker | Run / Walk / Cycle / Workouts / Plan |
| `13 · VIPSegment` | VIPSegment | Wellness / Membership |

Foundations already present: Primitives · Color (Light/Dark) · Spacing · Typography Primitives + text/effect styles.

---

## 3. UX step → components map

### A. Shell / every tab

| Step | Need | Component |
|------|------|-----------|
| App chrome top | Title / brand / Me | **Header**, **Avatar** |
| App chrome bottom | 4-tab PA nav | **BottomNav / Progress Architect** |
| Section framing | Title + See all | **Section** |

### B. Home

| Step | Need | Component |
|------|------|-----------|
| 1 Journey progress + rewards | Ring/bar + phase + reward cue | **JourneyProgress**, **Reward**, Badge |
| 2 For you today (invite) | Soft invite + dual CTA | **Card** (Hero/Horizontal) + **Button** Primary/Secondary |
| 2b No plan / cold start | Empty + start setup | **EmptyState** + Button |
| 2c Adjustment suggestion | Keep / Adjust | Card + Button ×2 |
| 3 Yesterday data | Compact metrics | **MetricTile** ×N + Section |
| 4 See more | Browse rows | **ListRow** / Card List-Item + Section |

### C. Plan setup (chat)

| Step | Need | Component |
|------|------|-----------|
| Chat mid | Bubbles | **ChatBubble** (User / Assistant / System) |
| Composer | Input + send | **ChatComposer** / **TextField** + Icon button |
| Draft confirm | Summary + CTA | Card + Button |

### D. Health

| Step | Need | Component |
|------|------|-----------|
| Metrics hub | Grid of vitals | **MetricTile** + Section Grid |
| Insights | Narrative card | Card / BenefitCard AI |
| Metric detail | Large data + trend | MetricTile Large + sparkline slot |
| Safety first | Dismissible note | **Notice** (Info / Warning / Safety) |
| Why this matters | Body copy block | Section + Card |

### E. Exercise

| Step | Need | Component |
|------|------|-----------|
| Sport switch | Run/Walk/… | **SportPicker** |
| Outdoor / Indoor | Sub filter | **Chip** (segment / filter) |
| Quick START | Primary action | **StartCTA** |
| Invite entry | From Home | Card + Button |
| Recent / Favorites | Rows | ListRow / Card |
| Session summary | Stats strip | MetricTile compact ×N + Button |

### F. Plan tab

| Step | Need | Component |
|------|------|-----------|
| Active journey | Progress + goal | JourneyProgress + Card |
| Phases | Phase chips | Chip / VIPSegment-like |
| Rewards | Milestone | **Reward** |
| Weekly reflection | Prompt card | Card + TextField / Button |
| Browse / switch | Plan list | ListRow + Card |

### G. AI+ conversion

| Step | Need | Component |
|------|------|-----------|
| Entry badge | Header / card mark | Badge/AI+ · MembershipChip |
| Locked preview | Curiosity | BenefitCard Locked + Badge Trial |
| Benefits hub | Grid | BenefitCard · Card Hero · Section |
| Subscribe CTA | Primary | Button Primary |
| Success | Celebrate | EmptyState Success / motion splash |

---

## 4. Gap list → v1 build order

| # | Component | Page name | Status | Why |
|---|-----------|-----------|--------|-----|
| 1 | BottomNav / Progress Architect | `14 · BottomNav PA` | **Built** | IA tabs Home/Health/Exercise/Plan |
| 2 | Avatar | `15 · Avatar` | **Built** | Header Me entry |
| 3 | MetricTile | `16 · MetricTile` | **Built** | Home Yesterday + Health hub |
| 4 | JourneyProgress | `17 · JourneyProgress` | **Built** | Home §1 + Plan core |
| 5 | ListRow | `18 · ListRow` | **Built** | See more / browse |
| 6 | Chip | `19 · Chip` | **Built** | Outdoor/Indoor · filters · phases |
| 7 | Notice | `20 · Notice` | **Built** | Health Safety first |
| 8 | ChatBubble | `21 · Chat` | **Built** | Plan setup |
| 9 | ChatComposer | `21 · Chat` | **Built** | Plan setup |
| 10 | TextField | `22 · TextField` | **Built** | Forms / reflection |
| 11 | EmptyState | `23 · EmptyState` | **Built** | No plan / empty lists |
| 12 | StartCTA | `24 · StartCTA` | **Built** | Exercise START |
| 13 | Reward | `25 · Reward` | **Built** | Journey rewards / milestones |

**Out of v1 (document only):** Sheet, Toast, DeviceCard (compose ListRow), full Chart (MetricTile hosts sparkline slot), Paywall package picker (compose BenefitCard + Button).

**Legacy keep:** BottomNav Today/Devices set remains on `10 · BottomNav` for archive screens — do not delete.

---

## 5. Shell rules (product UI)

From Cover / Mid-fi:

1. Product chrome = **黑白灰**; color only on Icon / progress / reward / sport accents / AI+ violet  
2. Primary CTA may use `color/brand/primary`  
3. Soft geometry · local depth only (brand DNA)  
4. Bind fills/radii/spacing to variables where possible  

---

## 6. Naming

- Components: `PascalCase` — `MetricTile`, `JourneyProgress`  
- Variants: `Property=Value` — `Size=MD, State=Default`  
- Pages: `NN · ComponentName` under `──── Components ────`  
- Icons remain under Icons section; do not conflate Soft Layer glyphs with UI chrome  

---

## Version

- **1.1.0** — Figma pages `14–25` built from UX map; Cover index updated
- **1.0.0** — Initial UX→component map from IA · Progress Architect v3 + gap backlog
