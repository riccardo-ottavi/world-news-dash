"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.getSourceById = exports.getSources = void 0;
const prisma_1 = require("../lib/prisma");
const categoryHelpers_1 = require("../lib/categoryHelpers");
const getSources = async (_req, res) => {
    try {
        const sources = await prisma_1.prisma.source.findMany({
            orderBy: {
                name: "asc",
            },
        });
        const normalizedSources = sources.map((source) => ({
            ...source,
            category: (0, categoryHelpers_1.canonicalCategory)(source.category) ?? null,
        }));
        res.status(200).json(normalizedSources);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Errore nel recupero delle fonti",
        });
    }
};
exports.getSources = getSources;
const getSourceById = async (req, res) => {
    try {
        let { id } = req.params;
        if (Array.isArray(id))
            id = id[0];
        if (!id) {
            return res.status(400).json({ message: "Invalid or missing id" });
        }
        const source = await prisma_1.prisma.source.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Errore nel recupero della fonte",
        });
    }
};
exports.getSourceById = getSourceById;
const getCategories = async (_req, res) => {
    try {
        const categories = await prisma_1.prisma.source.findMany({
            where: { category: { not: null } },
            select: { category: true },
            distinct: ["category"],
        });
        const list = categories.map((c) => c.category);
        const normalized = (0, categoryHelpers_1.normalizeCategories)(list);
        res.status(200).json(normalized);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore nel recupero delle categorie" });
    }
};
exports.getCategories = getCategories;
