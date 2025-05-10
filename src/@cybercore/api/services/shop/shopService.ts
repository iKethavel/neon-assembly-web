import axios from 'axios';
import qs from "qs"
import type { Chip, ChipCMS, Substance, SubstanceCMS } from './types';
import { normalizeSkillChip, normalizeSubstance } from './normalizer';
import { ChipSchema, SubstanceSchema } from './schema';

export class ShopService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';
  }

  async getSkillChips(): Promise<Chip[]> {
    try {
      const q = qs.stringify({
      }, {
        encodeValuesOnly: true, // prettify URL
      })

      const url = `${this.baseUrl}/skill-chips?${q}`;

      const response = await axios.get<{ data: ChipCMS[] }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const rawSkillChips = response.data.data.map(normalizeSkillChip);

      const normalizedData = rawSkillChips.filter((skillChip: unknown): skillChip is Chip => {
        const parsedSkillChip = ChipSchema.safeParse(skillChip);
        if (!parsedSkillChip.success) {
          console.error('Validation error:', parsedSkillChip.error);
          return false;
        }

        return true;
      })

      return normalizedData
    } catch (error) {
      console.error('Error fetching skill chips:', error);
      throw new Error('Failed to fetch skill chips');
    }
  }

  async getSkillChip(uid: string): Promise<Chip> {
    try {
      const q = qs.stringify({
        populate: '*'
      }, {
        encodeValuesOnly: true, // prettify URL
      })

      const url = `${this.baseUrl}/skill-chips/${uid}?${q}`;

      const response = await axios.get<{ data: ChipCMS }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const rawSkillChip = normalizeSkillChip(response.data.data);
      const parsedSkillChip = ChipSchema.safeParse(rawSkillChip);

      if (parsedSkillChip.success) {
        return parsedSkillChip.data
      }

      throw new Error('Failed to parse skill chip')
    } catch (error) {
      console.error('Error fetching skill chips:', error);
      throw error
    }
  }

  async getDrug(slug: string): Promise<Substance> {
    try {
      const q = qs.stringify({
        filters: {
          slug: {
            $eqi: slug
          }
        },
        populate: '*'
      }, {
        encodeValuesOnly: true, // prettify URL
      })

      const url = `${this.baseUrl}/drugs?${q}`;

      const response = await axios.get<{ data: SubstanceCMS[] }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const rawSubstance = response.data.data[0];
      if (!rawSubstance) {
        throw new Error('Substance not found');
      }

      const normalizedSubstance = normalizeSubstance(rawSubstance);
      const parsedSubstance = SubstanceSchema.safeParse(normalizedSubstance);

      if (!parsedSubstance.success) {
        console.error('Validation error:', parsedSubstance.error);
        throw new Error('Failed to parse substance')
      }

      return parsedSubstance.data
    } catch (error) {
      console.error('Error fetching substance:', error);
      throw error
    }
  }

}