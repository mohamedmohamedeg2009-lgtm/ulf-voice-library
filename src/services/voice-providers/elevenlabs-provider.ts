import { demoVoices } from "@/features/voices/demo-voices";
import { performanceSettingsSchema, type PerformanceSettings } from "@/features/studio/schemas";
import type { ProviderGenerationRequest, ProviderResult, VoiceProvider } from "@/services/voice-provider";

export function mapElevenLabsSettings(settings: Partial<PerformanceSettings>) {
  return {
    stability: (settings.stability ?? 75) / 100,
    similarity_boost: (settings.clarity ?? 90) / 100,
    style: (settings.expression ?? 65) / 100,
    use_speaker_boost: true,
  };
}

export class ElevenLabsProvider implements VoiceProvider {
  constructor(private readonly apiKey: string) {}

  async generateVoice(request: ProviderGenerationRequest): Promise<ProviderResult> {
    const outputFormat = request.format === "wav" ? "wav_44100" : "mp3_44100_128";
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(request.voiceId)}?output_format=${outputFormat}`, {
        method: "POST",
        headers: { "xi-api-key": this.apiKey, "content-type": "application/json", accept: request.format === "wav" ? "audio/wav" : "audio/mpeg" },
        body: JSON.stringify({ text: request.text, model_id: "eleven_multilingual_v2", voice_settings: mapElevenLabsSettings(request.settings) }),
        signal: AbortSignal.timeout(45_000),
      });
      if (!response.ok) {
        const code = response.status === 429 ? "rate_limited" : response.status === 401 ? "authentication" : response.status === 404 ? "invalid_voice" : "provider_unavailable";
        return { ok: false, error: { code, message: "تعذر توليد الصوت من المزود." } };
      }
      return { ok: true, audio: { bytes: new Uint8Array(await response.arrayBuffer()), contentType: request.format === "wav" ? "audio/wav" : "audio/mpeg" } };
    } catch (error) {
      return { ok: false, error: { code: error instanceof DOMException && error.name === "TimeoutError" ? "timeout" : "unknown", message: "تعذر الاتصال بمزود الصوت." } };
    }
  }

  async getVoices() { return demoVoices; }
  async getVoice(providerVoiceId: string) { return demoVoices.find((voice) => voice.providerVoiceId === providerVoiceId) ?? null; }
  validateSettings(settings: Partial<PerformanceSettings>) { const result = performanceSettingsSchema.safeParse(settings); return result.success ? { success: true } : { success: false, message: "إعدادات الصوت غير صالحة." }; }
}
