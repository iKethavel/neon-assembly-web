import { z } from 'zod';

// Define the Chip schema
export const ChipCMSSchema = z.object({
  id: z.number().int().positive(),
  documentId: z.string(),
  uid: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime(),
  advantage: z.string(),
  disadvantage: z.string(),
  provokeCyberPsychosis: z.boolean(),
  character: z.object({
    documentId: z.string(),
    name: z.string(),
  }).or(z.null()),
});

export const ChipSchema = z.object({
  uid: z.string(),
  name: z.string(),
  advantage: z.string(),
  disadvantage: z.string(),
  provokeCyberPsychosis: z.boolean(),
  character: z.object({
    documentId: z.string(),
    name: z.string(),
  }).or(z.null()),
});

export const SubstanceCMSSchema = z.object({
  id: z.number().int().positive(),
  documentId: z.string(),
  name: z.string(),
  effect: z.string(),
  mask: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime()
});

// Define the simplified Substance schema
export const SubstanceSchema = z.object({
  name: z.string(),
  effect: z.string(),
  mask: z.string(),
  slug: z.string()
});