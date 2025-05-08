import { z } from "zod";
import { shopService } from "../services";
import { ChipSchema } from "../services/shop/schema";
import { publicProcedure } from "../trpc";

export const shopRouter = {
  getSkillChips: publicProcedure
    .output(ChipSchema.array())
    .query(async () => {
      const data = await shopService.getSkillChips();

      return data;
    }),
  getSkillChip: publicProcedure
    .input(z.object({
      uid: z.string(),
    }))
    .output(ChipSchema)
    .query(async ({ input: { uid } }) => {
      const data = await shopService.getSkillChip(uid);

      return data;
    }),
}
