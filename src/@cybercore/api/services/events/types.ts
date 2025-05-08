import type { z } from "zod";
import type { NewsCMSSchema, NewsSchema, EventLogCMSSchema } from "./schema";

export type NewsCMS = z.infer<typeof NewsCMSSchema>
export type News = z.infer<typeof NewsSchema>
export type EventLog = z.infer<typeof EventLogCMSSchema>;
