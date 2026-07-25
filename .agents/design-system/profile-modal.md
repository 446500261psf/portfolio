# Profile Modal · Free / Premium

**Trigger:** Tap **Avatar** in L1 header  
**Component set:** `ProfileModal` (`121:866`) · `Membership=Free | Premium`  
**Page:** Page 27 (`43:151`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=121-866

---

## Variants

| Membership | Node | Notes |
|------------|------|-------|
| **Free** | `121:709` | Baseline profile + **Go Premium** upgrade card |
| **Premium** | `121:865` | + Premium time · Targets · My stickers |

Close ✕ always top-right. Fullscreen · no BottomNav.

---

## Shared

| Zone | Content |
|------|---------|
| TopBar | `Profile` + Close ✕ |
| ProfileHero | **Edit** (pencil `icon.edit` · top-right) · Avatar · Sifan Pan · email · goal chip |
| GoalProgress | −2.5 / −5.0 kg · 50% |
| Settings | Units · Notifications · Privacy · Connected apps · Help |
| Sign out | Red |

**Edit control:** 32×32 circle · top-right of avatar card · `icon.edit` Outline brand blue (`122:6`).

---

## Free only

**Go Premium** card — short benefit copy + **Upgrade** CTA → [`PremiumOnboarding`](./premium-onboarding.md) 4-page funnel.

---

## Premium only

### 1. Premium time
Gold-tint badge under hero:
- `★ Premium`
- `Active · expires in 200 days`
- `Renews Jan 10, 2027`

### 2. Targets
Daily targets with progress bars:
| Target | Sample |
|--------|--------|
| Steps | 8,521 / 10,000 |
| Water | 6 / 8 cups |
| Calories | 1,580 / 2,000 |
| Active min | 28 / 40 |

### 3. My stickers
Earned sticker wall (6): FirstStart · Hydration · Day3 · SleepTried · Insight · EarlyBird  
Instances from `Sticker` Kind set (`106:317`).

---

## Artifacts

- `/opt/cursor/artifacts/profile-modal-free.png`
- `/opt/cursor/artifacts/profile-modal-premium.png`
