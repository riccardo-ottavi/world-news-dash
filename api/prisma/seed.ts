import { PrismaClient } from "@prisma/client";
import sources from "../../shared/sources";
import { canonicalCategory } from "../src/lib/categoryHelpers";

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
