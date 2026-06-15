"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeItems = normalizeItems;
function normalizeItems(feed) {
    const items = feed.rss.channel.item;
    return items.map((item) => ({
        title: item.title,
        link: item.link,
        content: item.description || "",
        publishedAt: item.pubDate ? new Date(item.pubDate) : null,
    }));
}
