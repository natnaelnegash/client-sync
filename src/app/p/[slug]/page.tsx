import { db } from "@/db";
import { files, projects, clients, deliverables, invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PortalHeader } from "./components/PortalHeader";
import { Step1Signature } from "./components/Step1Signature";
import { Step2Upload } from "./components/Step2Upload";
import { Step3Tracker } from "./components/Step3Tracker";

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [project] = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      projectName: projects.projectName,
      scopeOfWork: projects.scopeOfWork,
      status: projects.status,
      clientSignature: projects.clientSignature,
      createdAt: projects.createdAt,
      clientName: clients.name,
      company: clients.company,
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.slug, slug));

  if (!project) return notFound();

  const projectDeliverables = await db
    .select()
    .from(deliverables)
    .where(eq(deliverables.projectId, project.id));

  const [projectInvoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.projectId, project.id));

  const uploadedFiles = await db
    .select()
    .from(files)
    .where(eq(files.projectId, project.id));

  let activeStep = 1;
  if (project.status === "COLLECTING_ASSETS") activeStep = 2;
  if (project.status === "IN_PROGRESS" || project.status === "IN_REVIEW" || project.status === "DELIVERY" || project.status === "COMPLETED") activeStep = 3;

  // Assuming agency is "Northlight Studio" for now
  const agencyName = "Northlight Studio"; 

  // Estimate start and delivery dates (dummy for demo)
  const startDate = project.createdAt;
  const deliveryDate = new Date(project.createdAt!.getTime() + 1000 * 60 * 60 * 24 * 50); // +50 days

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-indigo-100 font-sans">
      <PortalHeader 
        clientName={project.clientName} 
        agencyName={agencyName} 
        activeStep={activeStep} 
      />
      
      <div className="px-4 sm:px-6 lg:px-8">
        {activeStep === 1 && (
          <Step1Signature
            projectSlug={project.slug}
            projectName={project.projectName}
            agencyName={agencyName}
            projectValue={projectInvoice?.amount || 0}
            startDate={startDate}
            deliveryDate={deliveryDate}
            scopeOfWork={project.scopeOfWork}
          />
        )}

        {activeStep === 2 && (
          <Step2Upload
            projectSlug={project.slug}
            projectId={project.id}
          />
        )}

        {activeStep === 3 && (
          <Step3Tracker
            projectName={project.projectName}
            agencyName={agencyName}
            deliverables={projectDeliverables}
            invoice={projectInvoice}
          />
        )}
      </div>
    </main>
  );
}
