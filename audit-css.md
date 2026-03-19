# CSS Audit Report - Portfolio-v2/style.css

**Date:** 2026-02-19
**File:** `style.css` (1282 lines)
**Auditor:** CSS Quality Audit Agent

---

## Summary

18 issues identified across the stylesheet. Breakdown by severity:

| Severity | Count |
|----------|-------|
| High     | 5     |
| Medium   | 8     |
| Low      | 5     |

---

## Issues

### 1. Duplicate `#greetingText` Rule

- **Lines:** 34-43 and 1224-1233
- **Severity:** Medium
- **Issue:** `#greetingText` is defined twice with nearly identical properties. The first instance (line 34) sets `font-family: 'CyberAlert', 'Montserrat', 'Roboto', sans-serif` and the second (line 1224) sets `font-family: 'CyberAlert', 'Montserrat', 'Roboto', sans-serif` -- essentially the same. Both declare `display: inline-block`, `width: 420px`, `min-height: 2.5em`, `text-align: center`, `white-space: nowrap`, `transition: width 0.3s`, and `flex-shrink: 0`. The second rule completely overrides the first, making the first dead code.
- **Suggested Fix:** Remove the first `#greetingText` block (lines 34-43) and keep only the one at line 1224 which was intended to consolidate font rules.

---

### 2. Missing Unit on `margin: 10`

- **Line:** 718
- **Severity:** High
- **Issue:** `.email-form input` has `margin: 10;` which is invalid CSS. Unitless values (other than `0`) are not valid for the `margin` property. Browsers will ignore this declaration entirely, meaning the input has no margin applied.
- **Suggested Fix:** Change `margin: 10;` to `margin: 10px;` (or whichever unit is intended).

---

### 3. Redundant `align-content` and `align-items` on Same Flex Container

- **Lines:** 357-360 (`#content-body`), also lines 369-370 (`#aboutme`)
- **Severity:** Low
- **Issue:** `#content-body` sets both `align-content: center` (line 359) and `align-items: center` (line 360). For a single-line flex container (no `flex-wrap`), `align-content` has no effect -- only `align-items` matters. Additionally, `align-items` is declared twice: `align-items: flex-start` on line 357 and `align-items: center` on line 360, so the first one is dead code. The same pattern occurs on `#aboutme` (lines 369-370).
- **Suggested Fix:** Remove `align-content: center` and the first `align-items: flex-start` from `#content-body`. Remove `align-content: center` from `#aboutme`.

---

### 4. `.message-label { display: none; }` Without Accessible Alternative

- **Lines:** 1083-1085
- **Severity:** High
- **Issue:** The `<label for="message">` element is hidden with `display: none`, which removes it from the accessibility tree entirely. Screen readers will not announce the label for the message textarea, leaving it unlabeled for assistive technology users.
- **Suggested Fix:** Replace `display: none;` with a visually-hidden technique that keeps the element accessible:
  ```css
  .message-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  ```

---

### 5. `overflow-x: hidden` on Both `body` and `html`

- **Line:** 1120-1125
- **Severity:** Medium
- **Issue:** Both `body` and `html` have `overflow-x: hidden` applied via the combined selector `body, html`. Setting `overflow-x: hidden` on both elements simultaneously can cause scroll-related bugs on iOS Safari, where the page may still allow horizontal scrolling via touch, or where it prevents `position: sticky` from working correctly in some scenarios.
- **Suggested Fix:** Apply `overflow-x: hidden` only to `body`, not `html`. If horizontal overflow is an issue, fix the overflowing elements directly (e.g., the `width: 100vw` inline styles on inner divs which include scrollbar width).

---

### 6. Inline Styles in HTML Instead of CSS Classes

