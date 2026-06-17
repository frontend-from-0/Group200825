/** ISO 4217 codes — supported shop currencies */
export enum Currency {
  EUR = "EUR",
  GBP = "GBP",
  TRY = "TRY",
}

export const EU_CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: Currency.EUR, label: "Euro (€)" },
  { value: Currency.GBP, label: "British pound (£)" },
  { value: Currency.TRY, label: "Turkish lira (₺)" },
];

export function isCurrency(value: string): value is Currency {
  return Object.values(Currency).includes(value as Currency);
}

export function formatPrice(priceCents: number, currency: Currency): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}
