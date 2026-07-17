import { seedProjectTypes } from "./categories";

async function seed() {
  console.log("🌱 Starting seed...");

  await seedProjectTypes();

  console.log("✅ Seed completed");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });