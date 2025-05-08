import type { z } from "zod";
import type { BlackBoxCMSSchema, BlackBoxSchema } from "./schema";

export type BlackBoxCMS = z.infer<typeof BlackBoxCMSSchema>;
export type BlackBox = z.infer<typeof BlackBoxSchema>;
