import { db } from "@/db";
import { projectTemplates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { getWorkspaceOwnerId } from "@/utils/workspace";
import { CreateTemplateModal } from "./components/CreateTemplateModal";
import Link from "next/link";
import { LayoutTemplate, ArrowRight, Settings2 } from "lucide-react";
import { string } from "zod";
import { SearchInput } from "@/components/SearchInput";

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const ownerId = await getWorkspaceOwnerId(
    session.user.id,
    session.user.email,
  );

  const systemTemplates = await db
    .select()
    .from(projectTemplates)
    .where(eq(projectTemplates.type, "SYSTEM"))
    .orderBy(desc(projectTemplates.createdAt));

  const customTemplates = await db
    .select()
    .from(projectTemplates)
    .where(eq(projectTemplates.userId, ownerId))
    .orderBy(desc(projectTemplates.createdAt));

  const templates = [...systemTemplates, ...customTemplates];

  const resolvedParams = await searchParams;
  const searchFilter =
    typeof resolvedParams.type === "string" ? resolvedParams.type : "all";

  let filteredTemplates = templates;

  switch (searchFilter) {
    case "custom":
      filteredTemplates = customTemplates;
      break;

    case "system":
      filteredTemplates = systemTemplates;
      break;

    default:
      filteredTemplates = templates;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Project Templates
          </h1>
          <p className="text-slate-500 mt-1">
            Manage reusable blueprints for your agency workflows.
          </p>
        </div>
        <CreateTemplateModal />
      </div>

      {/* Filter Row */}
      <div className="flex sm:flex-row sm:items-center gap-2 pb-2">
        <div className="w-full sm:max-w-sm">
          <SearchInput placeholder="Search invoices..." />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Link
            href="?type=all"
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
              searchFilter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All
          </Link>
          <Link
            href="?type=custom"
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
              searchFilter === "custom"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Custom
          </Link>
          <Link
            href="?type=system"
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
              searchFilter === "system"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            System
          </Link>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutTemplate className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            No templates yet
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Create your first template to standardize your workflow and speed up
            project creation.
          </p>
          <CreateTemplateModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
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
