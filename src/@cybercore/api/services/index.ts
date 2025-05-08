import { CharacterService } from "./characters/characterService";
import { EventsService } from "./events/eventsService";
import { GameSettingsService } from "./gameSettings/gameSettingsService";
import { PuzzleService } from "./puzzles/puzzleService";
import { ShopService } from "./shop/shopService";

const characterService = new CharacterService()
const eventsService = new EventsService()
const shopService = new ShopService()
const puzzleService = new PuzzleService()
const gameSettingsService = new GameSettingsService()

export {
  characterService,
  eventsService,
  shopService,
  puzzleService,
  gameSettingsService,
}