- **Lines (in index.html):** 233, 234, 285, 290, 375, 380, 445
- **Severity:** Medium
- **Issue:** Multiple sections use inline `style` attributes:
  - `<section id="research" style="background-color: #2d2e3273;">` (line 233)
  - `<div style="display: flex; position: relative; justify-content: space-between; padding: 100px 40px; min-height: 95vh; align-items: center; width: 100vw;">` (lines 234, 290, 380)
  - `<section id="introduction" style="background-color: #25262a;">` (line 285)
  - `<section id="skill" style="background-color: #2d2e3273;">` (line 375)
  - `<section id="footer" style="background-color: #25262a;">` (line 445)

  These inline styles override CSS specificity, are hard to maintain, and create inconsistency between what the stylesheet controls and what the HTML controls. The `width: 100vw` is particularly problematic as it includes the scrollbar width and causes horizontal overflow.
- **Suggested Fix:** Move all inline styles to the stylesheet. Create CSS rules for these sections (e.g., `#research`, `#introduction > div`, `#skill > div`) and remove inline `style` attributes. Replace `width: 100vw` with `width: 100%`.

---

### 7. `h3` Not Styled Globally but Overridden in `.heading-container h3`

- **Lines:** 561-567 (`.heading-container h3`), no global `h3` rule exists
- **Severity:** Low
- **Issue:** While `h1`, `h2`, `h4`, and `h6` all have global style definitions (lines 152-176), `h3` has no global rule. The only `h3` styling comes from scoped selectors like `.heading-container h3` (line 561), `.design-card div h3` (line 626), and `.footer-email-intro h3` (line 783). This creates an inconsistent heading hierarchy where `h3` inherits browser defaults unless specifically scoped.
- **Suggested Fix:** Add a global `h3` style rule alongside the other heading styles to establish a consistent baseline:
  ```css
  h3 {
    font-size: 24px;
    font-weight: 500;
    color: #fefefe;
  }
  ```

---

### 8. `.social-icons a:nth-child(3)` Targets Instagram Correctly, but Verify

- **Lines (CSS):** 836-838, **(HTML):** 510-522
- **Severity:** Low
- **Issue:** The `.social-icons` div in the footer contains exactly 3 `<a>` children: LinkedIn (1st), GitHub (2nd), Instagram (3rd). The CSS rule `.social-icons a:nth-child(3) i:hover` (line 836) applies `color: #ea4335` (a Google/red color) on hover. However, the 3rd child is actually the Instagram link. The hover color `#ea4335` is Google's brand red, not Instagram's gradient -- this appears to be a mismatch from a previous layout that had an email/Google link in position 3.
- **Suggested Fix:** Update `.social-icons a:nth-child(3) i:hover` to use an Instagram-appropriate style (gradient or `#E1306C`), or apply the Instagram gradient already defined in `nth-child(5)` at line 844.

---

### 9. `.social-icons a:nth-child(4)` and `a:nth-child(5)` Target Non-Existent Items

- **Lines:** 840-856
- **Severity:** Medium
- **Issue:** The CSS defines hover styles for `.social-icons a:nth-child(4)` (Twitter blue, line 840), `.social-icons a:nth-child(5)` (Instagram gradient, line 844), and `.social-icons a:nth-child(6)` (Facebook blue, line 854). However, the HTML `.social-icons` container only has 3 `<a>` elements (LinkedIn, GitHub, Instagram). These rules are dead CSS that will never match any element.
- **Suggested Fix:** Remove the `nth-child(4)`, `nth-child(5)`, and `nth-child(6)` rules entirely. Update `nth-child(3)` to use the Instagram gradient style instead.

---

### 10. Contradictory `body` Font-Family Declarations

- **Lines:** 8 (`*` selector), 217 (`body`), 1184 (`body, p, li, a`)
- **Severity:** Medium
- **Issue:** Three conflicting font-family declarations compete for `body` text:
  1. Line 8: `* { font-family: "Raleway", sans-serif; }` -- sets everything to Raleway
  2. Line 217: `body { font-family: 'CyberAlert', sans-serif; }` -- overrides body to CyberAlert
  3. Line 1184: `body, p, li, a { font-family: 'Roboto', 'Raleway', sans-serif; }` -- overrides body again to Roboto

  The final winner is line 1184 (Roboto) due to cascade order, making line 217's CyberAlert declaration dead code for the body. The universal selector on line 8 is also overridden for most elements. This creates confusion about the intended font hierarchy.
