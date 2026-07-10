import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { projects, clients, invoices } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ClientListUI, ClientData } from "./ClientListUI";
import { getWorkspaceOwnerId } from "@/utils/workspace";

export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const ownerId = await getWorkspaceOwnerId(session.user.id, session.user.email);

  const clientsData = await db
    .select()
    .from(clients)
    .where(eq(clients.userId, ownerId));
  
  // Fetch projects and invoices for this user
  const projectsData = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, ownerId))
    .orderBy(desc(projects.createdAt));
    
  const invoicesData = await db
    .select()
    .from(invoices)
    .innerJoin(projects, eq(invoices.projectId, projects.id))
    .where(eq(projects.userId, ownerId));

  // Map into the format needed by the UI
  const formattedClients: ClientData[] = clientsData.map(c => {
    const clientProjects = projectsData.filter(p => p.clientId === c.id);
    const clientInvoices = invoicesData.filter(i => i.projects.clientId === c.id);

    const totalValue = clientInvoices.reduce((acc, inv) => acc + inv.invoices.amount, 0);
    const lastProject = clientProjects[0];

    return {
      id: c.id,
      name: c.name,
      company: c.company,
      email: c.email,
      phone: c.phone,
      projectsCount: clientProjects.length,
      totalValue,
      lastProjectSlug: lastProject?.slug || null,
      lastProjectName: lastProject?.projectName || null,
    }
  });

  return <ClientListUI clients={formattedClients} />;
}
