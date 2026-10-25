# Saman.dev: Personal Developer Portfolio

A bilingual (English / Persian) portfolio and blog built with **React**, **Vite** and **React Router**, styled with plain CSS. Projects and articles are stored in **Supabase** and managed from a built-in admin panel, so content changes never need a code change or a new deploy.

- **Live site:** https://saman-yarzada.vercel.app/
- **Author:** Saman Yarzada, Front-end Developer, Herat, Afghanistan
- **GitHub:** https://github.com/samanyarzada
- **LinkedIn:** https://www.linkedin.com/in/saman-yarzada-30398742b/
- **Telegram:** https://t.me/samanyarzada

---

## About the project

Saman.dev was built as the final portfolio assignment of a React course, then extended with a database and an admin panel. It shows who I am, my skills and the real projects I built, and gives visitors a contact form that really sends messages.

## Pages

| Page | Route | What it shows |
|------|-------|---------------|
| Home | `/` | Name, role, introduction, buttons for projects and contact, highlights, latest articles |
| Projects | `/projects` | Projects with screenshot, description, features, live demo and source code links |
| Skills | `/skills` | Skills with an honest level for each, and the React concepts used in this site |
| About | `/about` | Biography, learning journey, goals, education, experience and certificate |
| Blog | `/blog` | Articles with search, category filter and pagination |
| Article | `/blog/:slug` | Markdown text, reading progress bar, author box, previous / next and related articles |
| Category / Tag | `/category/:name`, `/tag/:name` | Articles filtered by category or tag |
| Contact | `/contact` | Validated contact form with a real submission, plus email and social links |
| Admin | `/admin` | Sign-in and content management (not linked from the public site) |
| 404 | `*` | Friendly page for unknown addresses |

## Features

**Public site**
- English (LTR) and Persian (RTL) with one click. The layout mirrors automatically using CSS logical properties
- Dark theme by default and a light theme with the same look. The choice is saved and applied before the first paint, so there is no flash
- Separate screenshots and cover images for each theme (`name.webp` and `name-light.webp`), with a safe fallback
- Blog search, category filter and pagination stored in the URL, so links can be shared and the back button works
- Article text is written in Markdown and rendered safely (raw HTML is not executed)
- Responsive from phone to desktop, keyboard friendly, with a skip link and visible focus
- Loading states (page loader, image skeletons) and error states (`ErrorBoundary`, image fallbacks, empty states)

**Contact form**
- Labelled fields, validation with clear messages and a character counter
- Real submission through Web3Forms. Success is shown only when the service confirms it. Offline, timeout, rejection and missing configuration each show an honest error
- Double-submit protection and a hidden honeypot field against bots
- The email address is never written in the page text. It is joined only when the visitor clicks "Send Email"

**Admin panel**
- Secure sign-in with a protected route and a redirect back to the page you wanted
- Add, edit, delete, reorder and hide projects
- Write, edit, publish, feature and delete articles, with drafts
- Markdown editor with a toolbar (`Ctrl+B` / `Ctrl+I`), live preview and a quick guide
- Image upload for dark and light versions. Images are resized and converted to WebP in the browser (max 500 KB)
- Toast messages, confirm dialogs before delete, and a warning before leaving with unsaved changes
- English and Persian interface, dark and light theme
- The panel is a separate lazy-loaded bundle, so visitors never download it

## How it is secured

The panel's buttons are only convenience. The real protection is in the database:

- **Row Level Security** is on for every table. Everyone can read published content. Only the admin account can write.
- A private `admins` table lists who may write. A signed-in user who is not in it cannot change anything.
- Drafts and hidden projects are blocked by the database, so they never reach the visitor's browser.
- Public sign-up is turned off in Supabase.
- Only the public `anon` key is used in the site. The `service_role` key is never used or stored.
- Admin pages ask search engines not to index them (`noindex`).

`scripts/check-rls.mjs` tests this from the point of view of an anonymous visitor. Every check must print `PASS`.

## Tech stack

- **React** (hooks, Context API, custom hooks, `lazy` and `Suspense`)
- **React Router** (nested routes with `Outlet`, dynamic params, `NavLink`, `useSearchParams`, protected routes)
- **Vite** as the build tool
- **Plain CSS** with CSS custom properties (design tokens)
- **Supabase** (Postgres database, authentication and file storage)
- **react-markdown** with **remark-gfm** for article text
- **Web3Forms** for contact messages
- **ESLint** for code quality
- **Vercel** for hosting

## Getting started

**Requirements:** Node.js 20.19 or newer and npm.

```bash
git clone https://github.com/samanyarzada/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
npm install
```

Create a `.env` file in the project root (see below), then:

```bash
npm run dev
```

The site opens at `http://localhost:5173`.

