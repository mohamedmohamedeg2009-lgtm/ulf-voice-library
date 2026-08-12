import type { Voice } from "@/features/voices/voice";
import type { GenerationRequest, PerformanceSettings } from "@/features/studio/schemas";

export type ProviderErrorCode =
  | "timeout"
  | "rate_limited"
  | "invalid_voice"
  | "unsupported_setting"
  | "authentication"
  | "provider_unavailable"
  | "unknown";

export type ProviderResult =
  | { ok: true; audio: { bytes: Uint8Array; contentType: "audio/mpeg" | "audio/wav"; duration?: number } }
  | { ok: false; error: { code: ProviderErrorCode; message: string } };

export interface VoiceProvider {
  generateVoice(request: GenerationRequest): Promise<ProviderResult>;
  getVoices(): Promise<Voice[]>;
  getVoice(providerVoiceId: string): Promise<Voice | null>;
  validateSettings(settings: Partial<PerformanceSettings>): { success: boolean; message?: string };
}
