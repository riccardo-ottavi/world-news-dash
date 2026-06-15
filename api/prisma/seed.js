"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const sources = require("./seed-data");

const CATEGORY_ALIASES = {
    mondo: "world",
    tecnologia: "technology",
};

function canonicalCategory(value) {
    if (!value)
        return undefined;
    return CATEGORY_ALIASES[value] ?? value;
}

const prisma = new PrismaClient();
async function main() {
    console.log("Seeding sources...");
    for (const s of sources) {
        const category = canonicalCategory(s.category) ?? null;
        await prisma.source.upsert({
            where: { url: s.url },
            update: { name: s.name, category },
            create: { name: s.name, url: s.url, category },
        });
    }
    const all = await prisma.source.findMany();
    console.log(`Seeded ${all.length} sources`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
