import { publicProcedure } from "../trpc";
import { z } from "zod";

export const exampleRouter = {
  getData: publicProcedure
    .input(z.object({
      text: z.string(),
    }))
    .output(z.string())
    .query(({ input }) => {
      return `Hello world ${Date.now()} ${input.text}`
    }),
}
