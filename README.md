# Saman.dev: Personal Developer Portfolio

A bilingual (English / Persian) portfolio and blog built with **React**, **Vite** and **React Router**, styled with plain CSS. It shows who I am, the skills I actually use, the real projects I built in my React course, and gives visitors a contact form that really sends messages.

- **Live site:** https://YOUR-PORTFOLIO-URL.vercel.app
- **Author:** Saman Yarzada, Front-end Developer, Herat, Afghanistan
- **GitHub:** https://github.com/samanyarzada
- **LinkedIn:** https://www.linkedin.com/in/saman-yarzada-30398742b/
- **Telegram:** https://t.me/samanyarzada

> Replace `YOUR-PORTFOLIO-URL` with the real address after deployment.

---

## About the project

Saman.dev was built as the final portfolio assignment of a React course. The goal is a professional, easy-to-navigate site that proves practical skills, not a static mockup: every link works, the form sends real emails, and the code is organized so I can explain every part of it.

## Sections

| Page | Route | What it shows |
|------|-------|---------------|
| Home / Hero | `/` | Name, role, short introduction, buttons for projects and contact, highlights, latest articles |
| Projects | `/projects` | All course projects with screenshot, description, features, live demo and source code links |
| Skills | `/skills` | Skills grouped by area, with an honest level for each, plus the React concepts used in this site |
| About | `/about` | Biography, learning journey, goals, education, experience and certificate |
| Blog | `/blog` | Articles with search, category filter and pagination |
| Article | `/blog/:slug` | Reading progress bar, author box, previous / next and related articles |
| Category / Tag | `/category/:name`, `/tag/:name` | Articles filtered by category or tag |
| Contact | `/contact` | Validated contact form with a real submission, plus email and social links |
| 404 | `*` | Friendly page for unknown addresses |

## Features

**Content and navigation**
- Sticky navbar with active link highlight and a mobile menu (closes with link click or `Escape`)
- Projects rendered from data with `map` into one reusable `ProjectCard`
- Blog search, category filter and pagination stored in the URL (`/blog?q=react&category=css&page=2`), so links can be shared and the back button works

**Bilingual**
- English (LTR) and Persian (RTL) with one click
- Layout mirrors automatically using CSS logical properties
- Vazirmatn font for Persian, Inter for English, Persian digits and dates
- The choice is saved in `localStorage`

**Themes**
- Dark theme by default and a light theme with the same look and feel
- Separate screenshots and profile photo for each theme (`name.webp` and `name-light.webp`), with a safe fallback
- The choice is saved in `localStorage` and applied before the first paint, so there is no flash

**Contact form**
- Labelled fields, validation with clear error messages, character counter
- Real submission through Web3Forms
- Success is shown only when the service confirms it. Offline, timeout, server rejection and missing configuration each show an honest error
- Double-submit protection and a hidden honeypot field against bots
- The email address is never written in the page text. It is joined only when the visitor clicks "Send Email"

**Quality**
- Loading states: page loader (`Suspense`), image skeletons, button spinner
- Error states: `ErrorBoundary`, image fallbacks, empty states, "not found" pages
- Accessibility: skip link, visible focus, labels connected to inputs, `aria-describedby` and `role="alert"` for errors, alt text for images, `prefers-reduced-motion` support
- Performance: lazy-loaded pages, lazy images with width and height, WebP images, only the needed font weights

## Projects shown in the portfolio

