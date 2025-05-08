import { characterService } from "../services";
import { publicProcedure } from "../trpc";
import { z } from "zod";

export const bankingRouter = {
  transfer: publicProcedure
    .input(z.object({
      initiatorId: z.string(),
      receiverId: z.string(),
      amount: z.number().min(1),
    }))
    .output(z.void())
    .mutation(async ({ input }) => {
      try {
        const { initiatorId, receiverId, amount } = input;

        const result = await characterService.transferMoney(initiatorId, receiverId, amount)
        if (result === 'error') {
          throw new Error('Something went wrong. Contact your GM');
        }

      } catch (error) {
        console.error('Error while transferring money', error);
        throw new Error('Something went wrong. Contact your GM');
      }
    }),
}
