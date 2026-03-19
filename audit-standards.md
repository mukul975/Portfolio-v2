# Cross-Browser Compatibility & Web Standards Audit Report

**Project:** Portfolio-v2
**Date:** 2026-02-19
**Files Audited:** `index.html`, `style.css`, `script.js`

---

## Summary

15 issues identified across cross-browser compatibility, HTML5 validation, performance, and web standards compliance. 3 high severity, 7 medium severity, 5 low severity.

---

## Issue 1: Obsolete IE Compatibility Meta Tag

- **Location:** `index.html`, line 23
- **Code:** `<meta http-equiv="X-UA-Compatible" content="IE=edge">`
- **Standard Violated:** HTML Living Standard - This meta tag was designed for Internet Explorer, which was officially retired by Microsoft on June 15, 2022. It has no effect on any currently supported browser.
- **Browser Impact:** None functional. It adds unnecessary bytes to every page load. No modern browser (Chrome, Firefox, Safari, Edge Chromium) reads this tag.
- **Severity:** LOW
- **Fix:** Remove the entire line. No replacement is needed since no supported browser requires it.

---

## Issue 2: Commented-Out Duplicate Stylesheet Link

- **Location:** `index.html`, lines 40-41
- **Code:**
  ```html
  <!-- <link rel="stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="style.css">
  ```
- **Standard Violated:** Code cleanliness / maintainability best practice. No specification violation, but dead code in production HTML increases file size and causes confusion for maintainers.
- **Browser Impact:** None functional. The commented-out line is ignored by all browsers.
- **Severity:** LOW
- **Fix:** Remove line 40 (the commented-out `<link>` tag). Keep only the active link on line 41.

---

## Issue 3: Commented-Out Duplicate Script Tag

- **Location:** `index.html`, lines 527-528
- **Code:**
  ```html
  <!-- <script src="script.js"></script> -->
  <script src="script.js"></script>
  ```
- **Standard Violated:** Same as Issue 2 - dead code in production markup.
- **Browser Impact:** None functional. Ignored by all browsers.
- **Severity:** LOW
- **Fix:** Remove line 527 (the commented-out `<script>` tag). Keep only the active script on line 528.

---

## Issue 4: Commented-Out HTML Content Left in Markup

- **Location:** `index.html`, lines 171 and 211
- **Code:**
  ```html
  <!-- <h1>Talk is cheap<br>Show me the code</h1> -->
  ```
- **Standard Violated:** Code cleanliness best practice. Commented-out content in production HTML adds to page weight and creates maintenance confusion.
- **Browser Impact:** None functional. Comments are ignored by all browsers.
- **Severity:** LOW
- **Fix:** Remove both commented-out `<h1>` blocks on lines 171 and 211.

---

## Issue 5: CSS @import for Google Fonts Causes Render-Blocking Extra Request

- **Location:** `style.css`, line 1
- **Code:**
  ```css
  @import url("https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&display=swap");
  ```
- **Standard Violated:** Web Performance Best Practices (Google Web Vitals / Lighthouse). `@import` in CSS is render-blocking: the browser must first download `style.css`, parse it, discover the `@import`, and then make a second sequential request for the font CSS. This creates a waterfall chain that delays rendering.
- **Browser Impact:** All browsers. Increases First Contentful Paint (FCP) and Largest Contentful Paint (LCP) times. The sequential request chain is especially harmful on slow connections.
- **Severity:** MEDIUM
- **Fix:** Replace the `@import` in `style.css` with a `<link>` tag in the `<head>` of `index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  ```
  This allows the browser to discover and begin fetching the font CSS in parallel with the stylesheet.

---

## Issue 6: Unnecessary Vendor-Prefixed Radial Gradients with Missing -moz- Prefix

- **Location:** `style.css`, lines 846-849
- **Code:**
  ```css
  background: -webkit-radial-gradient(30% 107%, circle, ...);
  background: -o-radial-gradient(30% 107%, circle, ...);
  background: radial-gradient(circle at 30% 107%, ...);
  background: -webkit-radial-gradient(circle at 30% 107%, ...);
  ```
