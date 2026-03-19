# Security Audit Report: Portfolio-v2

**File audited:** `D:\Portfolio-v2\index.html` (and `script.js`)
**Date:** 2026-02-19
**Auditor:** Automated Security Audit Agent
**Site type:** Static HTML/CSS/JS portfolio, hosted on GitHub Pages / Netlify

---

## Executive Summary

The portfolio site has **no critical** vulnerabilities (expected for a static site with no server-side code), but contains several **high** and **medium** severity issues that increase the attack surface and expose the site owner to spam, phishing, and supply-chain risks. The most impactful issues are the lack of Subresource Integrity (SRI) on external scripts, missing Content Security Policy, plaintext email exposure, and inadequate form spam protection.

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 3     |
| Medium   | 5     |
| Low      | 2     |
| Info     | 2     |
| **Total**| **12**|

---

## Findings

### 1. External Scripts Loaded Without Subresource Integrity (SRI)

**Severity:** HIGH
**OWASP Category:** A08:2021 - Software and Data Integrity Failures
**Location:** `index.html` lines 7, 38, 482, 497, 526

**Description:**
Five external JavaScript resources are loaded without `integrity` attributes. If any CDN or third-party host is compromised, an attacker could serve malicious JavaScript that executes in the context of the site, stealing form data, redirecting users, or injecting content.

**Affected resources:**
| Line | Script | Host |
|------|--------|------|
| 7 | `https://www.googletagmanager.com/gtag/js?id=G-4G5DVR6FCK` | Google Tag Manager |
| 38 | `https://kit.fontawesome.com/e674bba739.js` | FontAwesome CDN |
| 482 | `https://assets.calendly.com/assets/external/widget.js` | Calendly CDN |
| 497 | `https://assets.calendly.com/assets/external/widget.js` | Calendly CDN (duplicate) |
| 526 | `https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js` | jsDelivr CDN |

**Note:** Google Tag Manager and Calendly dynamically update their scripts, making SRI pinning impractical for those. However, anime.js (version-pinned) and FontAwesome kit are strong candidates for SRI.

**Fix:**
For version-pinned scripts like anime.js, generate and add SRI hashes:
```html
<script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"
        integrity="sha384-<hash>"
        crossorigin="anonymous"></script>
```
Generate hashes using: `https://www.srihash.org/`

