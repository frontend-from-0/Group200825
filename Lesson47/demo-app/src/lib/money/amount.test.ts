import { describe, expect, it } from "vitest";
import { formatEur, parseAmount, roundMoney } from "./amount";

describe("money", () => {
  it("rounds to 2 dp", () => {
    expect(roundMoney(1.005)).toBe(1.01);
  });

  it("parses and validates amounts", () => {
    expect(parseAmount("12,50")).toBe(12.5);
    expect(() => parseAmount(0)).toThrow();
    expect(() => parseAmount(2_000_000)).toThrow();
  });

  it("formats EUR for locales", () => {
    expect(formatEur(10, "en")).toContain("10");
    expect(formatEur(10, "tr")).toContain("10");
  });
});
