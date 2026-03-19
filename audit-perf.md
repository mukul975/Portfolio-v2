# Performance Audit Report: Portfolio-v2

**Date:** 2026-02-19
**Auditor:** Automated Performance Audit Agent
**Files analyzed:** `index.html`, `style.css`, `script.js`, `assets/`

---

## Summary

16 performance issues identified across render-blocking resources, network optimization, paint performance, and resource loading. The site loads **8 separate Google Fonts requests**, **duplicate Calendly widget resources**, and lacks critical preconnect/preload hints. Several issues are high-severity and directly impact First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS).

| Severity | Count |
|----------|-------|
| Critical | 4     |
| High     | 6     |
| Medium   | 4     |
| Low      | 2     |

---

## Issue #1: 8 Separate Google Fonts Requests

**Category:** Render-blocking / Network
**Severity:** CRITICAL
**Lines:** `index.html:42-49`

**Description:**
Eight individual `<link>` tags each make a separate render-blocking HTTP request to `fonts.googleapis.com`:

1. Montserrat (700, 900)
2. Roboto (400, 500, 700)
3. Orbitron (400, 700)
4. Share Tech Mono
5. Audiowide
6. VT323
7. Press Start 2P
8. Russo One

Additionally, `style.css:1` uses a CSS `@import` for Raleway and Source Code Pro (see Issue #11), making a total of **9 external font requests**.

**Impact:**
- Each request adds ~100-300ms of render-blocking time.
- Combined, these can add 800ms-2s+ to First Contentful Paint.
- Many fonts appear to be unused or barely used (VT323 via `.retro` class, Press Start 2P via `.pixel` class, Audiowide via `.creative` class). No HTML elements use these classes directly.
- The browser must download, parse, and apply all 9 font families before rendering text.

**Fix:**
1. Combine all Google Fonts into a single `<link>` request using the pipe-separated family syntax:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Roboto:wght@400;500;700&family=Orbitron:wght@400;700&family=Share+Tech+Mono&family=Audiowide&family=Raleway:wght@100..900&family=Source+Code+Pro:wght@200..900&display=swap" rel="stylesheet">
   ```
2. Audit font usage -- remove unused fonts (VT323, Press Start 2P, Russo One are likely unused in production).
3. Add `font-display: swap` (already present via `&display=swap` parameter).
4. Remove the CSS `@import` from `style.css` and merge into the single HTML `<link>`.

---

## Issue #2: FontAwesome Kit Loaded via External Script (Render-Blocking)

**Category:** Render-blocking
**Severity:** HIGH
**Line:** `index.html:38`

**Description:**
```html
<script src="https://kit.fontawesome.com/e674bba739.js" crossorigin="anonymous"></script>
```
This `<script>` tag in the `<head>` has no `async` or `defer` attribute. It is **parser-blocking** -- the browser stops parsing the HTML document until this script is fully downloaded and executed.

**Impact:**
- Blocks HTML parsing and delays FCP by the full download + execution time of the FontAwesome kit (~50-200ms depending on network).
- FontAwesome kits dynamically inject CSS, adding further render-blocking work.

**Fix:**
Add `defer` attribute to the script tag:
```html
<script defer src="https://kit.fontawesome.com/e674bba739.js" crossorigin="anonymous"></script>
```
Alternatively, switch to a self-hosted FontAwesome CSS subset containing only the icons actually used (fa-brands: linkedin-in, github, instagram, envelope; fa-solid: flask, camera, spider, desktop, wand-magic-sparkles, terminal, code, arrow-up, bars).

---

## Issue #3: anime.js Loaded via CDN Without SRI Hash

**Category:** Security / Network
**Severity:** MEDIUM
**Line:** `index.html:526`

**Description:**
```html
<script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>
```
The anime.js library is loaded from jsDelivr CDN without a Subresource Integrity (SRI) hash. While positioned at the bottom of `<body>` (good for non-blocking), it lacks SRI validation.

**Impact:**
- If the CDN is compromised, malicious code could be injected.
- No integrity verification means the browser accepts any content served from that URL.
- Not a direct performance issue, but a best-practice concern for security and caching.

**Fix:**
Add an `integrity` attribute with the correct SHA-384 hash and a `crossorigin` attribute:
```html
<script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"
        integrity="sha384-<correct-hash>"
        crossorigin="anonymous"></script>
```

---

## Issue #4: Calendly Widget CSS Loaded TWICE

**Category:** Network / Redundant resource
**Severity:** HIGH
**Lines:** `index.html:481` and `index.html:496`

**Description:**
```html
<!-- Line 481 -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
<!-- Line 496 -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
```
The same Calendly CSS stylesheet is loaded twice -- once for the "badge widget" and once for the "link widget".

**Impact:**
- Duplicate HTTP request (even if cached, the browser still processes the `<link>` element and parses the CSS again).
- Adds unnecessary bytes to parse and apply.
- Both are placed inside `<section id="footer">`, outside `<head>`, which is invalid HTML and can trigger additional layout recalculations.

**Fix:**
Remove the duplicate on line 496. Keep only one instance, and move it to the `<head>`:
```html
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
```

---

## Issue #5: Calendly Widget JS Loaded TWICE

**Category:** Network / Redundant resource
**Severity:** HIGH
**Lines:** `index.html:482` and `index.html:497`

**Description:**
```html
<!-- Line 482 -->
<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
<!-- Line 497 -->
<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
```
The Calendly widget JavaScript is loaded twice, once for each widget embed block.

**Impact:**
- Duplicate script download and execution.
- Potential race condition or double initialization of the Calendly widget.
- Wasted bandwidth and CPU time.

**Fix:**
Remove the duplicate on line 497. Keep only one instance. Move it before the closing `</body>` tag or to `<head>` with `async`:
```html
<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
```

---

## Issue #6: Google Analytics and Clarity Both Loaded Synchronously in `<head>`

**Category:** Render-blocking / Network
**Severity:** HIGH
**Lines:** `index.html:5-21`

**Description:**
- **Google Analytics (gtag.js):** Lines 7-14. The external script on line 7 has `async`, but the inline configuration script on lines 8-14 is synchronous.
- **Microsoft Clarity:** Lines 15-21. The inline script is synchronous and dynamically creates an async script tag. However, the inline script itself blocks parsing while it executes.

Both are placed at the very top of `<head>`, before `<meta charset>` and `<meta viewport>`.

**Impact:**
- The inline scripts execute synchronously, blocking the parser.
- Placing analytics before `<meta charset>` can cause encoding issues on some browsers.
- Both scripts compete for network bandwidth during the critical rendering path.

**Fix:**
1. Move `<meta charset>` and `<meta viewport>` to be the very first elements in `<head>`.
2. Move both analytics scripts to the bottom of `<body>`, or use `defer`/dynamic loading.
3. Alternatively, use Google Tag Manager to manage both gtag and Clarity with a single script.

---

## Issue #7: `email-background.png` Loaded in CSS Without Preload Hint

**Category:** Network / LCP
**Severity:** MEDIUM
**Line:** `style.css:702`

**Description:**
```css
background-image: url(assets/email-background.png);
```
This background image for the email form section is discovered late -- only after the browser has downloaded and parsed the CSS file, built the CSSOM, and started layout. There is no `<link rel="preload">` hint to help the browser discover this image earlier.

**Impact:**
- Late discovery means the image download starts much later than it could.
- If the footer section is visible on initial load (unlikely on desktop, but possible on short viewports or after scroll), the user sees a blank area until the image loads.

**Fix:**
Add a preload hint in the HTML `<head>`:
```html
<link rel="preload" href="assets/email-background.png" as="image">
```
Or, since this is a below-the-fold image, consider lazy loading it via JavaScript instead.

---

## Issue #8: PNG Image Used Where WebP/AVIF Would Be Smaller; Redundant JPG File Exists

**Category:** Network / Asset optimization
**Severity:** HIGH
**Files:** `assets/email-background.png`, `assets/email-background.jpg`

**Description:**
Both `email-background.png` and `email-background.jpg` exist in the `assets/` directory. The CSS references the PNG version. PNG is typically larger than optimized JPG, and both are significantly larger than modern formats like WebP or AVIF.

**Impact:**
- PNG files for photographic content can be 3-10x larger than WebP equivalents.
- Unnecessary bytes transferred over the network, increasing load time.
- The redundant JPG file wastes repository/deployment space.

**Fix:**
1. Convert `email-background.png` to WebP format using a tool like `cwebp`.
2. Update the CSS to reference the WebP file:
   ```css
   background-image: url(assets/email-background.webp);
   ```
3. For broader browser support, use the `image-set()` CSS function:
   ```css
   background-image: image-set(
     url(assets/email-background.avif) type("image/avif"),
     url(assets/email-background.webp) type("image/webp"),
     url(assets/email-background.png) type("image/png")
   );
   ```
4. Remove the unused `email-background.jpg` file.

---

## Issue #9: SVG Files Loaded as `<img>` Tags Instead of Inline SVG

**Category:** Network / Rendering efficiency
**Severity:** LOW
**Lines:** `index.html:187, 202, 277, 295, 433`

**Description:**
Five SVG files are loaded via `<img>` tags:
```html
<img src="assets/cyber.svg" alt="Cyber SVG" class="responsive-svg">
<img src="assets/who.svg" alt="Who SVG" class="responsive-svg">
<img src="assets/research.svg" alt="Research SVG" class="responsive-svg">
<img src="assets/project.svg" alt="Project SVG" class="responsive-svg">
<img src="assets/skill.svg" alt="Skill SVG" class="responsive-svg">
```

**Impact:**
- Each SVG loaded via `<img>` is a separate HTTP request.
- SVGs loaded as `<img>` cannot be styled with CSS or animated with JavaScript.
- Inline SVGs would benefit from the document cache and allow CSS-based animations.
- However, inline SVGs increase HTML document size, so the tradeoff depends on SVG file sizes.

**Fix:**
For the hero SVG (`cyber.svg`) that is above the fold and benefits from immediate rendering, consider inlining it. For below-the-fold SVGs, keep as `<img>` but add `loading="lazy"` (see Issue #10). If animations are not needed, keeping them as `<img>` is acceptable.

---

## Issue #10: No `loading="lazy"` on SVG Images Below the Fold

**Category:** Network / Resource prioritization
**Severity:** MEDIUM
**Lines:** `index.html:202, 277, 295, 433`

**Description:**
Four of the five SVG images are below the fold but lack the `loading="lazy"` attribute:
- `assets/who.svg` (About section)
- `assets/research.svg` (Research section)
- `assets/project.svg` (Projects section)
- `assets/skill.svg` (Skills section)

Only `assets/cyber.svg` (hero section) should load eagerly.

**Impact:**
- All five SVGs are fetched immediately on page load, competing for bandwidth with critical resources like fonts and CSS.
- Adds unnecessary network contention during the critical rendering path.

**Fix:**
Add `loading="lazy"` to below-the-fold images:
```html
<img src="assets/who.svg" alt="Who SVG" class="responsive-svg" loading="lazy">
<img src="assets/research.svg" alt="Research SVG" class="responsive-svg" loading="lazy">
<img src="assets/project.svg" alt="Project SVG" class="responsive-svg" loading="lazy">
<img src="assets/skill.svg" alt="Skill SVG" class="responsive-svg" loading="lazy">
```

---

## Issue #11: CSS `@import` Causes Additional Render-Blocking Request

**Category:** Render-blocking
**Severity:** CRITICAL
**Line:** `style.css:1`

**Description:**
```css
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&display=swap");
```
CSS `@import` creates a waterfall: the browser must first download `style.css`, then parse it, then discover and download the imported Google Fonts CSS, then download the actual font files. This is a **serial chain of 3+ requests**.

**Impact:**
- Adds a full round-trip latency to the critical rendering path.
- The browser cannot discover the imported resource until the parent CSS is fully downloaded and parsed.
- This is one of the most impactful render-blocking anti-patterns.

**Fix:**
Replace the `@import` with a `<link>` tag in HTML `<head>`, placed before the `style.css` link so both can be fetched in parallel:
```html
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
```
Then remove the `@import` line from `style.css`.

---

## Issue #12: Missing `<link rel="preconnect">` for External Domains

**Category:** Network / DNS + TLS latency
**Severity:** CRITICAL
**Location:** `index.html` `<head>` section (missing)

**Description:**
The page loads resources from multiple external domains, but there are no `<link rel="preconnect">` hints to establish early connections:

| Domain | Used For |
|--------|----------|
| `fonts.googleapis.com` | Google Fonts CSS |
| `fonts.gstatic.com` | Google Fonts files |
| `kit.fontawesome.com` | FontAwesome kit |
| `ka-f.fontawesome.com` | FontAwesome CDN (loaded by kit) |
| `assets.calendly.com` | Calendly widget |
| `cdn.jsdelivr.net` | anime.js |
| `www.googletagmanager.com` | Google Analytics |
| `www.clarity.ms` | Microsoft Clarity |

**Impact:**
- Each new domain requires DNS lookup (~20-120ms), TCP connection (~20-100ms), and TLS handshake (~30-150ms).
- Without preconnect, these costs are paid sequentially when resources are first requested.
- For Google Fonts alone, both `fonts.googleapis.com` and `fonts.gstatic.com` need connections.

**Fix:**
Add preconnect hints at the top of `<head>`, before any resource loads:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://kit.fontawesome.com" crossorigin>
<link rel="preconnect" href="https://assets.calendly.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
```

---

## Issue #13: Missing `<link rel="dns-prefetch">` for External Domains

**Category:** Network / DNS latency
**Severity:** MEDIUM
**Location:** `index.html` `<head>` section (missing)

**Description:**
Beyond `preconnect`, there are no `dns-prefetch` hints for any of the external domains. `dns-prefetch` is a lighter-weight alternative to `preconnect` and has wider browser support.

**Impact:**
- DNS resolution can take 20-120ms per domain.
- For domains where a full `preconnect` is too aggressive (e.g., analytics domains that load later), `dns-prefetch` is still beneficial.

**Fix:**
Add `dns-prefetch` as a fallback for `preconnect`, and for secondary domains:
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<link rel="dns-prefetch" href="https://kit.fontawesome.com">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://www.clarity.ms">
<link rel="dns-prefetch" href="https://assets.calendly.com">
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
```

---

## Issue #14: No `<link rel="preload">` for Critical Fonts (CyberAlert, Raleway)

**Category:** Network / Font loading
**Severity:** HIGH
**Location:** `index.html` `<head>` section (missing)

**Description:**
The custom `CyberAlert` font (defined in `style.css:26-32`) and `Raleway` (the primary body font) are critical for initial render but are not preloaded. The browser discovers them only after downloading and parsing the CSS.

Font files referenced:
- `assets/fonts/CyberAlert.woff`
- `assets/fonts/CyberAlert.otf`
- Raleway (via Google Fonts, discovered after CSS @import chain)

**Impact:**
- Font files are discovered late in the loading waterfall.
- Users see a Flash of Unstyled Text (FOUT) or Flash of Invisible Text (FOIT) until fonts load.
- CyberAlert is used for the hero greeting text, making it above-the-fold critical.

**Fix:**
Preload the critical CyberAlert font:
```html
<link rel="preload" href="assets/fonts/CyberAlert.woff" as="font" type="font/woff" crossorigin>
```
For Raleway, fixing the `@import` chain (Issue #11) will help. Additionally, add `font-display: swap` to the `@font-face` declaration for CyberAlert:
```css
@font-face {
  font-family: 'CyberAlert';
  src: url('assets/fonts/CyberAlert.woff') format('woff'),
       url('assets/fonts/CyberAlert.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

---

## Issue #15: `glow` Animation on Announcement Banner Runs Infinitely -- Causes Constant Repaints

**Category:** Paint / CPU
**Severity:** MEDIUM (LOW on desktop, MEDIUM on mobile)
**Line:** `style.css:66`

**Description:**
```css
animation: glow 1s infinite alternate;
```
The `glow` animation continuously changes `box-shadow` values every second, forever. Additionally, the `moveText` animation (`style.css:82-83`) uses `transform: translateX()` to scroll text infinitely, and the `pulse` animation (`style.css:112-113`) changes `opacity` infinitely.

**Impact:**
- `box-shadow` changes trigger **paint** operations on every frame (not compositable by the GPU).
- The browser must repaint the banner area ~60 times per second.
- On mobile devices, this constant repainting drains battery and can cause jank.
- Combined with `moveText` and `pulse`, three infinite animations run simultaneously on the banner.

**Fix:**
1. Replace `box-shadow` animation with a `filter: drop-shadow()` or use `will-change: box-shadow` to hint GPU compositing.
2. Better: use a CSS `filter` or pseudo-element with `opacity` animation (compositor-friendly):
   ```css
   #announcement-banner {
     position: relative;
   }
   #announcement-banner::after {
     content: '';
     position: absolute;
     inset: 0;
     box-shadow: 0 0 20px #00b840, 0 0 30px #00b840, 0 0 40px #00b840;
     animation: glow 1s infinite alternate;
     opacity: 1;
     pointer-events: none;
   }
   @keyframes glow {
     from { opacity: 0.5; }
     to { opacity: 1; }
   }
   ```
3. Consider reducing the animation to `animation-iteration-count: 3` or using `prefers-reduced-motion` media query:
   ```css
   @media (prefers-reduced-motion: reduce) {
     #announcement-banner { animation: none; }
     #announcement-banner p { animation: none; }
     .cta-text { animation: none; }
   }
   ```

---

## Issue #16: `window.onload` Used for Calendly Badge Init -- Can Delay Interactive

**Category:** Interactivity / TTI
**Severity:** LOW
**Lines:** `index.html:484-492`

**Description:**
```javascript
window.onload = function() {
  Calendly.initBadgeWidget({ ... });
}
```
`window.onload` fires only after **all** resources (images, scripts, stylesheets, fonts, iframes) have finished loading. This delays the Calendly badge initialization until everything else is done.

**Impact:**
- If any resource is slow to load, the Calendly badge won't appear until it finishes.
- `window.onload` is a single assignment -- if any other script also uses `window.onload`, one will overwrite the other.
- Minor impact since Calendly badge is not critical path, but it's a fragile pattern.

**Fix:**
Use `addEventListener` instead of `window.onload` assignment, and consider `DOMContentLoaded` if the Calendly script is loaded with `async`:
```javascript
window.addEventListener('load', function() {
  Calendly.initBadgeWidget({ ... });
});
```
Or, if the Calendly widget script supports it, initialize after the script loads using its own callback mechanism.

---

## Priority Matrix

| Priority | Issue # | Fix Effort | Performance Gain |
|----------|---------|------------|------------------|
| 1        | #11     | Low        | Very High (eliminates waterfall) |
| 2        | #1      | Low        | Very High (reduce 9 requests to 1) |
| 3        | #12     | Low        | High (saves 200-500ms on cold load) |
| 4        | #4, #5  | Low        | High (eliminate duplicate downloads) |
| 5        | #6      | Low        | Medium-High (unblock parser) |
| 6        | #2      | Low        | Medium-High (unblock parser) |
| 7        | #14     | Low        | Medium (reduce FOUT/FOIT) |
| 8        | #10     | Low        | Medium (defer below-fold images) |
| 9        | #8      | Medium     | Medium (reduce image bytes) |
| 10       | #13     | Low        | Low-Medium (DNS savings) |
| 11       | #15     | Medium     | Low-Medium (reduce repaints) |
| 12       | #7      | Low        | Low (preload below-fold image) |
| 13       | #3      | Low        | None (security only) |
| 14       | #9      | High       | Low (tradeoff dependent) |
| 15       | #16     | Low        | Low (robustness improvement) |

---

## Estimated Impact

Fixing issues #1, #2, #4, #5, #11, and #12 alone (all low-effort) could improve:
- **First Contentful Paint (FCP):** by 1-3 seconds
- **Largest Contentful Paint (LCP):** by 0.5-1.5 seconds
- **Total Blocking Time (TBT):** by 200-500ms
- **Total network requests:** reduced by ~12 (8 font requests consolidated to 1, 2 duplicate Calendly removed, @import eliminated)
