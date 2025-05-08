import type { GameSettings, GameSettingsCMS } from "./types";

/**
 * Maps a GameSettingsCMS object to a GameSettings object
 * 
 * @param cmsSettings - The CMS game settings data to be mapped
 * @returns A simplified GameSettings object
 */
export function normalizeGameSettings(cmsSettings: GameSettingsCMS): GameSettings {
  return {
    showVirusBar: cmsSettings.showVirusBar,
    timerSettings: {
      hacking: cmsSettings.hackingTimer,
      posting: cmsSettings.postingTimer,
      fixingChip: cmsSettings.fixingChipTimer
    }
  };
}