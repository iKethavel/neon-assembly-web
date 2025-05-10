import type { BlackBox, BlackBoxCMS } from "./types";

/**
 * Extracts plain text from structured content
 * 
 * @param content - Array of paragraph nodes
 * @returns Extracted plain text
 */
export function extractTextFromContent(content: BlackBoxCMS['content']): string {
  return content
    .map(paragraph =>
      paragraph.children
        .map(child => child.text)
        .join('')
    )
    .join('\n');
}

/**
 * Maps a BoxCMS object to a Box object
 * 
 * @param cmsBox - The CMS box data to be mapped
 * @returns A simplified Box object
 */
export function normalizeBlackBox(cmsBox: BlackBoxCMS): BlackBox {
  return {
    id: cmsBox.documentId,
    name: cmsBox.name,
    content: extractTextFromContent(cmsBox.content),
    description: cmsBox.description ?? '',
    isOpened: cmsBox.isOpened,
    slug: cmsBox.slug,
    password: cmsBox.password,
    helpers: cmsBox.helpers.map(helper => ({
      id: helper.id,
      role: helper.role,
      character: helper.character ? {
        documentId: helper.character.documentId,
        name: helper.character.name,
        role: helper.character.role,
      } : null,
    })),
  };
}