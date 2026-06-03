import { prisma } from "./prisma";

export async function saveArticles(articles: any[], sourceId: string) {
  for (const article of articles) {
    try {
      await prisma.article.create({
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
    } catch (err) {
       
      continue;
    }
  }
}