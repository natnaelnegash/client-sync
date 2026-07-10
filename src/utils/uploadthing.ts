"use client";

import { generateUploadDropzone, generateUploadButton } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Generates our perfectly typed Tailwind Drag&Drop component!
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const UploadButton = generateUploadButton<OurFileRouter>();
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();