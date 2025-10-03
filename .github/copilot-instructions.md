## Quick context for AI coding agents

This repository is an Astro-based personal blog (theme: Frosti) with an integrated presentation system (reveal.js + Pandoc). Use these notes to be immediately productive when making code changes, adding content, or fixing bugs.

### Big-picture architecture
- Frontend: Astro (see `astro.config.mjs`) producing a static site (`output: "static"`). Integrations: MDX, Tailwind, sitemap, and a Vercel adapter.
- Content: Markdown/MDX under `src/content/`.
  - Blog posts: `src/content/blog/` — schema defined in `src/content/config.ts` (required fields: `title`, `description`, `pubDate`, optional `tags`, `categories`, `draft`, `badge`).
  - Presentations: `src/content/presentations/` — Markdown files converted to reveal.js HTML by `scripts/build-presentations.js`.
- UI: Components live in `src/components/` (MDX helpers in `src/components/mdx/`, layout in `src/layouts/BaseLayout.astro`).
- Site config & i18n: `frosti.config.yaml` is read by `src/config.ts`; translations in `src/i18n/translations.yaml`.

### Critical developer workflows (commands to run)
- Local dev: `npm run dev` (runs `astro dev`).
- Full build: `npm run build` — runs presentations build (conditional), `astro check`, `astro build`, then `pagefind --site dist` to generate search index.
- Presentations (required external):
  - Build all presentations: `npm run build:presentations` (runs `node scripts/build-presentations.js`).
  - Conditionally build presentations during CI: `npm run build:presentations:conditional`.
  - Important: Pandoc must be installed on the machine (the build script aborts if `pandoc --version` fails). See `README.md` for platform install hints.

### Project-specific conventions & patterns (important to follow)
- Content collections use Astro Content: see `src/content/config.ts`. Use the same field names and types (e.g., `pubDate` is a date — use ISO or parseable date). Draft posts use `draft: true` and are filtered out in production by `src/utils/blogUtils.ts`.
- Presentation frontmatter: `scripts/build-presentations.js` expects simple YAML frontmatter keys (examples found in `src/content/presentations/*.md`). Supported keys used by the script: `title`, `author`, `header`, `footer`, `showPageNumber` (string 'false' disables page numbers). Keep frontmatter key/value pairs simple (the script uses a minimal parser — nested YAML is not supported there).
- Presentation output: built HTML files are written to `public/presentations/` mirroring the input structure. The `PresentationViewer` component (`src/components/mdx/PresentationViewer.astro`) embeds these files via an iframe (prop `src`) and provides fullscreen and wheel-navigation messaging.
- i18n and site config: `src/config.ts` reads `frosti.config.yaml` at repo root. If you change the YAML structure, update `src/interface/site.ts` and the consuming code.

### Integration points & external dependencies
- Pandoc: mandatory for presentation builds (scripts call `pandoc`). Install on CI nodes if presentations are built there.
- reveal.js: the Pandoc command in `scripts/build-presentations.js` references `https://unpkg.com/reveal.js@4.6.0` — network access required when building presentations.
- pagefind: used to create a client-side search index post-build (`pagefind --site dist`). Make sure `pagefind` is installed (devDependency) and available in CI PATH.
- Vercel adapter in `astro.config.mjs` — the site expects to be deployable to Vercel but builds as static output.

### Common change patterns & examples (concrete)
- Add a blog post: create a new Markdown/MDX file in `src/content/blog/` with frontmatter matching `src/content/config.ts` schema, then run `npm run dev` or `npm run build`.
- Update presentation styling/headers: either adjust frontmatter keys (`header`, `footer`) or modify `scripts/build-presentations.js` which injects custom CSS/script into generated HTML.
- Add a new translation key: update `src/i18n/translations.yaml` and then call `t('your.key')` via `src/config.ts` to fetch translated labels.

### Debugging tips
- If pages are missing after `astro build`, check `astro.check` output (`npm run build` runs it) and ensure content frontmatter conforms to the zod schema in `src/content/config.ts`.
- Presentation build failures typically show `pandoc` errors; reproduce locally by running the exact `pandoc` command logged by `scripts/build-presentations.js`.
- For search or indexing problems, ensure `pagefind` ran and that `dist/pagefind/` exists before copying into `public/pagefind` (see `npm run search:index`).

### Files to inspect for context when editing
- `astro.config.mjs` — build targets, integrations, markdown transform hooks.
- `src/content/config.ts` — content schema and required fields.
- `scripts/build-presentations.js` and `scripts/conditional-build-presentations.js` — presentation pipeline (Pandoc options, injected CSS/scripts, output paths).
- `src/components/mdx/PresentationViewer.astro` — how presentations are embedded and what iframe messaging the UI expects.
- `frosti.config.yaml` and `src/config.ts` — site-wide configuration and i18n wiring.

If anything above is unclear or you want the file to include more examples (e.g., exact frontmatter snippets or CI notes), tell me which area to expand and I'll iterate.
