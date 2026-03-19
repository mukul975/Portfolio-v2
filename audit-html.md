# HTML Audit Report: Portfolio-v2/index.html

**Auditor:** HTML Auditor Agent
**Date:** 2026-02-19
**File:** `D:/Portfolio-v2/index.html` (532 lines)

---

## Summary

The file has **27 issues** identified across severity levels:

| Severity | Count |
|----------|-------|
| Critical | 3     |
| Major    | 12    |
| Minor    | 12    |

---

## Issues

### 1. Commented-out duplicate stylesheet link

- **File:** `index.html`
- **Line:** 40
- **Severity:** Minor
- **Description:** Line 40 has a commented-out `<link rel="stylesheet" href="style.css">` immediately above the active identical link on line 41. This is dead code that clutters the `<head>`.
- **Suggested Fix:** Remove line 40 (`<!-- <link rel="stylesheet" href="style.css"> -->`).

---

### 2. `<title>` tag is not descriptive enough

- **File:** `index.html`
- **Line:** 37
- **Severity:** Major
- **Description:** The title tag reads `<title>Mahipal</title>`. This is too vague for SEO and accessibility. Screen readers and search engines rely on the title to describe the page.
- **Suggested Fix:** Change to something like `<title>Mahipal Jangra - Cybersecurity Researcher & Front-End Developer Portfolio</title>`.

---

### 3. Missing `<meta name="robots">` tag

- **File:** `index.html`
- **Line:** (absent, should be in `<head>` section, after line 25)
- **Severity:** Major
- **Description:** No `<meta name="robots">` tag is present. Search engines will use default behavior, but best practice is to explicitly declare indexing preferences.
- **Suggested Fix:** Add `<meta name="robots" content="index, follow">` inside the `<head>`.

---

### 4. Missing canonical `<link>` tag

- **File:** `index.html`
- **Line:** (absent, should be in `<head>` section)
- **Severity:** Major
- **Description:** There is no `<link rel="canonical" href="...">` tag. This can cause duplicate content issues if the site is accessible at multiple URLs (e.g., with and without trailing slash, www vs non-www).
- **Suggested Fix:** Add `<link rel="canonical" href="https://www.mahipal.engineer/">` inside the `<head>`.

---

### 5. `<h2>` used in header where `<h1>` would be more semantic (site name)

- **File:** `index.html`
- **Line:** 169
- **Severity:** Major
- **Description:** Line 169 uses `<h2>` for the greeting text in the hero section. The page's heading hierarchy is unclear -- there are multiple `<h1>` tags (lines 172, 177, 179, 212) but no single clear top-level heading identifying the page. Line 169's `<h2>` is used for a dynamic greeting, which is a secondary concern compared to the main heading.
- **Suggested Fix:** Ensure a single `<h1>` exists as the primary page heading (e.g., the site owner's name or main title). Demote other `<h1>` tags to `<h2>` or lower as appropriate to establish a correct heading hierarchy.

---

### 6. Multiple `<h1>` tags -- broken heading hierarchy

- **File:** `index.html`
- **Lines:** 172, 177, 179, 212
- **Severity:** Major
- **Description:** There are at least 4 `<h1>` elements on the page: "Cybersecurity Guardian / Front-End Maestro" (line 172), "2" (line 177), "6+" (line 179 as part of the stat display -- though this is inside `body-tail`), and "Who Am I?" (line 212). HTML best practice (and SEO guidance) is to have a single `<h1>` per page.
- **Suggested Fix:** Keep one `<h1>` for the page title. Convert others to `<h2>` or use `<span>` / `<p>` with CSS styling for visual effect (e.g., the stats "2" and "6+").

---

### 7. `<br>` tag used for spacing

- **File:** `index.html`
- **Line:** 168
- **Severity:** Minor
- **Description:** `</div><br>` on line 168 uses a `<br>` tag to create spacing between elements. `<br>` is for line breaks within inline text content, not for layout spacing.
- **Suggested Fix:** Remove the `<br>` tag and use CSS margin/padding on the `.developer-intro` div or the following `<h2>` to create the desired spacing.

---

### 8. Orphan/extra closing `</div>` tags in aboutme section

- **File:** `index.html`
- **Lines:** 227-228
- **Severity:** Critical
- **Description:** Lines 227 and 228 contain two closing `</div>` tags that do not match any opening `<div>`. The `aboutme` section's structure closes properly at lines 221-222. The extra `</div>` tags on lines 227-228 are orphans that break the DOM tree. These likely remain from a copy-paste of the `content-body` section structure.
- **Suggested Fix:** Remove the two orphan `</div>` tags on lines 227 and 228.

---

### 9. Calendly CSS linked twice

- **File:** `index.html`
- **Lines:** 481, 496
- **Severity:** Major
- **Description:** The Calendly widget CSS (`https://assets.calendly.com/assets/external/widget.css`) is loaded twice -- once for the "badge widget" block (line 481) and once for the "link widget" block (line 496). This causes a duplicate HTTP request and redundant stylesheet parsing.
- **Suggested Fix:** Remove the duplicate on line 496. Keep a single `<link>` for the Calendly CSS.

---

### 10. Calendly JS loaded twice

- **File:** `index.html`
- **Lines:** 482, 497
- **Severity:** Major
- **Description:** The Calendly widget JavaScript (`https://assets.calendly.com/assets/external/widget.js`) is loaded twice. This can cause double initialization, race conditions, or increased page load time.
- **Suggested Fix:** Remove the duplicate `<script>` tag on line 497. Keep a single script load on line 482.

---

### 11. `<link>` and `<script>` tags inside `<body>` (footer section)

- **File:** `index.html`
- **Lines:** 481, 482, 496, 497
- **Severity:** Major
- **Description:** `<link rel="stylesheet">` and external `<script>` tags for Calendly are placed inside the `<body>`, within the footer section. While browsers will parse them, `<link>` stylesheet tags belong in the `<head>`. Scripts can be in the body but stylesheets should not.
- **Suggested Fix:** Move the Calendly `<link rel="stylesheet">` to the `<head>` section. The `<script>` tags can remain at the bottom of the body or be moved to `<head>` with `defer`/`async`.

---

### 12. Form missing `action` attribute

- **File:** `index.html`
- **Line:** 447
- **Severity:** Major
- **Description:** The contact form `<form name="contactus" netlify method="POST">` has no `action` attribute. While Netlify Forms may handle this automatically during deployment, the form will not work outside Netlify (e.g., local testing or if deployed elsewhere). This is also invalid per the HTML spec when `method="POST"` is used.
- **Suggested Fix:** Add an explicit `action` attribute, e.g., `action="/success"` or `action="/"`. For Netlify, `action="/thank-you"` pointing to a success page is recommended.

---

### 13. Non-semantic `<section>` used for `<header>` and `<footer>`

- **File:** `index.html`
- **Lines:** 128, 445
- **Severity:** Major
- **Description:** The site header (line 128, `<section id="header">`) and footer (line 445, `<section id="footer">`) use generic `<section>` elements instead of semantic `<header>` and `<footer>` elements. This hurts accessibility -- assistive technologies use these landmarks to help users navigate.
- **Suggested Fix:** Replace `<section id="header">` with `<header id="header">` (and corresponding `</section>` with `</header>`). Replace `<section id="footer">` with `<footer id="footer">` (and corresponding `</section>` with `</footer>`).

---

### 14. Non-semantic `<section>` used for `<nav>`

- **File:** `index.html`
- **Lines:** 135-143
- **Severity:** Minor
- **Description:** The navbar menu container uses `<div>` and `<ul>` without a `<nav>` element. Screen readers and assistive technologies rely on `<nav>` to identify navigation landmarks.
- **Suggested Fix:** Wrap the navbar `<ul>` in a `<nav>` element, or replace the containing `<div class="navbar-menu-container">` with `<nav class="navbar-menu-container">`.

---

### 15. Missing ARIA labels on interactive elements

- **File:** `index.html`
- **Lines:** 132-134, 441-443
- **Severity:** Minor
- **Description:** The hamburger menu button (line 132) has no `aria-label`. The scroll-to-top button (line 441) also lacks an `aria-label`. These are icon-only buttons that have no visible text.
- **Suggested Fix:** Add `aria-label="Toggle menu"` to the menu button and `aria-label="Scroll to top"` to the scroll-to-top button.

---

### 16. Inline `style` attributes on sections

- **File:** `index.html`
- **Lines:** 233, 234-235, 285, 290, 375, 380, 445
- **Severity:** Minor
- **Description:** Multiple sections and divs use inline `style` attributes for layout (e.g., `style="background-color: #2d2e3273;"`, `style="display: flex; position: relative; ..."`, etc.). This makes the CSS harder to maintain, overrides stylesheet specificity, and mixes content with presentation.
- **Suggested Fix:** Move all inline styles to `style.css` using appropriate class selectors.

---

### 17. Empty `href` on Calendly anchor links

- **File:** `index.html`
- **Lines:** 174, 219, 498
- **Severity:** Minor
- **Description:** Multiple anchor tags use `href=""` with an `onclick` handler for Calendly popup. An empty `href` causes the browser to reload the current page if JavaScript fails. This is also a WCAG accessibility concern.
- **Suggested Fix:** Change `href=""` to `href="javascript:void(0)"` or better yet, use `href="https://calendly.com/mukuljangra5"` as a fallback for when JavaScript is disabled.

---

### 18. Font Awesome loaded as render-blocking script in `<head>`

- **File:** `index.html`
- **Line:** 38
- **Severity:** Minor
- **Description:** The Font Awesome kit (`https://kit.fontawesome.com/e674bba739.js`) is loaded via a `<script>` tag in the `<head>` without `async` or `defer`. However, looking more carefully, Font Awesome kit scripts auto-include async behavior. This is a low-severity observation.
- **Suggested Fix:** Verify that the Font Awesome kit script is non-blocking. If not, add `defer` attribute.

---

### 19. Commented-out script tag for `script.js`

- **File:** `index.html`
- **Line:** 527
- **Severity:** Minor
- **Description:** `<!-- <script src="script.js"></script> -->` is commented-out dead code directly above the active `<script src="script.js"></script>` on line 528. Same pattern as the stylesheet on line 40.
- **Suggested Fix:** Remove line 527.

---

### 20. Project cards missing links for several projects

- **File:** `index.html`
- **Lines:** 326-333 (Haze Removal), 334-341 (EmailGuard), 342-349 (Multicast), 360-368 (Pack India)
- **Severity:** Major
- **Description:** Four project cards in the "Latest Projects" section have no links at all:
  - "An Enhanced Haze Removal" (line 326) -- has no link, though the same project in the Research section (line 253) links to Springer.
  - "EmailGuard" (line 334) -- no link.
  - "Multicast Wireless Routing Protocol" (line 342) -- no link.
  - "Pack India Packers and Movers" (line 360) -- no link.
  These project cards end with just `</p>` and no anchor tag, unlike the other cards which have "Read More" or external links.
- **Suggested Fix:** Add appropriate links (GitHub repos, live demos, or publication links) to each card. If no link exists, consider adding a placeholder indicating "Source code available upon request" or similar.

---

### 21. `<br>` tags used for content formatting inside paragraphs

- **File:** `index.html`
- **Lines:** 172, 178, 213-217, 247-251
- **Severity:** Minor
- **Description:** Multiple `<br>` tags are used inside `<p>` elements and `<h1>` elements to create multi-line layouts. While `<br>` is valid inside `<p>`, using it extensively for layout purposes (especially in the about-me and research descriptions) makes the content harder to maintain and style responsively.
- **Suggested Fix:** Consider using separate `<p>` elements for distinct paragraphs, or `<ul>/<li>` for list-like content (particularly in research card descriptions).

---

### 22. `window.onload` will be overwritten

- **File:** `index.html`
- **Lines:** 484-492
- **Severity:** Critical
- **Description:** The Calendly initialization uses `window.onload = function() {...}`. If any other script also assigns `window.onload`, this handler will be overwritten (or it will overwrite others). The `script.js` file or other libraries may also use `window.onload`.
- **Suggested Fix:** Use `window.addEventListener('load', function() {...})` instead of `window.onload`.

---

### 23. Div soup -- excessive non-semantic div nesting

- **File:** `index.html`
- **Lines:** 183-193, 198-208, 274-280, 291-298, 428-435
- **Severity:** Minor
- **Description:** Several areas use deeply nested `<div>` structures (`div > div.container > div.svg-animation > img`) that could be simplified. The `body-part-2 > container > svg-animation` pattern is repeated 5 times with identical structure.
- **Suggested Fix:** Consider using `<figure>` for image wrappers. Reduce nesting where container divs serve no structural or styling purpose.

---

### 24. Missing `alt` text quality on images

- **File:** `index.html`
- **Lines:** 187, 202, 277, 295, 432
- **Severity:** Minor
- **Description:** Image `alt` attributes are overly generic: "Cyber SVG", "Who SVG", "Research SVG", "Project SVG", "Skill SVG". These do not meaningfully describe the image content for screen reader users.
- **Suggested Fix:** Use descriptive alt text, e.g., `alt="Illustration of cybersecurity concepts"`, `alt="Illustration representing the about me section"`, etc.

---

### 25. `<h6>` used for location in footer

- **File:** `index.html`
- **Line:** 478
- **Severity:** Minor
- **Description:** `<h6>Berlin, Deustchland </h6>` uses an `<h6>` heading for plain content text. Headings should reflect document structure, not be used for styling. Also note the typo: "Deustchland" should be "Deutschland".
- **Suggested Fix:** Use `<p>` or `<span>` for this text. Fix the typo.

---

### 26. Duplicate Calendly widget blocks (badge + link) create redundancy

- **File:** `index.html`
- **Lines:** 480-498
- **Severity:** Critical
- **Description:** Two separate Calendly widget blocks are present in the footer: a "badge widget" (lines 480-494) and a "link widget" (lines 495-499). Both load the same CSS and JS files, resulting in 4 redundant resource loads (2 CSS + 2 JS). The badge widget auto-creates a floating button, while the link widget provides an inline link. If both are needed, they should share a single CSS/JS load.
- **Suggested Fix:** Remove the duplicate CSS and JS loads. Load Calendly resources once (preferably in `<head>` for CSS, and once before use for JS). Keep both widget initialization blocks if both are needed, but deduplicate the resource loading.

---

### 27. `<meta http-equiv="X-UA-Compatible" content="IE=edge">` is obsolete

- **File:** `index.html`
- **Line:** 23
- **Severity:** Minor
- **Description:** This meta tag was used to force Internet Explorer to use the latest rendering engine. IE is no longer supported (end-of-life June 2022). This tag is now dead weight.
- **Suggested Fix:** Remove line 23.

---

## Priority Remediation Order

1. **Critical:** Fix orphan `</div>` tags (issue #8) -- broken DOM structure
2. **Critical:** Fix `window.onload` overwrite risk (issue #22) -- JavaScript reliability
3. **Critical:** Deduplicate Calendly resource loading (issue #26) -- performance and correctness
4. **Major:** Fix heading hierarchy (issues #5, #6) -- SEO and accessibility
5. **Major:** Add missing meta tags (issues #2, #3, #4) -- SEO
6. **Major:** Use semantic HTML elements (issues #13, #14) -- accessibility
7. **Major:** Move `<link>` tags to `<head>` (issue #11) -- HTML validity
8. **Major:** Add form `action` attribute (issue #12) -- form reliability
9. **Major:** Add links to project cards (issue #20) -- user experience
10. **Minor:** Clean up dead code, inline styles, and other minor issues (remaining)