- **Standard Violated:** CSS Images Module Level 3. The `radial-gradient()` function has been unprefixed and supported by all major browsers since 2014+. The `-webkit-` and `-o-` prefixes are unnecessary. Additionally, `-moz-` is missing if the goal was to support legacy Firefox (pre-16), and the second `-webkit-radial-gradient` on line 849 overwrites the standard `radial-gradient` on line 848 due to CSS cascade order.
- **Browser Impact:** The second `-webkit-radial-gradient` declaration (line 849) comes AFTER the standard `radial-gradient` (line 848), so in WebKit/Blink browsers it overrides the standard one. In Firefox, the standard declaration on line 848 applies correctly. In Opera (pre-Blink), the `-o-` prefix on line 847 would apply. The cascade order is incorrect for progressive enhancement.
- **Severity:** MEDIUM
- **Fix:** Remove all vendor-prefixed versions and keep only the standard syntax. Also fix the cascade order so the standard declaration is last:
  ```css
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
  ```

---

## Issue 7: -webkit-background-clip Used Alongside Standard (Correct Pattern, but Prefix Still Required)

- **Location:** `style.css`, lines 850-851
- **Code:**
  ```css
  background-clip: text;
  -webkit-background-clip: text;
  ```
- **Standard Violated:** CSS Backgrounds and Borders Module Level 4. `background-clip: text` is supported in all modern browsers, but Safari (all versions as of 2026) still requires `-webkit-background-clip: text` for the `text` value specifically.
- **Browser Impact:** Safari would not clip the background to text without the `-webkit-` prefix. Chrome, Edge, and Firefox support the unprefixed version.
- **Severity:** LOW (correctly handled, but the `-webkit-` prefix should come BEFORE the standard property for proper progressive enhancement)
- **Fix:** Reverse the order so the standard property comes last (overriding the prefixed one in browsers that support it):
  ```css
  -webkit-background-clip: text;
  background-clip: text;
  ```

---

## Issue 8: Missing font-display: swap on Google Fonts Loaded via HTML

- **Location:** `index.html`, lines 42-49
- **Code:**
  ```html
  <link href="https://fonts.googleapis.com/css?family=Montserrat:700,900&display=swap" rel="stylesheet">
  ```
  All 8 `<link>` tags for Google Fonts on lines 42-49 DO include `&display=swap`. However, they use the older Google Fonts API v1 (`/css?family=`) instead of the newer v2 API (`/css2?family=`).
- **Standard Violated:** Performance best practice. Google Fonts API v2 (used in the `@import` in CSS) provides more efficient font subsetting and smaller CSS output. Using v1 in HTML while v2 in CSS creates an inconsistent loading strategy.
- **Browser Impact:** All browsers. The v1 API returns larger CSS files with less efficient unicode-range subsetting compared to v2. This impacts load time, particularly on mobile connections.
- **Severity:** MEDIUM
- **Fix:** Migrate all `<link>` tags from v1 to v2 API format. For example:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
  ```

---

## Issue 9: Missing -webkit-backdrop-filter for Safari Support

- **Location:** `style.css`, line 252 (in `#header`) and line 701 (in `.email-form`)
- **Code:**
  ```css
  backdrop-filter: blur(15px);
  ```
- **Standard Violated:** CSS Filter Effects Module Level 2. `backdrop-filter` requires the `-webkit-` prefix in Safari versions prior to 18 (released September 2024). While Safari 18+ supports the unprefixed property, a significant portion of users may still run older Safari versions (especially on older iOS devices that cannot update).
- **Browser Impact:** Safari 15-17 (iOS 15-17, macOS Monterey-Sonoma) will NOT apply the backdrop blur effect without `-webkit-backdrop-filter`. This affects the navbar and contact form visual design for those users.
- **Severity:** HIGH
- **Fix:** Add the prefixed property before the standard one in both locations:
  ```css
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  ```

---

## Issue 10: Custom Scrollbar Styling Only Works in WebKit/Blink Browsers

- **Location:** `style.css`, lines 225-241
- **Code:**
  ```css
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cacaca; border-radius: 15px; }
  ::-webkit-scrollbar-thumb:hover { background: #fefefe; }
  ```
