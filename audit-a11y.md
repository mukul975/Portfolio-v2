# Accessibility (a11y) Audit Report

**Site:** Mahipal Jangra Portfolio
**URL:** https://www.mahipal.engineer/
**Audit Date:** 2026-02-19
**Standard:** WCAG 2.1 (Level AA)
**Files Audited:** `index.html`, `style.css`, `script.js`

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 5     |
| Major    | 7     |
| Minor    | 4     |
| **Total**| **16**|

---

## Issues

### 1. Hidden Message Label Not Accessible to Screen Readers

| Field | Value |
|-------|-------|
| **Element/Selector** | `label.message-label` for `<textarea id="message">` |
| **File** | `style.css` line 1083-1085; `index.html` line 459 |
| **WCAG Criterion** | 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A) |
| **Severity** | Critical |

**Description:** The CSS rule `.message-label { display: none; }` completely removes the label from the accessibility tree. Screen readers will not announce "Message" when the textarea receives focus. The user sees only a placeholder, which disappears on input.

**Recommendation:** Replace `display: none` with a visually-hidden technique that keeps the element in the accessibility tree:
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

### 2. Hamburger Menu Button Missing `aria-label`

| Field | Value |
|-------|-------|
| **Element/Selector** | `button#menu-toggle.menu-toggle` |
| **File** | `index.html` line 132-134 |
| **WCAG Criterion** | 4.1.2 Name, Role, Value (Level A), 1.1.1 Non-text Content (Level A) |
| **Severity** | Critical |

**Description:** The hamburger menu button contains only an icon (`<i class="fas fa-bars"></i>`) with no accessible name. Screen readers will announce it as an empty button or read the FontAwesome class names.

**Recommendation:** Add `aria-label="Toggle navigation menu"` to the `<button>`. Also add `aria-expanded="false"` and toggle it via JavaScript when the menu opens/closes.
```html
<button id="menu-toggle" class="menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
    <i class="fas fa-bars" aria-hidden="true"></i>
</button>
```

---

### 3. Missing `role="navigation"` / Incorrect Landmark Structure

| Field | Value |
|-------|-------|
| **Element/Selector** | `<section id="header">` (line 128), `<ul class="navbar-menu">` (line 136) |
| **File** | `index.html` lines 128-151 |
| **WCAG Criterion** | 1.3.1 Info and Relationships (Level A), 2.4.1 Bypass Blocks (Level A) |
| **Severity** | Major |

**Description:** The header navigation uses a `<section>` element instead of semantic `<header>` and `<nav>` elements. There is no `role="navigation"` on the navigation list, preventing screen reader users from identifying and jumping to the navigation.

**Recommendation:** Replace `<section id="header">` with `<header>` and wrap the `<ul class="navbar-menu">` in a `<nav aria-label="Main navigation">` element. Similarly wrap footer nav in `<nav aria-label="Footer navigation">`.

---

### 4. Missing `<main>` Landmark Element

| Field | Value |
|-------|-------|
| **Element/Selector** | Content sections `#content-body`, `#aboutme`, `#research`, `#introduction`, `#skill` |
| **File** | `index.html` lines 161-438 |
| **WCAG Criterion** | 1.3.1 Info and Relationships (Level A), 2.4.1 Bypass Blocks (Level A) |
| **Severity** | Major |

**Description:** There is no `<main>` element wrapping the primary content. Screen reader users rely on landmark regions (`<header>`, `<main>`, `<footer>`) to quickly navigate the page.

**Recommendation:** Wrap the content sections (from `#content-body` through `#skill`) in a `<main>` element. Also change `<section id="footer">` to a `<footer>` element.

---

### 5. Missing Semantic `<header>` and `<footer>` Elements

| Field | Value |
|-------|-------|
| **Element/Selector** | `<section id="header">` (line 128), `<section id="footer">` (line 445) |
| **File** | `index.html` lines 128, 445 |
| **WCAG Criterion** | 1.3.1 Info and Relationships (Level A) |
| **Severity** | Major |

**Description:** The page uses `<section id="header">` and `<section id="footer">` instead of the semantic HTML5 `<header>` and `<footer>` elements. These landmarks are essential for assistive technology navigation.

**Recommendation:** Replace `<section id="header">` with `<header id="header">` and `<section id="footer">` with `<footer id="footer">`.

---

### 6. Announcement Banner Animation Inaccessible for Motion-Sensitive Users

