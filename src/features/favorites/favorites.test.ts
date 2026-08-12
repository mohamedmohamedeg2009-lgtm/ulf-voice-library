import { describe, expect, it } from "vitest";
import { toggleFavorite } from "./favorites";

describe("toggleFavorite", () => {
  it("adds a voice once and removes it on the next toggle", () => {
    expect(toggleFavorite([], "voice-1")).toEqual(["voice-1"]);
    expect(toggleFavorite(["voice-1"], "voice-1")).toEqual([]);
  });

  it("preserves unrelated favorites", () => {
    expect(toggleFavorite(["voice-1"], "voice-2")).toEqual(["voice-1", "voice-2"]);
  });
});
