import "dotenv/config";
import axios from "axios";
import Parser from "rss-parser";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();
const parser = new Parser();

async function run() {
  const sources = await prisma.source.findMany();

  for (const source of sources) {
    const feedUrl = source.url.replace(/\/feed\/$/, "/feed");
    console.log(`Fetching: ${feedUrl}`);

    let feed;
    try {
      const response = await axios.get<string>(feedUrl, {
        timeout: 15000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: source.url,
        },
      });

      feed = await parser.parseString(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to fetch feed for ${source.url}:`, message);
      continue;
    }

    if (!feed || !feed.items) {
      console.warn(`No items returned for ${source.url}`);
      continue;
    }

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