import type { EventLog, News, NewsCMS } from "./types";

/**
 * Extracts text content from the structured message format
 * and joins them with spaces
 */
function extractTextFromMessage(message: NewsCMS['message']): string {
  return message
    .map(paragraph =>
      paragraph.children
        .map(child => child.text)
        .join('')
    )
    .join('\n');
}

/**
 * Normalizes a CMS news item to the simplified format
 */
export function normalizeNews(cmsNews: NewsCMS): News {
  return {
    id: cmsNews.id,
    documentId: cmsNews.documentId,
    sender: cmsNews.sender,
    message: extractTextFromMessage(cmsNews.message),
    createdAt: cmsNews.createdAt,
    updatedAt: cmsNews.updatedAt,
    publishedAt: cmsNews.publishedAt
  };
}

/**
 * Normalizes a CMS news item to the simplified format
 */
export function normalizeEventLog(eventLog: EventLog): EventLog {
  return eventLog
}