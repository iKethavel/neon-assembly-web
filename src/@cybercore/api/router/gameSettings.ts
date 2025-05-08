import { gameSettingsService } from "../services";
import { GameSettingsSchema } from "../services/gameSettings/schema";
import { publicProcedure } from "../trpc";

export const gameSettingsRouter = {
  getData: publicProcedure
    .output(GameSettingsSchema)
    .query(async () => {
      const data = await gameSettingsService.getGameSettings()

      return data
    }),
}
