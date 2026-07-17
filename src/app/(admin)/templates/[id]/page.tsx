import { db } from "@/db";
import {
  projectTemplates,
  templateMilestones,
  templateDeliverables,
  templateTasks,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/auth";
import { getWorkspaceOwnerId } from "@/utils/workspace";
import { notFound } from "next/navigation";
import { TemplateBuilder } from "./components/TemplateBuilder";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return null;

  const ownerId = await getWorkspaceOwnerId(
    session.user.id,
    session.user.email,
  );

  const [template] = await db
    .select()
    .from(projectTemplates)
    .where(eq(projectTemplates.id, id));

  if (
    !template ||
    (template.type !== "SYSTEM" && template.userId !== ownerId)
  ) {
    return notFound();
  }

  const milestones = await db
    .select()
    .from(templateMilestones)
    .where(eq(templateMilestones.templateId, id))
    .orderBy(asc(templateMilestones.order));

  // In a real app we might join, but since templates are relatively small, fetching all related is fine
  const milestoneIds = milestones.map((m) => m.id);

  let deliverables: any[] = [];
  let tasks: any[] = [];

  if (milestoneIds.length > 0) {
    deliverables = await db
      .select()
      .from(templateDeliverables)
      // Drizzle 'inArray' should be used, but for simplicity we fetch all and filter client side
      // Or we can just fetch all for this template's milestones.
      // Wait, Drizzle doesn't easily let us filter by templateId for deliverables without joins.
      // Let's just fetch all by mapping over milestoneIds in Promise.all or joining.
      // Actually, since this is a Server Component, let's just do sequential or simple queries.
      .execute();

    deliverables = deliverables.filter((d) =>
      milestoneIds.includes(d.milestoneId),
    );
    const deliverableIds = deliverables.map((d) => d.id);

    tasks = await db.select().from(templateTasks).execute();
    tasks = tasks.filter(
      (t) =>
        (t.milestoneId && milestoneIds.includes(t.milestoneId)) ||
        (t.deliverableId && deliverableIds.includes(t.deliverableId)),
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <Link
          href="/templates"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Templates
        </Link>
      </div>

      <TemplateBuilder
        template={template}
        milestones={milestones}
        deliverables={deliverables}
        tasks={tasks}
      />
    </div>
  );
}
