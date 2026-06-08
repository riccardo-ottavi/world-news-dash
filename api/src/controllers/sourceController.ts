import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

    res.status(200).json(sources);
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