### Environment variables

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
WEB3FORMS_KEY=your-web3forms-access-key
```

- Vite only exposes variables whose names start with a prefix listed in `envPrefix` in `vite.config.js` (`VITE_` and `WEB3FORMS_`). A variable with another name is silently `undefined`.
- Restart `npm run dev` after changing `.env`.
- `.env` is in `.gitignore` and must never be committed.
- Without the Supabase keys the public site shows the built-in content and the admin panel says it is not available. Without the Web3Forms key the contact form shows an honest "not set up" error.

### Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build in `dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with ESLint |
| `node --env-file=.env scripts/seed.mjs` | One-time import of the built-in projects, articles and categories into the database |
| `node --env-file=.env scripts/check-rls.mjs` | Test that visitors can read but cannot write |

## Database setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, create these tables with Row Level Security enabled: `admins`, `categories`, `projects`, `posts` and `profile`. Add the policies "everyone reads published content, only an admin writes", the `is_admin()` function and a public storage bucket named `media` (max 500 KB, WebP / JPEG / PNG).
3. In **Authentication**, create the admin user with an email and a strong password, then add that user to the `admins` table.
4. Turn off **Allow new users to sign up**.
5. Copy the project URL and the `anon` key into `.env`.
6. Run the seed script once, then run the security check:

```bash
# PowerShell: set the admin credentials for this session only
$env:ADMIN_EMAIL='admin@example.com'
$env:ADMIN_PASSWORD='your-password'
node --env-file=.env scripts/seed.mjs
Remove-Item Env:ADMIN_PASSWORD
node --env-file=.env scripts/check-rls.mjs
```

The seed script refuses to run if the database already has data, so it cannot overwrite changes made in the panel.

## Project structure

```
├── scripts/
│   ├── seed.mjs             # one-time data import
│   └── check-rls.mjs        # security check
├── public/
│   ├── favicon.svg
│   └── images/              # project screenshots and article covers (dark and -light versions)
├── src/
│   ├── assets/images/       # profile photos
│   ├── components/          # reusable UI parts
│   ├── context/             # Language, Theme, Content (database) providers
│   ├── data/                # profile.js, projects.js, posts.js, fallback.js
│   ├── hooks/               # useTranslation, useTheme, useContent, useContactForm ...
│   ├── i18n/                # English and Persian texts
│   ├── layouts/             # MainLayout
│   ├── lib/                 # supabase client, content loading, mappers, image upload
│   ├── pages/               # public pages
│   │   └── Admin/           # sign-in, layout, lists, forms, Markdown editor (lazy-loaded)
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

## How the content flows

1. `ContentProvider` loads categories, published projects and published articles from Supabase once, and shares them with every page.
2. While it loads, pages show a loader. If the database cannot be reached, the site falls back to the built-in content in `src/data/` instead of showing an empty page. An empty database result is not treated as an error.
3. After you save in the admin panel, the public site reloads its data, so the change is visible immediately.

## Deployment

The site is deployed on **Vercel**.

1. Push the repository to GitHub.
2. Import it in Vercel (Framework: Vite, build command `npm run build`, output `dist`).
3. Add the three environment variables from the section above.
4. Deploy. After changing an environment variable, redeploy, because Vite reads it at build time.

`vercel.json` rewrites every address to `index.html`, so opening or refreshing a deep link such as `/blog/some-article` or `/admin/login` works instead of returning a 404.

Every branch also gets its own Vercel preview address, which is how the admin panel was tested before it was merged into `main`.

## Quality checks

The full checklist with evidence is in [`docs/QA-checklist.md`](docs/QA-checklist.md). It covers navigation and links, the contact form with valid and invalid data, phone / tablet / desktop layouts, the browser console, loading and error states, keyboard and accessibility checks, performance and the live version.

## Known limitations

- Categories and the profile text (bio, skills, learning journey, goals) are not editable from the panel yet. Categories are edited in the Supabase table editor and the profile in `src/data/profile.js`.
- Images already in `public/images` are not removed by the panel. Only images uploaded from the panel are deleted together with their project or article.
- Articles load in one request. This is fine for dozens of articles, but a very large blog would need the list and the text loaded separately.
- Article text is rendered in the browser, so search engines see less of it than server-rendered pages.
- The contact form depends on the Web3Forms service.
- Tailwind CSS is part of the build setup, but the site is styled with plain CSS.

## What I learned

- Planning the folder structure first makes everything faster.
- Data that can be calculated (for example from the URL) should not be copied into a second state.
- A form must never show success unless the server confirms it.
- The interface only guides the user. Real security belongs in the database rules.
- Testing is part of the work. QA found problems I did not see by eye.

## Contact

Use the contact form on the site, or reach me here:

- GitHub: [@samanyarzada](https://github.com/samanyarzada)
- LinkedIn: [Saman Yarzada](https://www.linkedin.com/in/saman-yarzada-30398742b/)
- Telegram: [@samanyarzada](https://t.me/samanyarzada)

---

Built by Saman Yarzada.