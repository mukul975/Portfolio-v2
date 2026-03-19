# Mobile & Responsive Design Audit Report

**Project:** Portfolio-v2
**Date:** 2026-02-19
**Files Audited:** `index.html`, `style.css`, `script.js`

---

## Summary

15 responsive design issues identified across the portfolio site. Issues range from layout overflow on mid-size tablets to touch target accessibility violations and iOS Safari compatibility concerns. The site has breakpoints at 1200px, 992px, 900px (research-only), 768px, 600px, and 480px but has significant gaps in coverage, especially in the 601px-767px and 769px-991px ranges.

---

## Issue 1: `#greetingText` Fixed Width Overflow (601px-767px)

**Selector:** `#greetingText`
**File:** `style.css`, lines 34-43 and 1224-1233
**Breakpoint Affected:** 601px to 767px
**Severity:** HIGH

**Problem:** `#greetingText` has `width: 420px` in its base style. The 600px breakpoint resets it to `width: 100%`, but between 601px and 767px there is no override. On a 650px-wide screen, a 420px fixed-width element inside a flex column layout (set at 992px) will not overflow the viewport, but combined with `white-space: nowrap` and the CyberAlert custom font, the greeting text will extend beyond its parent container on screens where the parent is constrained.

Additionally, the `#greetingText` selector is declared twice (lines 34-43 and lines 1224-1233) with identical properties, causing redundancy.

**Fix:**
- Add a media query at 768px (or adjust the 600px breakpoint to 768px) to set `#greetingText { width: 100%; max-width: 100%; white-space: normal; }`.
- Remove the duplicate `#greetingText` declaration at lines 1224-1233.

---

## Issue 2: `#content-body` Excessive Left Padding on Mid-Size Tablets

**Selector:** `#content-body`
**File:** `style.css`, line 362
**Breakpoint Affected:** 769px to 991px
**Severity:** HIGH

**Problem:** `#content-body` has `padding: 100px 0 0 100px`. The 992px breakpoint changes this to `padding: 80px 20px`, and the 768px breakpoint changes it to `padding: 50px 20px`. However, between 769px and 991px, the `flex-direction` is already `column` (set at 992px) but the padding override also happens at 992px, so the content is stacked vertically with only 20px padding -- this is actually fine at 992px.

The real gap is: at exactly 993px to the default desktop layout, 100px left padding consumes a significant portion of a ~1000px screen, leaving only ~900px for content. With the two-column flex layout still active, the body-part-1 and body-part-2 each get roughly 450px, which is very tight.

**Fix:**
- Add an intermediate breakpoint or adjust the 992px breakpoint upward to ~1100px to catch tablets in landscape mode, reducing the left padding earlier:
```css
@media (max-width: 1100px) {
  #content-body {
    padding: 80px 0 0 40px;
  }
}
```

---

## Issue 3: `.email-form` Fixed Height + Percentage Padding Causes Overflow

**Selector:** `.email-form`
**File:** `style.css`, lines 690-704
**Breakpoint Affected:** Below 768px
**Severity:** HIGH

**Problem:** The base `.email-form` has `height: 300px` and `padding: 60px 25% 40px 20px`. The form contains an h2, two labels, two inputs, a textarea, and a submit button. At 300px height with 60px top padding and 40px bottom padding, only 200px remains for all form content. The 25% right padding further squeezes horizontal space. On smaller screens:
- At 992px breakpoint: `padding: 30px 10%` and `width: 100%` -- but `height: 300px` is never overridden.
- At 768px breakpoint: `padding: 20px 10%` -- but `height: 300px` is still never overridden.

The fixed 300px height combined with all the form elements will cause content to clip or overflow, especially when the textarea is included.

**Fix:**
- Change `height: 300px` to `min-height: 300px` or `height: auto` in the base style.
- Add `height: auto` in the 768px and 992px breakpoints.
```css
.email-form {
  min-height: 300px;
  height: auto;
}
```

---

## Issue 4: `#footer` 100vh Height Clips Content on Mobile Landscape

**Selector:** `#footer`
**File:** `style.css`, line 670
**Breakpoint Affected:** Mobile landscape (height < 500px), and generally any short viewport
**Severity:** MEDIUM

