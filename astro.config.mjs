// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://overduerg.github.io',
  integrations: [mdx(), sitemap()],
  vite: {
    // Tailwind CSS v4 is integrated via its official Vite plugin
    // (the legacy @astrojs/tailwind integration is deprecated).
    plugins: [tailwindcss()],
  },
});
