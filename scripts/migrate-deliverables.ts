import { db } from "../src/db";
import { projects, milestones, deliverables } from "../src/db/schema";
import { isNull, eq } from "drizzle-orm";

async function main() {
  console.log("Starting migration: wrapping flat deliverables into milestones...");
  
  try {
    // 1. Get all deliverables that have no milestone
    const orphanedDeliverables = await db.select().from(deliverables).where(isNull(deliverables.milestoneId));
    console.log(`Found ${orphanedDeliverables.length} orphaned deliverables.`);

    if (orphanedDeliverables.length === 0) {
      console.log("No migration needed.");
      process.exit(0);
    }

    // 2. Find unique project IDs from those deliverables
    const projectIds = [...new Set(orphanedDeliverables.map(d => d.projectId))];
    console.log(`These deliverables belong to ${projectIds.length} projects.`);

    // 3. For each project, create a default milestone and map deliverables
    for (const projectId of projectIds) {
      console.log(`Migrating project ${projectId}...`);
      
      const [newMilestone] = await db.insert(milestones).values({
        projectId: projectId,
        title: "Phase 1: Delivery",
        status: "PENDING",
        order: 0,
      }).returning();

      const projectDeliverables = orphanedDeliverables.filter(d => d.projectId === projectId);
      
      for (const d of projectDeliverables) {
        await db.update(deliverables).set({ milestoneId: newMilestone.id }).where(eq(deliverables.id, d.id));
      }
    }
    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

main();