- **Standard Violated:** CSS Scrollbars Styling Module Level 1 (W3C Working Draft). The `::-webkit-scrollbar` pseudo-elements are non-standard and only work in Chrome, Edge (Chromium), and Safari. Firefox supports the standard `scrollbar-width` and `scrollbar-color` properties.
- **Browser Impact:** Firefox displays the default OS scrollbar instead of the custom styled one. This creates a visual inconsistency between browsers.
- **Severity:** MEDIUM
- **Fix:** Add the standard scrollbar properties for Firefox alongside the existing WebKit pseudo-elements:
  ```css
  /* Standard scrollbar styling (Firefox) */
  html {
    scrollbar-width: thin;
    scrollbar-color: #cacaca transparent;
  }

  /* WebKit scrollbar styling (Chrome, Edge, Safari) */
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cacaca; border-radius: 15px; }
  ::-webkit-scrollbar-thumb:hover { background: #fefefe; }
  ```

---

## Issue 11: Redundant type="text/javascript" on Script Tags

- **Location:** `index.html`, lines 15, 482, 497
- **Code:**
  ```html
  <script type="text/javascript">
  ```
- **Standard Violated:** HTML Living Standard, Section 4.12.1. The default type for `<script>` elements is `"text/javascript"` in HTML5. Explicitly specifying it is redundant and adds unnecessary bytes.
- **Browser Impact:** None functional. All browsers default to JavaScript. This is purely a standards cleanliness issue.
- **Severity:** LOW
- **Fix:** Remove `type="text/javascript"` from all `<script>` tags:
  ```html
  <script>
  ```

---

## Issue 12: Mixed Google Fonts Loading Strategy (CSS @import + HTML link)

- **Location:** `style.css`, line 1 (loads Raleway, Source Code Pro via @import) and `index.html`, lines 42-49 (loads Montserrat, Roboto, Orbitron, Share Tech Mono, Audiowide, VT323, Press Start 2P, Russo One via `<link>`)
- **Standard Violated:** Web Performance Best Practices. Using two different loading mechanisms for Google Fonts creates an inconsistent loading waterfall:
  1. Browser downloads `index.html` and discovers `<link>` tags (parallel fetch begins)
  2. Browser downloads `style.css` from the `<link>` tag
  3. Browser parses CSS, discovers `@import`, initiates a SECOND sequential request for Raleway/Source Code Pro
  This means Raleway and Source Code Pro load later than the other fonts, creating a staggered FOUT (Flash of Unstyled Text).
- **Browser Impact:** All browsers. Raleway and Source Code Pro will render later than other fonts, potentially causing a visible layout shift.
- **Severity:** MEDIUM
- **Fix:** Consolidate all font loading into `<link>` tags in the HTML `<head>`. Remove the `@import` from `style.css` and add Raleway and Source Code Pro as additional `<link>` tags in `index.html`, or combine all fonts into a single Google Fonts v2 `<link>` request.

---

## Issue 13: `<link>` Elements Inside `<body>` (Invalid HTML5 Placement)

- **Location:** `index.html`, lines 481 and 496
- **Code:**
  ```html
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
  ```
- **Standard Violated:** HTML Living Standard, Section 4.2.4. The `<link>` element with `rel="stylesheet"` is metadata content and is only valid inside the `<head>` element. Placing it in `<body>` is non-conforming HTML5. While browsers do handle this gracefully (they still load and apply the stylesheet), it fails HTML validation.
- **Browser Impact:** All browsers will still load and apply the stylesheet. However, placing `<link>` in `<body>` can trigger a re-render/re-layout when the stylesheet is applied, potentially causing a flash of unstyled content (FOUC) for the Calendly widget. Additionally, line 496 is a DUPLICATE of line 481, loading the same stylesheet twice.
- **Severity:** HIGH
- **Fix:**
  1. Move both Calendly stylesheet `<link>` tags from the `<body>` to the `<head>`.
  2. Remove the duplicate on line 496 (keep only one).
  ```html
  <!-- In <head> -->
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
  ```

---

## Issue 14: Duplicate Calendly Script Tags

- **Location:** `index.html`, lines 482 and 497
- **Code:**
  ```html
  <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
  ```