| Field | Value |
|-------|-------|
| **Element/Selector** | `#announcement-banner p` with `animation: moveText 10s linear infinite`, `animation: glow 1s infinite alternate`, `.cta-text` with `animation: pulse 2s infinite` |
| **File** | `style.css` lines 66, 82, 112 |
| **WCAG Criterion** | 2.3.3 Animation from Interactions (Level AAA), 2.2.2 Pause, Stop, Hide (Level A) |
| **Severity** | Major |

**Description:** The announcement banner has a continuously scrolling marquee-like animation (`moveText`), a glowing box-shadow animation (`glow`), and a pulsing text animation (`pulse`). None of these respect the `prefers-reduced-motion` media query. This can cause discomfort or seizures in users with vestibular disorders or photosensitive epilepsy. Additionally, the continuously moving text violates WCAG 2.2.2 as there is no mechanism to pause, stop, or hide it.

**Recommendation:** Add a `prefers-reduced-motion` media query to disable or reduce all animations:
```css
@media (prefers-reduced-motion: reduce) {
  #announcement-banner p {
    animation: none;
  }
  #announcement-banner {
    animation: none;
  }
  #announcement-banner .cta-text {
    animation: none;
  }
}
```

---

### 7. Form Inputs Rely on Placeholder Instead of Visible Labels

| Field | Value |
|-------|-------|
| **Element/Selector** | `<input id="name">` (line 455), `<input id="email">` (line 457) |
| **File** | `index.html` lines 454-457; `style.css` (no visible label styles) |
| **WCAG Criterion** | 1.3.1 Info and Relationships (Level A), 3.3.2 Labels or Instructions (Level A) |
| **Severity** | Major |

**Description:** While `<label>` elements exist for the name and email fields, they have no special visible styling and appear to blend in or be overshadowed by the form design. The placeholder text disappears once the user starts typing, leaving no persistent indicator of the field's purpose. The message textarea label is explicitly hidden (see Issue #1).

**Recommendation:** Ensure all form labels are persistently visible. Consider placing labels above inputs with clear styling, or use a floating-label pattern that keeps the label visible after input begins.

---

### 8. Color Contrast: `#7c7d81` on `#2d2e32` Background

| Field | Value |
|-------|-------|
| **Element/Selector** | `.design-card p`, `.heading-container p`, `.footer-email-intro p`, `.footer-email-intro h6` |
| **File** | `style.css` lines 577, 637, 772, 779 |
| **WCAG Criterion** | 1.4.3 Contrast (Minimum) (Level AA) |
| **Severity** | Major |

**Description:** The color `#7c7d81` (a medium gray) is used for descriptive text on backgrounds of `#2d2e32` (dark charcoal). The contrast ratio is approximately **3.1:1**, which fails the WCAG AA minimum of **4.5:1** for normal text (and 3:1 for large text). Affected areas include project card descriptions, section subtitles, footer information labels, and the "Berlin, Deutschland" location text.

**Recommendation:** Change the text color to at least `#a0a1a5` (approximately 4.6:1 ratio) or lighter. Alternatively, lighten the specific backgrounds where this text appears. Verify with a contrast checker tool.

---

### 9. Focus Styles Not Defined for Keyboard Navigation

| Field | Value |
|-------|-------|
| **Element/Selector** | All interactive elements (links, buttons, inputs) |
| **File** | `style.css` (global -- no `:focus` or `:focus-visible` rules present) |
| **WCAG Criterion** | 2.4.7 Focus Visible (Level AA) |
| **Severity** | Critical |

**Description:** No custom `:focus` or `:focus-visible` styles are defined in the stylesheet. Some browsers provide a default focus ring, but `border: none; outline: none;` on buttons (line 201) actively removes it. Keyboard users cannot see which element currently has focus.

**Recommendation:** Add visible focus indicators for all interactive elements:
```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #64f4ac;
  outline-offset: 2px;
}
```
Remove `outline: none` from `button.normal` (line 201).

---

### 10. Calendly Links Use Empty `href` with `onclick` -- Not Keyboard/Screen-Reader Friendly

| Field | Value |
|-------|-------|
| **Element/Selector** | `<a href="" onclick="Calendly.initPopupWidget(...)">` |
| **File** | `index.html` lines 174, 219, 498 |
| **WCAG Criterion** | 2.1.1 Keyboard (Level A), 4.1.2 Name, Role, Value (Level A) |
| **Severity** | Critical |

