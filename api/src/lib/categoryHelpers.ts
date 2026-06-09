export const CATEGORY_ALIASES: Record<string, string> = {
  mondo: "world",
  tecnologia: "technology",
};

export const canonicalCategory = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  return CATEGORY_ALIASES[value] ?? value;
};

export const expandCategoryAliases = (value?: string | null): string[] => {
  if (!value) return [];

  const canonical = canonicalCategory(value);
  const aliases = Object.entries(CATEGORY_ALIASES)
    .filter(([, target]) => target === canonical)
    .map(([alias]) => alias);

  return Array.from(new Set([canonical, value, ...aliases].filter(Boolean) as string[]));
};

export const normalizeCategories = (categories: Array<string | null>): string[] => {
  return Array.from(new Set(categories.filter(Boolean).map((c) => canonicalCategory(c) as string))).filter(
    Boolean
  ) as string[];
};
