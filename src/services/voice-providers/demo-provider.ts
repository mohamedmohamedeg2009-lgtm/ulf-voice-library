import { performanceSettingsSchema } from "@/features/studio/schemas";
import { demoVoices } from "@/features/voices/demo-voices";
import type { PerformanceSettings } from "@/features/studio/schemas";
import type { VoiceProvider, ProviderResult, ProviderGenerationRequest } from "@/services/voice-provider";

export class DemoVoiceProvider implements VoiceProvider {
  async generateVoice(request: ProviderGenerationRequest): Promise<ProviderResult> {
    void request;
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
