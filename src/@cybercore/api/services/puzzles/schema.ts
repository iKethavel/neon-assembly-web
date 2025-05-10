import { z } from 'zod';

// Define the rich text content structure
const TextNodeSchema = z.object({
  text: z.string(),
  type: z.literal('text')
});

const ParagraphNodeSchema = z.object({
  type: z.literal('paragraph'),
  children: z.array(TextNodeSchema)
});

export const HelperSchema = z.object({
  id: z.number(),
  role: z.string(),
  character: z.object({
    documentId: z.string(),
    name: z.string(),
    role: z.string(),
  }).or(z.null()),
});

// Define the CMS BlackBox schema
export const BlackBoxCMSSchema = z.object({
  id: z.number().int().positive(),
  documentId: z.string(),
  name: z.string(),
  content: z.array(ParagraphNodeSchema),
  password: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime(),
  isOpened: z.boolean(),
  slug: z.string(),
  description: z.string(),
  helpers: z.array(HelperSchema)
});

// Define the simplified BlackBox schema
export const BlackBoxSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(), // Simplified to a plain string
  isOpened: z.boolean(),
  slug: z.string(),
  password: z.string().nullable(),
  helpers: z.array(HelperSchema),
  description: z.string(),
});

