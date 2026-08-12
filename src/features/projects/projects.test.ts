import { describe, expect, it } from "vitest";
import { projectInputSchema } from "./schemas";

describe("projectInputSchema", () => {
  it("trims a valid project name", () => {
    expect(projectInputSchema.parse({ name: "  مباريات الأسبوع  ", description: "" }).name).toBe("مباريات الأسبوع");
  });

  it("rejects empty names and oversized descriptions", () => {
    expect(projectInputSchema.safeParse({ name: " ", description: "x".repeat(501) }).success).toBe(false);
  });

  it.each([
    "2026-01-01T00:00:00.000Z",
    "2026-01-01T03:00:00.000+03:00",
  ])("accepts timezone-aware project timestamps: %s", async (timestamp) => {
    const { projectSchema } = await import("./schemas");
    const result = projectSchema.parse({
      id: "10000000-0000-4000-8000-000000000020",
      name: "مباريات الأسبوع",
      description: "",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    expect(result.createdAt).toBe(timestamp);
    expect(result.updatedAt).toBe(timestamp);
  });
});
