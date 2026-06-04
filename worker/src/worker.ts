import Parser from "rss-parser";
import { prisma } from "./prisma";
const parser = new Parser();

const FEEDS = [
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
];

async function run() {
  for (const url of FEEDS) {
    console.log("Fetching:", url);

    const feed = await parser.parseURL(url);

    const source = await prisma.source.upsert({
      where: { url },
      update: {},
      create: {
        name: feed.title || "Unknown",
        url,
        category: "world"
      }
    });

    for (const item of feed.items) {
      if (!item.link) continue;

      try {
        await prisma.article.create({
          data: {
            title: item.title || "No title",
            link: item.link,
            content: item.contentSnippet || "",
            publishedAt: item.pubDate ? new Date(item.pubDate) : null,
            hash: item.link,
            sourceId: source.id
          }
        });
      } catch (e) {
        // duplicato → skip
        continue;
      }
    }
  }

  console.log("DONE");
  await prisma.$disconnect();
}

run().catch(console.error);