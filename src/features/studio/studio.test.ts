import { describe, expect, it } from "vitest";
import { generationRequestSchema, performanceSettingsSchema } from "./schemas";

describe("Voice Studio schemas", () => {
  it("provides deliberate defaults for every performance setting", () => {
    expect(performanceSettingsSchema.parse({})).toEqual({
      speed: 1,
      pitch: 0,
      energy: 70,
      emotion: "متوازن",
      clarity: 90,
      expression: 65,
      pauseIntensity: 50,
      emphasis: 60,
      stability: 75,
      speakingStyle: "طبيعي",
    });
  });

  it("rejects an empty generation request before contacting a provider", () => {
    const result = generationRequestSchema.safeParse({ text: " ", voiceId: "", settings: {} });
    expect(result.success).toBe(false);
  });

  it("accepts Arabic text, a voice, format, and valid settings", () => {
    const result = generationRequestSchema.safeParse({
      text: "مباراة اليوم الساعة تسع",
      voiceId: "10000000-0000-4000-8000-000000000001",
      format: "mp3",
      settings: {},
    });
    expect(result.success).toBe(true);
  });
});