- **Suggested Fix:** Establish a clear font strategy. Remove the `font-family` from `body` at line 217 since it is overridden. Consolidate the font declarations into a single, intentional hierarchy at the top of the file.

---

### 11. `.email-form { height: 300px }` - Fixed Height With Dynamic Content

- **Line:** 693
- **Severity:** Medium
- **Issue:** `.email-form` has a fixed `height: 300px`. The form contains a heading, name input, email input, a message textarea, and a submit button plus labels. If the content grows (e.g., validation error messages, longer text on smaller screens, or browser zoom), the content will overflow the fixed container. The form also has `padding: 60px 25% 40px 20px` which further constrains available space.
- **Suggested Fix:** Change `height: 300px` to `min-height: 300px` to allow the form to grow with content while maintaining a minimum size.

---

### 12. `#footer { height: 100vh }` - Full Viewport Height Footer

- **Line:** 670
- **Severity:** Medium
- **Issue:** The footer is set to exactly `height: 100vh`, forcing it to always be the full viewport height. On screens where the footer content is taller than the viewport (e.g., mobile, zoomed-in views), the content overflows. On very large screens, the footer has excessive empty space. While media queries at 992px and 768px override this to `height: auto`, desktop users with smaller browser windows will still experience overflow.
- **Suggested Fix:** Change `height: 100vh` to `min-height: 100vh` so the footer can grow to accommodate content while still filling the viewport when content is short.

---

### 13. `#introduction` Has `display: flex` Both in CSS and via Inline Style

- **Lines (CSS):** 543-551, **(HTML):** 290
- **Severity:** Low
- **Issue:** `#introduction` has `display: flex` set in the CSS (line 544). Its inner `<div>` at HTML line 290 also has an inline style with `display: flex; position: relative; justify-content: space-between; padding: 100px 40px; min-height: 95vh; align-items: center; width: 100vw;`. This creates a redundant flex-in-flex nesting where the CSS-defined flex properties on `#introduction` and the inline style on the child div partially overlap and can conflict. The `#introduction` CSS also defines `justify-content: space-between` and `align-items: center`, which are redundant with the inline style on the child.
- **Suggested Fix:** Remove the inline styles from the inner `<div>` and consolidate all layout properties into the CSS file under `#introduction` or a dedicated child selector like `#introduction > div`.

---

### 14. `#content-body` Sets `align-items` Twice

- **Lines:** 357 and 360
- **Severity:** Low
- **Issue:** `#content-body` declares `align-items: flex-start` on line 357 and then `align-items: center` on line 360. The second declaration overrides the first within the same rule block, making line 357's `align-items: flex-start` dead code.
- **Suggested Fix:** Remove `align-items: flex-start;` on line 357 and keep only `align-items: center;` on line 360.

---

### 15. Excessive Google Font Imports - Performance Impact

- **Lines (CSS):** 1 (in style.css), **(HTML):** 42-49 (in index.html)
- **Severity:** High
- **Issue:** The site loads 9 font families:
  1. **Raleway** (9 weights) -- style.css line 1
  2. **Source Code Pro** (8 weights) -- style.css line 1
  3. **Montserrat** (2 weights) -- index.html line 42
  4. **Roboto** (3 weights) -- index.html line 43
  5. **Orbitron** (2 weights) -- index.html line 44
  6. **Share Tech Mono** -- index.html line 45
  7. **Audiowide** -- index.html line 46
  8. **VT323** -- index.html line 47
  9. **Press Start 2P** -- index.html line 48
  10. **Russo One** -- index.html line 49

  Plus the custom **CyberAlert** font. Several fonts are defined in CSS utility classes (`.techy`, `.retro`, `.pixel`, `.impact`) that appear rarely or never used in the HTML. **Source Code Pro** is imported but never referenced anywhere in the CSS or HTML. This results in potentially 500KB+ of font downloads blocking initial render.
