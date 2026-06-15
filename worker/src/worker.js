"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWorker = runWorker;
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const parser = new rss_parser_1.default();
async function runWorker() {
    const sources = await prisma.source.findMany();
    for (const source of sources) {
        const feedUrl = source.url.replace(/\/feed\/$/, "/feed");
        console.log(`Fetching: ${feedUrl}`);
        let feed;
        try {
            const response = await axios_1.default.get(feedUrl, {
                timeout: 15000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
            });
            feed = await parser.parseString(response.data);
        }
        catch (err) {
            console.error(`Failed to fetch feed: ${source.url}`, err);
            continue;
        }
        if (!feed?.items)
            continue;
        for (const item of feed.items) {
            if (!item.link)
                continue;
            try {
                await prisma.article.create({
                    data: {
                        title: item.title || "No title",
                        link: item.link,
                        content: item.contentSnippet || "",
                        publishedAt: item.pubDate ? new Date(item.pubDate) : null,
                        hash: item.link,
                        sourceId: source.id,
                    },
                });
            }
            catch {
                continue;
            }
        }
    }
    console.log("Worker finished");
}
