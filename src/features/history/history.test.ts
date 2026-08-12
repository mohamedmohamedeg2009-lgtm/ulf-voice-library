import { describe, expect, it } from "vitest";
import { recordingSchema } from "./schemas";

describe("recordingSchema", () => {
  it("requires at least one real audio artifact", () => {
    const result = recordingSchema.safeParse({
      id: "10000000-0000-4000-8000-000000000011",
      text: "تجربة",
      voiceId: "10000000-0000-4000-8000-000000000001",
      voiceName: "ناصر",
      settings: {},
      audioUrl: null,
      mp3Url: null,
      wavUrl: null,
      duration: 1,
      projectId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});