**Description:** Three Calendly links use `href=""` with `onclick` JavaScript handlers. The empty `href` means the link points to the current page. If JavaScript fails to load, users are redirected nowhere useful. The `return false` in the handler prevents default behavior but the pattern is fragile. These links also lack descriptive text for screen readers (they say "LET'S Connect!" and "Schedule time with me" which is acceptable, but the mechanism is not robust).

**Recommendation:** Change `href=""` to `href="https://calendly.com/mukuljangra5"` as a fallback, and use `event.preventDefault()` in a proper event listener instead of inline `onclick`. Alternatively, use a `<button>` element since these trigger a popup widget rather than navigating:
```html
<button type="button" onclick="Calendly.initPopupWidget({url: '...'})">LET'S Connect!</button>
```

---

### 11. Cards Have Click Behavior But No `role="button"` or Keyboard Handler

| Field | Value |
|-------|-------|
| **Element/Selector** | `.design-card` elements |
| **File** | `script.js` lines 5-10; `style.css` line 611 (`cursor: pointer`) |
| **WCAG Criterion** | 2.1.1 Keyboard (Level A), 4.1.2 Name, Role, Value (Level A) |
| **Severity** | Major |

**Description:** The `.design-card` elements have a `click` event listener that toggles an `active` class, and the CSS sets `cursor: pointer` on hover. However, `<div>` elements are not focusable or operable via keyboard by default. They lack `role="button"`, `tabindex="0"`, and `keydown`/`keypress` handlers for Enter/Space activation.

**Recommendation:** Either add `role="button"`, `tabindex="0"`, and keyboard event handling:
```js
card.setAttribute('role', 'button');
card.setAttribute('tabindex', '0');
card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
    }
});
```
Or reconsider whether the "active" card behavior is truly needed.

---

### 12. Icons (`<i>`) Missing `aria-hidden="true"`

| Field | Value |
|-------|-------|
| **Element/Selector** | All `<i class="fa-*">` elements |
| **File** | `index.html` lines 133, 146-148, 244, 258, 305, 313, 321, 329, 337, 345, 353, 365, 386, 395, 404, 412, 420, 442, 512, 515, 520 |
| **WCAG Criterion** | 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A) |
| **Severity** | Minor |

**Description:** FontAwesome icons are rendered using `<i>` elements with CSS class names like `fa-solid fa-flask`, `fa-solid fa-terminal`, etc. Without `aria-hidden="true"`, screen readers may attempt to announce the element, potentially reading out the CSS class name content or the ligature text, resulting in confusing output.

**Recommendation:** Add `aria-hidden="true"` to all decorative `<i>` icon elements:
```html
<i class="fa-solid fa-flask" aria-hidden="true"></i>
```
For icons that convey meaning (and are the only content of a link/button), pair with an `aria-label` on the parent or a visually-hidden text span instead.

---

### 13. Footer Social Icon Links Missing `aria-label`

| Field | Value |
|-------|-------|
| **Element/Selector** | `.social-icons a` elements |
| **File** | `index.html` lines 511-521 |
| **WCAG Criterion** | 1.1.1 Non-text Content (Level A), 2.4.4 Link Purpose (Level A), 4.1.2 Name, Role, Value (Level A) |
| **Severity** | Critical |

**Description:** The footer social icon links contain only `<i>` icon elements with no text content and no `aria-label`. Screen readers will announce these as empty links or read the `href` URL, providing no indication of purpose.

**Recommendation:** Add `aria-label` to each icon-only link:
```html
<a href="https://www.linkedin.com/in/mahipal975/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
    <i class="fa-brands fa-linkedin-in" aria-hidden="true"></i>
</a>
<a href="https://github.com/mukul975" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
    <i class="fa-brands fa-github" aria-hidden="true"></i>
</a>
<a href="https://www.instagram.com/_mukul.jangra_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">
    <i class="fa-brands fa-instagram" aria-hidden="true"></i>
</a>
```

---

### 14. Scroll-to-Top Button Missing `aria-label`

| Field | Value |
|-------|-------|
| **Element/Selector** | `button#scrollToTop.scroll-to-top` |
| **File** | `index.html` lines 441-443 |
| **WCAG Criterion** | 4.1.2 Name, Role, Value (Level A), 1.1.1 Non-text Content (Level A) |
| **Severity** | Minor |