**Problem:** `#footer` has `height: 100vh`. On mobile landscape orientation (e.g., 667px wide x 375px tall on iPhone), the contact form, footer title, footer-right info, navigation, and social icons must all fit within 375px minus padding. The 992px and 768px breakpoints change this to `height: auto`, so this only affects screens wider than 992px in landscape -- however, many tablets in landscape are wider than 992px but shorter than expected.

The inline style on the HTML (`style="background-color: #25262a;"`) does not set height, so the CSS `height: 100vh` from the stylesheet applies.

**Fix:**
- Change `height: 100vh` to `min-height: 100vh` in the base footer style so content can extend beyond the viewport when needed:
```css
#footer {
  min-height: 100vh;
  height: auto;
}
```

---

## Issue 5: `.body-tail` 100px Top Padding Pushes Stats Off-Screen on Mobile

**Selector:** `.body-tail`
**File:** `style.css`, line 482
**Breakpoint Affected:** Below 992px (after `#content-body` becomes single column)
**Severity:** MEDIUM

**Problem:** `.body-tail` has `padding: 100px 0 0 0`. When `#content-body` switches to `flex-direction: column` at 992px and the height constraint is removed (`height: auto`), the stats section ("2 research published", "6+ projects completed") is pushed down by 100px from the body-title above it. On a mobile screen, this creates excessive whitespace and may push the stats partially or fully out of the initial viewport.

There is no override for `.body-tail` padding in any breakpoint.

**Fix:**
- Add responsive overrides:
```css
@media (max-width: 992px) {
  .body-tail { padding: 40px 0 0 0; }
}
@media (max-width: 768px) {
  .body-tail { padding: 20px 0 0 0; }
}
```

---

## Issue 6: Mobile Hamburger Menu Shows Both Nav AND Social Links (Tall Menu)

**Selector:** `.navbar-menu-container.active`, `.social-media-container.active`
**File:** `style.css`, lines 999-1002; `script.js`, lines 17-20
**Breakpoint Affected:** Below 768px
**Severity:** MEDIUM

**Problem:** When the hamburger menu is toggled, `script.js` toggles `.active` on both `.navbar-menu-container` AND `.social-media-container` simultaneously. This shows 5 nav links + 3 social links, each with `padding: 10px 0` and `font-size: 14px-18px`. On a small phone (e.g., 568px tall iPhone SE), the expanded menu could take up 300-400px of vertical space, pushing the page content completely off-screen and making the menu itself potentially scrollable within the sticky header.

**Fix:**
- Consider collapsing social links into a horizontal row at the bottom of the mobile menu instead of vertical list items.
- Alternatively, add `max-height` and `overflow-y: auto` to the mobile menu container:
```css
@media (max-width: 768px) {
  #header {
    max-height: 80vh;
    overflow-y: auto;
  }
}
```
- Or separate the nav and social toggles into two different interactions.

---

## Issue 7: Announcement Banner Scrolling Animation on Narrow Screens

**Selector:** `#announcement-banner p`
**File:** `style.css`, lines 79-92
**Breakpoint Affected:** Below 480px
**Severity:** LOW

**Problem:** The `moveText` keyframe animation translates from `translateX(100%)` to `translateX(-100%)`. The `%` values are relative to the element's own width, not the container. Since the `<p>` contains a long text string with `white-space: nowrap`, its computed width could be 500-700px. On a 320px screen, the text will translate by its own width (e.g., 600px), which means it will scroll correctly but:
1. There will be a long gap of empty space before the text re-enters from the right.
2. The text moves very fast across the small visible area.
3. The `overflow: hidden` on the banner clips correctly, but the user experience is poor with such a brief visibility window.

**Fix:**
- Use viewport-relative values or adjust the animation for smaller screens:
```css
@media (max-width: 600px) {
  #announcement-banner p {
    animation: moveText 15s linear infinite; /* slower speed */
  }
}
```
- Or consider replacing the scrolling marquee with a static, multi-line banner on mobile.

---

## Issue 8: `.developer-intro` Pills Wrap Badly on Mobile

**Selector:** `.developer-intro`
**File:** `style.css`, lines 433-454
**Breakpoint Affected:** Below 600px
**Severity:** MEDIUM

**Problem:** `.developer-intro` uses `display: flex` with `align-items: center` but never sets `flex-wrap: wrap`. It contains 4 pill elements ("Front-End Developer", "Security Enthusiast", "Research Scholar", "MCP Builder"). On screens narrower than ~500px, these 4 pills in a single row will overflow horizontally. The global `max-width: 100%` on all elements (line 14) may constrain the container but the pills will shrink to illegible sizes rather than wrapping to a new line.