| Project | Description | Live | Code |
|---------|-------------|------|------|
| Pro Dashboard | Project-management dashboard with sign-in, analytics and light / dark theme | [Live](https://pro-dashboard-eight.vercel.app/) | [GitHub](https://github.com/samanyarzada/Pro-Dashboard) |
| Nova Store | Responsive e-commerce storefront with search and a shopping cart | [Live](https://nova-store-steel.vercel.app/) | [GitHub](https://github.com/samanyarzada/Nova-Store) |
| CourseHub | Course enrollment dashboard with schedule and enrollment status | [Live](https://coursehub-react-ecru.vercel.app/) | [GitHub](https://github.com/samanyarzada/coursehub-react) |
| Stationery Stock Monitor | Inventory manager in plain HTML, CSS and JavaScript | [Live](https://stationery-stock-monitor.vercel.app/) | [GitHub](https://github.com/samanyarzada/Stationery-Stock-Monitor) |
| Ledgerline UI | Accounting dashboard UI kit, theme and language switching with pure CSS | [Live](https://ledgerline-ui.vercel.app/) | [GitHub](https://github.com/samanyarzada/ledgerline-ui) |

Stationery Stock Monitor and Ledgerline UI are not React projects. They are included to show HTML, CSS and JavaScript fundamentals without a framework.

## Tech stack

- **React** (hooks: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`)
- **React Router** (nested routes with `Outlet`, dynamic params, `NavLink`, `useSearchParams`, `useLocation`)
- **Vite** as the build tool
- **Plain CSS** with CSS custom properties (design tokens) for themes, spacing and colors
- **Web3Forms** for sending contact messages without a backend
- **ESLint** for code quality
- **Vercel** for hosting

## React concepts used

| Concept | Where |
|---------|-------|
| `useState`, controlled inputs | Contact form, mobile menu, theme and language |
| `useEffect` with cleanup | Page titles, scroll listener, saving settings |
| `useRef` | Image cache check, double-submit guard, reading progress bar |
| Context API | `LanguageContext` and `ThemeContext` |
| Custom hooks | `useTranslation`, `useTheme`, `useContactForm`, `usePagination`, `useProfileImage` |
| Routing | Nested layout, dynamic routes, search params, 404 |
| Lists and keys | `projects.map`, posts, skills, timeline |
| Conditional rendering | Empty states, fallbacks, form states |
| Reusable components | `ProjectCard`, `PostCard`, `SectionHeader`, `EmailButton`, `FormField` |
| `React.lazy` and `Suspense` | Page-level code splitting |
| `ErrorBoundary` | Friendly error screen instead of a blank page |

## Getting started

**Requirements:** Node.js 18 or newer and npm.

```bash
# 1. Clone the repository
git clone https://github.com/samanyarzada/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

# 2. Install dependencies
npm install

# 3. Create the environment file (see below)

# 4. Start the development server
npm run dev
```

The site opens at `http://localhost:5173`.

### Environment variable

The contact form needs a free access key from [web3forms.com](https://web3forms.com). Create a file named `.env` in the project root (next to `package.json`):

```
WEB3FORMS_KEY=your-access-key
```

Notes:
- `vite.config.js` exposes variables that start with `VITE_` or `WEB3FORMS_`.
- Restart `npm run dev` after changing `.env`.
- `.env` is listed in `.gitignore` and must not be committed.
- Without a key the form shows an honest "not set up" error and never a fake success message.

### Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build in `dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with ESLint |

## Project structure

```
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── projects/        # project screenshots (dark and -light versions)
│       └── posts/           # article covers (dark and -light versions)
├── src/
│   ├── assets/images/       # profile photos (profile.webp, profile-light.webp)
│   ├── components/          # reusable UI parts (Navbar, Footer, ProjectCard, PostCard, ContactForm ...)
│   ├── context/             # Language and Theme providers
│   ├── data/                # profile.js, projects.js, posts.js
│   ├── hooks/               # useTranslation, useTheme, useContactForm, usePagination ...
│   ├── i18n/                # English and Persian texts
│   ├── layouts/             # MainLayout (navbar, outlet, footer)
│   ├── pages/               # Home, Projects, Skills, About, Blog, PostDetail, Category, Tag, Contact, NotFound
│   ├── styles/              # variables.css, global.css, light.css, tweaks.css
│   ├── utils/               # slugify, format, validators, themedImage
│   ├── App.jsx              # routes and lazy loading
│   └── main.jsx             # providers and router
├── docs/
│   ├── QA-checklist.md
│   └── presentation-outline.md
├── index.html
├── vercel.json              # makes deep links work after refresh
└── vite.config.js
```

## How to edit the content

| I want to change | File |
|------------------|------|
| Name, bio, journey, goals, skills, links | `src/data/profile.js` |
| Add or edit a project | `src/data/projects.js` |
| Add or edit an article | `src/data/posts.js` |
| Interface texts (English and Persian) | `src/i18n/en.js`, `src/i18n/fa.js` |
| Colors, spacing, fonts | `src/styles/variables.css` (dark) and `src/styles/light.css` (light) |

**Adding a project:** add one object to `projects.js` and put two screenshots in `public/images/projects/` (`name.webp` and `name-light.webp`). The card appears automatically.

**Adding an article:** add one object to `posts.js` with `title`, `excerpt` and `content` in both languages. An optional `image` uses the same two-file naming rule. Without an image, a gradient cover is shown.

## Deployment

The site is deployed on **Vercel**.

1. Push the repository to GitHub.
2. Import it in Vercel. Framework: Vite, build command `npm run build`, output `dist`.
3. Add the environment variable `WEB3FORMS_KEY` before deploying.
4. Deploy. After changing an environment variable, redeploy, because Vite reads it at build time.

`vercel.json` rewrites every address to `index.html`, so opening or refreshing a deep link such as `/blog/react-router-introduction` works instead of returning a 404.

## Quality checks

The full checklist with evidence is in [`docs/QA-checklist.md`](docs/QA-checklist.md). It covers navigation and links, the contact form with valid and invalid data, phone / tablet / desktop layouts, the browser console, loading and error states, keyboard and accessibility checks, performance and the live version.

## Known limitations

- Articles are static data in `posts.js`. There is no backend or admin panel.
- The contact form depends on the Web3Forms service.
- Tailwind CSS is installed in the build setup, but this portfolio is styled with plain CSS.
- Some articles use the generated gradient cover because they have no image yet.

## What I learned

- Planning the folder structure first makes everything faster.
- State that can be calculated (for example from the URL) should not be copied into a second state.
- A form must never show success unless the server confirms it.
- Testing is part of the work. QA found problems I did not see by eye.
- Explaining code is harder than writing it, and teaching others helped me understand it better.

## Contact

Use the contact form on the site, or reach me here:

- GitHub: [@samanyarzada](https://github.com/samanyarzada)
- LinkedIn: [Saman Yarzada](https://www.linkedin.com/in/saman-yarzada-30398742b/)
- Telegram: [@samanyarzada](https://t.me/samanyarzada)

---

Built by Saman Yarzada.
