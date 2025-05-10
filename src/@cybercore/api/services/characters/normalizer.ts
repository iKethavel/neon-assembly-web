import { normalizeSkillChip } from "../shop/normalizer";
import type { Character, CharacterCMS } from "./types";

export function normalizeCharacterData(
  cmsCharacter: CharacterCMS
): Character {
  return {
    id: cmsCharacter.id,
    documentId: cmsCharacter.documentId,
    player: cmsCharacter.player ? {
      username: cmsCharacter.player.username
    } : null,
    name: cmsCharacter.name,
    eurodollars: cmsCharacter.eurodollars,
    createdAt: cmsCharacter.createdAt,
    updatedAt: cmsCharacter.updatedAt,
    publishedAt: cmsCharacter.publishedAt,
    role: cmsCharacter.role,
    description: extractTextFromParagraphs(cmsCharacter.description),
    ssn: cmsCharacter.ssn,

    virus: cmsCharacter.virus ?? 0,
    cyber_psychoses_level: cmsCharacter.cyber_psychoses_level,

    // Transform cyber_psychoses
    cyber_psychoses: cmsCharacter.cyber_psychoses?.map(psychosis => ({
      id: psychosis.id,
      title: psychosis.title,
      description: extractTextFromParagraphs(psychosis.description)
    })) ?? [],

    // Transform secrets
    secrets: cmsCharacter.secrets?.map(secret => ({
      id: secret.id,
      description: extractTextFromParagraphs(secret.description),
      level: secret.level
    })) ?? [],

    // Transform nervous_system
    nervous_system: cmsCharacter.nervous_system?.map(system => ({
      id: system.id,
      message: system.message,
      sensor: system.sensor
    })) ?? [],

    // Transform skill_chips (no need to transform structured text here)
    skill_chips: cmsCharacter.skill_chips?.map(normalizeSkillChip) ?? [],

    // Transform contactList with nested character data
    contactList: cmsCharacter.contactList?.map(contact => ({
      id: contact.id,
      breach: contact.breach,
      character: {
        id: contact.character.id,
        documentId: contact.character.documentId,
        name: contact.character.name,
        eurodollars: contact.character.eurodollars,
        createdAt: contact.character.createdAt,
        updatedAt: contact.character.updatedAt,
        publishedAt: contact.character.publishedAt,
        role: contact.character.role,
        description: extractTextFromParagraphs(contact.character.description),
        ssn: contact.character.ssn,
        cyber_psychoses_level: contact.character.cyber_psychoses_level,
        avatar: contact.character.avatar?.url ?? 'https://usfgtgnpsarbvkzfuvzu.supabase.co/storage/v1/object/public/strapi/media/ChatGPT Image May 3, 2025, 08_25_19 PM.png-309a7cdf31ddec401bd64e40ba5eecc5.png'
      }
    })) ?? [],

    // Transform disadvantages
    disadvantages: cmsCharacter.disadvantages?.map(disadvantage => ({
      id: disadvantage.id,
      message: disadvantage.message,
      sensor: disadvantage.sensor
    })) ?? [],

    avatar: cmsCharacter.avatar?.url ?? 'https://usfgtgnpsarbvkzfuvzu.supabase.co/storage/v1/object/public/strapi/media/ChatGPT Image May 3, 2025, 08_25_19 PM.png-309a7cdf31ddec401bd64e40ba5eecc5.png'
  };
}

/**
 * Defines types for structured paragraph content
 */
interface TextNode {
  text: string;
  type: 'text';
}

interface Paragraph {
  type: 'paragraph';
  children: TextNode[];
}

/**
 * Defines type for heading content
 */
interface Heading {
  type: 'heading';
  level: number;
  children: TextNode[];
}

/**
 * Type union for content blocks
 */
type ContentBlock = Paragraph | Heading;

/**
 * Extracts text content from an array of paragraph objects
 * @param paragraphs Array of paragraph or heading objects with text children
 * @returns Single string with all text content concatenated
 */
function extractTextFromParagraphs(paragraphs: ContentBlock[]): string {
  if (!Array.isArray(paragraphs)) {
    return '';
  }

  return paragraphs
    .map(block => {
      if (Array.isArray(block.children)) {
        return block.children
          .map(child => child.text || '')
          .join('');
      }
      return '';
    })
    .filter(text => text.length > 0)
    .join('\n\n');
}