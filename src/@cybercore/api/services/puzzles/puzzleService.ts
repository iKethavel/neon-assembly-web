import axios from 'axios';
import qs from "qs"
import type { BlackBox, BlackBoxCMS } from './types';
import { normalizeBlackBox } from './normalizer';
import { BlackBoxSchema } from './schema';


export class PuzzleService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';
  }

  async getBlackBox(slug: string): Promise<BlackBox> {
    try {
      const q = qs.stringify({
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: [
          'helpers',
          'helpers.character',
        ]
      }, {
        encodeValuesOnly: true, // prettify URL
      })

      const url = `${this.baseUrl}/black-boxes?${q}`;

      const response = await axios.get<{ data: BlackBoxCMS[] }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const resultData = response.data.data[0];
      if (!resultData) {
        throw new Error('BlackBox not found');
      }

      const rawBlackBox = normalizeBlackBox(resultData);
      const parsedBlackBox = BlackBoxSchema.safeParse(rawBlackBox);

      if (parsedBlackBox.success) {
        return parsedBlackBox.data
      } else {
        console.error('Failed to parse BlackBox:', parsedBlackBox.error);
        throw new Error('Failed to parse BlackBox');
      }
    } catch (error) {
      console.error('Error fetching  BlackBoxs:', error);
      throw error
    }
  }


  async joinBlackBox({ characterId, blackBoxSlug, helperId }: BlackBoxJoinParams): Promise<void> {
    try {
      const box = await this.getBlackBox(blackBoxSlug);

      const url = `${this.baseUrl}/black-boxes/${box.id}`;
      const helpers = box.helpers.map(helper => {
        return {
          role: helper.role,
          character: [helper.id === helperId ? characterId : helper.character?.documentId],
        }
      });

      await axios({
        method: 'PUT',
        url,
        data: {
          data: {
            helpers,
          }
        }
      })
    } catch (error) {
      console.error('Error joining BlackBox:', error);
      throw error
    }
  }

  async openBlackBox({ blackBoxSlug, password }: BlackBoxOpenParams): Promise<void> {
    try {
      const box = await this.getBlackBox(blackBoxSlug);

      const url = `${this.baseUrl}/black-boxes/${box.id}`;

      await axios({
        method: 'PUT',
        url,
        data: {
          data: {
            isOpened: !box.password || box.password === password,
          }
        }
      })
    } catch (error) {
      console.error('Error joining BlackBox:', error);
      throw error
    }
  }

}


interface BlackBoxJoinParams {
  blackBoxSlug: string;
  characterId: string;
  helperId: number;
}

interface BlackBoxOpenParams {
  blackBoxSlug: string;
  password: string;
}