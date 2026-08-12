import { z } from "zod";

export const performanceSettingsSchema = z.object({
  speed: z.number().min(0.5).max(2).default(1),
  pitch: z.number().min(-12).max(12).default(0),
  energy: z.number().int().min(0).max(100).default(70),
  emotion: z.enum(["متوازن", "حماسي", "هادئ", "واثق", "عدواني"]).default("متوازن"),
  clarity: z.number().int().min(0).max(100).default(90),
  expression: z.number().int().min(0).max(100).default(65),
  pauseIntensity: z.number().int().min(0).max(100).default(50),
  emphasis: z.number().int().min(0).max(100).default(60),
  stability: z.number().int().min(0).max(100).default(75),
  speakingStyle: z.enum(["طبيعي", "إعلاني", "رياضي", "رسمي", "قصصي"]).default("طبيعي"),
});

export const generationRequestSchema = z.object({
  text: z.string().trim().min(1, "اكتب النص أولًا").max(5000),
  voiceId: z.uuid(),
  format: z.enum(["mp3", "wav"]).default("mp3"),
  settings: performanceSettingsSchema,
});

export type PerformanceSettings = z.infer<typeof performanceSettingsSchema>;
export type GenerationRequest = z.infer<typeof generationRequestSchema>;
