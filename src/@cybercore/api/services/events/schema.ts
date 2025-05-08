import { z } from 'zod';

// Schema for the text object inside children array
const TextSchema = z.object({
  text: z.string(),
  type: z.literal('text')
});

// Schema for the paragraph object inside message array
const ParagraphSchema = z.object({
  type: z.literal('paragraph'),
  children: z.array(TextSchema)
});

// Main schema for the entire object
const NewsCMSSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  sender: z.string(),
  message: z.array(ParagraphSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime()
});

const NewsSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  sender: z.string(),
  message: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime()
});

/**
 * Schema for a money transfer transaction
 */
const EventLogCMSSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  initiator: z.string(),
  receiver: z.string(),
  type: z.literal('money_transfer'),
  value: z.string(), // Value as string (could be changed to z.number() if needed)
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime()
});


export { NewsCMSSchema, NewsSchema, EventLogCMSSchema, ParagraphSchema, TextSchema };