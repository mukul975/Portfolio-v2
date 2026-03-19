# SEO Audit Report -- mahipal.engineer

**Audit Date:** 2026-02-19
**File Audited:** `D:/Portfolio-v2/index.html`
**Live Domain:** `https://www.mahipal.engineer/`

---

## Summary

16 issues identified across meta tags, structured data, heading hierarchy, and missing files. 5 high-impact, 7 medium-impact, and 4 low-impact issues.

---

## Issues

### 1. `<title>` tag is too short and missing keywords

- **Location:** `index.html` line 37 -- `<title>Mahipal</title>`
- **Issue:** The title tag contains only a first name. It does not include the last name, profession, or any keywords. Search engines use the title tag as the primary ranking signal and as the clickable headline in SERPs.
- **Impact:** HIGH
- **Fix:** Change to a descriptive title such as:
  ```html
  <title>Mahipal Jangra | Cybersecurity Researcher & Front-End Developer Portfolio</title>
  ```

---

### 2. Missing canonical tag

- **Location:** `<head>` section (absent)
- **Issue:** There is no `<link rel="canonical">` tag. Without a canonical URL, search engines may index duplicate versions of the page (e.g., with/without `www`, with/without trailing slash, old GitHub Pages URL).
- **Impact:** HIGH
- **Fix:** Add inside `<head>`:
  ```html
  <link rel="canonical" href="https://www.mahipal.engineer/">
  ```

---

### 3. Missing robots meta tag

- **Location:** `<head>` section (absent)
- **Issue:** No `<meta name="robots">` tag is present. While search engines default to `index, follow`, explicitly declaring it is best practice and ensures no ambiguity.
- **Impact:** MEDIUM
- **Fix:** Add inside `<head>`:
  ```html
  <meta name="robots" content="index, follow">
  ```

---

### 4. `og:url` points to old GitHub Pages domain

- **Location:** `index.html` line 31 -- `<meta property="og:url" content="https://mukul975.github.io/Portfolio-v2/">`
- **Issue:** The Open Graph URL still references the old GitHub Pages deployment (`mukul975.github.io/Portfolio-v2/`) while the actual live domain is `mahipal.engineer`. When shared on social platforms, the link preview will point to the wrong URL.
- **Impact:** HIGH
- **Fix:** Update to:
  ```html
  <meta property="og:url" content="https://www.mahipal.engineer/">
  ```

---

### 5. `og:title` and `<title>` are inconsistent

- **Location:** `index.html` line 27 (`og:title` = "Mahipal Jangra Portfolio") vs line 37 (`<title>` = "Mahipal")
- **Issue:** The Open Graph title is more descriptive than the HTML title. These should be consistent (or at least both descriptive) to avoid confusing both search engines and users who see different titles in browser tabs vs. social shares.
- **Impact:** MEDIUM
- **Fix:** Align both. Update the `<title>` tag as described in Issue 1. The `og:title` can remain "Mahipal Jangra Portfolio" or be updated to match the new title.

---

### 6. `og:image` and `twitter:image` reference old GitHub Pages domain

- **Location:** `index.html` lines 29 and 36
- **Issue:** Both image meta tags use `https://mukul975.github.io/Portfolio-v2/assets/Mockup.png`. While the file `assets/Mockup.png` exists locally, the URLs should point to the current domain. If the old GitHub Pages deployment is ever removed, image previews on social platforms will break.
- **Impact:** MEDIUM
- **Fix:** Update both to:
  ```html
  <meta property="og:image" content="https://www.mahipal.engineer/assets/Mockup.png">
  <meta name="twitter:image" content="https://www.mahipal.engineer/assets/Mockup.png">
  ```

---

### 7. Structured data WebPage `name` is just "Mahipal"

- **Location:** `index.html` line 67 -- `"name": "Mahipal"` inside the `WebPage` JSON-LD block
- **Issue:** The WebPage schema `name` should be descriptive, matching the updated page title. Search engines may use this in rich results.
- **Impact:** MEDIUM
- **Fix:** Update to:
  ```json
  "name": "Mahipal Jangra | Cybersecurity Researcher & Front-End Developer Portfolio"
  ```

---

### 8. BreadcrumbList "Works" points to `#introduction` anchor

- **Location:** `index.html` line 86 -- `"name": "Works", "item": "https://www.mahipal.engineer/#introduction"`
- **Issue:** The breadcrumb entry "Works" links to the `#introduction` anchor, but the actual section `id` is `introduction` and the section heading says "Latest Projects". While the nav label "Works" matches, the anchor name `introduction` is semantically misleading for a projects section. This is a minor inconsistency but can confuse crawlers trying to understand page structure.
- **Impact:** LOW
- **Fix:** Consider renaming the section `id` from `introduction` to `works` or `projects` for consistency, and updating all references accordingly.

---

### 9. Structured data `SoftwareSourceCode` and `CreativeWork` entries missing `author` property

- **Location:** `index.html` lines 92-120 -- all `SoftwareSourceCode` and `CreativeWork` JSON-LD entries
- **Issue:** None of the project/research entries in the structured data include an `author` property linking back to the Person entity. This weakens the semantic connection between the author and their works in the knowledge graph.
- **Impact:** MEDIUM
- **Fix:** Add an `author` reference to each entry:
  ```json
  "author": {"@id": "https://www.mahipal.engineer/#person"}
  ```

---

### 10. Missing `<meta name="author">` tag

- **Location:** `<head>` section (absent)
- **Issue:** No author meta tag is present. While not a direct ranking factor, it helps search engines and tools identify the page author.
- **Impact:** LOW
- **Fix:** Add inside `<head>`:
  ```html
  <meta name="author" content="Mahipal Jangra">
  ```

---

### 11. Missing `<meta name="keywords">` tag

