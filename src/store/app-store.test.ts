import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "./app-store";

describe("app store", () => {
  beforeEach(() => useAppStore.getState().reset());

  it("selects a voice and toggles favorites without duplicates", () => {
    useAppStore.getState().selectVoice("voice-1");
    useAppStore.getState().toggleFavorite("voice-1");
    useAppStore.getState().toggleFavorite("voice-1");
    expect(useAppStore.getState().selectedVoiceId).toBe("voice-1");
    expect(useAppStore.getState().favoriteIds).toEqual([]);
  });

  it("creates a project with normalized input", () => {
    const project = useAppStore.getState().createProject({ name: "  مباريات الأسبوع  ", description: "" });
    expect(project?.name).toBe("مباريات الأسبوع");
    expect(useAppStore.getState().projects).toHaveLength(1);
  });
});
