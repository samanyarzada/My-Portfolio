# QA Checklist: Saman.dev Portfolio

- **Live URL:** (add after deploy)
- **Repository:** https://github.com/samanyarzada/ (add repo name)
- **Tested by:** Saman Yarzada
- **Date:** ____
- **Browsers:** Chrome ____ , (second browser) ____

Result column: PASS / FAIL (fixed). Evidence: short note or screenshot file name.

## 1. Navigation and links

| # | Test | Result | Evidence / fix |
|---|------|--------|----------------|
| 1.1 | Navbar: Home, Projects, Skills, About, Blog, Contact each open the right page | | |
| 1.2 | Active link is highlighted | | |
| 1.3 | Mobile menu opens, closes with link click and Escape | | |
| 1.4 | Footer links work | | |
| 1.5 | Project links (5 live demos) open the live sites | | |
| 1.6 | Project links (5 GitHub repos) open the right repositories | | |
| 1.7 | GitHub, LinkedIn, Telegram icons open the right profiles | | |
| 1.8 | Unknown URL (for example /xyz) shows the 404 page | | |
| 1.9 | Direct open of /blog/react-router-introduction works on the live site (no 404 after refresh) | | |

## 2. Contact form

| # | Test | Result | Evidence / fix |
|---|------|--------|----------------|
| 2.1 | Empty submit: all four fields show an error, focus goes to the first field | | |
| 2.2 | Invalid email (abc@) shows the email error | | |
| 2.3 | Message shorter than 10 characters shows an error | | |
| 2.4 | Message longer than 1000 characters shows an error | | |
| 2.5 | Valid submit: button shows "Sending...", then success card | | |
| 2.6 | The email really arrived in the inbox | | |
| 2.7 | No access key: honest error, no fake success | | |
| 2.8 | Offline (DevTools > Network > Offline): network error shown, no success | | |
| 2.9 | Double click on Send does not send twice | | |
| 2.10 | Send Email button opens the mail app, address is not visible in the page text | | |

## 3. Responsive layout

| # | Width | Result | Evidence / fix |
|---|-------|--------|----------------|
| 3.1 | Phone 360 px: no horizontal scroll, nothing clipped | | |
| 3.2 | Phone 390 px (all 7 pages) | | |
| 3.3 | Tablet 768 px | | |
| 3.4 | Tablet 1024 px: navbar does not wrap or overlap | | |
| 3.5 | Laptop 1366 px | | |
| 3.6 | Desktop 1920 px | | |
| 3.7 | Persian (RTL) at 360 px and 1366 px | | |

## 4. Console and errors

| # | Test | Result | Evidence / fix |
|---|------|--------|----------------|
| 4.1 | Console has no red errors on each page (Home, Projects, Skills, About, Blog, a post, Contact) | | |
| 4.2 | Console has no React warnings (keys, hooks) | | |
| 4.3 | `npm run lint` finishes without errors | | |
| 4.4 | `npm run build` finishes without errors | | |

## 5. Loading and error states

| # | Test | Result | Evidence / fix |
|---|------|--------|----------------|
| 5.1 | Page change shows the loader (DevTools > Network > Slow 3G) | | |
| 5.2 | Project screenshot shows a skeleton while loading | | |
| 5.3 | Missing screenshot shows the fallback box | | |
| 5.4 | Blog search with no result shows the empty state | | |
| 5.5 | Wrong article slug shows "Article not found" | | |
| 5.6 | Wrong category shows "Category not found" | | |
| 5.7 | Contact form states: idle, sending, success, error | | |

## 6. Accessibility

| # | Test | Result | Evidence / fix |
|---|------|--------|----------------|
| 6.1 | Tab goes through the whole page in a logical order | | |
| 6.2 | Focus outline is visible on every link, button and input | | |
| 6.3 | "Skip to main content" appears on the first Tab and works | | |
| 6.4 | Every image has useful alt text (decorative ones are hidden) | | |
| 6.5 | Every form field has a connected label (click the label, the input gets focus) | | |
| 6.6 | Errors are announced (aria-describedby, role="alert") | | |
| 6.7 | Page has one h1 and headings do not skip levels | | |
| 6.8 | Text contrast is at least 4.5:1 (DevTools > Inspect > Contrast) | | |
| 6.9 | Language switch updates `lang` and `dir` on the html tag | | |
| 6.10 | Reduced motion: animations stop (DevTools > Rendering > Emulate prefers-reduced-motion) | | |
| 6.11 | Lighthouse Accessibility score | | score: ____ |

## 7. Performance

Measured the same way before and after: Lighthouse, Mobile, on the production build (`npm run build` then `npm run preview`) or on the live URL.

| Metric | Before | After |
|--------|--------|-------|
| Performance score | | |
| LCP | | |
| Total Blocking Time | | |
| CLS | | |
| Total page weight (Network tab) | | |

| # | Test | Result | Evidence / fix |
|---|------|--------|----------------|
| 7.1 | Every project screenshot is under 200 KB (WebP) | | |
| 7.2 | Profile photo is optimized | | |
| 7.3 | Pages are lazy loaded (separate JS files in Network tab) | | |
| 7.4 | Fonts use display=swap and only the needed weights | | |
| 7.5 | No layout jump when images load (width and height are set) | | |

## 8. Code and deployment

| # | Test | Result | Evidence / fix |
|---|------|--------|----------------|
| 8.1 | Folder structure is organized (components, pages, data, hooks, utils) | | |
| 8.2 | No unused files or commented-out code | | |
| 8.3 | `.env` is in `.gitignore` and not pushed | | |
| 8.4 | Environment variable is set on Vercel/Netlify | | |
| 8.5 | Live version opens, all pages work, form sends a real message | | |
| 8.6 | Refreshing a deep link (/blog/some-post) works on the live site | | |

## Issues found and fixed

| Issue | How I found it | Fix |
|-------|----------------|-----|
| | | |