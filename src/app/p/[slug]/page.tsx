import { db } from "@/db";
import { files, projects, clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SignatureForm } from "./components/SignatureForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing";
import {
  completeAssetCollection,
  notifyUploadAction,
} from "@/app/actions/project";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { AssetUploader } from "./components/AssetUploader";

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
      clientName: clients.name
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.slug, slug));

  if (!project) return notFound();

  const uploadedFiles = await db
    .select()
    .from(files)
    .where(eq(files.projectId, project.id));

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-blue-100">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {project.projectName}
          </h1>
          <p className="text-lg text-slate-500">
            Prepared for {project.clientName}
          </p>
        </div>

        {/* State 1: Awaiting Signature */}
        {project.status === "AWAITING_SIGNATURE" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-0 shadow-lg ring-1 ring-slate-200">
              <CardHeader className="bg-slate-900 text-white rounded-t-xl px-8 py-6">
                <CardTitle>Project Scope of Work</CardTitle>
                <CardDescription className="text-slate-300">
                  Please review the details below.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 prose prose-slate">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                  {project.scopeOfWork}
                </div>
              </CardContent>
            </Card>

            <SignatureForm slug={project.slug} />
          </div>
        )}

        {/* State 2: Assets Collection / Acknowledged Signature */}
        {project.status !== "AWAITING_SIGNATURE" && (
          <Card className="border-green-100 shadow-md">
            <CardContent className="flex flex-col items-center text-center py-12 px-6 gap-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-semibold text-slate-900">
                Scope Signed Successfully!
              </h2>
              <p className="text-slate-600">
                Signed by{" "}
                <strong className="text-slate-900">
                  {project.clientSignature}
                </strong>
                . We are moving into the next phase.
              </p>
              {/* Future Phase: UploadThing integration here */}
            </CardContent>
          </Card>
        )}

        {project.status === "COLLECTING_ASSETS" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <Card className="border-0 shadow-lg ring-1 ring-slate-200 p-8">
              <CardHeader className="px-0 pt-0 text-center">
                <CardTitle>Next Step: Upload Your Assets</CardTitle>
                <CardDescription>
                  Please upload any creative assets (videos, PDFs, images)
                  needed to get started.
                </CardDescription>
              </CardHeader>
              {/* The Upload dropzone mapped to our specific project instance */}
              <AssetUploader
                projectId={project.id}
                projectSlug={project.slug}
              />
              {/* Display existing uploaded files sequentially mapped */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8 space-y-3">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">
                    Successfully Uploaded:
                  </h3>
                  <ul className="space-y-2">
                    {uploadedFiles.map((f) => (
                      <li
                        key={f.id}
                        className="text-sm font-medium text-slate-600 bg-slate-100 p-3 rounded-md flex justify-between"
                      >
                        <a
                          href={f.fileUrl}
                          target="_blank"
                          className="hover:text-blue-600 transition-colors"
                        >
                          {f.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
            {/* A "I'm Done Uploading!" Confirmation Action */}
            <form
              action={async () => {
                "use server";
                await completeAssetCollection(project.slug);
              }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full text-md font-medium"
                disabled={uploadedFiles.length === 0}
              >
                I am Done Uploading files
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
