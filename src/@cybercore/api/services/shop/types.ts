import type { z } from "zod";
import type { ChipSchema, ChipCMSSchema, SubstanceCMSSchema, SubstanceSchema } from "./schema";

export type ChipCMS = z.infer<typeof ChipCMSSchema>;
export type Chip = z.infer<typeof ChipSchema>;


export type SubstanceCMS = z.infer<typeof SubstanceCMSSchema>;
export type Substance = z.infer<typeof SubstanceSchema>;