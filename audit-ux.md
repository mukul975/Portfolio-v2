# UX and Content Audit Report

**Site:** Mahipal Jangra Portfolio (index.html)
**Date:** 2026-02-19
**Auditor:** Automated UX Audit Agent

---

## Summary

15 issues identified across the portfolio website. Issues are categorized by type (typo, UX, content, broken) and rated by severity (Critical, High, Medium, Low).

---

## Issue 1: Typo in Location Text

- **Location:** `index.html` line 478 — `<h6>Berlin, Deustchland </h6>`
- **Type:** Typo
- **Severity:** Medium
- **Description:** "Deustchland" is misspelled. The correct German spelling is "Deutschland".
- **Fix:** Change `Deustchland` to `Deutschland` on line 478.

---

## Issue 2: Project Cards With No Links (Haze Removal, EmailGuard, Multicast Wireless Routing, Pack India)

- **Location:** `index.html` lines 326-368 — four `design-card` elements in the `#introduction` (Latest Projects) section
- **Type:** UX / Broken
- **Severity:** Critical
- **Description:** Four project cards have no links at all. Visitors cannot learn more about these projects, view source code, or see demos. The cards are:
  - "An Enhanced Haze Removal" (line 327-333) — no `<a>` tag
  - "EmailGuard" (line 334-341) — no `<a>` tag
  - "Multicast Wireless Routing Protocol" (line 342-349) — no `<a>` tag
  - "Pack India Packers and Movers" (line 360-368) — no `<a>` tag
- **Fix:** Add a relevant link for each project (GitHub repo, live demo, or publication link). If no external resource exists, consider removing the card or adding a note that it is a private/archived project.

---

## Issue 3: Wrong Icon for "Pack India" Project Card

- **Location:** `index.html` line 365 — `<i class="fa-solid fa-terminal"></i>`
- **Type:** Content
- **Severity:** Low
- **Description:** The "Pack India Packers and Movers Website Development Project" uses a terminal icon (`fa-terminal`), which is inappropriate for a website project. A globe or link icon would better represent a web development project.
- **Fix:** Change `fa-terminal` to `fa-globe` or `fa-link` (e.g., `<i class="fa-solid fa-globe"></i>`).

---

## Issue 4: Wrong Icon for "Multicast Wireless Routing" Project Card

- **Location:** `index.html` line 345 — `<i class="fa-solid fa-code"></i>`
- **Type:** Content
- **Severity:** Low
- **Description:** "Multicast Wireless Routing Protocol In Java Programming" uses the generic `fa-code` icon. A networking-related icon such as `fa-network-wired` or `fa-tower-broadcast` would better convey the project topic.
- **Fix:** Change `fa-code` to `fa-network-wired` (e.g., `<i class="fa-solid fa-network-wired"></i>`).

---

## Issue 5: Announcement Banner Scrolls Too Fast to Click Links

- **Location:** `style.css` lines 79-92 — `#announcement-banner p` animation
- **Type:** UX
- **Severity:** High
- **Description:** The announcement banner text uses a CSS `moveText` animation with a 10-second linear infinite loop that translates from +100% to -100%. The text moves continuously and fast enough that users cannot hover over or click the "MCP Web Scrape" and "MCP Windows Server" links before they scroll off screen. This makes the banner links effectively unusable.
- **Fix:** Either (a) increase the animation duration significantly (e.g., 20-30s), (b) add `animation-play-state: paused` on hover so users can click, or (c) switch to a static banner layout that does not scroll.

---

## Issue 6: "LET'S Connect!" Button Only Opens Calendly (No Email/Contact Fallback)

- **Location:** `index.html` line 174 — `<a href="" onclick="Calendly.initPopupWidget(...)">LET'S Connect!</a>`
- **Type:** UX
- **Severity:** High
- **Description:** The hero section CTA button exclusively opens a Calendly scheduling popup. There is no fallback for users who want to send an email directly or scroll to the contact form. Also, the `href=""` attribute means clicking the link reloads the page if JavaScript fails. This same issue appears again at line 219 in the About Me section.
- **Fix:** Change `href=""` to `href="#footer"` so the link scrolls to the contact section if JavaScript is disabled. Consider adding a secondary link or changing the behavior to scroll to the contact form section.

