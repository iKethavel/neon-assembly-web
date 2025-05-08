import { z } from "zod";
import { eventsService } from "../services";
import { EventLogCMSSchema, NewsSchema } from "../services/events/schema";
import { publicProcedure } from "../trpc";

export const eventsRouter = {
  getNews: publicProcedure
    .output(NewsSchema.array())
    .query(async () => {
      const data = await eventsService.getNewsLog()

      return data
    }),
  addNews: publicProcedure
    .input(z.object({
      message: z.string(),
      sender: z.string(),
    }))
    .mutation(async ({ input }) => {
      const data = await eventsService.postNews(input)

      return data
    }),
  getEvents: publicProcedure
    .output(EventLogCMSSchema.array())
    .query(async () => {
      const data = await eventsService.getEventsLog()

      return data
    }),
}
