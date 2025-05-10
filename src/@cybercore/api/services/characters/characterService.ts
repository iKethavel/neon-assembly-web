
import axios from 'axios';
import qs from 'qs';
import type { Character, CharacterCMS, Contact } from './types';
import { normalizeCharacterData } from './normalizer';
import { CharacterSchema } from './schema';
import { shopService } from '..';

const populateFileds = [
  'player',
  'secrets',
  'cyber_psychoses',
  'nervous_system',
  'skill_chips',
  'contactList',
  'contactList.character',
  'contactList.character.avatar',
  'disadvantages',
  'avatar',
]

export class CharacterService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';
  }

  async getCharactersByUsername(username: string): Promise<Character[]> {
    try {
      const q = qs.stringify({
        filters: {
          player: {
            username: {
              $eq: username,
            },
          },
        },
        populate: populateFileds
      }, {
        encodeValuesOnly: true, // prettify URL
      })

      const url = `${this.baseUrl}/characters?${q}`;
      const response = await axios.get<{ data: CharacterCMS[] }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const rawCharacters = response.data.data.map(normalizeCharacterData);

      const normalizedData = rawCharacters.filter((character: unknown): character is Character => {
        const parsedCharacter = CharacterSchema.safeParse(character);
        if (!parsedCharacter.success) {
          console.error('Validation error:', parsedCharacter.error);
          return false;
        }
        return true;
      })

      return normalizedData
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error
    }
  }

  async getCharacterById(id: string): Promise<Character> {
    try {
      const q = qs.stringify({
        populate: populateFileds
      })
      const url = `${this.baseUrl}/characters/${id}?${q}`;

      const response = await axios.get<{ data: CharacterCMS }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const rawCharacter = normalizeCharacterData(response.data.data);

      const result = CharacterSchema.parse(rawCharacter);

      return result
    } catch (error) {
      console.error(`Error fetching character with ID ${id}:`, error);
      throw error
    }
  }

  async addContactBySSN(characterId: string, ssn: string): Promise<'not_found' | 'already_added' | 'success'> {
    try {
      const q = qs.stringify({
        filters: {
          ssn: {
            $eq: ssn,
          }
        },
        // populate: [
        //   'secrets',
        //   'cyber_psychoses',
        //   'nervous_system',
        //   'skill_chips',
        //   'contactList',
        //   'contactList.character',
        //   'disadvantages'
        // ]
      })

      const url = `${this.baseUrl}/characters?${q}`;
      const searchResponse = await axios.get<{ data: CharacterCMS[] }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const ssnCharacterRef = searchResponse.data.data[0]
      if (searchResponse.data.data.length === 0 || !ssnCharacterRef) {
        return 'not_found'
      }

      const character = await this.getCharacterById(characterId);

      const isAlreadyAdded = character.contactList.find((contact) => contact.character.id === ssnCharacterRef.id)
      if (isAlreadyAdded) {
        return 'already_added'
      }

      await axios({
        method: 'PUT',
        url: `${this.baseUrl}/characters/${characterId}`,
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
        data: {
          data: {
            // Add the specified contacts to the character's contact list
            contactList: [
              {
                character: ssnCharacterRef.documentId,
                breach: 0,
              },
              ...character.contactList.map((contact) => ({
                character: contact.character.documentId,
                breach: contact.breach,
              })),
            ]
          }
        },
      });

      return 'success'
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching characters:', error.message);
      }
      throw error
    }
  }

  async getContact(characterId: string, ssn: string): Promise<Contact> {
    try {
      const character = await this.getCharacterById(characterId);
      const contact = character.contactList.find((contact) => contact.character.ssn === ssn)
      if (!contact) {
        throw new Error('Contact not found');
      }

      const contactCharacter = await this.getCharacterById(contact.character.documentId);
      const contactData: Contact = {
        id: contact.id,
        breach: contact.breach,
        character: {
          id: contactCharacter.id,
          documentId: contactCharacter.documentId,
          ssn: contactCharacter.ssn,
          name: contactCharacter.name,
          avatar: contactCharacter.avatar,

          role: contactCharacter.role,
          eurodollars: contactCharacter.eurodollars,

          disadvantages: contactCharacter.disadvantages,

          cyber_psychoses: contactCharacter.cyber_psychoses,
          contactList: contactCharacter.contactList.map((contact) => ({
            documentId: contact.character.documentId,
            ssn: contact.character.ssn,
            name: contact.character.name,
          })),

          secrets: contactCharacter.secrets,
          description: contactCharacter.description
        }
      }

      return contactData
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching characters:', error.message);
      }

      throw error
    }
  }

  async getContactBySSN(ssn: string): Promise<Character> {
    try {
      const q = qs.stringify({
        filters: {
          ssn: {
            $eq: ssn,
          },
        },
        populate: populateFileds
      }, {
        encodeValuesOnly: true, // prettify URL
      })

      const url = `${this.baseUrl}/characters?${q}`;
      const response = await axios.get<{ data: CharacterCMS[] }>(url, {
        // headers: {
        //   Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        // },
      });

      const rawContact = response.data.data[0]
      if (!rawContact) {
        throw new Error('Contact not found');
      }
      const contact = normalizeCharacterData(rawContact);
      const parsedContact = CharacterSchema.parse(contact);

      return parsedContact
    } catch (error) {
      console.error(`Error fetching character with SSN ${ssn}:`, error);
      throw error
    }
  }


  async transferMoney(initiatorId: string, receiverId: string, amount: number): Promise<'success' | 'error'> {
    try {
      const initiator = await this.getCharacterById(initiatorId);
      const receiver = await this.getCharacterById(receiverId);

      if (amount > initiator.eurodollars) {
        return 'error'
      }


      await Promise.all([
        axios({
          method: 'PUT',
          url: `${this.baseUrl}/characters/${initiatorId}`,
          data: {
            data: {
              eurodollars: initiator.eurodollars - amount,
            }
          },
        }),
        axios({
          method: 'PUT',
          url: `${this.baseUrl}/characters/${receiverId}`,
          data: {
            data: {
              eurodollars: receiver.eurodollars + amount,
            }
          },
        })
      ])

      await axios({
        method: 'POST',
        url: `${this.baseUrl}/event-logs`,
        data: {
          data: {
            initiator: initiator.name,
            receiver: receiver.name,
            type: 'money_transfer',
            value: amount.toString(),
          }
        },
      })

      return 'success'
    } catch (error) {
      console.error('Error while transferring money', error);
      throw new Error('Something went wrong. Contact your GM');
    }
  }

  async injectChip(characterId: string, skillChipId: string): Promise<void> {
    try {
      const chip = await shopService.getSkillChip(skillChipId)
      const character = await this.getCharacterById(characterId)

      await axios({
        method: 'PUT',
        url: `${this.baseUrl}/skill-chips/${skillChipId} `,
        data: {
          data: {
            character: [character.documentId]
          }
        }
      })

      await axios({
        method: 'PUT',
        url: `${this.baseUrl}/characters/${characterId} `,
        // headers: {
        //   Authorization: `Bearer ${ process.env.STRAPI_API_TOKEN } `,
        // },
        data: {
          data: {
            disadvantages: [
              {
                sensor: `${chip.name} [${chip.uid}]`,
                message: chip.disadvantage
              },
              ...character.disadvantages
            ]
          }
        },
      });

    } catch (error) {
      console.error('Error while injecting chip', error);
      throw error
    }
  }

  async fixChip(characterId: string, disadvantageId: number): Promise<void> {
    try {
      const character = await this.getCharacterById(characterId)

      const updatedDisadvantages = character.disadvantages.filter((disadvantage) => disadvantage.id !== disadvantageId).map((disadvantage) => ({
        sensor: disadvantage.sensor,
        message: disadvantage.message
      }))

      await axios({
        method: 'PUT',
        url: `${this.baseUrl}/characters/${characterId} `,
        // headers: {
        //   Authorization: `Bearer ${ process.env.STRAPI_API_TOKEN } `,
        // },
        data: {
          data: {
            disadvantages: updatedDisadvantages
          }
        },
      });

    }
    catch (error) {
      console.error('Error while fixing chip', error);
      throw error
    }
  }

  async hackContactPerson({ characterId, ssn, breachLevel }: hackContactPersonParams): Promise<void> {
    try {
      const character = await this.getCharacterById(characterId);

      const contactList = character.contactList.map((contact) => {
        return {
          character: contact.character.documentId,
          breach: ssn === contact.character.ssn ? breachLevel : contact.breach,
        }
      })

      await axios({
        method: 'PUT',
        url: `${this.baseUrl}/characters/${characterId} `,
        // headers: {
        //   Authorization: `Bearer ${ process.env.STRAPI_API_TOKEN } `,
        // },
        data: {
          data: {
            // Add the specified contacts to the character's contact list
            contactList: contactList
          }
        },
      });



    } catch (error) {
      console.error('Error while hacking contact person', error);
      throw error
    }
  }
}

interface hackContactPersonParams {
  characterId: string,
  ssn: string,
  breachLevel: number
}
