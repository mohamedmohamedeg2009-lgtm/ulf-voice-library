import { z } from "zod";
import { performanceSettingsSchema, type PerformanceSettings } from "@/features/studio/schemas";
import type { Voice } from "@/features/voices/voice";
import type { TextAnalysis, VoiceRecommendation } from "@/services/ai-service";

export const smartSettingsResponseSchema = z.object({
  contentType: z.string().trim().min(1),
  settings: performanceSettingsSchema,
  rationale: z.string().trim().min(1).max(300),
});

const contentPatterns = [
  ["تم اكتمال الحجز", /اكتمل|كامل|تم الحجز/],
  ["باقي أماكن", /باقي|متبقي|مكانين|أماكن/],
  ["تغيير موعد", /تغيير.*موعد|تأجيل/],
  ["تغيير ملعب", /تغيير.*ملعب/],
  ["إعلان نتيجة", /النتيجة|فاز|تعادل/],
  ["رجل المباراة", /رجل المباراة/],
  ["دعوة حارس", /حارس/],
  ["حجز ملعب", /حجز.*ملعب|احجز/],
  ["بطولة", /بطولة/],
  ["تحدي", /تحدي/],
  ["إعلان مباراة", /مباراة|مواجهة/],
] as const;

export function analyzeText(text: string): TextAnalysis {
  const matched = contentPatterns.find(([, pattern]) => pattern.test(text));
  return {
    contentType: matched?.[0] ?? "محتوى عام",
    tone: /!|تحدي|قوي|اليوم/.test(text) ? "حماسي" : "متوازن",
    keywords: contentPatterns.filter(([, pattern]) => pattern.test(text)).map(([name]) => name),
  };
}

export function recommendVoices(text: string, voices: Voice[]): VoiceRecommendation[] {
  const analysis = analyzeText(text);
  const energetic = analysis.tone === "حماسي";
  return voices
    .filter((voice) => voice.isActive)
    .map((voice) => ({
      voice,
      score: (voice.country === "الكويت" ? 20 : 0)
        + (energetic ? voice.energyLevel : 100 - Math.abs(65 - voice.energyLevel))
        + (voice.styleTags.some((tag) => text.includes("حجز") ? tag.includes("حجوزات") : tag.includes("رياضي")) ? 25 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ voice }) => ({
      voiceId: voice.id,
      reason: `${voice.displayName} مناسب لنمط ${analysis.contentType} وأدائه ${voice.voiceTone}.`,
    }));
}

export function suggestVoiceSettings(text: string): { settings: PerformanceSettings; rationale: string; contentType: string } {
  const analysis = analyzeText(text);
  const energetic = analysis.tone === "حماسي";
  return {
    contentType: analysis.contentType,
    settings: performanceSettingsSchema.parse({
      speed: energetic ? 1.08 : 0.98,
      energy: energetic ? 82 : 65,
      clarity: 94,
      expression: energetic ? 76 : 64,
      pauseIntensity: 55,
      speakingStyle: energetic ? "رياضي" : "طبيعي",
    }),
    rationale: `ضبط مقترح يناسب ${analysis.contentType}.`,
  };
}

export function improveText(text: string) {
  const trimmed = text.trim();
  return { original: text, proposed: trimmed.endsWith("!") ? trimmed : `${trimmed}!` };
}