At 480px, the pills have `font-size: 11px` and `padding: 4px 8px` with `margin: 0 10px 0 0`, but `flex-wrap` is never added.

**Fix:**
```css
.developer-intro {
  flex-wrap: wrap;
  gap: 8px;
}
@media (max-width: 480px) {
  .developer-intro {
    justify-content: center;
  }
  .developer-intro p {
    margin: 0;
  }
}
```

---

## Issue 9: `#research > div` min-height 95vh on Mobile

**Selector:** `#research > div` (also applies via inline styles on `#introduction` and `#skill` inner divs)
**File:** `style.css`, line 394; `index.html`, lines 234, 290, 380
**Breakpoint Affected:** Below 900px
**Severity:** MEDIUM

**Problem:** `#research > div` has `min-height: 95vh`. The 900px media query sets `min-height: unset` for `#research > div`, which fixes research. However, the inner `<div>` elements of `#introduction` (line 290) and `#skill` (line 380) have inline `style="min-height: 95vh"` which cannot be overridden by CSS without `!important`. On mobile, where content stacks vertically, 95vh is unnecessary and forces excessive empty space when content is shorter, or forces excessive scrolling when cards stack up.

**Fix:**
- Remove inline `min-height: 95vh` from the HTML `<div>` elements inside `#introduction` and `#skill`.
- Move to CSS and add responsive override:
```css
#introduction > div,
#skill > div {
  min-height: 95vh;
}
@media (max-width: 900px) {
  #introduction > div,
  #skill > div,
  #research > div {
    min-height: unset;
  }
}
```

---

## Issue 10: `.design-card` max-width Not Reset in 600px Breakpoint

**Selector:** `.design-card`
**File:** `style.css`, lines 597-607 (base), line 994-997 (768px), lines 1111-1117 (600px)
**Breakpoint Affected:** 601px to 767px
**Severity:** LOW

**Problem:** The base `.design-card` has `max-width: 80%`. At 768px, it is overridden to `max-width: 100%` (line 995). At 600px, it is also set to `max-width: 100%` (line 1113). However, between 601px and 767px, there is no applicable breakpoint -- wait, the 768px breakpoint uses `max-width: 768px` which covers everything up to 768px, so the 600px breakpoint is redundant for this property.

Actually, reviewing more carefully: the 768px breakpoint at line 994 sets `.design-card { max-width: 100%; }`. Since 601px < 768px, the 768px breakpoint already covers the 601-767 range. The 600px breakpoint redeclares this unnecessarily. So this is not a gap but a redundancy.

The actual issue is that on screens between 769px and 991px (where `flex-direction` is column from 992px for `#content-body` but not for card sections), `.cards-container` is `width: 100%` (from 992px breakpoint) but `.design-card` is still `max-width: 80%`, leaving cards at 80% of container width which looks awkward on tablets.

**Fix:**
```css
@media (max-width: 992px) {
  .design-card {
    max-width: 100%;
  }
}
```

---

## Issue 11: Touch Target Sizes Too Small (< 44px)

**Selectors:** `.navbar-menu li a`, `.social-media li a`, `.footer-menu li a`, `.social-icons a i`
**File:** `style.css`, various lines
**Breakpoint Affected:** All mobile breakpoints (below 768px)
**Severity:** HIGH (Accessibility / WCAG 2.5.5)

**Problem:** Multiple interactive elements fail the 44x44px minimum touch target recommendation:

| Element | Font Size | Padding | Estimated Touch Area |
|---------|-----------|---------|---------------------|
| `.navbar-menu li a` (mobile) | 14px (line 1015) | `10px 20px` (line 961) | ~44x34px - close but height is short |
| `.social-media li a` (mobile) | 14px | `10px 20px` | ~44x34px |
| `.social-media li i` | 14px (line 329) | None | ~14x14px - very small |
| `.footer-menu li a` | 12px (line 813) | Inherits from `li` padding `0 20px` | ~40x22px - too small |
| `.social-icons a i` | Default size, `margin: 0 5px` (line 828) | None | ~20x20px - too small |
| `.design-card a` (read more links) | 14px | None | ~auto x 20px - too small |
| `#announcement-banner .banner-link` | 16px | None | ~auto x 20px |

