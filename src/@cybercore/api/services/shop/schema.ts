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

