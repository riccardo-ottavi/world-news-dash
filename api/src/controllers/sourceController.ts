import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { canonicalCategory, normalizeCategories } from "../lib/categoryHelpers";

export const getSources = async (
  _req: Request,
  res: Response
) => {
  try {
    const sources = await prisma.source.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const normalizedSources = sources.map((source) => ({
      ...source,
      category: canonicalCategory(source.category) ?? null,
    }));

    res.status(200).json(normalizedSources);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Errore nel recupero delle fonti",
    });
  }
};

export const getSourceById = async (
  req: Request,
  res: Response
) => {
  try {
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0];
    if (!id) {
      return res.status(400).json({ message: "Invalid or missing id" });
    }

    const source = await prisma.source.findUnique({
      where: { id },
      include: {
        articles: true,
      },
    });

    if (!source) {
      return res.status(404).json({
        message: "Fonte non trovata",
      });
    }

    res.status(200).json(source);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Errore nel recupero della fonte",
    });
  }
};

export const getCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.source.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    });

    const list = categories.map((c) => c.category) as (string | null)[];
    const normalized = normalizeCategories(list);

    res.status(200).json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero delle categorie" });
  }
};