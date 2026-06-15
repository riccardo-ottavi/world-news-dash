"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsById = exports.getNewsPreview = exports.getNews = void 0;
const prisma_1 = require("../lib/prisma");
const categoryHelpers_1 = require("../lib/categoryHelpers");
const preview_1 = require("../lib/preview");
const getNews = async (req, res) => {
    try {
        const { category, sourceId } = req.query;
        const where = {};
        if (sourceId) {
            where.sourceId = sourceId;
        }
        if (category) {
            where.source = {
                category: {
                    in: (0, categoryHelpers_1.expandCategoryAliases)(category),
                },
            };
        }
        const articles = await prisma_1.prisma.article.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Errore nel recupero delle news",
        });
    }
};
exports.getNews = getNews;
const getNewsPreview = async (_req, res) => {
    try {
        const since = new Date();
        since.setDate(since.getDate() - 1);
        const articles = await prisma_1.prisma.article.findMany({
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
        const preview = (0, preview_1.buildNewsPreview)(articles);
        res.status(200).json(preview);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Errore nel recupero dell'anteprima delle news",
        });
    }
};
exports.getNewsPreview = getNewsPreview;
const getNewsById = async (req, res) => {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        if (!id) {
            return res.status(400).json({ message: "ID mancante" });
        }
        const article = await prisma_1.prisma.article.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Errore nel recupero dell'articolo",
        });
    }
};
exports.getNewsById = getNewsById;
