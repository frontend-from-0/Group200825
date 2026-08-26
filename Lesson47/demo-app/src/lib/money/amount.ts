import { z } from "zod";

export const MIN_AMOUNT_EUR = 0.01;
export const MAX_AMOUNT_EUR = 1_000_000;

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export const amountSchema = z
  .number()
  .finite()
  .min(MIN_AMOUNT_EUR, `Minimum is ${MIN_AMOUNT_EUR}`)
  .max(MAX_AMOUNT_EUR, `Maximum is ${MAX_AMOUNT_EUR}`)
  .transform(roundMoney);

export function parseAmount(raw: unknown): number {
  if (typeof raw === "string") {
    const normalized = raw.replace(",", ".").trim();
    return amountSchema.parse(Number(normalized));
  }
  return amountSchema.parse(raw);
}

export function formatEur(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
