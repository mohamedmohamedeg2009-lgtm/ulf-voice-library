import { describe, expect, it } from "vitest";
import { isAllowedEmail } from "./authorization";

describe("isAllowedEmail", () => {
  it("normalizes case and whitespace", () => {
    expect(isAllowedEmail(" Owner@Example.com ", "owner@example.com")).toBe(true);
  });

  it("fails closed when the allowed email is missing", () => {
    expect(isAllowedEmail("owner@example.com", undefined)).toBe(false);
  });
});
