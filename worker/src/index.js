"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchRss_1 = require("./fetchRss");
const normalize_1 = require("./normalize");
const saveArticles_1 = require("./saveArticles");
const prisma_1 = require("./prisma");
const RSS_URL = "https://www.reutersagency.com/feed/?best-topics=world&post_type=best";
async function run() {
    console.log("Starting RSS worker...");
    const source = await prisma_1.prisma.source.upsert({
        where: { url: RSS_URL },
        update: {},
        create: {
            name: "Reuters",
            url: RSS_URL,
            category: "world",
        },
    });
    const feed = await (0, fetchRss_1.fetchRss)(RSS_URL);
    const articles = (0, normalize_1.normalizeItems)(feed);
    await (0, saveArticles_1.saveArticles)(articles, source.id);
    console.log(`Inserted ${articles.length} articles`);
}
run().catch(console.error);
