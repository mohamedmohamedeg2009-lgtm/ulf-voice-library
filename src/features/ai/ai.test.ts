import { describe, expect, it } from "vitest";
import { analyzeText, recommendVoices, smartSettingsResponseSchema } from "./demo-ai-service";
import { demoVoices } from "@/features/voices/demo-voices";

describe("demo AI service", () => {
  it("recognizes a match announcement without locking the type system to sports", () => {
    expect(analyzeText("مباراة اليوم الساعة 9، باقي مكانين").contentType).toBe("إعلان مباراة");
  });

  it("returns the best three existing voices with a concise reason", () => {
    const results = recommendVoices("تحدي قوي في مباراة اليوم", demoVoices);
    expect(results).toHaveLength(3);
    expect(results.every((item) => demoVoices.some((voice) => voice.id === item.voiceId))).toBe(true);
    expect(results.every((item) => item.reason.length >= 8)).toBe(true);
  });

  it("rejects out-of-range AI settings instead of trusting model output", () => {
    expect(() => smartSettingsResponseSchema.parse({
      contentType: "إعلان",
      settings: { energy: 140 },
      rationale: "اختبار",
    })).toThrow();
  });
});
