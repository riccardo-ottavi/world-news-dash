import axios from "axios";
import Parser from "rss-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const parser = new Parser();

export async function runWorker() {
  const sources = await prisma.source.findMany();

  for (const source of sources) {
    const feedUrl = source.url.replace(/\/feed\/$/, "/feed");

    console.log(`Fetching: ${feedUrl}`);

    let feed: any;

    try {
      const response = await axios.get<string>(feedUrl, {
        timeout: 15000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      feed = await parser.parseString(response.data);
    } catch (err) {
      console.error(`Failed to fetch feed: ${source.url}`, err);
      continue;
    }

    if (!feed?.items) continue;

    for (const item of feed.items) {
      if (!item.link) continue;

      try {
        await prisma.article.create({
          data: {
            title: item.title || "No title",
            link: item.link,
            content: item.contentSnippet || item.content || "",
            publishedAt: item.pubDate ? new Date(item.pubDate) : null,
            hash: item.link,
            sourceId: source.id,
          },
        });
      } catch (err) {
        // ignore duplicates and continue
        continue;
      }
    }
  }

  await prisma.$disconnect();
  console.log("Worker finished");
}

export default runWorker;
