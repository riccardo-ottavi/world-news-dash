import "dotenv/config";
import Parser from "rss-parser";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();
const parser = new Parser();

async function run() {
  const sources = await prisma.source.findMany();

  for (const source of sources) {
    console.log(`Fetching: ${source.url}`);

    const feed = await parser.parseURL(source.url);

    for (const item of feed.items) {
      if (!item.link) continue;
      console.log(item)

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

cron.schedule("*/1440 * * * *", () => {
  console.log("Scheduled run:", new Date().toISOString());
  run().catch((err) => console.error("Scheduled run failed", err));
});