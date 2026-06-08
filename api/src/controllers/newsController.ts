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

export const getNewsById = async (
  req: Request,
  res: Response
) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      return res.status(400).json({ message: "ID mancante" });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
      include: {
        source: true,
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "Articolo non trovato",
      });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Errore nel recupero dell'articolo",
    });
  }
};