import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getNews = async (
  req: Request,
  res: Response
) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        source: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 50,
    });

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Errore nel recupero delle news",
    });
  }
};