---

## Issue 7: Message Textarea Label Hidden via CSS (Inconsistent Form UX)

- **Location:** `index.html` line 459 — `<label for="message" class="message-label">Message</label>`, `style.css` line 1083-1085 — `.message-label { display: none; }`
- **Type:** UX
- **Severity:** Medium
- **Description:** The Name and Email fields have visible `<label>` elements, but the Message textarea label is hidden with `display: none`. This creates inconsistent form UX and harms accessibility — screen readers may still read it, but the visual presentation is inconsistent.
- **Fix:** Either show the Message label (remove `display: none`) for visual consistency, or hide all labels consistently using `sr-only` / `visually-hidden` CSS class that keeps them accessible but visually hidden.

---

## Issue 8: Contact Form Has No Action Attribute and No Success State

- **Location:** `index.html` line 447 — `<form name="contactus" netlify method="POST">`
- **Type:** UX / Broken
- **Severity:** High
- **Description:** The form has no `action` attribute. While Netlify intercepts forms with the `netlify` attribute, there is no success state handling — after submission, users see no confirmation message, thank-you page, or redirect. Users are left wondering if their message was sent. Additionally, if the site is hosted elsewhere (e.g., GitHub Pages), the form will silently fail.
- **Fix:** Add `action="/thank-you"` (or a custom success page path) to the form element. Create a minimal thank-you page or add JavaScript to display a success message inline after submission.

---

## Issue 9: Email Capitalization Inconsistency

- **Location:** `index.html` line 479 — `<h3>Mukuljangra5@gmail.com</h3>` vs. line 148 — `<a href="mailto:mukuljangra5@gmail.com">`
- **Type:** Content
- **Severity:** Low
- **Description:** The display email in the footer shows "Mukuljangra5@gmail.com" (capital M), while the actual mailto link uses "mukuljangra5@gmail.com" (lowercase m). While email addresses are technically case-insensitive, the visual inconsistency appears unprofessional.
- **Fix:** Standardize to `mukuljangra5@gmail.com` (all lowercase) in both the display text and the mailto link.

---

## Issue 10: Greeting Text Span Has Fixed Width (Overflow on Non-Latin Scripts)

- **Location:** `index.html` line 169 — `<span id="greetingText">`, `style.css` lines 34-43 and 1224-1233 — `#greetingText { width: 420px; white-space: nowrap; }`
- **Type:** UX
- **Severity:** Medium
- **Description:** The greeting `<span>` has a fixed width of 420px and `white-space: nowrap`. The JavaScript cycles through greetings in multiple scripts (Hindi, Bengali, Japanese, Chinese, Arabic, Tamil, Russian, etc.). Non-Latin scripts and longer translations can easily overflow the 420px fixed width, causing text to clip or overflow. While there is a responsive override at 600px, the issue persists on medium screens (600-1200px).
- **Fix:** Change to `width: auto; max-width: 100%;` or use `min-width: 420px` with `width: auto` to allow the container to grow for longer texts. Alternatively, reduce font size dynamically or use `text-overflow: ellipsis` as a fallback.

---

## Issue 11: Footer Navigation Missing "Contact" Link

- **Location:** `index.html` lines 501-508 — `.footer-nav-menu`
- **Type:** UX
- **Severity:** Medium
- **Description:** The footer navigation includes links to About, Research, Works, and Skills, but does not include a "Contact" link that scrolls back to the contact form (which is in the same footer section). Since the footer is long and the contact form may not be in view when users see the navigation, there is no way for users at the bottom of the page to quickly jump back to the form.
- **Fix:** Add a `<li><a href="#footer">Contact</a></li>` entry to the footer navigation menu. Alternatively, since the form is already in the footer, this could link to a named anchor within the form section.

---

## Issue 12: Research Section Does Not Prominently Show Publication Year