**Description:** The scroll-to-top button contains only a FontAwesome arrow-up icon (`<i class="fa-solid fa-arrow-up"></i>`) with no accessible name. Screen readers will not convey the button's purpose.

**Recommendation:** Add `aria-label="Scroll to top"` to the button and `aria-hidden="true"` to the icon:
```html
<button id="scrollToTop" class="scroll-to-top" onclick="scrollToTop()" aria-label="Scroll to top">
    <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
</button>
```

---

### 15. Missing `lang` Attribute for Non-English Greeting Text

| Field | Value |
|-------|-------|
| **Element/Selector** | `#greetingText` animated text content |
| **File** | `script.js` lines 73-91 |
| **WCAG Criterion** | 3.1.2 Language of Parts (Level AA) |
| **Severity** | Minor |

**Description:** The greeting animation cycles through text in 17 languages (English, Hindi, Bengali, Japanese, French, Spanish, Chinese, German, Tamil, Irish, Italian, Hebrew, Russian, Arabic, Vietnamese). The dynamically injected text does not include `lang` attributes. Screen readers will attempt to pronounce all text using English pronunciation rules, making non-English greetings unintelligible.

**Recommendation:** Add `lang` attributes when injecting greeting text. Maintain a mapping of language codes alongside the greetings array:
```js
const greetings = [
    { text: 'Stay safe from cyber', lang: 'en' },
    { text: 'साइबर से सुरक्षित रहें', lang: 'hi' },
    { text: 'সাইবার থেকে নিরাপদ থাকুন', lang: 'bn' },
    { text: 'サイバーから安全に過ごしてください', lang: 'ja' },
    // ... etc
];
// When setting text:
greetingText.setAttribute('lang', greetings[greetIndex].lang);
```

---

### 16. Heading Hierarchy: `<h2>` Used Before `<h1>` in Hero Section

| Field | Value |
|-------|-------|
| **Element/Selector** | `<h2>` (line 169), `<h1>` (line 172) in `#content-body` |
| **File** | `index.html` lines 169, 172 |
| **WCAG Criterion** | 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA) |
| **Severity** | Minor |

**Description:** In the hero section (`#content-body`), an `<h2>` element containing the animated greeting text appears before the `<h1>` element ("Cybersecurity Guardian / Front-End Maestro"). Headings should follow a logical descending order. Having `<h2>` before `<h1>` breaks the document outline and can confuse screen reader users who navigate by headings. Additionally, section headers like "Research", "Latest Projects", and "Skills" use `<h3>` but there is no parent `<h2>` introducing them -- they skip from `<h1>` (in hero) to `<h3>`.

**Recommendation:** Change the greeting `<h2>` to a `<p>` or `<span>` with appropriate ARIA role if needed, since it is decorative animated text rather than a structural heading. Ensure section headings follow a logical order (`<h1>` -> `<h2>` -> `<h3>`). Consider making section titles `<h2>` instead of `<h3>`.

---

## Additional Observations

### A. Inline Styles Throughout HTML

Multiple `<section>` and `<div>` elements use inline `style` attributes (lines 233, 234, 285, 290, 375, 380, 445). While not a WCAG violation, inline styles make it harder to maintain consistent accessible styling and to apply `prefers-reduced-motion` or high-contrast overrides.

### B. `target="_blank"` Without Advisory

External links use `target="_blank"` with `rel="noopener noreferrer"` (good for security), but there is no visual or textual indication that links open in a new window/tab. WCAG 3.2.5 (Level AAA) recommends informing users.

### C. Form Has No Error Handling / Validation Feedback

The contact form uses HTML5 `required` attributes but has no visible error messages or ARIA live regions to announce validation errors to screen readers.

### D. No Skip Navigation Link

There is no "Skip to main content" link at the top of the page. This is important for keyboard and screen reader users to bypass repetitive navigation (WCAG 2.4.1 Bypass Blocks, Level A).

---

## Severity Definitions

| Severity | Definition |
|----------|-----------|
| **Critical** | Prevents users with disabilities from accessing core content or functionality. Must fix immediately. |
| **Major** | Significantly hinders the experience for users with disabilities. Should fix in next release. |
| **Minor** | Causes inconvenience but does not block access. Fix when possible. |

---

## Tools Used

- Manual code review of `index.html`, `style.css`, and `script.js`
- WCAG 2.1 Level AA compliance criteria
- Contrast ratio calculation for `#7c7d81` on `#2d2e32`

---

*End of audit report.*
