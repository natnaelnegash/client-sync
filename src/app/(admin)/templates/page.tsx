import { db } from "@/db";
import { projectTemplates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { getWorkspaceOwnerId } from "@/utils/workspace";
import { CreateTemplateModal } from "./components/CreateTemplateModal";
import Link from "next/link";
import { LayoutTemplate, ArrowRight, Settings2 } from "lucide-react";

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const ownerId = await getWorkspaceOwnerId(session.user.id, session.user.email);
  
  const templates = await db.select()
    .from(projectTemplates)
    .where(eq(projectTemplates.userId, ownerId))
    .orderBy(desc(projectTemplates.createdAt));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project Templates</h1>
          <p className="text-slate-500 mt-1">Manage reusable blueprints for your agency workflows.</p>
        </div>
        <CreateTemplateModal />
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutTemplate className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No templates yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Create your first template to standardize your workflow and speed up project creation.
          </p>
          <CreateTemplateModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Link 
              href={`/templates/${template.id}`} 
              key={template.id}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase tracking-wider">
                  {template.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">
                {template.description || "No description provided."}
              </p>
              
              <div className="flex items-center text-sm font-medium text-indigo-600 pt-4 border-t border-slate-100 mt-auto">
                Edit Template 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
