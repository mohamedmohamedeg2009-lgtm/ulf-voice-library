import { describe, expect, it } from "vitest";
import { DemoVoiceProvider } from "./voice-providers/demo-provider";

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
