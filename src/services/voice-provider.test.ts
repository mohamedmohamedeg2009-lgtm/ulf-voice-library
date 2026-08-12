import { describe, expect, it } from "vitest";
import { DemoVoiceProvider } from "./voice-providers/demo-provider";
import { mapElevenLabsSettings } from "./voice-providers/elevenlabs-provider";

describe("DemoVoiceProvider", () => {
  it("validates provider settings before generation", () => {
    const provider = new DemoVoiceProvider();
    expect(provider.validateSettings({ speed: 4 }).success).toBe(false);
  });

  it("returns an honest unavailable result instead of fabricated audio", async () => {
    const provider = new DemoVoiceProvider();
    const result = await provider.generateVoice({
      text: "مباراة اليوم",
      voiceId: "demo-nasser",
      format: "mp3",
      settings: {},
    });
    expect(result).toEqual({
      ok: false,
      error: { code: "provider_unavailable", message: "مزود الصوت التجريبي لا يولد ملفات صوتية." },
    });
  });
});

describe("ElevenLabs settings adapter", () => {
  it("maps only supported normalized settings into provider fields", () => {
    expect(mapElevenLabsSettings({ stability: 75, expression: 60, speed: 1.2, clarity: 90 })).toEqual({
      stability: 0.75,
      similarity_boost: 0.9,
      style: 0.6,
      use_speaker_boost: true,
    });
  });
});
