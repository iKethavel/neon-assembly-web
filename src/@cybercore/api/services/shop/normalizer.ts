import type { Chip, ChipCMS } from "./types";

/**
 * Maps a ChipCMS object to a Chip object
 * 
 * @param cmsChip - The CMS chip data to be mapped
 * @returns A simplified Chip object
 */
export function normalizeSkillChip(cmsChip: ChipCMS): Chip {
  return {
    uid: cmsChip.documentId,
    name: cmsChip.name,
    advantage: cmsChip.advantage,
    disadvantage: cmsChip.disadvantage,
    provokeCyberPsychosis: cmsChip.provokeCyberPsychosis,
    character: cmsChip.character
      ? {
        documentId: cmsChip.character.documentId,
        name: cmsChip.character.name,
      }
      : null,
  };
}