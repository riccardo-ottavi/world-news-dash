import { fetchRss } from "./fetchRss";
import { normalizeItems } from "./normalize";
import { saveArticles } from "./saveArticles";
import { prisma } from "./prisma";

const RSS_URL = "https://www.reutersagency.com/feed/?best-topics=world&post_type=best";

async function run() {
  console.log("Starting RSS worker...");

  const source = await prisma.source.upsert({
    where: { url: RSS_URL },
    update: {},
    create: {
      name: "Reuters",
      url: RSS_URL,
      category: "world",
    },
  });

  const feed = await fetchRss(RSS_URL);

  const articles = normalizeItems(feed);

  await saveArticles(articles, source.id);

  console.log(`Inserted ${articles.length} articles`);
}

run().catch(console.error);