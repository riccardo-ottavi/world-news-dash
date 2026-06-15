"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const sources_1 = __importDefault(require("../../shared/sources"));
const categoryHelpers_1 = require("../src/lib/categoryHelpers");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Seeding sources...");
    for (const s of sources_1.default) {
        const category = (0, categoryHelpers_1.canonicalCategory)(s.category) ?? null;
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
