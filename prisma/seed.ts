import "dotenv/config";
import { seedDatabase } from "../src/lib/db/repository";
import { prisma } from "../src/lib/db";

async function main() {
  const [users, assets, evidence, meta] = await Promise.all([
    prisma.user.count(),
    prisma.asset.count(),
    prisma.evidenceRecord.count(),
    prisma.appMeta.count(),
  ]);
  const force = process.env.FORCE_SEED === "1";
  const incomplete = (users > 0 || assets > 0 || evidence > 0) && meta === 0;
  if (!force && (users > 0 || assets > 0 || evidence > 0) && !incomplete) {
    console.log(
      "Neon database already populated — skipping seed (refusing to wipe).",
    );
    return;
  }
  if (incomplete && !force) {
    console.log(
      "Neon database looks incomplete (rows without AppMeta) — repairing seed.",
    );
  }
  await seedDatabase();
  console.log("Seeded atopic dermatitis corpus into Postgres (DATABASE_URL).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