- **Location:** `<head>` section (absent)
- **Issue:** No keywords meta tag. While Google has stated it does not use the keywords meta tag for ranking, other search engines (Bing, Yandex) may still consider it, and it is part of standard SEO practice.
- **Impact:** LOW
- **Fix:** Add inside `<head>`:
  ```html
  <meta name="keywords" content="Mahipal Jangra, cybersecurity, front-end developer, portfolio, MCP, web development, security researcher, Berlin">
  ```

---

### 12. Heading hierarchy issues -- `<h3>` used for section titles before `<h1>`

- **Location:** `index.html` line 130 (`<h3 class="title-first-name">Mahipal</h3>` in navbar), lines 236, 287, 377 (section headings use `<h3>`), line 172 (first `<h1>` in body content)
- **Issue:** The first heading element a crawler encounters is an `<h3>` in the navbar (line 130). The actual `<h1>` does not appear until line 172. Section titles like "Research", "Latest Projects", and "Skills" all use `<h3>` instead of `<h2>`. This breaks the heading hierarchy (`h1 > h2 > h3`). Proper heading hierarchy helps search engines understand page structure and content importance.
- **Impact:** MEDIUM
- **Fix:**
  - Change section heading tags (Research, Latest Projects, Skills) from `<h3>` to `<h2>`.
  - Keep the navbar/footer name as a styled `<span>` or `<div>` rather than a heading tag since it is not a content heading.
  - Ensure there is exactly one `<h1>` that is prominent and descriptive.

---

### 13. No `sitemap.xml` or robots.txt

- **Location:** Root directory of the project (both files are absent)
- **Issue:** Neither `sitemap.xml` nor `robots.txt` exists. There is also no `<link rel="sitemap">` tag in the HTML. A sitemap helps search engines discover and index all pages. A `robots.txt` file provides crawl directives.
- **Impact:** HIGH
- **Fix:**
  - Create `robots.txt` in the project root:
    ```
    User-agent: *
    Allow: /
    Sitemap: https://www.mahipal.engineer/sitemap.xml
    ```
  - Create `sitemap.xml` in the project root:
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://www.mahipal.engineer/</loc>
        <lastmod>2026-02-19</lastmod>
        <priority>1.0</priority>
      </url>
    </urlset>
    ```

---

### 14. Structured data `sameAs` array only has GitHub -- missing LinkedIn and Instagram

- **Location:** `index.html` lines 77-79 -- `"sameAs": ["https://github.com/mukul975"]`
- **Issue:** The Person schema only lists GitHub in the `sameAs` array. The footer of the page links to LinkedIn and Instagram as well (lines 511, 519). Including all social profiles in `sameAs` helps search engines build a more complete knowledge graph entry.
- **Impact:** MEDIUM
- **Fix:** Update to:
  ```json
  "sameAs": [
    "https://github.com/mukul975",
    "https://www.linkedin.com/in/mahipal975/",
    "https://www.instagram.com/_mukul.jangra_/"
  ]
  ```

---

### 15. Extensive use of inline `style` attributes

- **Location:** `index.html` lines 233, 234, 285, 290, 375, 380, 445
- **Issue:** Multiple sections use inline `style` attributes for layout and background colors (e.g., `style="background-color: #2d2e3273;"`, `style="display: flex; position: relative; ..."`). While this does not directly affect SEO ranking, it increases page weight, makes the HTML harder to parse, and prevents clean separation of content and presentation. Some SEO tools flag this as a code quality issue.
- **Impact:** LOW
- **Fix:** Move all inline styles to the external `style.css` stylesheet. Create CSS classes for the repeated patterns.

---

### 16. Missing `hreflang` attribute for multilingual greeting content

- **Location:** `index.html` line 169 -- `<span id="greetingText">Stay safe from cyber</span>` (the `script.js` likely cycles through greetings in multiple languages)
- **Issue:** The page displays greetings in multiple languages (based on the greeting text animation), but there is no `hreflang` declaration. While this is a single-page site in English, the presence of multilingual text content without `hreflang` can confuse search engines about the primary language of the page.
- **Impact:** HIGH
- **Fix:** Since this is primarily an English-language page, add to `<head>`:
  ```html
  <link rel="alternate" hreflang="en" href="https://www.mahipal.engineer/">
  <link rel="alternate" hreflang="x-default" href="https://www.mahipal.engineer/">
  ```
  This tells search engines the primary language is English and this is the default version.

---

## Priority Summary

| Priority | Issues |
|----------|--------|
| **HIGH** | #1 Title too short, #2 Missing canonical, #4 og:url wrong domain, #13 No sitemap/robots.txt, #16 Missing hreflang |
| **MEDIUM** | #3 Missing robots meta, #5 Title inconsistency, #6 OG image wrong domain, #7 WebPage name too short, #9 Missing author in structured data, #12 Heading hierarchy, #14 sameAs incomplete |
| **LOW** | #8 BreadcrumbList anchor mismatch, #10 Missing author meta, #11 Missing keywords meta, #15 Inline styles |

---

## Recommended Fix Order

1. Fix `<title>` tag and align `og:title` (Issues 1, 5)
2. Add canonical tag (Issue 2)
3. Fix `og:url`, `og:image`, and `twitter:image` to use `mahipal.engineer` domain (Issues 4, 6)
4. Create `robots.txt` and `sitemap.xml` (Issue 13)
5. Add `hreflang` tags (Issue 16)
6. Update structured data: WebPage name, author properties, sameAs array (Issues 7, 9, 14)
7. Add missing meta tags: robots, author, keywords (Issues 3, 10, 11)
8. Fix heading hierarchy (Issue 12)
9. Address BreadcrumbList anchor naming (Issue 8)
10. Move inline styles to CSS (Issue 15)
