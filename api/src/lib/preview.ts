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
    world: 12,
    italia: 5,
    technology: 3,
    general: 1,
};

const urgentKeywordSet = new Set([
    "guerra",
    "attacco",
    "attaccato",
    "raid",
    "bombardamento",
    "invasione",
    "emergenza",
    "strike",
    "airstrike",
    "helicopter",
    "military",
    "bombing",
    "shooting",
    "killed",
    "dead",
    "war",
    "missile",
    "shelling",
    "rocket",
    "drone",
    "battle",
    "evacuation",
    "iran",
    "israel",
    "lebanon",
    "gaza",
    "tehran",
    "tyre",
]);

const keywordWeights: Record<string, number> = {
    guerra: 8,
    attacco: 7,
    attacchi: 7,
    attaccato: 7,
    attaccano: 7,

    // inglese
    war: 10,
    strike: 9,
    strikes: 9,
    attacked: 9,
    attacking: 8,
    attack: 7,
    attacks: 7,
    invasion: 8,
    ceasefire: 6,
    crisis: 6,
    emergency: 7,
    helicopter: 6,
    military: 6,
    missile: 7,
    airstrike: 9,
    sanctions: 6,
    protest: 4,
    blast: 6,
    bombing: 7,
    shooting: 7,
    killed: 7,
    deaths: 6,
    death: 6,
    dead: 6,
    evacuation: 5,
    siege: 7,
    shelling: 8,
    rocket: 7,
    drone: 6,
    tanks: 6,
    battles: 7,
    battle: 7,
    iran: 8,
    israel: 8,
    lebanon: 7,
    tyre: 7,
    gaza: 8,
    tehran: 7,
    britain: 4,
    london: 3,
    usa: 6,
    us: 4,
};

const lowPriorityWeights: Record<string, number> = {
    pope: -8,
    blessing: -6,
    mass: -5,
    church: -7,
    basilica: -7,
    gaudi: -6,
    barcelona: -4,
    culture: -5,
    art: -5,
    exhibition: -5,
    pilgrimage: -6,
    music: -4,
    theater: -4,
    fashion: -4,
    festival: -5,
    tourism: -5,
    landmark: -4,
    iconic: -4,
    statue: -4,
    artist: -3,
    design: -3,
    museum: -4,
    architecture: -4,
    heritage: -4,
    popeleo: -5,
};

const strongBreakingKeywords = new Set([
    "guerra",
    "attacco",
    "attaccato",
    "raid",
    "bombardamento",
    "invasione",
    "emergenza",
    "strike",
    "airstrike",
    "helicopter",
    "military",
    "bombing",
    "shooting",
    "killed",
    "dead",
    "war",
    "missile",
    "shelling",
    "rocket",
    "drone",
    "battle",
    "evacuation",
]);

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
    const lowPriorityScore = keywords.reduce((sum, keyword) => sum + (lowPriorityWeights[keyword] ?? 0), 0);

    const sourceName = article.sourceName.toLowerCase();
    const sourceBoost = sourceName.includes("world") || sourceName.includes("nyt") || sourceName.includes("bbc") || sourceName.includes("reuters") ? 2 : 0;
    const urgentBonus = keywords.some((keyword) => urgentKeywordSet.has(keyword)) ? 5 : 0;

    return {
        score: Math.round((recencyScore * 0.9 + categoryScore * 2 + keywordScore + lowPriorityScore + sourceBoost + urgentBonus) * 10) / 10,
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
const mappedArticles = articles.map((article) => {
    const title = article.title?.trim() || "Untitled";
    const contentText = article.content?.trim();
    const highlight = contentText && normalizeText(contentText) !== normalizeText(title) ? contentText : "";

    return {
      id: article.id,
      title,
      category: article.source?.category,
      sourceName: article.source?.name || "Unknown source",
      highlight,
      publishedAt: article.publishedAt ?? null,
    };
  });

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
        const shortHighlight =
            item.highlight.length > 120
                ? `${item.highlight.slice(0, 117)}...`
                : item.highlight;

        return shortHighlight
            ? `${index + 1}. ${sourcePart}${item.title} — ${shortHighlight}`
            : `${index + 1}. ${sourcePart}${item.title}`;
    });

    return {
        date: new Date().toISOString(),
        summary: [intro, "", ...points].join("\n"),
        items: topArticles,
    };
}
