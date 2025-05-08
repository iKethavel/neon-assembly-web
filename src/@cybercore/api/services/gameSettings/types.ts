import type { z } from "zod";
import type { GameSettingsCMSSchema, GameSettingsSchema } from "./schema";

export type GameSettingsCMS = z.infer<typeof GameSettingsCMSSchema>;
export type GameSettings = z.infer<typeof GameSettingsSchema>;