**Fix:**
- Add minimum touch target sizing for mobile:
```css
@media (max-width: 768px) {
  .navbar-menu li a,
  .social-media li a,
  .footer-menu li a {
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  .social-icons a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
  }
}
```

---

## Issue 12: `overflow-x: hidden` on Body Causes iOS Safari Issues

**Selector:** `body, html`
**File:** `style.css`, lines 1120-1125
**Breakpoint Affected:** All (iOS Safari specific)
**Severity:** MEDIUM

**Problem:** `overflow-x: hidden` on both `body` and `html` is used to prevent horizontal scrolling from elements that extend beyond the viewport (like `width: 100vw` inline divs). However, on iOS Safari:
1. It can break `position: sticky` behavior -- the sticky header (`#header` with `position: sticky; top: 0`) and the sticky announcement banner (`#announcement-banner` with `position: sticky; top: 0`) may stop working.
2. It can trap keyboard focus, preventing users from scrolling to focused elements that are off-screen.
3. It creates a new stacking context that can interfere with z-index layering.

The root cause of the horizontal overflow is the `width: 100vw` used in inline styles on `#research > div`, `#introduction > div`, and `#skill > div` (lines 234, 290, 380 of `index.html`). The `100vw` includes the scrollbar width, which causes a horizontal overflow of ~15px.

**Fix:**
- Replace inline `width: 100vw` with `width: 100%` on the inner divs in HTML.
- Once the root cause is fixed, `overflow-x: hidden` can be removed or limited to `html` only:
```css
html {
  overflow-x: hidden;
}
body {
  overflow-x: visible; /* or remove the rule */
}
```

---

## Issue 13: Font Sizes at 480px Breakpoint May Be Too Small

**Selector:** Various heading and paragraph elements
**File:** `style.css`, lines 1128-1168
**Breakpoint Affected:** Below 480px
**Severity:** MEDIUM (Accessibility)

**Problem:** At the 480px breakpoint, the following font sizes apply (cumulative with 768px overrides):

| Element | Size at 480px | Minimum Recommended |
|---------|---------------|-------------------|
| `h1` | 30px (768px override) -> `.body-title h1`: 20px (480px override) | 20px is borderline acceptable |
| `h2` | 24px (768px) | OK |
| `p` | 12px (768px) | 14px recommended for body text |
| `.developer-intro p` | 11px (480px) | 12px minimum recommended |
| `.body-title p` | 12px (768px) | 14px recommended |
| `.design-card p` | 14px (base, never overridden down) | OK |
| `.navbar-menu li a` | 14px (768px line 1015) | OK |
| `#greetingText` | 0.9em of parent (480px) | Depends on parent, could be ~13px |
| `.footer-email-intro p` | 12px (768px global p) overriding base 12px | Acceptable |

The global `p` at 12px on 480px screens is below the 14px minimum recommended by WCAG for comfortable reading on mobile.

**Fix:**
```css
@media (max-width: 480px) {
  p {
    font-size: 14px;
    line-height: 1.5;
  }
  .developer-intro p {
    font-size: 12px; /* pills are short labels, OK at 12px */
  }
}
```

---

## Issue 14: `.developer-intro` Not Set to Column on Very Small Screens

**Selector:** `.developer-intro`
**File:** `style.css`, lines 433-454
**Breakpoint Affected:** Below 400px
**Severity:** MEDIUM

**Problem:** `.developer-intro` is `display: flex` with no `flex-direction` set (defaults to `row`). Even with `flex-wrap: wrap` (if added per Issue 8), on very narrow screens (320px, e.g., iPhone SE 1st gen), 4 pills wrapping into 2 rows still may not fit well. The pills have no `flex-direction: column` override at any breakpoint. Combined with the `align-items: center; justify-content: center` from line 1078-1081, the pills center but remain in row flow.

At 320px wide with 10px container padding on each side, there is 300px available. Four pills ("Front-End Developer" ~140px, "Security Enthusiast" ~130px, "Research Scholar" ~120px, "MCP Builder" ~95px) cannot fit even two per row.

**Fix:**
```css
@media (max-width: 400px) {
  .developer-intro {
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .developer-intro p {
    margin: 0;
    width: auto;
  }
}
```

---

## Issue 15: Scroll-to-Top Button Overlaps Content on Small Screens

