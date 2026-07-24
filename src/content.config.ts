import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const conceptSchema = z.object({
  title: z.string(),
  // Short definition shown on cards and used as the flashcard back.
  definition: z.string(),
  // Grouping from the source PDF, e.g. "Concurrency", "Generics".
  topic: z.string(),
  // 1 = solid fundamentals, 3 = genuinely hard.
  difficulty: z.number().int().min(1).max(3).default(2),
  // Ordinal used by the offset gutter. Keep unique.
  offset: z.number().int(),
  tags: z.array(z.string()).default([]),
  // Page in the source PDF, so you can always trace a claim back.
  source: z.string().optional(),
});

const concepts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/concepts" }),
  schema: conceptSchema,
});

// French mirror of `concepts` — same filenames/slugs, translated content.
const conceptsFr = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/concepts-fr" }),
  schema: conceptSchema,
});

export const collections = { concepts, conceptsFr };
