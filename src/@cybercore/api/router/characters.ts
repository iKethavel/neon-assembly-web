import { z } from "zod";
import { characterService } from "../services";
import { CharacterSchema, ContactSchema } from "../services/characters/schema";
import { publicProcedure } from "../trpc";

export const charactersRouter = {
  getAllForUser: publicProcedure
    .output(CharacterSchema.array())
    .query(async ({ ctx }) => {
      const characters = await characterService.getCharactersByUsername(ctx.user?.primaryEmailAddress?.emailAddress ?? '');

      return characters
    }),
  getById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .output(CharacterSchema)
    .query(async ({ input }) => {
      const character = await characterService.getCharacterById(input.id);

      return character
    }),
  addContactBySSN: publicProcedure
    .input(z.object({
      ssn: z.string(),
      characterId: z.string(),
    }))
    .output(z.union([z.literal('not_found'), z.literal('already_added'), z.literal('success')]))
    .mutation(async ({ input }) => {
      const { characterId, ssn } = input;

      const contact = await characterService.addContactBySSN(characterId, ssn);

      return contact;
    }),
  getContact: publicProcedure
    .input(z.object({
      ssn: z.string(),
      characterId: z.string(),
    }))
    .output(ContactSchema)
    .query(async ({ input }) => {
      const { ssn, characterId } = input;

      const contact = await characterService.getContact(characterId, ssn);

      return contact;
    }
    ),
  getContactBySSN: publicProcedure
    .input(z.object({
      ssn: z.string(),
    }))
    .output(CharacterSchema)
    .query(async ({ input }) => {
      const { ssn } = input;

      const contact = await characterService.getContactBySSN(ssn);

      return contact;
    }
    ),
  injectChip: publicProcedure
    .input(z.object({
      characterId: z.string(),
      skillChipUid: z.string(),
    }))
    .output(z.union([z.literal('psy'), z.literal('no_effect')]))
    .mutation(async ({ input }) => {
      const { characterId, skillChipUid } = input;

      const contact = await characterService.injectChip(characterId, skillChipUid);

      return contact;
    }),
  fixChip: publicProcedure
    .input(z.object({
      characterId: z.string(),
      disadvantageId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { characterId, disadvantageId } = input;

      const contact = await characterService.fixChip(characterId, disadvantageId);

      return contact;
    }),
  hackContactPerson: publicProcedure
    .input(z.object({
      ssn: z.string(),
      characterId: z.string(),
      breachLevel: z.number(),
    }))
    .mutation(async ({ input }) => {
      await characterService.hackContactPerson(input);
    }),
}
