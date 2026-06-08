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