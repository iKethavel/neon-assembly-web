import type { z } from "zod";
import type { ChipSchema, ChipCMSSchema } from "./schema";

export type ChipCMS = z.infer<typeof ChipCMSSchema>;
export type Chip = z.infer<typeof ChipSchema>;
