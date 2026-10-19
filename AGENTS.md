# AGENTS.md

## Project overview

Personal portfolio/gaming site for GitHub Pages (`https://overduerg.github.io`).

- **Astro 7** (static output) + **TypeScript** (strict)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin — NOT `@astrojs/tailwind`
  (deprecated). Config is CSS-first in `src/styles/global.css` (`@theme` / `@theme inline`).
- **Content Collections** (MDX) defined in `src/content.config.ts` with Zod schemas:
  `games-made`, `games-played`, `projects`.
- **View transitions** via `<ClientRouter />` in `src/layouts/BaseLayout.astro`.
- Vanilla TS only for interactivity (`src/scripts/site.ts`). No UI frameworks — do not add
  React/Vue/Svelte islands without asking.
- Deploy: `.github/workflows/deploy.yml` (`withastro/action@v6` → GitHub Pages on push to
  `main`).
- **Routing:** `/` home (hero + Make & Play categories), `/projects/` hub with two
  category tiles, `/projects/produce/` games made (`games-made` collection),
  `/projects/consume/` favourite games (`games-played` collection), `/contact/`. There
  is no top-level `/games/` route.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (validates content schemas)
- `npm run preview` — serve the built site

## Conventions

- Dark-first theming: `.dark` class on `<html>`, colors are CSS vars in `global.css`
  exposed as Tailwind colors (`bg-bg`, `text-ink`, `border-line`, `text-accent`, ...).
  Use them instead of raw Tailwind palette colors.
- Scroll animations: add `data-reveal` (+ optional `style="--i:N"` stagger) to elements;
  `site.ts` handles the IntersectionObserver. All client scripts must use `document`-
  level delegated listeners or `astro:page-load` so they survive view transitions.
- Content entries: copy an existing MDX file; every frontmatter field must validate
  against the collection schema. `featured: true` shows an entry on the homepage.
- Covers are optional and co-located: an image beside the entry file referenced as
  `cover: ./name.jpg` (relative to the entry). Schemas use `image()` from the schema
  helper; cards/detail pages render it via `astro:assets` `<Image>` and fall back to a
  letter placeholder when `cover` is absent.
- Site-wide strings (name, tagline, contact links) live in `src/consts.ts`.
