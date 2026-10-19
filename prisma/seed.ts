import "dotenv/config";
import { seedDatabase } from "../src/lib/db/repository";
import { prisma } from "../src/lib/db";

async function main() {
  await seedDatabase();
  console.log("Seeded atopic dermatitis corpus into SQLite (prisma/dev.db).");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
