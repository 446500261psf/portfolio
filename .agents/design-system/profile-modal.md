# Profile Modal · Avatar 全屏模态

**Trigger:** Tap **Avatar** in any L1 header  
**Screen:** `05 · Profile Modal` (`118:620`)  
**Flow preview:** `Flow · Avatar opens Profile Modal` (`118:701`) — Today dimmed + modal  
**Page:** Page 27 (`43:151`)  
**Deep link:** https://www.figma.com/design/1ibE2wPPDAauJKaj1ft6AC/Design-System?node-id=118-620

---

## Behavior

1. User taps Avatar (header right)  
2. Opens **fullscreen** modal (390 × ~844+, covers tab content; no BottomNav)  
3. Tap **Close ✕** (top-right) dismisses → back to previous L1  

---

## Anatomy

| Zone | Content |
|------|---------|
| StatusBar | 9:41 · signal |
| TopBar | Title `Profile` (left) · **Close** 36×36 circle + ✕ (**right**) |
| ProfileHero | Avatar 80 · name · email · goal chip |
| GoalProgress | −2.5 / −5.0 kg · 50% bar |
| Settings list | Units · Notifications · Privacy · Connected apps · Help |
| Sign out | Destructive text row |

**Style:** bg `#F8F7F6` · cards radius 24 · SF Compact Rounded · brand `#007AFF`  
**Avatar:** `Avatar` / `Face=B` (`104:796`)

---

## Close button

| Spec | Value |
|------|-------|
| Position | TopBar **trailing** (x≈338 in 390 frame) |
| Size | 36×36 · radius 18 |
| Fill | White · 1px `#E5E5E5` stroke |
| Glyph | ✕ · 16 Medium · `#111827` |

---

## Artifacts

- `/opt/cursor/artifacts/profile-modal.png`
- `/opt/cursor/artifacts/profile-modal-flow.png`
