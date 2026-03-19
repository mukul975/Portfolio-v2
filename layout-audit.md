# HTML Structure Audit: #research and #mcp-tools sections

## Reference Pattern (from working sections #introduction and #skill)

The site uses this layout pattern for every working section:

```
<section id="..." style="background-color: ...;">          /* position: relative via CSS */
    <div class="heading-container">...</div>               /* position: absolute; top: 20px; left: 50%; transform: translateX(-50%) */
    <div style="position: relative; padding: 100px 40px; min-height: 95vh; ...">
        <div class="cards-container">
            <div class="cards">
                <div class="design-card">...</div>
            </div>
        </div>
    </div>
</section>
```

Key CSS facts:
- `.heading-container` is `position: absolute; top: 20px; left: 50%; transform: translateX(-50%)` (style.css:829-835)
- `section#research, section#introduction, section#skill` all have `position: relative` (style.css:1447-1453)
- `#introduction` and `#skill` both have `position: relative` in their own rules (style.css:804-811, 813-818)

---

## Issue 1: #research uses a non-standard wrapper `<div class="section-inner-flex">` (CRITICAL)

**Location:** index.html:243

The #research section wraps ALL its content (heading, links, cards) inside a `<div class="section-inner-flex">`:

```html
<section id="research" style="background-color: #2d2e3273;">
    <div class="section-inner-flex">                  <!-- non-standard wrapper -->
        <div class="heading-container">...</div>
        <div class="research-links-row">...</div>
        <div class="research-cards-container">...</div>
    </div>
</section>
```

**Problem:** There is NO CSS rule for `.section-inner-flex` anywhere in style.css. This class is completely undefined.

However, there IS a CSS rule `#research > div` (style.css:557-567) that styles any direct child div of #research:
```css
#research > div {
    display: flex;
    flex-direction: row;           /* <-- forces row layout */
    justify-content: space-between;
    align-items: center;
    padding: 100px 40px 80px;
    min-height: 95vh;
    position: relative;
}
```

**Impact:** The `#research > div` rule targets `.section-inner-flex` (since it is the direct child div). This means:
- The `.section-inner-flex` div gets `flex-direction: row`, so the heading, links, and cards will try to sit side by side horizontally instead of stacking vertically.
- The `.heading-container` IS inside a `position: relative` ancestor (the `.section-inner-flex` div gets `position: relative` from `#research > div`), so the absolute heading positioning works.
- BUT the `flex-direction: row` likely breaks the intended vertical layout of heading -> links -> cards.

**Recommendation:** Either:
1. Remove `.section-inner-flex` and restructure to match other sections, OR
2. Add CSS for `.section-inner-flex` that overrides the `#research > div` rule with `flex-direction: column`

---

## Issue 2: #research uses non-standard card wrapper classes

**Location:** index.html:252-279

The #research section uses:
```html
<div class="research-cards-container">
    <div class="design-card research-card">...</div>
    <div class="design-card research-card">...</div>
</div>
```

The standard pattern (from #introduction) is:
```html
<div class="cards-container">
    <div class="cards">
        <div class="design-card">...</div>
    </div>
</div>
```

**Differences:**
- Uses `research-cards-container` instead of `cards-container`
- Missing the intermediate `<div class="cards">` wrapper
- Cards have `research-card` modifier class in addition to `design-card`

**Impact:** The `.research-cards-container` has its own CSS (style.css:137-142) so this is intentionally different. The cards still use `.design-card` as base class. This is a minor structural inconsistency but may be intentional for the different layout needs. Not necessarily a bug.

---

## Issue 3: #research has double-padding from section + inner wrapper

**Location:** index.html:242-281, style.css:548-567

- `#research` section itself has `padding-bottom: 80px` (style.css:551)
- `#research > div` (the `.section-inner-flex` wrapper) has `padding: 100px 40px 80px` (style.css:562)

**Impact:** Bottom padding stacks: 80px (inner) + 80px (section) = 160px total bottom padding. But `.research-cards-container` ALSO has `padding: 0 40px 80px` (style.css:137-142), adding yet another 80px bottom and 40px sides.

**Total bottom padding:** 80px (section) + 80px (inner div) + 80px (cards container) = potentially 240px of bottom padding. This is excessive compared to other sections.

**Total side padding:** 40px (inner div) + 40px (cards container) = 80px per side. Other sections have 40px.

---

## Issue 4: #mcp-tools heading-container is NOT inside a position:relative parent (CRITICAL)

**Location:** index.html:283-327

```html
<section id="mcp-tools" style="background-color: #1e1f23;">
    <div class="heading-container">                <!-- DIRECT child of section -->
        <h2>MCP Tools</h2>
        <p>Building the infrastructure layer for AI agents</p>
    </div>
    <div style="position: relative; padding: 100px 40px 80px; min-height: 95vh; ...">
        ...content...
    </div>
</section>
```

**Problem:** The `<section id="mcp-tools">` has NO CSS rule giving it `position: relative`.

- There is NO `#mcp-tools` rule in style.css at all.
- The generic rule at style.css:1447-1453 covers `section#research, section#introduction, section#skill` but NOT `section#mcp-tools`.
- The `<section>` element's default position is `static`.

**Impact:** `.heading-container` is `position: absolute` but its parent `<section id="mcp-tools">` is `position: static`. This means the heading will be positioned relative to the next ancestor with `position: relative`, which might be `<main>`, `<body>`, or the inline-styled inner div -- causing the heading to appear in the wrong place or overlap other content.

**Recommendation:** Add `section#mcp-tools` to the CSS rule at style.css:1447-1453:
```css
section#research,
section#introduction,
section#skill,
section#mcp-tools {
    width: 100%;
    position: relative;
    box-sizing: border-box;
}
```

---

## Issue 5: #mcp-tools uses non-standard card wrapper

**Location:** index.html:297-325

```html
<div class="mcp-cards-container">
    <div class="design-card mcp-card">...</div>
</div>
```

Like #research, it skips the standard `.cards-container > .cards > .design-card` nesting and uses its own container class. The `.mcp-cards-container` has its own CSS (style.css:231-236) so this is intentional, but inconsistent with the site pattern.

---

## Issue 6: #mcp-tools inner div uses inline styles instead of a CSS class

**Location:** index.html:288

```html
<div style="position: relative; padding: 100px 40px 80px; min-height: 95vh; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center;">
```

While #introduction and #skill also use some inline styles for their inner divs, this one is particularly heavy. Not a structural bug, but a maintainability concern.

---

## Issue 7: #mcp-tools missing from responsive media queries

Since there is no `#mcp-tools` in the CSS at all, none of the responsive breakpoints adjust its padding, layout, or sizing. Sections #research, #introduction, and #skill all have responsive rules at various breakpoints (1100px, 900px, 768px, 480px). #mcp-tools has none.

---

## Summary of Critical Issues

| # | Section | Issue | Severity |
|---|---------|-------|----------|
| 1 | #research | `.section-inner-flex` has no CSS; `#research > div` forces `flex-direction: row` on it | CRITICAL |
| 3 | #research | Triple-stacked bottom padding (section + inner + cards = ~240px) | MEDIUM |
| 4 | #mcp-tools | Missing `position: relative` on section; heading floats to wrong ancestor | CRITICAL |
| 7 | #mcp-tools | No responsive CSS rules at all | HIGH |
| 2 | #research | Non-standard card wrapper (no `.cards > .design-card` nesting) | LOW |
| 5 | #mcp-tools | Non-standard card wrapper (no `.cards > .design-card` nesting) | LOW |
