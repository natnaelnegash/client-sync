import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { projects, clients, invoices } from "@/db/schema";
import { eq, sum, desc } from "drizzle-orm";
import Link from "next/link";
import { CreateProjectModal } from "../dashboard/components/CreateProjectModal";
import { formatDistanceToNow } from "date-fns";
import { getWorkspaceOwnerId } from "@/utils/workspace";

function getStatusDetails(status: string) {
  switch (status) {
    case "AWAITING_SIGNATURE":
      return {
        color: "bg-amber-100 text-amber-700",
        progress: 10,
        label: "Awaiting Signature",
      };
    case "COLLECTING_ASSETS":
      return {
        color: "bg-blue-100 text-blue-700",
        progress: 30,
        label: "Collecting Assets",
      };
    case "IN_PROGRESS":
      return {
        color: "bg-indigo-100 text-indigo-700",
        progress: 60,
        label: "In Progress",
      };
    case "IN_REVIEW":
      return {
        color: "bg-purple-100 text-purple-700",
        progress: 80,
        label: "In Review",
      };
    case "DELIVERY":
      return {
        color: "bg-pink-100 text-pink-700",
        progress: 90,
        label: "Delivery",
      };
    case "COMPLETED":
      return {
        color: "bg-emerald-100 text-emerald-700",
        progress: 100,
        label: "Completed",
      };
    default:
      return {
        color: "bg-slate-100 text-slate-700",
        progress: 0,
        label: "Draft",
      };
  }
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const ownerId = await getWorkspaceOwnerId(
    session.user.id,
    session.user.email,
  );
  const resolvedParams = await searchParams;

  const statusFilter =
    typeof resolvedParams.status === "string" ? resolvedParams.status : "all";

  const projectsData = await db
    .select({
      id: projects.id,
      name: projects.projectName,
      slug: projects.slug,
      status: projects.status,
      createdAt: projects.createdAt,
      clientName: clients.name,
      clientOrg: clients.company,
      totalValue: sum(invoices.amount),
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(invoices, eq(invoices.projectId, projects.id))
    .where(eq(projects.userId, ownerId))
    .groupBy(projects.id, clients.id)
    .orderBy(desc(projects.createdAt));

  const totalCount = projectsData.length;
  const activeCount = projectsData.filter(
    (p) => p.status !== "COMPLETED",
  ).length;

  let filteredProjects = projectsData;
  if (statusFilter !== "all") {
    filteredProjects = projectsData.filter((p) => p.status === statusFilter);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Projects</h1>
          <p className="text-sm text-slate-500">
            {totalCount} total · {activeCount} active
          </p>
        </div>
        <CreateProjectModal />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-xs shrink-0 flex justify-center">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search projects..."
              className="pl-9 h-10 bg-white border-slate-200 focus-visible:ring-indigo-600 rounded-lg text-sm w-full shadow-sm"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
            <Link
              href="?status=all"
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
                statusFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              All
            </Link>
            <Link
              href="?status=AWAITING_SIGNATURE"
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
                statusFilter === "AWAITING_SIGNATURE"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Awaiting Signature
            </Link>
            <Link
              href="?status=IN_PROGRESS"
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
                statusFilter === "IN_PROGRESS"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              In Progress
            </Link>
            <Link
              href="?status=COMPLETED"
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
                statusFilter === "COMPLETED"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Completed
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm shrink-0">
          <button className="p-1.5 bg-slate-100 rounded text-slate-700 shadow-sm">
            <List className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600">
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No projects found. Create one to get started!
                  </td>
                </tr>
              )}
              {filteredProjects.map((project) => {
                const { color, progress, label } = getStatusDetails(
                  project.status,
                );
                const valueFormatted = project.totalValue
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(Number(project.totalValue) / 100)
                  : "$0";
                const timeAgo = project.createdAt
                  ? formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true,
                    })
                  : "just now";

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {project.clientName}
                        </span>
                        <span className="text-sm text-slate-500">
                          {project.clientOrg || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
                      >
                        {label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-medium text-slate-900">
                        {valueFormatted}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {timeAgo}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredProjects.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing 1–{filteredProjects.length} of {filteredProjects.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                disabled
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-indigo-600 text-white font-medium text-sm shadow-sm">
                1
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                disabled
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
