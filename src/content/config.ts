import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const events = defineCollection({
    loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/content/events" }),
    schema: z.object({
        isDraft: z.boolean().default(false),
        ongoing: z.boolean().optional().default(false),
        title: z.string(),
        snippet: z.string(),
        institution: z.string(),
        eventDate: z.string().optional(),
        url: z.string().url().optional(),
    }),
});

export const collections = { events };