- **Location:** `index.html` lines 240-271 — research cards in `#research` section
- **Type:** Content
- **Severity:** Low
- **Description:** Publication years (2022 and 2025) are buried at the end of paragraph text within `<strong>Year:</strong>` tags, mixed with the description. For an academic portfolio, the publication year should be prominently displayed, such as in a badge, subtitle, or separate visual element.
- **Fix:** Extract the year into a visible badge or tag element positioned near the card heading (e.g., `<span class="year-badge">2022</span>`) with distinct styling.

---

## Issue 13: Orphaned Closing Tags in About Me Section

- **Location:** `index.html` lines 226-228 — orphaned `</div></div>` tags between the About Me content and closing `</section>`
- **Type:** Broken
- **Severity:** Medium
- **Description:** After the About Me section content (line 222 `</div>`), there are orphaned closing tags: an empty `</div>` on line 227 and `</div>` on line 228, preceded by blank lines. These appear to be leftover from a previous layout structure. While browsers handle mismatched tags gracefully, this creates invalid HTML and could cause unexpected layout issues.
- **Fix:** Remove the orphaned `</div></div>` tags on lines 226-228 (the blank lines and closing tags between the body content and `</section>` tag on line 231).

---

## Issue 14: 404 Page Has No Main Navigation

- **Location:** `404.html` — entire file
- **Type:** UX
- **Severity:** Low
- **Description:** The 404 page only has a single "Return to Home" link. It has no main site navigation, no search functionality, and no links to key sections. Users who land on the 404 page are essentially stranded with only one option. Additionally, there is no link from the main site header or anywhere else that references the 404 page exists.
- **Fix:** Add the main navigation bar to the 404 page (or at least links to key sections like About, Projects, Contact). Consider adding suggested links or a brief site map.

---

## Issue 15: Developer Intro Pills Are Not Interactive or Linked

- **Location:** `index.html` lines 163-168 — `.developer-intro` paragraph tags
- **Type:** UX
- **Severity:** Low
- **Description:** The pills labeled "Front-End Developer", "Security Enthusiast", "Research Scholar", and "MCP Builder" have `cursor: pointer` and hover effects (font-weight change) in CSS, suggesting interactivity. However, they are plain `<p>` tags with no links, no click handlers, and no tooltips. Users expect interactive behavior from elements styled as clickable pills.
- **Fix:** Either (a) link each pill to the relevant section (e.g., "Research Scholar" links to `#research`, "MCP Builder" links to the MCP projects), (b) add tooltip text explaining each role, or (c) remove the `cursor: pointer` and hover effects to stop implying interactivity.

---

## Summary Table

| # | Issue | Type | Severity | Line(s) |
|---|-------|------|----------|---------|
| 1 | "Deustchland" typo | Typo | Medium | 478 |
| 2 | 4 project cards with no links | UX/Broken | Critical | 326-368 |
| 3 | Wrong icon for Pack India (terminal) | Content | Low | 365 |
| 4 | Wrong icon for Multicast Wireless Routing | Content | Low | 345 |
| 5 | Banner scrolls too fast to click | UX | High | CSS 79-92 |
| 6 | CTA only opens Calendly, no fallback | UX | High | 174, 219 |
| 7 | Message label hidden inconsistently | UX | Medium | 459, CSS 1083 |
| 8 | Form has no action, no success state | UX/Broken | High | 447 |
| 9 | Email capitalization mismatch | Content | Low | 479 vs 148 |
| 10 | Fixed-width greeting overflows | UX | Medium | 169, CSS 34-43 |
| 11 | Footer nav missing Contact link | UX | Medium | 501-508 |
| 12 | Publication year not prominent | Content | Low | 240-271 |
| 13 | Orphaned closing div tags | Broken | Medium | 226-228 |
| 14 | 404 page has no navigation | UX | Low | 404.html |
| 15 | Dev intro pills not interactive | UX | Low | 163-168 |

---

**Critical:** 1 | **High:** 3 | **Medium:** 5 | **Low:** 6
