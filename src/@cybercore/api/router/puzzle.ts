import { puzzleService } from "../services";
import { BlackBoxSchema } from "../services/puzzles/schema";
import { publicProcedure } from "../trpc";
import { z } from "zod";

export const puzzleRouter = {
  getBlackBox: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .output(BlackBoxSchema)
    .query(async ({ input }) => {
      const data = await puzzleService.getBlackBox(input.slug);

      return data;
    }),
  joinBlackBox: publicProcedure
    .input(z.object({
      slug: z.string(),
      characterId: z.string(),
      helperId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await puzzleService.joinBlackBox({
        characterId: input.characterId,
        blackBoxSlug: input.slug,
        helperId: input.helperId,
      });
    }),
  openBlackBox: publicProcedure
    .input(z.object({
      slug: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      await puzzleService.openBlackBox({
        blackBoxSlug: input.slug,
        password: input.password,
      });
    }),
}
