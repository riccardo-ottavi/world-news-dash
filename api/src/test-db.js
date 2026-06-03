const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const source = await prisma.source.create({
    data: {
      name: "Test RSS",
      url: "https://example.com/rss",
      category: "test",
    },
  });

  console.log(source);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());