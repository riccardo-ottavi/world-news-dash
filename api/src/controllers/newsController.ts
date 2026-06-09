import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { expandCategoryAliases } from "../lib/categoryHelpers";
import { buildNewsPreview } from "../lib/preview";

export const getNews = async (
  req: Request,
  res: Response
) => {
  try {
    const { category, sourceId } = req.query as { [key: string]: string | undefined };

    const where: any = {};

    if (sourceId) {
      where.sourceId = sourceId;
    }

    if (category) {
      where.source = {
        category: {
          in: expandCategoryAliases(category),
        },
      };
    }

    const articles = await prisma.article.findMany({
      where,
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

export const getNewsPreview = async (
  _req: Request,
  res: Response
) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const articles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: since,
        },
      },
      include: {
        source: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 12,
    });

    const preview = buildNewsPreview(articles);

    res.status(200).json(preview);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Errore nel recupero dell'anteprima delle news",
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