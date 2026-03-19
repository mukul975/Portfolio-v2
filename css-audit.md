# CSS Audit: #research and #mcp-tools Sections

**Auditor:** css-auditor
**Date:** 2026-02-19
**File:** `style.css` (1641 lines)
**Scope:** All CSS classes used by the `#research` and `#mcp-tools` sections

---

## 1. `.design-card` max-width: 80% vs `.research-card` / `.mcp-card` override

**ISSUE FOUND -- PARTIAL**

- `.design-card` (line 858): `max-width: 80%`
- `.research-card` (line 145): `flex: 1 1 340px; max-width: 520px;` -- **overrides with a fixed max-width. OK.**
- `.mcp-card` (line 239): `flex: 1 1 280px; max-width: 360px;` -- **overrides with a fixed max-width. OK.**

Both `.research-card` and `.mcp-card` set an explicit `max-width` in pixels which takes precedence over the percentage-based `.design-card` value. Specificity is equal (single class each), but both new classes appear **after** `.design-card` in source order, so they win. **No bug here.**

However, there is a **mobile exception**: at `max-width: 600px` (line 1385), `.design-card` is set to `max-width: 100%`. Since `.research-card` and `.mcp-card` are not touched in this breakpoint, their `max-width: 520px` / `max-width: 360px` will still apply on small screens. This is likely fine since 360px < typical phone width, but on very narrow devices (320px viewport), the `max-width: 100%` from the global `*, *::before, *::after` rule (line 12) would clamp them anyway. **No action required.**

**Verdict: OK**

---

## 2. Double padding: `.research-cards-container` / `.mcp-cards-container` vs parent div

**ISSUE FOUND -- YES, for #research**

### #research section:
- `#research > div` (line 557): `padding: 100px 40px 80px 40px;`
- `.research-cards-container` (line 137): `padding: 0 40px 80px;`
- **Result:** The cards container adds an extra 40px horizontal padding on each side on top of the parent's 40px. Total effective padding from section edge = **80px on each side**. This is likely unintended double-padding. The bottom also doubles: parent gives 80px bottom, container gives 80px bottom = **160px total bottom space** from the last card to the section edge.

### #mcp-tools section:
- Parent wrapper div has **inline style** `padding: 100px 40px 80px;` (index.html line 288)
- `.mcp-cards-container` (line 231): `padding: 0 40px 80px;`
- **Same issue:** 40px + 40px = **80px horizontal** on each side, and 80px + 80px = **160px bottom**.

**Similarly, `.research-links-row`** (line 113) has `padding: 0 40px 40px;`, adding another 40px horizontal on top of the parent's 40px.

**Verdict: BUG -- double horizontal and bottom padding in both sections**

### Fix recommendations:
- Remove `padding` from `.research-cards-container`, `.mcp-cards-container`, and `.research-links-row`, OR
- Remove the horizontal padding from the parent `#research > div` and the MCP inline style wrapper, OR
- Change the child containers to `padding: 0 0 40px;` (remove horizontal, keep only vertical spacing)

---

## 3. `.mcp-explainer` padding conflict with parent

**ISSUE FOUND -- YES**

- Parent inline style (index.html line 288): `padding: 100px 40px 80px;`
- `.mcp-explainer` (line 200): `padding: 0 40px 50px;`
- **Result:** The explainer adds 40px horizontal padding on each side on top of the parent's 40px = **80px effective horizontal padding** for the explainer text.

This narrows the text content area more than intended. The `max-width: 780px` on `.mcp-explainer` partially mitigates this on wide screens (the element is already narrower than the parent), but on screens where the parent is less than ~860px wide (780px + 80px padding), the double padding will unnecessarily squeeze the text.

**Verdict: BUG -- double horizontal padding on medium-width screens**

### Fix recommendation:
- Remove horizontal padding from `.mcp-explainer`, change to `padding: 0 0 50px;`

---

## 4. Missing responsive/mobile breakpoint rules for new classes

**ISSUE FOUND -- YES, MULTIPLE GAPS**

### Classes with NO mobile breakpoints at all:
| Class | Issue |
|---|---|
| `.research-cards-container` | No responsive rules. `padding: 0 40px 80px` stays on mobile -- 40px side padding on a 375px screen is excessive |
| `.mcp-cards-container` | Same issue. `padding: 0 40px 80px` on mobile |
| `.mcp-explainer` | `padding: 0 40px 50px` on mobile -- too much horizontal padding |
| `.research-card` | `max-width: 520px` is fine on mobile but `flex: 1 1 340px` min-width may cause horizontal scroll on screens < 340px |
| `.mcp-card` | `flex: 1 1 280px` -- same concern on very narrow screens |
| `.research-links-row` | `padding: 0 40px 40px` -- too much side padding on mobile |
| `.mcp-badges` | No responsive rules, but `flex-wrap: wrap` handles it. OK. |
| `.research-card-header` | No responsive rules, but content is small. OK. |
| `.publisher-badge` | No responsive rules. OK at 12px font. |
| `.research-finding` | Uses `!important` on font-size (14px) -- cannot be overridden in breakpoints without another `!important` |
| `.mcp-card-meta` | Uses `!important` on margin-bottom -- same concern |

### Specific gaps:
1. **At 768px breakpoint**: `.design-card` gets `max-width: 100%` but `.research-card` (520px) and `.mcp-card` (360px) do not. Should add overrides.
2. **At 600px breakpoint**: `.design-card` gets `width: 100%; max-width: 100%;` but again no overrides for research/mcp cards.
3. **At 480px breakpoint**: No rules for any new research/mcp classes.
4. **At 900px breakpoint** (line 584): Only `#research > div`, `.cards-container`, `.image-container` are handled. The `.research-cards-container` padding is NOT adjusted.

