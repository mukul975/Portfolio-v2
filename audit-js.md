# JavaScript Quality Audit Report

**File:** `D:/Portfolio-v2/script.js` and inline scripts in `D:/Portfolio-v2/index.html`
**Date:** 2026-02-19
**Auditor:** JS Quality Auditor Agent

---

## Summary

12 issues identified across `script.js` (131 lines) and inline `<script>` blocks in `index.html`. Issues range from potential memory leaks and scroll performance problems to UX gaps and race conditions with external library loading.

| Severity   | Count |
|------------|-------|
| High       | 3     |
| Medium     | 5     |
| Low        | 4     |

---

## Issue 1: `scrollToTop()` defined as global function outside DOMContentLoaded

**Location:** `script.js:124-130`
**Type:** Bug (minor)
**Severity:** Low

**Description:**
`scrollToTop()` is defined at module scope (outside the `DOMContentLoaded` listener) as a global function. The scroll-to-top button in `index.html:441` invokes it via `onclick="scrollToTop()"`. While this works because inline `onclick` attributes evaluate in global scope, it pollutes the global namespace and could be overwritten by any other script defining a function with the same name.

**Fix:**
Move the scroll-to-top logic into the `DOMContentLoaded` block and attach the handler programmatically instead of using an inline `onclick`:

```js
// Inside DOMContentLoaded:
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
```

Remove `onclick="scrollToTop()"` from `index.html:441`.

---

## Issue 2: `window.onload` overwrites any previous onload handler

**Location:** `index.html:484-492` (inline `<script>`)
**Type:** Bug
**Severity:** High

**Description:**
The Calendly badge widget initialization uses `window.onload = function() { ... }`. This is a direct property assignment, meaning if any other script (Google Analytics, Clarity, or a future addition) also assigns `window.onload`, whichever runs last wins and the others are silently discarded. Google Analytics and Clarity currently use their own async patterns, so this works today, but it is fragile.

Additionally, `window.onload` fires only after **all** resources (images, stylesheets, iframes, SVGs) have finished loading. On a page with multiple SVG images, external fonts, and the Calendly widget CSS/JS loaded async, this could delay the badge widget initialization significantly on slow connections.

**Fix:**
Replace `window.onload = function()` with `addEventListener`:

```js
window.addEventListener('load', function() {
    Calendly.initBadgeWidget({ ... });
});
```

---

## Issue 3: Scroll spy default highlights first nav item even when not scrolled

**Location:** `script.js:28-47`
**Type:** Bug
**Severity:** Medium

**Description:**
In `improvedSetActiveLink()`, `closestIndex` is initialized to `0`. The loop only updates `closestIndex` when `rect.top <= 100`. On a fresh page load (not scrolled), no section will have `rect.top <= 100` (except possibly the first section if it starts near the top), so `closestIndex` stays `0` and the first nav link ("About") is always marked as active. This is incorrect if the page is loaded with the viewport at the very top where the hero section (`#content-body`) is visible, not the "About" section.

**Fix:**
Initialize `closestIndex` to `-1` and only apply the active class when a valid section was found:

```js
function improvedSetActiveLink() {
    let closestIndex = -1;
    let minDistance = Infinity;
    sections.forEach((section, i) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - 80);
        if (rect.top <= 100 && distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    });
    navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === closestIndex);
    });
}
```

---

## Issue 4: No null check on sections array elements before calling `getBoundingClientRect`

**Location:** `script.js:25, 31-33`
**Type:** Bug
**Severity:** Medium

**Description:**
`sections` is built by mapping nav link `href` attributes through `document.querySelector()`. If any `href` value does not match a real element ID on the page, `querySelector` returns `null`. While the current loop on line 31 does check `if (!section) return;`, the `sections` array itself contains `null` entries. This is handled correctly in the current code via the guard clause, but it would silently hide mismatches between navigation links and section IDs with no warning for developers.

**Fix:**
Add a console warning during development so mismatched nav links are immediately visible:

```js
const sections = Array.from(navLinks).map(link => {
    const selector = link.getAttribute('href');
    const section = document.querySelector(selector);
    if (!section) {
        console.warn(`Scroll spy: No element found for nav link href="${selector}"`);
    }
    return section;
});
```

---

## Issue 5: Duplicate `scroll` event listeners instead of combined handler

**Location:** `script.js:48` and `script.js:55`
**Type:** Performance
**Severity:** Low

**Description:**
Two separate `window.addEventListener('scroll', ...)` calls are registered:
1. Line 48: scroll spy (`improvedSetActiveLink`)
2. Line 55: scroll-to-top button visibility toggle

Each scroll event fires both callbacks independently. While modern browsers batch these, combining them into a single handler is cleaner and makes the scroll budget easier to reason about.

**Fix:**
Combine into a single scroll handler:

