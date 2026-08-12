import { z } from "zod";
import { performanceSettingsSchema } from "@/features/studio/schemas";

export const recordingSchema = z.object({
  id: z.uuid(),
  text: z.string().trim().min(1).max(5000),
  voiceId: z.uuid(),
  voiceName: z.string().trim().min(1),
  settings: performanceSettingsSchema,
  audioUrl: z.url().nullable(),
  mp3Url: z.url().nullable(),
  wavUrl: z.url().nullable(),
  duration: z.number().nonnegative().nullable(),
  projectId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
}).refine((value) => Boolean(value.audioUrl || value.mp3Url || value.wavUrl), {
  message: "يجب أن يحتوي التسجيل على ملف صوتي واحد على الأقل",
});

export type Recording = z.infer<typeof recordingSchema>;
