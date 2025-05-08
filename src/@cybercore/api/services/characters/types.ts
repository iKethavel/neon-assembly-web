import type { z } from "zod";
import type { CharacterCMSSchema, CharacterSchema, ContactSchema } from "./schema";

export type CharacterCMS = z.infer<typeof CharacterCMSSchema>
export type Character = z.infer<typeof CharacterSchema>
export type Contact = z.infer<typeof ContactSchema>