- **Standard Violated:** Performance best practice. The same Calendly widget script is loaded twice. While the browser cache will prevent a second network request, it still causes the script to be parsed and potentially executed twice. Combined with `window.onload` on line 484 (which overwrites any previous onload handler), this is error-prone.
- **Browser Impact:** All browsers. Double script execution can cause unexpected behavior. The `window.onload` assignment on line 484 also overwrites any previously set `onload` handler (though in this case there isn't one).
- **Severity:** HIGH
- **Fix:** Remove the duplicate script and link tags on lines 496-497. Keep only the first Calendly widget block (lines 481-493). Also consider using `addEventListener` instead of direct `window.onload` assignment.

---

## Issue 15: Heading Order Violation - h3 Before h1

- **Location:** `index.html`, line 130 (first heading is `<h3>`) vs. line 172 (first `<h1>`)
- **Code:**
  ```html
  <h3 class="title-first-name">Mahipal</h3>  <!-- line 130 -->
  ...
  <h1>Cybersecurity Guardian<br>Front-End Maestro</h1>  <!-- line 172 -->
  ```
- **Standard Violated:** WCAG 2.1 Success Criterion 1.3.1 (Info and Relationships) and HTML5 heading best practices. Headings should follow a logical, sequential hierarchy (h1 -> h2 -> h3). The first heading in the document is `<h3>` (the site name in the navbar), appearing before any `<h1>`. Additionally, multiple `<h1>` elements appear throughout the page (lines 172, 177, 179, 212), which is acceptable in HTML5 sectioning but not ideal for SEO and accessibility.
- **Browser Impact:** No visual impact in any browser. However, screen readers and assistive technologies rely on heading hierarchy for navigation. A screen reader user navigating by headings would encounter an `<h3>` before any `<h1>`, which is confusing and indicates a broken document structure.
- **Severity:** MEDIUM
- **Fix:** Change the navbar site name from `<h3>` to a non-heading element (since it serves as branding, not a content heading):
  ```html
  <span class="title-first-name">Mahipal</span>
  ```
  Alternatively, if it should remain a heading, restructure the heading hierarchy so that the first `<h1>` appears before any lower-level headings. Also review the use of `<h3>` as section headings (lines 236, 243, 257, 287, 304, 312, 320, 328, 336, 344, 362, 377, 385, 393, 410, 420) - many of these should be `<h2>` to maintain proper hierarchy under the page's `<h1>`.

---

## Summary Table

| # | Issue | Location | Severity | Category |
|---|-------|----------|----------|----------|
| 1 | Obsolete IE meta tag | index.html:23 | LOW | Standards |
| 2 | Commented-out duplicate stylesheet link | index.html:40 | LOW | Code Quality |
| 3 | Commented-out duplicate script tag | index.html:527 | LOW | Code Quality |
| 4 | Commented-out HTML content | index.html:171,211 | LOW | Code Quality |
| 5 | CSS @import causes render-blocking chain | style.css:1 | MEDIUM | Performance |
| 6 | Unnecessary vendor-prefixed gradients (wrong cascade order) | style.css:846-849 | MEDIUM | Cross-Browser |
| 7 | -webkit-background-clip order (prefix after standard) | style.css:850-851 | LOW | Cross-Browser |
| 8 | Google Fonts using older v1 API in HTML | index.html:42-49 | MEDIUM | Performance |
| 9 | Missing -webkit-backdrop-filter for Safari | style.css:252,701 | HIGH | Cross-Browser |
| 10 | No Firefox scrollbar styling (standard properties missing) | style.css:225-241 | MEDIUM | Cross-Browser |
| 11 | Redundant type="text/javascript" | index.html:15,482,497 | LOW | Standards |
| 12 | Mixed font loading strategy (@import + link) | style.css:1, index.html:42-49 | MEDIUM | Performance |
| 13 | link elements inside body (invalid HTML5) | index.html:481,496 | HIGH | Standards/Validation |
| 14 | Duplicate Calendly scripts | index.html:482,497 | HIGH | Performance/Correctness |
| 15 | Heading order violation (h3 before h1) | index.html:130 | MEDIUM | Accessibility/SEO |

---

## Recommended Priority Order

1. **HIGH - Issues 9, 13, 14:** Fix Safari backdrop-filter, move link tags to head, remove duplicate Calendly resources
2. **MEDIUM - Issues 5, 6, 8, 10, 12, 15:** Consolidate font loading, fix gradient prefixes, add Firefox scrollbar support, fix heading hierarchy
3. **LOW - Issues 1, 2, 3, 4, 7, 11:** Remove dead code, obsolete meta tag, redundant type attributes
