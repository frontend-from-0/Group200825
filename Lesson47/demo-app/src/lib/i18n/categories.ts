export type Locale = "en" | "tr";

export type DefaultCategoryDef = {
  key: string;
  icon: string;
  color: string;
  name: Record<Locale, string>;
};

export const DEFAULT_CATEGORIES: DefaultCategoryDef[] = [
  {
    key: "general",
    icon: "wallet",
    color: "#6C5CE7",
    name: { en: "General", tr: "Genel" },
  },
  {
    key: "transportation",
    icon: "car",
    color: "#0984E3",
    name: { en: "Transportation", tr: "Ulaşım" },
  },
  {
    key: "charity",
    icon: "heart",
    color: "#E84393",
    name: { en: "Charity", tr: "Bağış" },
  },
  {
    key: "education",
    icon: "book",
    color: "#00B894",
    name: { en: "Education", tr: "Eğitim" },
  },
  {
    key: "food_drink",
    icon: "utensils",
    color: "#FDCB6E",
    name: { en: "Food & Drink", tr: "Yiyecek & İçecek" },
  },
  {
    key: "shopping",
    icon: "bag",
    color: "#E17055",
    name: { en: "Shopping", tr: "Alışveriş" },
  },
  {
    key: "housing",
    icon: "home",
    color: "#636E72",
    name: { en: "Housing", tr: "Konut" },
  },
  {
    key: "health",
    icon: "activity",
    color: "#00CEC9",
    name: { en: "Health", tr: "Sağlık" },
  },
];

export function resolveLocale(raw?: string | null): Locale {
  if (raw?.toLowerCase().startsWith("tr")) return "tr";
  return "en";
}
