import { db } from "../index";
import { users, deliverableTypes, projectTemplates, templateMilestones, templateDeliverables, templateTasks } from "../schema";
import { seedProjectTypes as seedCategories } from "./categories";
import { corporateWebsiteTemplate } from "./templates/website";
import { ecommerceTemplate } from "./templates/ecommerce";
import { brandingTemplate } from "./templates/branding";
import { mobileAppTemplate } from "./templates/mobile";
import { videoProductionTemplate } from "./templates/video_editing";
import { marketingTemplate } from "./templates/marketing";
import { copywritingTemplate } from "./templates/copywriting";
import { photographyTemplate } from "./templates/photography";
import { consultingTemplate } from "./templates/consulting";

const templates = [
  corporateWebsiteTemplate,
  ecommerceTemplate,
  brandingTemplate,
  mobileAppTemplate,
  videoProductionTemplate,
  marketingTemplate,
  copywritingTemplate,
  photographyTemplate,
  consultingTemplate,
];

async function seed() {
  console.log("Starting DB seed...");

  // 1. Create a System user
  const [systemUser] = await db.insert(users).values({
    name: "System Admin",
    email: "systemadmin@gmail.com",
  }).returning();
  console.log(`Created System User: ${systemUser.id}`);

  // 2. Create base deliverable types
  const [docType] = await db.insert(deliverableTypes).values([
    { name: "Document", slug: "document", description: "Text documents, PDFs, etc." },
    { name: "Design", slug: "design", description: "Figma files, images, etc." },
    { name: "Code", slug: "code", description: "Source code delivery" },
    { name: "Video", slug: "video", description: "Video files" },
  ]).returning();
  console.log("Created Deliverable Types.");

  // 3. Ensure categories (projectTypes) are seeded
  const categories = await seedCategories(); 
  console.log(`${categories} Categories.`);
  console.log(`Ensured ${categories.length} Categories.`);

  // 4. Seed the templates
  for (const tpl of templates) {
    const category = categories.find((c) => c.name === tpl.category);
    if (!category) {
      console.warn(`Could not find category: ${tpl.category} for template ${tpl.name}`);
      continue;
    }

    const [insertedTemplate] = await db.insert(projectTemplates).values({
      name: tpl.name,
      description: tpl.description,
      userId: systemUser.id,
      typeId: category.id,
    }).returning();
    console.log(`Inserted Template: ${tpl.name}`);

    for (let mIdx = 0; mIdx < tpl.milestones.length; mIdx++) {
      const ms = tpl.milestones[mIdx];
      const [insertedMs] = await db.insert(templateMilestones).values({
        templateId: insertedTemplate.id,
        title: ms.name,
        order: mIdx,
      }).returning();

      if (ms.deliverables) {
        for (let dIdx = 0; dIdx < ms.deliverables.length; dIdx++) {
          const del = ms.deliverables[dIdx];
          await db.insert(templateDeliverables).values({
            milestoneId: insertedMs.id,
            typeId: docType.id, // Using Document as default, since UI hasn't specified
            title: del.name,
            order: dIdx,
          });
        }
      }

      if (ms.tasks) {
        for (let tIdx = 0; tIdx < ms.tasks.length; tIdx++) {
          const taskName = ms.tasks[tIdx];
          await db.insert(templateTasks).values({
            milestoneId: insertedMs.id,
            title: taskName,
            order: tIdx,
          });
        }
      }
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed:", err);
  process.exit(1);
});
