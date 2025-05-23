import type { Chip, ChipCMS, Substance, SubstanceCMS } from "./types";

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
    disadvantage: cmsChip.disadvantage || '',
    provokeCyberPsychosis: cmsChip.provokeCyberPsychosis,
    character: cmsChip.character
      ? {
        documentId: cmsChip.character.documentId,
        name: cmsChip.character.name,
      }
      : null,
  };
}

/**
 * Maps a SubstanceCMS object to a Substance object
 * 
 * @param cmsSubstance - The CMS substance data to be mapped
 * @returns A simplified Substance object
 */
export function normalizeSubstance(cmsSubstance: SubstanceCMS): Substance {
  return {
    name: cmsSubstance.name,
    effect: cmsSubstance.effect,
    mask: cmsSubstance.mask,
    slug: cmsSubstance.slug
  };
}