For dynamically-updating scripts (GTM, Calendly), SRI is not feasible -- mitigate with a Content Security Policy instead (see Finding #2).

---

### 2. No Content Security Policy (CSP)

**Severity:** HIGH
**OWASP Category:** A05:2021 - Security Misconfiguration
**Location:** `index.html` `<head>` section (missing entirely); no `netlify.toml` or `_headers` file found

**Description:**
There is no Content Security Policy defined, either as a `<meta http-equiv="Content-Security-Policy">` tag or via HTTP response headers. Without CSP, any script injected via XSS or a compromised third-party resource will execute without restriction. CSP is the primary defense-in-depth layer against cross-site scripting.

**Fix:**
Add a CSP meta tag to `<head>` or, preferably, configure it as an HTTP header via `netlify.toml` / `_headers`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://kit.fontawesome.com https://assets.calendly.com https://cdn.jsdelivr.net https://www.clarity.ms 'unsafe-inline';
  style-src 'self' https://fonts.googleapis.com https://assets.calendly.com 'unsafe-inline';
  font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com;
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://calendly.com;
  frame-src https://calendly.com;
">
```

For a Netlify deployment, create a `_headers` file:
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://kit.fontawesome.com https://assets.calendly.com https://cdn.jsdelivr.net https://www.clarity.ms 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com https://assets.calendly.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://calendly.com; frame-src https://calendly.com;
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

### 3. Plaintext Email Address Exposed in HTML

**Severity:** HIGH
**OWASP Category:** A01:2021 - Broken Access Control (Information Disclosure)
**Location:** `index.html` line 479, line 148 (`mailto:` link)

**Description:**
The email address `Mukuljangra5@gmail.com` is visible in plaintext in two places:
- **Line 479:** Displayed as an `<h3>` element in the footer contact section
- **Line 148:** In a `mailto:` hyperlink in the navigation social media section

Automated email harvesting bots routinely scrape HTML source for email addresses matching common patterns. This will result in increased spam and potential targeted phishing attacks against the site owner.

**Fix:**
Option A -- JavaScript obfuscation:
```javascript
// Decode at runtime; bots typically don't execute JS
const user = 'mukuljangra5';
const domain = 'gmail.com';
document.getElementById('email-display').textContent = user + '@' + domain;
document.getElementById('email-link').href = 'mailto:' + user + '@' + domain;
```

Option B -- HTML entity encoding:
```html
<h3>&#109;&#117;&#107;&#117;&#108;&#106;&#97;&#110;&#103;&#114;&#97;&#53;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;</h3>
```

Option C -- Remove the displayed email entirely and rely on the contact form as the sole contact method.

---

### 4. Contact Form Missing Spam Protection (No Honeypot or CAPTCHA)

**Severity:** MEDIUM
**OWASP Category:** A07:2021 - Identification and Authentication Failures
**Location:** `index.html` lines 447-464

**Description:**
The contact form uses the `netlify` attribute for form handling but has:
- No `netlify-honeypot` attribute (Netlify's built-in bot detection)
- No CAPTCHA or reCAPTCHA integration
- No rate limiting (client-side or server-side)

This makes the form an easy target for spam bots, which can flood the inbox with junk submissions, phishing attempts, or abuse the form to send spam via notification emails.

**Fix:**
Add Netlify's built-in honeypot field:
```html
<form name="contactus" netlify netlify-honeypot="bot-field" method="POST">
  <p class="hidden" style="display:none;">
    <label>Don't fill this out: <input name="bot-field" /></label>
  </p>
  <!-- rest of form -->
</form>
```

Additionally, consider adding Netlify's reCAPTCHA integration:
```html
<form name="contactus" netlify netlify-recaptcha method="POST">
  <div data-netlify-recaptcha="true"></div>
  <!-- rest of form -->
</form>
```

---

### 5. Missing `rel="noopener noreferrer"` on External Links with `target="_blank"`

**Severity:** MEDIUM
**OWASP Category:** A05:2021 - Security Misconfiguration
**Location:** `index.html` lines 253, 269, 357

**Description:**
Three external links open in new tabs via `target="_blank"` but are missing the `rel="noopener noreferrer"` attribute:

| Line | Link Text | Destination |
|------|-----------|-------------|
| 253 | "Read More" (Springer research) | `https://link.springer.com/chapter/10.1007/978-981-16-8721-1_25` |
| 269 | "Read More" (EI 2025 research) | `https://doi.org/10.2352/EI.2025.37.3.MOBMU-312` |
| 357 | "Read More" (Vampire Attacks project) | `https://github.com/mukul975/Vampire-Attacks...` |

Without `rel="noopener"`, the opened page gains access to the `window.opener` object, potentially allowing it to redirect the original page (reverse tabnabbing attack). Without `rel="noreferrer"`, the full referrer URL is leaked to the destination site.

**Note:** Modern browsers (Chrome 88+, Firefox 79+, Safari 12.1+) now implicitly add `rel="noopener"` for `target="_blank"` links. However, older browsers remain vulnerable, and explicit declaration is a best practice.

**Fix:**
Add `rel="noopener noreferrer"` to all three links:
```html
<!-- Line 253 -->
<a href="https://link.springer.com/chapter/10.1007/978-981-16-8721-1_25" target="_blank" rel="noopener noreferrer">Read More</a>

<!-- Line 269 -->
<a href="https://doi.org/10.2352/EI.2025.37.3.MOBMU-312" target="_blank" rel="noopener noreferrer">Read More</a>

<!-- Line 357 -->
<a href="https://github.com/mukul975/Vampire-Attacks-Draining-Life-from-Wireless-Ad-Hoc-Sensor-Networks" target="_blank" rel="noopener noreferrer" class="read-more-btn">Read More <i class="fas fa-arrow-right"></i></a>
```

---

### 6. Multiple Inline `<script>` Blocks Increase XSS Attack Surface

**Severity:** MEDIUM
**OWASP Category:** A03:2021 - Injection
**Location:** `index.html` lines 8-14, 15-21, 51-123, 483-493

**Description:**
Four inline `<script>` blocks exist in the HTML:

| Lines | Purpose |
|-------|---------|
| 8-14 | Google Analytics (gtag) initialization |
| 15-21 | Microsoft Clarity initialization |
| 51-123 | JSON-LD structured data |
| 483-493 | Calendly badge widget initialization |

Inline scripts make it impossible to use a strict CSP without `'unsafe-inline'`, which significantly weakens the policy. If any XSS vector is found, inline scripts cannot be distinguished from attacker-injected scripts.

**Note:** The JSON-LD block (lines 51-123) is `type="application/ld+json"` and is not executable, so it poses no XSS risk. The other three are executable inline scripts.

**Fix:**
Move all inline JavaScript into external `.js` files and reference them with `<script src="...">`. This enables a CSP with nonce-based or hash-based script-src, eliminating `'unsafe-inline'`:

```html
<!-- Instead of inline scripts -->
<script src="analytics.js"></script>
<script src="clarity.js"></script>
<script src="calendly-init.js"></script>
```

Alternatively, if inline scripts must remain, use CSP nonces:
```html
<meta http-equiv="Content-Security-Policy" content="script-src 'nonce-abc123' https://...">
<script nonce="abc123">/* analytics code */</script>
```

---

### 7. Calendly Links with Empty `href=""` and `onclick` Handler

**Severity:** MEDIUM
**OWASP Category:** A05:2021 - Security Misconfiguration
**Location:** `index.html` lines 174, 219, 498

**Description:**
Three anchor elements use the pattern:
```html
<a href="" onclick="Calendly.initPopupWidget({...});return false;">...</a>
```

Issues:
1. **Graceful degradation failure:** If JavaScript is disabled or fails to load (network error, ad blocker blocking Calendly), clicking the link navigates to `href=""`, which resolves to the current page. The user gets no feedback and no way to schedule.
2. **Inline event handlers:** The `onclick` attribute is an inline event handler that conflicts with strict CSP policies and is considered a bad practice per OWASP guidelines.

**Fix:**
Use a meaningful fallback URL and attach event handlers via JavaScript:
```html
<a href="https://calendly.com/mukuljangra5" class="calendly-trigger">LET'S Connect!</a>
```
```javascript
document.querySelectorAll('.calendly-trigger').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    Calendly.initPopupWidget({
      url: 'https://calendly.com/mukuljangra5?hide_gdpr_banner=1&background_color=25262a&text_color=ffffff&primary_color=64f4ac'
    });
  });
});
```

---

### 8. `innerHTML` Usage in JavaScript

**Severity:** MEDIUM
**OWASP Category:** A03:2021 - Injection (DOM-based XSS)
**Location:** `script.js` line 94

**Description:**
The greeting animation function uses `innerHTML`:
```javascript
greetingText.innerHTML = '';
```

While the current usage is safe (setting to an empty string, and subsequent content is inserted via `document.createElement` and `textContent`), the use of `innerHTML` establishes a pattern that could become dangerous if the code is modified to accept user-controlled input in the future. The greeting strings are hardcoded, so this is currently a low practical risk.

**Fix:**
Replace `innerHTML = ''` with a safer DOM method:
```javascript
while (greetingText.firstChild) {
  greetingText.removeChild(greetingText.firstChild);
}
```

---

### 9. Duplicate Calendly Script and Stylesheet Loading

**Severity:** LOW
**OWASP Category:** A05:2021 - Security Misconfiguration
**Location:** `index.html` lines 481-482 and 496-497

**Description:**
The Calendly widget CSS and JS are loaded twice:
```
Line 481: <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
Line 482: <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
Line 496: <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
Line 497: <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
```

This doubles the external network requests and attack surface. Each additional external resource is a potential vector for supply-chain attacks. Additionally, `type="text/javascript"` is redundant in HTML5 (browsers default to JavaScript).

**Fix:**
Remove the duplicate loading (keep only one set, preferably in `<head>` or at the end of `<body>`). Remove the redundant `type="text/javascript"` attribute:
```html
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

---

### 10. Google Fonts Loaded Without Preconnect

**Severity:** LOW
**OWASP Category:** A05:2021 - Security Misconfiguration
**Location:** `index.html` lines 42-49

**Description:**
Eight Google Fonts stylesheets are loaded from `fonts.googleapis.com` without `<link rel="preconnect">` hints. While not a direct security vulnerability, each external CSS request can:
- Leak referrer information to Google
- Be intercepted on insecure networks (though Google enforces HTTPS)
- Increase dependency on third-party availability

Additionally, none of the Google Fonts `<link>` tags include SRI hashes.

**Fix:**
Add preconnect hints and consider self-hosting fonts for maximum security and privacy:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

For maximum control, self-host fonts using tools like `google-webfonts-helper`.

---

### 11. Analytics and Tracking IDs Exposed in Source

**Severity:** INFO
**OWASP Category:** N/A (Information Disclosure)
**Location:** `index.html` lines 7, 13 (Google Analytics), line 20 (Microsoft Clarity)

**Description:**
The following tracking identifiers are visible in the HTML source:
- **Google Analytics:** `G-4G5DVR6FCK` (lines 7, 13)
- **Microsoft Clarity:** `lb9967r49a` (line 20)

These identifiers are inherently public (they must be client-side to function) and pose no direct security risk. However, they can be:
- Used to confirm site ownership / identity correlation
- Potentially abused to send fake analytics data (referrer spam)
- Used for OSINT (Open Source Intelligence) fingerprinting

**Fix:**
No action required. This is expected and acceptable behavior for client-side analytics. For awareness: anyone can send fake events to these tracking IDs, so do not rely solely on analytics data for security-sensitive decisions.

---

### 12. Calendly Username Exposed in Multiple Locations

**Severity:** INFO
**OWASP Category:** N/A (Information Disclosure)
**Location:** `index.html` lines 174, 219, 486, 498

**Description:**
The Calendly scheduling URL `https://calendly.com/mukuljangra5` is embedded in four places, exposing the Calendly username. This is by design (needed for the widget to function) but worth noting:
- Reveals the email-based username pattern
- Calendly page may expose additional personal scheduling information
- Could be used in social engineering attempts

**Fix:**
No action required if the Calendly page is intentionally public. Ensure Calendly privacy settings are configured appropriately.

---

## Summary of Recommendations (Priority Order)

| Priority | Finding | Action |
|----------|---------|--------|
| 1 | No CSP | Add Content Security Policy via meta tag or HTTP headers |
| 2 | No SRI on external scripts | Add integrity attributes to version-pinned external scripts |
| 3 | Plaintext email | Obfuscate email or switch to contact-form-only approach |
| 4 | No form spam protection | Add `netlify-honeypot` and/or reCAPTCHA to the contact form |
| 5 | Missing `rel="noopener noreferrer"` | Add to all 3 `target="_blank"` links that lack it |
| 6 | Inline scripts | Move to external files to enable strict CSP |
| 7 | Empty `href` on Calendly links | Use meaningful fallback URL and unobtrusive JS |
| 8 | `innerHTML` usage | Replace with safe DOM manipulation methods |
| 9 | Duplicate Calendly resources | Remove duplicate `<link>` and `<script>` tags |
| 10 | Google Fonts preconnect | Add `rel="preconnect"` hints or self-host fonts |

---

## Links with `target="_blank"` -- Full Audit

| Line | Has `rel="noopener noreferrer"` | Status |
|------|---------------------------------|--------|
| 146 | Yes | OK |
| 147 | Yes | OK |
| 253 | **No** | NEEDS FIX |
| 269 | **No** | NEEDS FIX |
| 308 | Yes | OK |
| 316 | Yes | OK |
| 324 | Yes | OK |
| 357 | **No** | NEEDS FIX |
| 511 | Yes | OK |
| 514 | Yes | OK |
| 519 | Yes | OK |

**Result:** 3 out of 11 external `target="_blank"` links are missing `rel="noopener noreferrer"`.

---

## Missing Security Headers

The site has no `netlify.toml`, `_headers`, or `.htaccess` file. The following security headers are recommended:

| Header | Recommended Value | Purpose |
|--------|-------------------|---------|
| `Content-Security-Policy` | See Finding #2 | Prevent XSS and injection |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unused browser APIs |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforce HTTPS |

---

*End of Security Audit Report*
