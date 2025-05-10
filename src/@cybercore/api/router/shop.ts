import { z } from "zod";
import { shopService } from "../services";
import { ChipSchema, SubstanceSchema } from "../services/shop/schema";
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
  getDrug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .output(SubstanceSchema)
    .query(async ({ input: { slug } }) => {
      const data = await shopService.getDrug(slug);

      return data;
    }),
}
