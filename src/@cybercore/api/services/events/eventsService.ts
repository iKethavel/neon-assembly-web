import axios from 'axios';
import qs from "qs";
import { normalizeEventLog, normalizeNews } from "./normalizer";
import type { EventLog, News, NewsCMS } from './types';
import { EventLogCMSSchema, NewsSchema } from './schema';

export class EventsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';
  }


  async getNewsLog(): Promise<News[]> {
    try {
      const q = qs.stringify({
        sort: ['updatedAt:desc']
      }, {
        encodeValuesOnly: true, // prettify URL
      })

      const url = `${this.baseUrl}/news-logs?${q}`;

      const response = await axios.get<{ data: NewsCMS[] }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const rawNewsLogs = response.data.data.map(normalizeNews);

      const normalizedData = rawNewsLogs.filter((newsLog: unknown): newsLog is News => {
        const parsedNewsLog = NewsSchema.safeParse(newsLog);
        if (!parsedNewsLog.success) {
          console.error('Validation error:', parsedNewsLog.error);
          return false;
        }

        return true;
      })

      return normalizedData

    } catch (error) {
      console.error('Error fetching news logs:', error);
      throw new Error('Failed to fetch news logs');
    }
  }

  async postNews(post: Pick<News, 'sender' | 'message'>): Promise<void> {
    try {
      const url = `${this.baseUrl}/news-logs`;

      await axios.post(
        url,
        {
          data: {
            sender: post.sender,
            message: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: post.message,
                  },
                ],
              },
            ],
          }
        },
        {
          // headers: {
          //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          //   'Content-Type': 'application/json',
          // },
        }
      );
    } catch (error) {
      console.error('Error creating news log:', error);
      throw new Error('Failed to create news log');
    }
  }


  async getEventsLog(): Promise<EventLog[]> {
    try {
      const q = qs.stringify({
        sort: ['updatedAt:desc']
      }, {
        encodeValuesOnly: true, // prettify URL
      })

      const url = `${this.baseUrl}/event-logs?${q}`;
      const response = await axios.get<{ data: EventLog[] }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const rawEventLogs = response.data.data.map(normalizeEventLog);
      const normalizedData = rawEventLogs.filter((eventLog: unknown): eventLog is EventLog => {
        const parsedEventLog = EventLogCMSSchema.safeParse(eventLog);
        if (!parsedEventLog.success) {
          return false;
        }

        return true;
      })

      return normalizedData

    } catch (error) {
      console.error('Error fetching news logs:', error);
      throw new Error('Failed to fetch news logs');
    }
  }

}