**Selector:** `.scroll-to-top`
**File:** `style.css`, lines 121-148
**Breakpoint Affected:** Below 480px
**Severity:** LOW

**Problem:** The scroll-to-top button is positioned at `bottom: 30px; right: 30px` with `width: 50px; height: 50px`. On a 320px-wide screen, the button occupies from x=240 to x=290 (out of 320). This can overlap with:
1. Card content that extends to full width (`.design-card` at `max-width: 100%` on mobile).
2. The Calendly badge widget (which also floats in the bottom-right corner).
3. Text content in the footer section.

The `z-index: 1000` ensures it renders on top, but it obscures content beneath it without any way for the user to dismiss it.

**Fix:**
```css
@media (max-width: 480px) {
  .scroll-to-top {
    bottom: 20px;
    right: 15px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
```

---

## Additional Issues Found During Audit

### Issue 16: Inline `width: 100vw` Causes Horizontal Scrollbar

**Selector:** Inline styles on divs inside `#research`, `#introduction`, `#skill`
**File:** `index.html`, lines 234, 290, 380
**Breakpoint Affected:** All viewports with visible scrollbar
**Severity:** HIGH

**Problem:** `width: 100vw` on inner divs includes scrollbar width (~15px on Windows, ~0px on macOS with overlay scrollbars). This creates a horizontal overflow of ~15px which is the root cause of needing `overflow-x: hidden` on body/html.

**Fix:** Replace `width: 100vw` with `width: 100%` in the inline styles, or move to CSS.

---

### Issue 17: `#aboutme` Has 100px Left Padding Not Fully Addressed

**Selector:** `#aboutme`
**File:** `style.css`, line 372
**Breakpoint Affected:** 769px to 991px
**Severity:** LOW

**Problem:** `#aboutme` has `padding: 80px 0 80px 100px`. At 992px it changes to `padding: 80px 20px`, and at 768px to `padding: 50px 20px`. Between 769px and 991px, the 992px breakpoint already applies (since 769 < 992), so this is actually covered. No issue.

---

### Issue 18: Two Sticky Elements Competing for `top: 0`

**Selector:** `#header` and `#announcement-banner`
**File:** `style.css`, lines 254-256 (header `position: sticky; top: 0; z-index: 1`) and lines 61-64 (banner `position: sticky; top: 0; z-index: 2`)
**Breakpoint Affected:** All
**Severity:** LOW

**Problem:** Both the header and the announcement banner have `position: sticky; top: 0`. Since the banner appears after the header in DOM order, as you scroll:
1. The header sticks at top: 0.
2. The banner, being after it, will stick below the header (the sticky positioning respects DOM flow within the same scroll container).
3. However, on mobile where the header can expand to a tall hamburger menu (Issue 6), the banner will be pushed down significantly.

The `z-index: 2` on the banner vs `z-index: 1` on the header means the banner will visually cover the header if they overlap, which is likely unintended.

**Fix:** Set the banner's `top` to the header's height, or use a single sticky wrapper. On mobile, consider hiding the banner or making it non-sticky.

---

## Priority Summary

| Priority | Issues |
|----------|--------|
| **HIGH** | #1 (greetingText overflow), #2 (content-body padding), #3 (email-form overflow), #11 (touch targets), #16 (100vw scrollbar) |
| **MEDIUM** | #4 (footer 100vh), #5 (body-tail padding), #6 (tall mobile menu), #8 (pill wrapping), #9 (95vh min-height), #12 (iOS overflow-x), #13 (font sizes), #14 (developer-intro column) |
| **LOW** | #7 (banner animation), #10 (design-card max-width), #15 (scroll-to-top overlap), #18 (competing sticky) |

---

## Breakpoint Coverage Gap Analysis

| Range | Current Coverage | Status |
|-------|-----------------|--------|
| > 1200px | Base styles | OK |
| 993px - 1200px | Only `.svg-animation` adjusted | GAPS: content-body padding, card widths |
| 769px - 992px | Major layout shifts (flex-direction, padding) | OK but some gaps |
| 601px - 768px | Mobile layout, hamburger menu | Missing: greetingText, design-card |
| 481px - 600px | greetingText, background-circle, card resets | OK |
| < 480px | Small screen fine-tuning | Missing: body-tail, developer-intro column, font sizes |
| Landscape mobile | Not specifically addressed | GAP: footer height, header height |
