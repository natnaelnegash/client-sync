import { db } from "@/db";
import { files, projects, clients, deliverables, invoices, messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PortalHeader } from "./components/PortalHeader";
import { Step1Signature } from "./components/Step1Signature";
import { Step2Upload } from "./components/Step2Upload";
import { Step3Tracker } from "./components/Step3Tracker";
import { PinGate } from "./components/PinGate";
import { cookies } from "next/headers";

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
      portalPin: projects.portalPin,
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

  const projectInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.projectId, project.id));
    
  const projectValue = projectInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const uploadedFiles = await db
    .select()
    .from(files)
    .where(eq(files.projectId, project.id));

  const contractFile = uploadedFiles.find(f => f.fileName.includes("Contract_"));
  const contractFileUrl = contractFile?.fileUrl || null;

  let activeStep = 1;
  if (project.status === "COLLECTING_ASSETS") activeStep = 2;
  if (project.status === "IN_PROGRESS" || project.status === "IN_REVIEW" || project.status === "DELIVERY" || project.status === "COMPLETED") activeStep = 3;

  // Assuming agency is "Northlight Studio" for now
  const agencyName = "Northlight Studio"; 

  // PIN Authentication Check
  if (project.portalPin) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(`client_portal_auth_${project.slug}`);
    if (authCookie?.value !== "authenticated") {
      return <PinGate projectSlug={project.slug} agencyName={agencyName} />;
    }
  }

  // Estimate start and delivery dates (dummy for demo)
  const startDate = project.createdAt;
  const deliveryDate = new Date(project.createdAt!.getTime() + 1000 * 60 * 60 * 24 * 50); // +50 days

  const initialMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.projectId, project.id))
    .orderBy(asc(messages.createdAt));

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
            projectId={project.id}
            projectName={project.projectName}
            agencyName={agencyName}
            projectValue={projectValue}
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
            projectId={project.id}
            projectName={project.projectName}
            agencyName={agencyName}
            deliverables={projectDeliverables}
            invoices={projectInvoices}
            contractFileUrl={contractFileUrl}
            initialMessages={initialMessages}
          />
        )}
      </div>
    </main>
  );
}
