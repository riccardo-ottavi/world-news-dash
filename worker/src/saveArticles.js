"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveArticles = saveArticles;
const prisma_1 = require("./prisma");
async function saveArticles(articles, sourceId) {
    for (const article of articles) {
        try {
            await prisma_1.prisma.article.create({
                data: {
                    title: article.title,
                    link: article.link,
                    content: article.content,
                    publishedAt: article.publishedAt,
                    hash: article.link,
                    source: {
                        connect: { id: sourceId },
                    },
                },
            });
        }
        catch (err) {
            continue;
        }
    }
}
