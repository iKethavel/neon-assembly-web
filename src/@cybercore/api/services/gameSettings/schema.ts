import { z } from 'zod';

// Define the CMS Game Settings schema
export const GameSettingsCMSSchema = z.object({
  id: z.number().int().positive(),
  documentId: z.string(),
  showVirusBar: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime(),
  hackingTimer: z.number().int().positive(),
  postingTimer: z.number().int().positive(),
  fixingChipTimer: z.number().int().positive()
});

// Define the simplified Game Settings schema
export const GameSettingsSchema = z.object({
  showVirusBar: z.boolean(),
  timerSettings: z.object({
    hacking: z.number().int().positive(),
    posting: z.number().int().positive(),
    fixingChip: z.number().int().positive()
  })
});
