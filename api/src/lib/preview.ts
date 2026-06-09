export type NewsPreviewItem = {
  id: string;
  title: string;
  sourceName: string;
  category?: string | null;
  highlight: string;
  score: number;
  tags: string[];
};

export type NewsPreview = {
  date: string;
  summary: string;
  items: NewsPreviewItem[];
};

const categoryWeights: Record<string, number> = {
  world: 6,
  italia: 4,
  technology: 2,
  general: 1,
};

const keywordWeights: Record<string, number> = {
  guerra: 7,
  attacco: 6,
  attacchi: 6,
  raid: 6,
  bombardamento: 6,
  invasione: 6,
  emergenza: 6,
  crisi: 5,
  tregua: 4,
  sanzioni: 4,
  elezioni: 4,
  referendum: 4,
  accordo: 3,
  cyber: 3,
  cyberattacco: 4,
  esplosione: 5,
  omicidio: 5,
  incendio: 4,
  virus: 4,
  pandemia: 5,
  petrolio: 4,
  gas: 4,
};

const strongBreakingKeywords = new Set(["guerra", "attacco", "raid", "bombardamento", "invasione", "emergenza"]);

const normalizeText = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

const extractKeywords = (text: string): string[] => {
  const normalized = normalizeText(text);
  return Object.keys(keywordWeights).filter((keyword) => normalized.includes(keyword));
};

const buildArticleScore = (
  article: Omit<NewsPreviewItem, "score" | "tags"> & { publishedAt?: string | Date | null }
) => {
  const now = Date.now();
  const publishedAt = article.publishedAt ? new Date(article.publishedAt).getTime() : now;
  const ageHours = Math.max(0, (now - publishedAt) / 36_000_00);
  const recencyScore = Math.max(0, 24 - ageHours) * 1.5;

  const categoryKey = (article.category || "general").toLowerCase();
  const categoryScore = categoryWeights[categoryKey] ?? categoryWeights.general;

  const text = `${article.title} ${article.highlight}`;
  const keywords = Array.from(new Set(extractKeywords(text)));
  const keywordScore = keywords.reduce((sum, keyword) => sum + (keywordWeights[keyword] ?? 0), 0);

  return {
    score: Math.round((recencyScore + categoryScore * 2 + keywordScore) * 10) / 10,
    keywords,
  };
};

export function buildNewsPreview(
  articles: Array<{
    id: string;
    title?: string | null;
    content?: string | null;
    publishedAt?: string | Date | null;
    source?: { name: string; category?: string | null } | null;
  }>
): NewsPreview {
  const mappedArticles = articles.map((article) => ({
    id: article.id,
    title: article.title?.trim() || "Untitled",
    category: article.source?.category,
    sourceName: article.source?.name || "Unknown source",
    highlight: article.content?.trim() || article.title?.trim() || "No description available.",
    publishedAt: article.publishedAt ?? null,
  }));

  const uniqueArticles: Array<{
    id: string;
    title: string;
    category?: string | null;
    sourceName: string;
    highlight: string;
    publishedAt: string | Date | null;
  }> = [];
  const seenTitles = new Set<string>();

  for (const article of mappedArticles) {
    const normalizedTitle = normalizeText(article.title);
    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      uniqueArticles.push(article);
    }
  }

  const scoredArticles = uniqueArticles.map((article) => {
    const { score, keywords } = buildArticleScore(article);
    return {
      ...article,
      score,
      keywords,
      tags: [] as string[],
    };
  });

  const keywordSources = scoredArticles.reduce<Record<string, Set<string>>>((acc, article) => {
    const sourceName = article.sourceName || "Unknown source";
    article.keywords.forEach((keyword) => {
      acc[keyword] = acc[keyword] ?? new Set();
      acc[keyword].add(sourceName);
    });
    return acc;
  }, {});

  const topicKeywords = Object.entries(keywordSources)
    .filter(([, sources]) => sources.size > 1)
    .map(([keyword]) => keyword);

  const enrichedArticles = scoredArticles.map((article) => {
    const tags = new Set<string>();
    if (article.category) tags.add(article.category);
    if (article.score >= 18) tags.add("high priority");
    const hasBreaking = article.keywords.some((keyword) => strongBreakingKeywords.has(keyword));
    if (hasBreaking) tags.add("breaking");
    article.keywords.forEach((keyword) => tags.add(keyword));

    const matchingTopicKeywords = article.keywords.filter((keyword) => topicKeywords.includes(keyword));
    matchingTopicKeywords.forEach((keyword) => tags.add(`topic ${keyword}`));

    const topicBonus = matchingTopicKeywords.length * 2;
    return {
      ...article,
      score: Math.round((article.score + topicBonus) * 10) / 10,
      tags: Array.from(tags),
    };
  });

  const orderedArticles = enrichedArticles
    .slice()
    .sort((a, b) => b.score - a.score || (b.publishedAt ? new Date(b.publishedAt).getTime() : 0) - (a.publishedAt ? new Date(a.publishedAt).getTime() : 0));

  const topArticles = orderedArticles.slice(0, 4);

  const categoryCounts = Object.entries(
    topArticles.reduce<Record<string, number>>((acc, item) => {
      const key = item.category || "general";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  const breakingCount = topArticles.filter((item) => item.tags.includes("breaking")).length;
  const introParts: string[] = [];
  if (categoryCounts.length) {
    introParts.push(`Today’s preview highlights ${categoryCounts.join(", ")} news.`);
  } else {
    introParts.push("Here is today’s news preview.");
  }
  if (breakingCount > 0) {
    introParts.push(`Includes ${breakingCount} breaking update${breakingCount === 1 ? "" : "s"}.`);
  }
  const summaryTopics = Array.from(
    new Set(topArticles.flatMap((item) => item.tags.filter((tag) => tag.startsWith("topic "))))
  ).map((tag) => tag.replace("topic ", ""));
  if (summaryTopics.length) {
    introParts.push(`Topic focus: ${summaryTopics.join(", ")}.`);
  }

  const intro = introParts.join(" ");

  const points = topArticles.map((item, index) => {
    const sourcePart = item.sourceName ? `${item.sourceName} - ` : "";
    const categoryPart = item.category ? ` [${item.category}]` : "";
    const tagPart = item.tags.length ? ` ${item.tags.map((tag) => `[${tag}]`).join(" ")}` : "";
    const shortHighlight = item.highlight.length > 120 ? `${item.highlight.slice(0, 117)}...` : item.highlight;
    return `${index + 1}. ${sourcePart}${item.title}${categoryPart}${tagPart} — ${shortHighlight}`;
  });

  return {
    date: new Date().toISOString(),
    summary: [intro, "", ...points].join("\n"),
    items: topArticles,
  };
}
