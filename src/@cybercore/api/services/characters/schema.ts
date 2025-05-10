import { z } from 'zod';
import { ChipSchema } from '../shop/schema'

const AvatarSchema = z.object({
  id: z.number().int().positive(),
  documentId: z.string(),
  name: z.string(),
  alternativeText: z.string().or(z.null()).optional(),
  caption: z.string().or(z.null()).optional(),
  width: z.string().or(z.null()).optional(),
  height: z.string().or(z.null()).optional(),
  formats: z.string().or(z.null()).optional(),
  hash: z.string(),
  ext: z.string(),
  mime: z.string(),
  size: z.number().positive(),
  url: z.string().url(),
  previewUrl: z.string().or(z.null()).optional(),
  provider: z.string(),
  provider_metadata: z.string().or(z.null()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime()
}).or(z.null());

// Define the schema for the text children in paragraphs
const TextNodeSchema = z.object({
  text: z.string(),
  type: z.literal('text')
});

// Define the schema for paragraph structure
const ParagraphSchema = z.object({
  type: z.literal('paragraph'),
  children: z.array(TextNodeSchema)
});

// Schema for player object
const PlayerSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  username: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime()
});

// Schema for cyber psychosis
const CyberPsychosisSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  title: z.string(),
  description: z.array(ParagraphSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime()
});

// Schema for secrets
const SecretSchema = z.object({
  id: z.number(),
  description: z.array(ParagraphSchema),
  level: z.enum(['restricted', 'confidential', 'top-secret'])
});

// Schema for nervous system
const NervousSystemSchema = z.object({
  id: z.number(),
  message: z.string(),
  sensor: z.null()
});

// Schema for a simplified character object (used in contacts)
const SimplifiedCharacterSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string(),
  eurodollars: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime(),
  role: z.string(),
  description: z.array(ParagraphSchema),
  ssn: z.string(),
  cyber_psychoses_level: z.number().nullable(),
  avatar: AvatarSchema,
});

// Define schemas for previously empty arrays
const SkillChipSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  uid: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime(),
  advantage: z.string(),
  disadvantage: z.string(),
  provokeCyberPsychosis: z.boolean(),
  character: SimplifiedCharacterSchema
});

const ContactSchemaCms = z.object({
  id: z.number(),
  breach: z.number(),
  character: SimplifiedCharacterSchema
});

const DisadvantageSchema = z.object({
  id: z.number(),
  message: z.string(),
  sensor: z.string()
});

// Schema for the updated character data
export const CharacterCMSSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string(),
  eurodollars: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime(),
  role: z.string(),
  description: z.array(ParagraphSchema),
  ssn: z.string(),
  virus: z.null().or(z.number()),
  cyber_psychoses_level: z.null().or(z.number()), // Updated to null or number based on examples
  player: PlayerSchema,
  cyber_psychoses: z.array(CyberPsychosisSchema).or(z.null()),
  secrets: z.array(SecretSchema).or(z.null()),
  nervous_system: z.array(NervousSystemSchema).or(z.null()),
  skill_chips: z.array(SkillChipSchema).or(z.null()),
  contactList: z.array(ContactSchemaCms).or(z.null()),
  disadvantages: z.array(DisadvantageSchema).or(z.null()),
  avatar: AvatarSchema
});

export const ContactSchema = z.object({
  id: z.number(),
  breach: z.number(),
  character: z.object({
    id: z.number(),
    documentId: z.string(),
    ssn: z.string(),
    name: z.string(),
    avatar: z.string().or(z.null()),

    role: z.string(),
    eurodollars: z.number(),

    disadvantages: z.array(z.object({
      id: z.number(),
      message: z.string(),
      sensor: z.string().or(z.null())
    })),
    cyber_psychoses: z.array(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
    })),
    contactList: z.array(z.object({
      documentId: z.string(),
      ssn: z.string(),
      name: z.string(),
    })),

    secrets: z.array(z.object({
      id: z.number(),
      description: z.string(),
      level: z.enum(['restricted', 'confidential', 'top-secret'])
    })),
    description: z.string(),
  })
})

const ContactSchemaSimplified = z.object({
  id: z.number(),
  breach: z.number(),
  character: z.object({
    id: z.number(),
    documentId: z.string(),
    name: z.string(),
    eurodollars: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    publishedAt: z.string().datetime(),
    role: z.string(),
    description: z.string(),
    ssn: z.string(),
    cyber_psychoses_level: z.number().nullable(),
    avatar: z.string().or(z.null())
  })
});

// Keep the simplified Character schema for reference
export const CharacterSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string(),
  eurodollars: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime(),
  role: z.string(),
  description: z.string(),
  ssn: z.string(),
  virus: z.number(),
  cyber_psychoses_level: z.null().or(z.number().or(z.string())),
  cyber_psychoses: z.array(z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
  })),
  secrets: z.array(z.object({
    id: z.number(),
    description: z.string(),
    level: z.enum(['restricted', 'confidential', 'top-secret'])
  })),
  nervous_system: z.array(z.object({
    id: z.number(),
    message: z.string(),
    sensor: z.string().or(z.null())
  })),
  skill_chips: z.array(ChipSchema),
  contactList: z.array(ContactSchemaSimplified),
  disadvantages: z.array(z.object({
    id: z.number(),
    message: z.string(),
    sensor: z.string().or(z.null())
  })),
  avatar: z.string().or(z.null())
});
