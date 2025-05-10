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
    virusWarning: cmsSettings.virusWarning,
    virusDead: cmsSettings.virusDead,
    timerSettings: {
      hacking: cmsSettings.hackingTimer,
      posting: cmsSettings.postingTimer,
      fixingChip: cmsSettings.fixingChipTimer,
      investigateChip: cmsSettings.investigateChipTimer,
    }
  };
}