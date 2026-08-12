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
});
