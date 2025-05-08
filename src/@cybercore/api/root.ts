import { charactersRouter } from "./router/characters";
import { exampleRouter } from "./router/example";
import { eventsRouter } from "./router/events";
import { createTRPCRouter } from "./trpc";
import { bankingRouter } from "./router/banking";
import { shopRouter } from "./router/shop";
import { puzzleRouter } from "./router/puzzle";
import { gameSettingsRouter } from "./router/gameSettings";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  characters: charactersRouter,
  events: eventsRouter,
  banking: bankingRouter,
  shop: shopRouter,
  puzzle: puzzleRouter,
  gameSettings: gameSettingsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
