import Parser from "rss-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const parser = new Parser();

async function run() {
  const sources = await prisma.source.findMany();

  for (const source of sources) {
    console.log(`Fetching: ${source.url}`);

    const feed = await parser.parseURL(source.url);

    for (const item of feed.items) {
      if (!item.link) continue;

      try {
        await prisma.article.create({
          data: {
            title: item.title || "No title",
            link: item.link,
            content: item.contentSnippet || "",
            publishedAt: item.pubDate
              ? new Date(item.pubDate)
              : null,
            hash: item.link,
            sourceId: source.id,
          },
        });
      } catch {
        
        continue;
      }
    }
  }

  await prisma.$disconnect();
}

run()
  .then(() => console.log("DONE"))
  .catch(console.error);