```js
window.addEventListener('scroll', function() {
    improvedSetActiveLink();
    if (scrollToTopBtn) {
        scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    }
}, { passive: true });
```

---

## Issue 6: Greeting animation uses recursive `setTimeout` with no cancellation mechanism -- memory leak

**Location:** `script.js:114-116`
**Type:** Memory
**Severity:** High

**Description:**
The greeting animation calls `setTimeout(() => animateGreeting(greetings[greetIndex]), 2000)` inside the `complete` callback of `anime()`. This creates an infinite recursive cycle: animation completes -> setTimeout -> new animation -> completes -> setTimeout -> ... forever.

There is no way to cancel this loop. If the page is a single-page application or if a future version adds page transitions, the animation continues running in the background, creating DOM elements via `greetingText.innerHTML` manipulation and scheduling new anime instances indefinitely. On long-running sessions (e.g., a user leaves the tab open for hours), this accumulates timer references and DOM operations.

**Fix:**
Store the timeout ID and provide a cleanup mechanism. Also use `requestAnimationFrame` awareness or `document.visibilitychange` to pause when the tab is not visible:

```js
let greetingTimer = null;

function animateGreeting(text) {
    // ... existing DOM setup ...
    anime({
        // ... existing config ...
        complete: () => {
            greetIndex = (greetIndex + 1) % greetings.length;
            greetingTimer = setTimeout(() => animateGreeting(greetings[greetIndex]), 2000);
        }
    });
}

// Pause when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden && greetingTimer) {
        clearTimeout(greetingTimer);
        greetingTimer = null;
    } else if (!document.hidden && !greetingTimer) {
        greetingTimer = setTimeout(() => animateGreeting(greetings[greetIndex]), 2000);
    }
});

animateGreeting(greetings[greetIndex]);
```

---

## Issue 7: No fallback if `anime.js` fails to load

**Location:** `script.js:71`
**Type:** Bug
**Severity:** Medium

**Description:**
The greeting animation is wrapped in `if (window.anime) { ... }`. If anime.js fails to load (CDN down, ad blocker, network error), the `#greetingText` element retains its static HTML content ("Stay safe from cyber" from `index.html:169`), which is acceptable as a basic fallback. However, there is no indication to the developer that anime.js failed, and the text never changes from the initial static value.

More critically, `anime.js` is loaded at `index.html:526` (just before `script.js` on line 528). Since `script.js` uses `DOMContentLoaded`, and anime.js is loaded with a regular (non-async, non-defer) `<script>` tag before `script.js`, anime.js should always be available when `DOMContentLoaded` fires. But if someone adds `async` or `defer` to the anime.js script tag in the future, the `if (window.anime)` check would silently skip the animation.

**Fix:**
Add a visible fallback or console warning:

```js
if (window.anime) {
    // ... animation code ...
} else {
    console.warn('anime.js not loaded - greeting animation disabled');
    // Optionally: cycle greetings with simple CSS transitions as fallback
}
```

---

## Issue 8: Clicking outside a card does not deactivate the active card

**Location:** `script.js:5-9`
**Type:** UX
**Severity:** Low

**Description:**
When a `.design-card` is clicked, it gets the `active` class and all other cards lose it. However, clicking anywhere outside a card (e.g., on the background, another section, or whitespace) does not remove the `active` class from the currently active card. The card stays in its expanded/highlighted state until the user clicks a different card.

**Fix:**
Add a document-level click listener that deactivates cards when clicking outside:

```js
document.addEventListener('click', function(e) {
    if (!e.target.closest('.design-card')) {
        document.querySelectorAll('.design-card').forEach(c => c.classList.remove('active'));
    }
});
```

---

## Issue 9: Mobile menu does not close when a nav link is clicked

**Location:** `script.js:12-21` and `script.js:63-68`
**Type:** UX
**Severity:** Medium

**Description:**
The mobile menu opens/closes when the hamburger button (`#menu-toggle`) is clicked. However, when a user clicks a nav link inside the mobile menu (lines 63-68), the menu stays open. The user must manually tap the hamburger button again to close it. This is a common mobile UX anti-pattern.

**Fix:**
Close the mobile menu when a nav link is clicked:

```js
navLinks.forEach((link, i) => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        // Close mobile menu
        if (navbarMenuContainer) navbarMenuContainer.classList.remove('active');
        if (socialMediaContainer) socialMediaContainer.classList.remove('active');
    });
});
```

---

## Issue 10: Missing `{ passive: true }` on scroll event listeners

**Location:** `script.js:48` and `script.js:55`
**Type:** Performance
**Severity:** Medium

**Description:**
Both `window.addEventListener('scroll', ...)` calls do not specify `{ passive: true }`. Scroll event listeners that do not call `preventDefault()` should be marked as passive so the browser knows it can safely composite scroll frames without waiting for JavaScript to execute. Without this, browsers may delay scroll rendering to check if the handler calls `preventDefault()`, causing janky scrolling on mobile devices.

