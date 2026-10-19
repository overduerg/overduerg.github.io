# overduerg.github.io

Personal site showcasing games I've made, games I've played, and my programming projects.

Built with [Astro](https://astro.build) + TypeScript + Tailwind CSS v4, deployed to GitHub
Pages via GitHub Actions.

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start local dev server at `localhost:4321`  |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally        |

## Adding content

All content lives in `src/content/` as MDX files, validated by the schemas in
`src/content.config.ts`:

- `src/content/games-made/` — games you made / are making (shown under **Produce**)
- `src/content/games-played/` — your gaming log, status + rating (shown under **Consume**)

Copy an existing entry and edit the frontmatter. Set `featured: true` to surface an entry
on the homepage.

### Adding a card with an image + title

Two steps — drop the image next to the entry, point to it in the frontmatter:

1. **Put the image beside the entry file.** Any name works:

   ```
   src/content/games-made/my-game.mdx
   src/content/games-made/my-game-cover.jpg   ← the image
   ```

2. **Add one line to the frontmatter**, using a path relative to the entry file:

   ```yaml
   ---
   title: My Game          # ← shown on the card
   cover: ./my-game-cover.jpg
   status: in-development
   ---
   ```

That's it — the card renders the image with the title. If you omit `cover`, the card falls
back to a styled letter placeholder, so images are always optional.

**Recommended image sizes**

| Collection      | Aspect | Size            |
| :-------------- | :----- | :-------------- |
| `games-made`    | 16:9   | 1280 × 720      |
| `games-played`  | 1:1    | 512 × 512       |
`.jpg`, `.png`, `.webp` and `.avif` all work. Astro optimizes and resizes them at build
time — use large originals, don't pre-shrink them.

Prefer folders? Nesting works too:

```
src/content/games-played/minecraft/
├── index.mdx
└── cover.jpg        →  cover: ./cover.jpg
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
deploys it to GitHub Pages. In the repo settings, set **Pages → Source → GitHub Actions**.

## Structure

```
src/
├── components/     # Reusable Astro components (cards, header, footer)
├── content/        # MDX content collections
├── content.config.ts
├── consts.ts       # Site name, tagline, contact details
├── layouts/        # BaseLayout (head, fonts, meta, view transitions)
├── pages/          # Routes: /, /projects/, /projects/produce/, /projects/consume/, /contact/
├── scripts/        # Vanilla TS (theme toggle, reveal-on-scroll, filters)
└── styles/         # Tailwind v4 CSS-first config + design tokens
```
