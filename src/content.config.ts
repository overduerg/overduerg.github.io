import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Games you have played / are playing — a gaming log with status & rating.
 */
const gamesPlayed = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/games-played' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      cover: image().optional(),
      platform: z.string().optional(),
      status: z.enum(['playing', 'completed', 'on-hold', 'dropped', 'backlog']),
      rating: z.number().min(0).max(10).optional(),
      hoursPlayed: z.number().optional(),
      completedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
    }),
});

/**
 * Games you have made or are making.
 */
const gamesMade = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/games-made' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string().optional(),
      cover: image().optional(),
      status: z.enum(['released', 'in-development', 'prototype', 'jam', 'on-hold']),
      engine: z.string().optional(),
      platforms: z.array(z.string()).default([]),
      releaseDate: z.coerce.date().optional(),
      links: z
        .object({
          itch: z.url().optional(),
          steam: z.url().optional(),
          github: z.url().optional(),
          play: z.url().optional(),
        })
        .default({}),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
    }),
});

export const collections = { 'games-played': gamesPlayed, 'games-made': gamesMade };
