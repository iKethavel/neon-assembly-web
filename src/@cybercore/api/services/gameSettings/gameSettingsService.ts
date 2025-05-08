import type { StrapiClient } from '@strapi/client';
import { strapi } from '@strapi/client';
import { GameSettingsCMSSchema, GameSettingsSchema } from './schema';
import { normalizeGameSettings } from './normalizer';
import type { GameSettings } from './types';



export class GameSettingsService {
  private baseUrl: string;
  private client: StrapiClient;

  constructor() {
    this.baseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';

    this.client = strapi({ baseURL: this.baseUrl });
  }

  async getGameSettings(): Promise<GameSettings> {
    try {
      const result = await this.client.single('game-settings').find()
      const cmsData = GameSettingsCMSSchema.safeParse(result.data);
      if (!cmsData.success) throw new Error('Failed to parse game settings data');

      const data = normalizeGameSettings(cmsData.data)
      const parsedData = GameSettingsSchema.safeParse(data);
      if (!parsedData.success) throw new Error('Failed to parse game settings data');

      const gameSettings = parsedData.data;


      return gameSettings;
    } catch (error) {
      console.error('Error fetching game settings:', error);
      throw error;
    }
  }
}