Neither handler calls `preventDefault()`, so both are safe to mark as passive.

**Fix:**
Add `{ passive: true }` option to both scroll listeners:

```js
window.addEventListener('scroll', improvedSetActiveLink, { passive: true });

window.addEventListener('scroll', function() {
    // scroll-to-top toggle
}, { passive: true });
```

---

## Issue 11: Calendly widget.js loaded twice and badge may not initialize on slow connections

**Location:** `index.html:482` and `index.html:497`
**Type:** Performance / Bug
**Severity:** Low

**Description:**
The Calendly `widget.css` is included twice (lines 481 and 496) and `widget.js` is included twice (lines 482 and 497), both with `async`. While browsers may de-duplicate identical requests via cache, this is wasteful and can cause double initialization in edge cases.

Additionally, `window.onload` (line 484) fires after all resources finish loading. If the Calendly `widget.js` is loaded with `async`, there is a race condition: `window.onload` could fire before `widget.js` has finished loading and executing, meaning `Calendly` is not yet defined when `initBadgeWidget` is called. This would throw a `ReferenceError`.

**Fix:**
1. Remove the duplicate `<link>` and `<script>` tags (lines 496-497).
2. Check for `Calendly` existence before calling:

```js
window.addEventListener('load', function() {
    if (typeof Calendly !== 'undefined') {
        Calendly.initBadgeWidget({ ... });
    } else {
        console.warn('Calendly widget.js not loaded');
    }
});
```

---

## Issue 12: Race condition between anime.js loading and DOMContentLoaded

**Location:** `index.html:526-528`, `script.js:71`
**Type:** Bug
**Severity:** High

**Description:**
The loading order in `index.html` is:

```
Line 526: <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>
Line 528: <script src="script.js"></script>
```

Both are synchronous (no `async` or `defer`), placed at the end of `<body>`. In theory, they execute in order: anime.js loads and executes, then script.js loads and executes. By the time `DOMContentLoaded` fires (which may fire immediately if the DOM was already parsed by this point), `window.anime` should be defined.

However, `DOMContentLoaded` fires when the HTML document has been completely parsed, which happens **before** deferred scripts and potentially before synchronous scripts at the end of body have all executed in some edge cases with browser prefetching. In practice, synchronous scripts at end-of-body block `DOMContentLoaded`, so this is safe in modern browsers.

The real risk is if someone changes these to `async` or `defer` in a future refactor. The `if (window.anime)` check silently fails with no user-visible indication.

**Fix:**
Add a more robust loading strategy:

```js
function initGreetingAnimation() {
    if (window.anime) {
        // ... animation code ...
    } else {
        // Retry once after a short delay, or set up a fallback
        setTimeout(() => {
            if (window.anime) {
                // ... animation code ...
            } else {
                console.warn('anime.js unavailable after retry');
            }
        }, 1000);
    }
}
initGreetingAnimation();
```

Or better, load anime.js before `</head>` to guarantee availability.

---

## Priority Fix Order

1. **Issue 6** (High - Memory): Fix the greeting animation memory leak with timer cancellation and visibility API
2. **Issue 2** (High - Bug): Replace `window.onload` with `addEventListener('load', ...)`
3. **Issue 12** (High - Bug): Add robust anime.js loading check or reorder scripts
4. **Issue 9** (Medium - UX): Close mobile menu on nav link click
5. **Issue 3** (Medium - Bug): Fix scroll spy default index
6. **Issue 10** (Medium - Performance): Add `{ passive: true }` to scroll listeners
7. **Issue 4** (Medium - Bug): Add development warnings for missing sections
8. **Issue 7** (Medium - Bug): Add anime.js fallback
9. **Issue 5** (Low - Performance): Combine scroll listeners
10. **Issue 1** (Low - Bug): Move scrollToTop into DOMContentLoaded
11. **Issue 8** (Low - UX): Add click-outside-to-deactivate for cards
12. **Issue 11** (Low - Performance/Bug): Remove duplicate Calendly assets

---

## Additional Observations

- **No minification or bundling:** `script.js` is served as-is. For production, consider minifying.
- **No error boundaries:** No `try/catch` around third-party library calls (`anime()`, `Calendly`).
- **`window.pageYOffset` is deprecated:** Line 56 uses `window.pageYOffset` which is deprecated in favor of `window.scrollY`. Both are equivalent but `scrollY` is the modern standard.
- **Inline event handlers in HTML:** `onclick="scrollToTop()"` (line 441) and `onclick="Calendly.initPopupWidget(...)"` (lines 174, 219, 498) mix behavior with markup. Consider moving all handlers to JavaScript for separation of concerns and easier CSP policy enforcement.
