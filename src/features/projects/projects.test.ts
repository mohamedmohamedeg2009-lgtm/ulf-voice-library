import { describe, expect, it } from "vitest";
import { projectInputSchema } from "./schemas";

describe("projectInputSchema", () => {
  it("trims a valid project name", () => {
    expect(projectInputSchema.parse({ name: "  مباريات الأسبوع  ", description: "" }).name).toBe("مباريات الأسبوع");
  });

  it("rejects empty names and oversized descriptions", () => {
    expect(projectInputSchema.safeParse({ name: " ", description: "x".repeat(501) }).success).toBe(false);
  });
});