- **Suggested Fix:** Audit actual font usage. Remove `Source Code Pro` entirely (unused). Consider removing `VT323`, `Press Start 2P`, `Russo One`, `Share Tech Mono`, and `Audiowide` if they are only used for the `.techy-title` and `.creative-title` classes on section headings -- or lazy-load them. Consolidate font imports into a single `<link>` tag with `display=swap`.

---

### 16. `@keyframes moveText` Makes Banner Text Unreadable

- **Lines:** 85-92
- **Severity:** High
- **Issue:** The `moveText` animation translates the banner text from `translateX(100%)` to `translateX(-100%)` over 10 seconds with `infinite` repetition. This means the text scrolls entirely off-screen to the left and then jumps back to the right side. At any given moment, the text may be partially or fully off-screen, making it unreadable. Combined with the `overflow: hidden` on `#announcement-banner` (line 67), the text disappears completely during portions of the animation cycle. This also creates accessibility issues (WCAG 2.2.2 -- Pause, Stop, Hide).
- **Suggested Fix:** Either:
  - Remove the animation entirely and display the banner text statically.
  - Change the animation to a subtle effect (fade, gentle pulse) that keeps text readable.
  - If marquee-style scrolling is desired, use a wider animation range that keeps text on-screen longer, and provide a way to pause the animation (e.g., `@media (prefers-reduced-motion: reduce)` to disable it).

---

### 17. Unused CSS Classes

- **Lines:** 185-187 (`.section-p1`), 189-191 (`.section-m1`), 497-504 (`.background-circle`)
- **Severity:** Medium
- **Issue:** Several CSS classes are defined but never used in the HTML:
  - `.section-p1` (line 185) -- not found in `index.html`
  - `.section-m1` (line 189) -- not found in `index.html`
  - `.background-circle` (line 497) -- not found in `index.html`

  These add dead weight to the stylesheet. `.section-p1` and `.section-m1` are even overridden in media queries at lines 884 and 1034, compounding the dead code.
- **Suggested Fix:** Remove `.section-p1`, `.section-m1`, and `.background-circle` rules (including their media query overrides) from the stylesheet.

---

### 18. `.design-card.active` Uses `!important` Heavily

- **Lines:** 1250-1261
- **Severity:** High
- **Issue:** The `.design-card.active` rule uses `!important` on 6 properties: `background-color`, `color`, `box-shadow`, `border`, and then on child elements `h3`, `p`, `a`, `i` for `color`. This is a sign of specificity problems -- the normal cascade cannot override the base `.design-card` styles without `!important`. This makes future styling changes difficult, as any override of the active state will also need `!important`, leading to specificity wars.
- **Suggested Fix:** Increase the specificity of `.design-card.active` naturally instead of using `!important`. For example:
  - Use `section .design-card.active` or `#introduction .design-card.active` for higher specificity.
  - Alternatively, restructure the `.design-card` base styles to use lower specificity so that `.design-card.active` can naturally override them.
  - Remove all `!important` declarations from the active card styles.

---

## Recommendations Summary

| Priority | Action |
|----------|--------|
| Immediate | Fix `margin: 10;` to `margin: 10px;` (line 718) |
| Immediate | Fix `.message-label` accessibility (line 1083) |
| Immediate | Change `@keyframes moveText` to keep text readable (lines 85-92) |
| High | Audit and reduce font imports (9+ fonts loaded) |
| High | Remove `!important` from `.design-card.active` and fix specificity |
| Medium | Remove duplicate `#greetingText` rule (line 34) |
| Medium | Move inline styles from HTML to CSS |
| Medium | Remove dead `nth-child(4/5/6)` social icon rules |
| Medium | Change fixed heights to `min-height` on `.email-form` and `#footer` |
| Medium | Fix `overflow-x: hidden` on both body and html |
| Medium | Remove contradictory body font-family |
| Medium | Remove unused CSS classes |
| Low | Remove duplicate `align-items` in `#content-body` |
| Low | Fix `nth-child(3)` Instagram color mismatch |
| Low | Add global `h3` style |
| Low | Remove redundant `align-content` declarations |
| Low | Consolidate flex properties on `#introduction` |
