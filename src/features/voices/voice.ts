import { z } from "zod";

export const voiceSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(2).max(80),
  displayName: z.string().trim().min(2).max(80),
  dialect: z.string().trim().min(2),
  country: z.string().trim().min(2),
  gender: z.literal("male"),
  ageStyle: z.string().trim().min(2),
  voiceTone: z.string().trim().min(2),
  energyLevel: z.number().int().min(0).max(100),
  styleTags: z.array(z.string().trim().min(1)).max(20),
  description: z.string().trim().max(500),
  previewAudioUrl: z.url().nullable(),
  provider: z.string().trim().min(1),
  providerVoiceId: z.string().trim().min(1),
  isFavorite: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Voice = z.infer<typeof voiceSchema>;