### Fix recommendations:
Add to existing breakpoints:
```css
@media (max-width: 768px) {
  .research-cards-container,
  .mcp-cards-container {
    padding: 0 10px 40px;
  }
  .mcp-explainer {
    padding: 0 10px 30px;
  }
  .research-links-row {
    padding: 0 10px 20px;
  }
  .research-card,
  .mcp-card {
    max-width: 100%;
    flex-basis: 100%;
  }
}

@media (max-width: 480px) {
  .research-cards-container,
  .mcp-cards-container {
    padding: 0 5px 30px;
    gap: 16px;
  }
  .mcp-explainer {
    padding: 0 5px 20px;
  }
  .research-links-row {
    padding: 0 5px 15px;
    gap: 12px;
  }
}
```

---

## 5. `.section-inner-flex` -- missing CSS class

**ISSUE FOUND -- YES**

The class `section-inner-flex` is used in `index.html` line 243 as the direct child of `#research`:
```html
<div class="section-inner-flex">
```

But there is **no `.section-inner-flex` rule anywhere in `style.css`**. This div is currently only styled by the `#research > div` rule (line 557), which targets it by structure, not by class.

This works, but it means:
- The class name suggests a flex layout was intended but never defined
- If additional child divs are added to `#research`, the `#research > div` selector would match them too (unintended)

**Verdict: LOW PRIORITY -- works by coincidence via `#research > div` selector**

### Fix recommendation:
Either define the class:
```css
.section-inner-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 100px 40px 80px;
  min-height: 95vh;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}
```
Or remove the class from the HTML and keep relying on `#research > div`.

---

## 6. z-index, overflow, and positioning conflicts

### z-index:
- `#research` (line 552): `position: relative;` -- no z-index set. OK.
- `#mcp-tools`: No positioning in CSS, but inline style has `position: relative` on inner wrapper (line 288). No z-index. OK.
- `.heading-container` (line 829): `position: absolute; top: 20px; left: 50%;` -- **CONFLICT in #mcp-tools**: The `.heading-container` in `#mcp-tools` (line 284) is a direct child of the section, NOT inside the positioned wrapper div. Since `#mcp-tools` has no `position: relative`, the heading will be positioned relative to the nearest positioned ancestor, which could be the viewport or a parent with positioning. In `#research`, the heading IS inside `.section-inner-flex` which has `position: relative` via `#research > div`, so it works correctly there.

**Verdict: POTENTIAL BUG in #mcp-tools heading positioning**

### overflow:
- Global rule (line 12): `max-width: 100%` on all elements -- this could clip flexbox children that need to grow beyond their container's width. Research/MCP cards have `flex: 1 1 Xpx` which should be fine since `max-width` doesn't prevent flex-shrink.
- Global rule (line 16): `.container, section, div` get `max-width: 100%` -- this constrains ALL divs. The `.mcp-explainer` with `max-width: 780px` is fine (more restrictive). The card containers are fine (flex-wrap handles overflow).
- `body` (line 1401): `overflow-x: hidden` -- prevents horizontal scrollbar but could mask layout overflow bugs in the new sections.

**Verdict: No critical overflow issues, but `overflow-x: hidden` on body masks potential problems**

### Positioning:
- `.heading-container` uses `position: absolute` with `top: 20px` -- this removes it from document flow. In the research section, the parent has `padding-top: 100px` to compensate. In the MCP section, the inline style wrapper also has `padding-top: 100px`. This pattern works but is fragile -- any content height change in the heading will require manual padding adjustment.

**Verdict: FRAGILE PATTERN -- absolute positioning of headings requires manual padding sync**

---

## 7. Additional findings

### `!important` usage:
- `.research-finding` (line 187-189): Uses `!important` on `margin`, `font-size`, and `color`. This fights against the global `p` styling and makes these properties hard to override in media queries.
- `.mcp-card-meta` (line 248): Uses `!important` on `margin-bottom`.
- **Recommendation:** Remove `!important` and increase specificity instead (e.g., `.research-card .research-finding`).

### MCP section inline styles:
- The MCP section's inner wrapper (index.html line 288) uses extensive inline styles: `position: relative; padding: 100px 40px 80px; min-height: 95vh; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center;`
- These inline styles cannot be overridden by media queries in CSS without `!important`.
- **Recommendation:** Move these to a CSS class (e.g., `.mcp-section-inner`) so responsive breakpoints can modify them.

### #mcp-tools section has no CSS rules at all:
- Unlike `#research` which has dedicated rules (lines 548-600), `#mcp-tools` has zero CSS rules targeting it by ID.
- All its layout depends on inline styles and child class rules.
- **Recommendation:** Add `#mcp-tools` rules in CSS for responsive behavior.

---

## Summary of Issues by Severity

| Severity | Issue | Section |
|---|---|---|
| **HIGH** | Double horizontal padding (40px + 40px) on card containers | Both |
| **HIGH** | No mobile breakpoints for new container classes -- 40px padding on 375px screen | Both |
| **HIGH** | MCP inline styles block responsive CSS overrides | #mcp-tools |
| **MEDIUM** | `.mcp-explainer` double horizontal padding on medium screens | #mcp-tools |
| **MEDIUM** | `.heading-container` absolute positioning may misfire in #mcp-tools (no positioned parent) | #mcp-tools |
| **MEDIUM** | `!important` usage blocks clean responsive overrides | Both |
| **LOW** | `.section-inner-flex` class used in HTML but not defined in CSS | #research |
| **LOW** | Absolute heading positioning is fragile / requires manual padding sync | Both |
| **INFO** | `overflow-x: hidden` on body may mask horizontal overflow from new sections | Global |
