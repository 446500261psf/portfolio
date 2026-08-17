# User Flows — Sports & Health App

**FigJam board:** [User Flows · Today Health Exercise Devices](https://www.figma.com/board/L8dn3zBruD2EermIve4CXU)

Brand-agnostic flows for a mobile app with bottom tabs: **Today · Health · Exercise · Devices**.

---

## 1. App Shell · Tab Navigation

**Diagram:** `1. App Shell · Tab Navigation`  
**Anchor node:** `6:178` (Open App)

| Step | Screen / action |
|------|-----------------|
| Open App | User launches the app |
| App Shell | Persistent shell with bottom tab bar |
| Today / Health / Exercise / Devices | Any tab reachable via tab switch |

**Primary path:** Open App → App Shell → (any tab) ↔ tab switch

**Screenshot:** `/opt/cursor/artifacts/flows-1-app-shell.png`

---

## 2. Today · Daily Loop

**Diagram:** `2. Today · Daily Loop`  
**Anchor node:** `4:105` (Open App)

| Step | Screen / action |
|------|-----------------|
| Today Screen | Default landing after launch |
| Daily Content | Summary cards, goals, insights |
| Cards and Insights | Scrollable feed |
| CTA tap | User taps a call-to-action |
| Health Tab / Exercise Tab | Deep-link into sibling tabs |
| Back | Returns to Today |
| next day | Loop restarts on next open |

**Primary paths:**
- Open App → Today → Content → CTA → **Health** → Back → Today
- Open App → Today → Content → CTA → **Exercise** → Back → Today

**Screenshot:** `/opt/cursor/artifacts/flows-2-today.png`

---

## 3. Health · Metrics Hub

**Diagram:** `3. Health · Metrics Hub`  
**Anchor node:** `2:41` (Health Tab)

| Step | Screen / action |
|------|-----------------|
| Health Tab | Entry from bottom nav |
| Metrics Hub | Grid of health metrics |
| Metric Cards | Sleep, heart rate, steps, etc. |
| Tap metric | User selects one metric |
| Metric Detail | Charts, history, trends |
| Back | Returns to hub |
| Tab switch | Leaves Health tab |

**Primary path:** Health Tab → Metrics Hub → Metric Detail → Back → Metrics Hub

**Screenshot:** `/opt/cursor/artifacts/flows-3-health.png`

---

## 4. Exercise · Session Flow

**Diagram:** `4. Exercise · Session Flow`  
**Anchor node:** `1:3` (Exercise Tab)

| Step | Screen / action |
|------|-----------------|
| Exercise Tab | Entry from bottom nav |
| Pick Sport | Choose activity type |
| START Session | Begin workout |
| Active Session | Live tracking UI |
| Session Summary | Stats, duration, calories |
| Done? | User chooses next step |
| Today Tab | Return to daily overview |
| Again | Start another session |

**Primary paths:**
- Exercise → Pick Sport → START → Active → Summary → **Today**
- Exercise → Pick Sport → START → Active → Summary → **Again** → Exercise

**Screenshot:** `/opt/cursor/artifacts/flows-4-exercise.png`

---

## 5. Devices · Connect and Manage

**Diagram:** `5. Devices · Connect and Manage`  
**Anchor node:** `3:69` (Devices Tab)

| Step | Screen / action |
|------|-----------------|
| Devices Tab | Entry from bottom nav |
| Device List | Paired and available devices |
| Action | Connect new or manage existing |
| Connect Device | Pairing flow |
| Manage Device | Settings, unpair, firmware |
| Permissions Tip | OS permission prompt / guidance |
| OK | Dismiss and return to list |

**Primary paths:**
- Devices → List → **Connect** → Permissions Tip → OK → List
- Devices → List → **Manage** → Permissions Tip → OK → List

**Screenshot:** `/opt/cursor/artifacts/flows-5-devices.png`

---

## 6. Cold Start · First Run

**Diagram:** `6. Cold Start · First Run`  
**Anchor node:** `5:146` (First Launch)

| Step | Screen / action |
|------|-----------------|
| First Launch | Fresh install, no account required for lite path |
| Splash | Brief brand / loading |
| Onboarding Lite | 2–3 screens max |
| Set Goals | Activity / health targets |
| Preferences | Units, notifications |
| Land on Today | Default tab after onboarding |
| Daily Loop | Enters recurring Today flow |

**Primary path:** First Launch → Splash → Onboarding Lite → Set Goals → Preferences → **Today** → Daily Loop

**Screenshot:** `/opt/cursor/artifacts/flows-6-cold-start.png`

---

## Cross-flow summary

```
Cold Start ──► Today (default tab)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     Health     Exercise     Devices
        │           │           │
        └───── CTA / tab ───────┘
```

**Full board overview:** `/opt/cursor/artifacts/flows-overview.png`

---

## Tab map

| Tab | Role | Key exit |
|-----|------|----------|
| **Today** | Daily hub, CTAs | Health, Exercise |
| **Health** | Metrics hub + detail | Back to hub |
| **Exercise** | Sport pick → session → summary | Today or repeat |
| **Devices** | List, connect, manage | Permissions tip |
