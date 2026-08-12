import { performanceSettingsSchema } from "@/features/studio/schemas";
import { demoVoices } from "@/features/voices/demo-voices";
import type { GenerationRequest, PerformanceSettings } from "@/features/studio/schemas";
import type { VoiceProvider, ProviderResult } from "@/services/voice-provider";

export class DemoVoiceProvider implements VoiceProvider {
  async generateVoice(_request: GenerationRequest): Promise<ProviderResult> {
    return {
      ok: false,
      error: { code: "provider_unavailable", message: "مزود الصوت التجريبي لا يولد ملفات صوتية." },
    };
  }

  async getVoices() {
    return demoVoices;
  }

  async getVoice(providerVoiceId: string) {
    return demoVoices.find((voice) => voice.providerVoiceId === providerVoiceId) ?? null;
  }

  validateSettings(settings: Partial<PerformanceSettings>) {
    const result = performanceSettingsSchema.safeParse(settings);
    return result.success ? { success: true } : { success: false, message: "إعدادات الصوت غير مدعومة." };
  }
}
