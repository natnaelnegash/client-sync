"use client";

import { notifyUploadAction } from "@/app/actions/project";
import { UploadDropzone } from "@/utils/uploadthing";

interface AssetUploaderProps {
  projectId: string;
  projectSlug: string;
}

export function AssetUploader({ projectId, projectSlug }: AssetUploaderProps) {
  return (
    <UploadDropzone
      endpoint="projectAssets"
      input={{ projectId }}
      onClientUploadComplete={async (res) => {
        // Triggers the exact email action server safely
        await notifyUploadAction(projectSlug);
      }}
      onUploadError={(error: Error) => {
        console.error("Upload Error:", error.message);
      }}
    />
  );
}
