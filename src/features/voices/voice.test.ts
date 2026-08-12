import { describe, expect, it } from "vitest";
import { voiceSchema } from "./voice";

const voice = {
  id: "10000000-0000-4000-8000-000000000001",
  name: "nasser",
  displayName: "ناصر",
  dialect: "كويتي",
  country: "الكويت",
  gender: "male",
  ageStyle: "شبابي",
  voiceTone: "حماسي",
  energyLevel: 88,
  styleTags: ["كويتي", "رياضي"],
  description: "صوت رياضي واضح",
  previewAudioUrl: null,
  provider: "demo",
  providerVoiceId: "demo-nasser",
  isFavorite: false,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("voiceSchema", () => {
  it("accepts a complete male Gulf voice", () => {
    expect(voiceSchema.parse(voice).displayName).toBe("ناصر");
  });

  it("rejects female voices because this library is male-only", () => {
    expect(() => voiceSchema.parse({ ...voice, gender: "female" })).toThrow();
  });

  it.each([
    "2026-01-01T00:00:00.000Z",
    "2026-01-01T03:00:00.000+03:00",
  ])("accepts timezone-aware voice timestamps: %s", (timestamp) => {
    const result = voiceSchema.parse({
      ...voice,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    expect(result.createdAt).toBe(timestamp);
    expect(result.updatedAt).toBe(timestamp);
  });

  it("rejects voice timestamps without timezone information", () => {
    expect(() => voiceSchema.parse({
      ...voice,
      createdAt: "2026-01-01T00:00:00.000",
      updatedAt: "2026-01-01T00:00:00.000",
    })).toThrow();
  });
});
