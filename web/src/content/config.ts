import { defineCollection, z } from 'astro:content';

const modules = defineCollection({
  schema: z.object({
    module_number: z.number().min(0).max(14),
    title: z.string(),
    subtitle: z.string().optional(),
    version: z.string().optional(),
    lang: z.enum(['ru', 'en']),
    audience: z.string().optional(),
    path: z.enum(['quickstart', 'mentor', 'coordinator', 'statesman', 'deep']).optional(),
    topics: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    lang: z.enum(['ru', 'en']),
    description: z.string().optional(),
  }),
});

export const collections = { modules, pages };
