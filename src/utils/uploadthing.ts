"use client";

import { generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Generates our perfectly typed Tailwind Drag&Drop component!
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();